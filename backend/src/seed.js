import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import {User,Scheduler} from './models.js';
if(!process.env.ADMIN_EMAIL||!process.env.ADMIN_PASSWORD||process.env.ADMIN_PASSWORD.length<12)throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD (12+ characters) in .env');
await mongoose.connect(process.env.MONGODB_URI);
const email=process.env.ADMIN_EMAIL.toLowerCase();
if(await User.exists({email}))console.log('Admin email already exists; no account was changed.');
else {await User.create({name:process.env.ADMIN_NAME||'Admin',email,passwordHash:await bcrypt.hash(process.env.ADMIN_PASSWORD,12),role:'admin',approval:'approved'});console.log('Admin created.');}
await Scheduler.updateOne({_id:'global'},{$setOnInsert:{revision:0}},{upsert:true});
await mongoose.disconnect();
