import {test,before,after} from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import {MongoMemoryReplSet} from 'mongodb-memory-server';
import request from 'supertest';
import {createApp} from '../src/app.js';
import * as M from '../src/models.js';
let repl,app,admin,customer,other,coord,outsider,move,assignment,plan,quote;
const call=(user,method,url,body)=>{let r=request(app)[method]('/api'+url);if(user)r=r.set('Authorization',`Bearer ${user.token}`);return body===undefined?r:r.send(body);};
async function account(role,name){const r=await call(null,'post','/auth/register',{name,email:`${name}@example.com`,phone:'9876543210',password:'StrongPassword123!',role,acceptTerms:true});assert.equal(r.status,201,JSON.stringify(r.body));return r.body;}
before(async()=>{process.env.JWT_SECRET='test-secret-with-at-least-thirty-two-characters';repl=await MongoMemoryReplSet.create({replSet:{count:1,args:['--nounixsocket','--setParameter','diagnosticDataCollectionEnabled=false']}});await mongoose.connect(repl.getUri());await M.Scheduler.create({_id:'global'});app=createApp();await M.User.create({name:'Admin',email:'admin@example.com',passwordHash:await bcrypt.hash('StrongPassword123!',4),role:'admin',approval:'approved'});admin=(await call(null,'post','/auth/login',{email:'admin@example.com',password:'StrongPassword123!'})).body;customer=await account('customer','customer');other=await account('customer','other');coord=await account('coordinator','coord');outsider=await account('coordinator','outsider');}, {timeout:180000});
after(async()=>{await mongoose.disconnect();if(repl)await repl.stop();});
test('role and credential boundaries',async()=>{
 assert.equal((await call(null,'post','/auth/register',{name:'Intruder',email:'bad@example.com',phone:'9876543210',password:'StrongPassword123!',role:'admin',acceptTerms:true})).status,400);
 assert.equal((await call(null,'post','/auth/login',{email:'customer@example.com',password:'incorrect'})).status,401);
 assert.equal((await call(customer,'get','/admin/overview')).status,403);
 assert.equal((await call(customer,'get','/coordinator/jobs')).status,403);
 assert.equal((await call(coord,'get','/moves')).status,403);
 assert.equal((await call(coord,'get','/coordinator/jobs')).status,403);
 assert.equal((await call(null,'get','/moves')).status,401);
 assert.equal((await call(customer,'patch','/auth/me',{role:'admin'})).status,400);
});
test('coordinator verification and private document ownership',async()=>{
 const upload=await request(app).post('/api/uploads').set('Authorization',`Bearer ${coord.token}`).field('purpose','identity').attach('file',Buffer.from('%PDF-1.4\nDemo identity only'),'demo.pdf');assert.equal(upload.status,201,JSON.stringify(upload.body));assert.equal(upload.body.upload.path,undefined);
 const id=upload.body.upload._id;
 assert.equal((await call(customer,'get',`/uploads/${id}`)).status,403);
 let r=await call(coord,'put','/coordinator/application',{workProfile:{city:'Pune',serviceAreas:['Pune'],languages:['Hindi'],experienceYears:2,providerType:'individual'},identityFile:id,reference:{name:'Reference',phone:'9876543210',permission:true},consents:{verification:true,conduct:true,policyVersion:'1.0'}});assert.equal(r.status,200,JSON.stringify(r.body));
 r=await call(coord,'post','/coordinator/application/submit',{});assert.equal(r.status,200);
 const application=r.body.application._id;
 assert.equal((await call(admin,'patch',`/admin/coordinator-applications/${application}/status`,{status:'approved',reviewNotes:'Reviewed'})).status,400);
 r=await call(admin,'patch',`/admin/coordinator-applications/${application}/status`,{status:'approved',reviewNotes:'Demo checks completed',identityChecked:true,referenceChecked:true});assert.equal(r.status,200,JSON.stringify(r.body));
 assert.equal((await call(coord,'get','/coordinator/jobs')).status,401); // old token revoked
 coord=(await call(null,'post','/auth/login',{email:'coord@example.com',password:'StrongPassword123!'})).body;
 assert.equal((await call(coord,'get','/coordinator/jobs')).status,200);
});
test('draft, AI unavailable, ownership and submission',async()=>{
 const details={pickupAddress:'Pune pickup',destAddress:'Pune drop',pickupFloor:'3',destFloor:'1',pickupLift:'No',destLift:'Yes',moveDate:'2030-10-04',homeSize:'1 BHK',accessPersonPickup:'Friend',accessPersonDelivery:'Friend'};
 const inventory=[{id:1,name:'Monitor',qty:1,fragile:true,notes:'Pack carefully'}];
 const r=await call(customer,'post','/moves',{details,inventory,accessAuthorized:true});assert.equal(r.status,201,JSON.stringify(r.body));move=r.body.move._id;
 assert.equal((await call(other,'get',`/moves/${move}`)).status,403);
 assert.equal((await call(coord,'get',`/moves/${move}`)).status,403);
 assert.equal((await call(customer,'post',`/moves/${move}/ai-plan`,{})).status,503);
 assert.equal((await call(customer,'post',`/moves/${move}/submit`,{})).status,400);
 plan={inventory,handlingInstructions:['Protect monitor'],accessRestrictions:['Third floor stairs'],unavailableHours:'11-1',missingQuestions:[],checklist:[{task:'Pack monitor',completed:false}]};
 assert.equal((await call(customer,'put',`/moves/${move}/plan`,plan)).status,200);
 assert.equal((await call(customer,'post',`/moves/${move}/submit`,{})).status,200);
 assert.equal((await call(customer,'patch',`/moves/${move}`,{specialInstructions:'change'})).status,409);
});
test('admin assignment, conflicts and versioned quotes',async()=>{
 const vehicle=(await call(admin,'post','/admin/vehicles',{label:'Demo van',registration:'DEMO01',type:'Van',capacityKg:1000,capacityM3:12,driverName:'Driver',driverPhone:'9876543210',city:'Pune',rate:1000})).body.resource;
 const worker=(await call(admin,'post','/admin/workers',{name:'Worker',phone:'9876543210',city:'Pune',skills:['packing'],rate:500})).body.resource;
 assignment={coordinator:coord.user.id,vehicle:vehicle._id,workers:[worker._id],start:'2030-10-04T02:30:00.000Z',end:'2030-10-04T12:30:00.000Z'};
 let r=await call(admin,'put',`/admin/moves/${move}/assignment`,assignment);assert.equal(r.status,200,JSON.stringify(r.body));
 const second=await M.Move.create({customer:other.user.id,status:'submitted',details:{},inventory:[]});
 const competing=await Promise.all([call(admin,'put',`/admin/moves/${second.id}/assignment`,assignment),call(admin,'put',`/admin/moves/${move}/assignment`,assignment)]);assert.equal(competing[0].status,409);assert.equal(competing[1].status,200);
 assert.equal((await call(customer,'put',`/admin/moves/${move}/assignment`,assignment)).status,403);
 assert.equal((await call(coord,'post',`/coordinator/jobs/${move}/start`,{})).status,409);
 r=await call(admin,'post',`/admin/moves/${move}/quotes`,{items:[{label:'Transport',amount:2000},{label:'Labour',amount:500}]});assert.equal(r.status,201,JSON.stringify(r.body));const old=r.body.quote._id;
 r=await call(admin,'post',`/admin/moves/${move}/quotes`,{items:[{label:'Transport and labour',amount:2600}]});assert.equal(r.status,201);quote=r.body.quote._id;
 assert.equal((await call(customer,'post',`/moves/${move}/quote/accept`,{quoteId:old})).status,409);
 assert.equal((await call(customer,'post',`/moves/${move}/quote/accept`,{quoteId:quote})).status,200);
 assert.equal((await call(customer,'post',`/moves/${move}/quote/accept`,{quoteId:quote})).status,409);
});
test('progress, approvals, delivery and resource release',async()=>{
 assert.equal((await call(coord,'post',`/coordinator/jobs/${move}/start`,{})).status,200);
 assert.equal((await call(customer,'post',`/coordinator/jobs/${move}/updates`,{status:'loading',note:'Attempt'})).status,403);
 assert.equal((await call(coord,'post',`/coordinator/jobs/${move}/updates`,{status:'unloading',note:'Skip'})).status,409);
 const change=(await call(coord,'post',`/coordinator/jobs/${move}/change-requests`,{reason:'Packing material',amount:300})).body.change;
 assert.equal((await call(coord,'post',`/moves/${move}/change-requests/${change._id}/decision`,{decision:'approved'})).status,403);
 assert.equal((await call(other,'post',`/moves/${move}/change-requests/${change._id}/decision`,{decision:'approved'})).status,403);
 assert.equal((await call(customer,'post',`/moves/${move}/change-requests/${change._id}/decision`,{decision:'approved'})).status,200);
 assert.equal((await call(customer,'post',`/moves/${move}/change-requests/${change._id}/decision`,{decision:'approved'})).status,409);
 for(const status of ['loading','in_transit','unloading'])assert.equal((await call(coord,'post',`/coordinator/jobs/${move}/updates`,{status,note:status})).status,201);
 assert.equal((await call(coord,'post',`/coordinator/jobs/${move}/ready-for-confirmation`,{})).status,400);
 assert.equal((await call(coord,'patch',`/coordinator/jobs/${move}/checklist`,{index:0,completed:true})).status,200);
 assert.equal((await call(coord,'post',`/coordinator/jobs/${move}/ready-for-confirmation`,{})).status,200);
 assert.equal((await call(customer,'post',`/moves/${move}/confirm-delivery`,{received:true,notes:'Received'})).status,200);
 assert.equal(await M.Reservation.countDocuments({move}),0);
 assert.equal((await call(customer,'post',`/moves/${move}/review`,{rating:5,feedback:'Good'})).status,200);
 assert.equal((await call(customer,'post',`/moves/${move}/review`,{rating:5})).status,409);
 assert.equal((await call(customer,'post',`/moves/${move}/incidents`,{category:'damage',description:'Monitor scratch'})).status,201);
 assert.equal((await call(admin,'get','/admin/incidents')).status,200);
});
test('concurrent assignments reserve one winner and cancellation releases holds',async()=>{
 const a=await M.Move.create({customer:customer.user.id,status:'submitted',details:{},inventory:[]});
 const b=await M.Move.create({customer:other.user.id,status:'submitted',details:{},inventory:[]});
 const results=await Promise.all([call(admin,'put',`/admin/moves/${a.id}/assignment`,assignment),call(admin,'put',`/admin/moves/${b.id}/assignment`,assignment)]);
 assert.deepEqual(results.map(x=>x.status).sort(),[200,409]);
 const winner=results[0].status===200?a:b;
 assert.equal(await M.Reservation.countDocuments({move:winner._id}),3);
 assert.equal((await call(admin,'post',`/moves/${winner.id}/cancel`,{reason:'Demo cancellation'})).status,200);
 assert.equal(await M.Reservation.countDocuments({move:winner._id}),0);
});
test('logout invalidates session and reset is not faked',async()=>{
 assert.equal((await call(null,'post','/auth/forgot-password',{email:'customer@example.com'})).status,503);
 assert.equal((await call(other,'post','/auth/logout',{})).status,200);
 assert.equal((await call(other,'get','/auth/me')).status,401);
});
