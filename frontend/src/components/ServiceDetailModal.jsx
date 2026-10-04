import React from 'react';
import { X, CheckCircle2, ArrowRight, ShieldCheck, Truck, Package, Clock } from 'lucide-react';

export default function ServiceDetailModal({ service, isOpen, onClose, onBookService }) {
  if (!isOpen || !service) return null;

  const serviceDetails = {
    'home-shifting': {
      fullTitle: 'Complete Home Relocation & Shifting Services',
      description: 'MoveMate handles your entire household transition with zero stress. From high-grade multilayer bubble wrapping of delicate glass items to careful dismantling and reassembly of large wardrobes and beds, our dedicated crew and coordinator manage everything.',
      included: [
        'Dedicated Move Coordinator for seamless on-site supervision',
        'Specialized multilayer bubble wrap, foam and stretch film for electronics & crockery',
        'Professional dismantling & reassembly of beds, dining tables, wardrobes',
        'Dedicated closed container truck to prevent weather damage',
        'Placement of furniture in designated rooms at your new home',
        'Complimentary basic transit risk insurance'
      ],
      idealFor: '1 RK, 1 BHK, 2 BHK, 3 BHK, 4 BHK apartments, penthouses and independent villas.'
    },
    'office-relocation': {
      fullTitle: 'End-to-End Corporate & Office Relocation',
      description: 'Zero business disruption with specialized office moving workflows. We coordinate server moves, workstation dismantling, IT cable management, and sequential desk-by-desk labeling so your team can get back to work immediately on Monday.',
      included: [
        'Weekend, evening and overnight shifting windows for zero workplace downtime',
        'Anti-static bubble wrap and custom padded crates for monitors, servers & electronics',
        'Desk-by-desk color-coded labeling system for effortless team setup',
        'Conference room, ergonomic chairs and filing cabinet relocation',
        'Floor plan adherence and cable tray re-installation',
        'Dedicated corporate account manager'
      ],
      idealFor: 'Startups, corporate branch offices, co-working setups, and tech enterprises (10 to 500+ desks).'
    },
    'packing-services': {
      fullTitle: 'Professional Packing & Protective Supplies',
      description: 'Need only packing expertise or high-grade moving materials? Our certified packers bring industrial strength packing supplies to wrap your treasured possessions securely for long-distance transit or storage.',
      included: [
        '5-ply heavy-duty corrugated cartons and wardrobe hanging boxes',
        'Multiple layers of bubble wrap, corrugated sheets, and foam corners',
        'Room-by-room numbered inventory manifest with fragile labeling',
        'Kitchenware, porcelain, artwork and mirror specialized wooden crating (optional)',
        'Post-move unpacking, furniture placement, and eco-friendly carton disposal',
        'Available as standalone service or add-on to any move'
      ],
      idealFor: 'Valuable antiques, delicate crockery, long-term storage prep, or inter-city moves.'
    }
  };

  const details = serviceDetails[service.id] || serviceDetails['home-shifting'];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container service-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="service-modal-badge">
            <span className="badge-tag">{service.badge}</span>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="service-modal-body">
          <div className="service-modal-hero">
            <div className="service-modal-img-wrap">
              <img src={service.image} alt={service.title} className="service-modal-img" />
            </div>
            <div className="service-modal-intro">
              <h2>{details.fullTitle}</h2>
              <p className="service-lead">{details.description}</p>
            </div>
          </div>

          <div className="service-modal-inclusions">
            <h3>What is included in this service:</h3>
            <div className="inclusions-grid">
              {details.included.map((item, idx) => (
                <div key={idx} className="inclusion-card">
                  <CheckCircle2 size={20} className="inclusion-check" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="service-modal-target">
            <strong>Ideal For:</strong> {details.idealFor}
          </div>

          <div className="service-modal-actions">
            <button 
              type="button" 
              className="btn-outline-pill"
              onClick={onClose}
            >
              Close
            </button>
            <button 
              type="button" 
              className="btn-primary-pill"
              onClick={() => {
                onClose();
                onBookService(service.id);
              }}
            >
              Get instant price for {service.title} <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
