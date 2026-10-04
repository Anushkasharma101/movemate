import React from 'react';
import { Calendar, UserCheck, PackageCheck, Truck, Shield, ArrowRight } from 'lucide-react';

export default function HowItWorks({ onPlanMoveClick }) {
  const steps = [
    {
      number: '01',
      title: 'Share your move details',
      desc: 'Pick your date, home size, pickup and drop locations for an instant transparent quote.',
      icon: <Calendar size={24} />
    },
    {
      number: '02',
      title: 'Dedicated coordinator assigned',
      desc: 'Your move manager handles planning, crew scheduling, and special fragile item requests.',
      icon: <UserCheck size={24} />
    },
    {
      number: '03',
      title: 'Professional packing & loading',
      desc: 'Trained movers arrive with heavy-duty boxes, bubble wrap and protective covers.',
      icon: <PackageCheck size={24} />
    },
    {
      number: '04',
      title: 'Safe transit & setup',
      desc: 'Live GPS tracked vehicle brings your goods safely, with complete unpacking support.',
      icon: <Truck size={24} />
    }
  ];

  return (
    <section className="how-it-works-section" id="how-it-works">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">Smooth & Stress-Free</div>
          <h2 className="section-title">How MoveMate Works</h2>
          <p className="section-desc">
            We handle every detail from your first packing box to final furniture assembly.
          </p>
        </div>

        <div className="steps-grid">
          {steps.map((step, idx) => (
            <div key={step.number} className="step-card">
              <div className="step-card-header">
                <span className="step-number">{step.number}</span>
                <div className="step-icon-wrapper">
                  {step.icon}
                </div>
              </div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.desc}</p>
              {idx < steps.length - 1 && <div className="step-connector-line"></div>}
            </div>
          ))}
        </div>

        <div className="how-it-works-cta-box">
          <div className="cta-box-text">
            <h3>Ready to experience a hassle-free moving day?</h3>
            <p>Get your guaranteed transparent price estimate in under 60 seconds.</p>
          </div>
          <button 
            type="button" 
            className="btn-primary-pill"
            onClick={onPlanMoveClick}
          >
            Start moving planner <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
