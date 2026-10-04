import React from 'react';
import { ShieldCheck, UserCheck, PackageCheck, Truck, CheckCircle2, ArrowRight } from 'lucide-react';

export default function AssuranceSection({ onPlanMoveClick }) {
  const assurances = [
    {
      icon: <UserCheck size={28} className="assurance-icon" />,
      title: 'Dedicated Move Coordinator',
      desc: 'One single point of contact who manages building permissions, truck schedules, and special handling.'
    },
    {
      icon: <ShieldCheck size={28} className="assurance-icon" />,
      title: 'Transparent, Locked Pricing',
      desc: 'No hidden surge charges, elevator fees, or fuel surprises on moving day. What you see is what you pay.'
    },
    {
      icon: <PackageCheck size={28} className="assurance-icon" />,
      title: 'Multilayer Fragile Protection',
      desc: 'Heavy-duty 5-ply cartons, bubble wrap, corner guards, and mattress covers ensure zero transit damage.'
    },
    {
      icon: <Truck size={28} className="assurance-icon" />,
      title: 'Dedicated Weatherproof Vehicles',
      desc: 'Closed-body container trucks equipped with loading ramps and safety harnesses for safe travel.'
    }
  ];

  return (
    <section className="assurance-section">
      <div className="container">
        <div className="assurance-banner">
          <div className="assurance-header">
            <div className="section-tag">Move With Complete Peace of Mind</div>
            <h2 className="assurance-title">The MoveMate Assurance</h2>
            <p className="assurance-subtitle">
              We eliminated the chaos, price haggling, and broken items of traditional moving.
            </p>
          </div>

          <div className="assurance-grid">
            {assurances.map((item, idx) => (
              <div key={idx} className="assurance-card">
                <div className="assurance-icon-wrap">
                  {item.icon}
                </div>
                <h3 className="assurance-card-title">{item.title}</h3>
                <p className="assurance-card-desc">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="assurance-bottom-cta">
            <button 
              type="button" 
              className="btn-primary-pill"
              onClick={onPlanMoveClick}
            >
              Plan your move in minutes <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
