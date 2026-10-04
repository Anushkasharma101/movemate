import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ServiceCards({ onSelectService }) {
  const services = [
    {
      id: 'home-shifting',
      title: 'Home Shifting',
      subtitle: '1 BHK, 2 BHK, 3 BHK and more',
      tagline: 'Complete home relocation with care',
      image: '/images/truck_icon.jpg',
      features: ['Furniture dismantling & assembly', 'Multi-layer bubble wrapping', 'Dedicated vehicle & crew'],
      badge: 'Most Popular'
    },
    {
      id: 'office-relocation',
      title: 'Office Relocation',
      subtitle: 'Workspaces, teams and equipment',
      tagline: 'Minimal downtime business moving',
      image: '/images/chair_icon.jpg',
      features: ['IT equipment specialized packing', 'Weekend & overnight moving', 'Desk-by-desk labeling'],
      badge: 'Corporate Ready'
    },
    {
      id: 'packing-services',
      title: 'Packing Services',
      subtitle: 'Quality materials and expert packing',
      tagline: 'Heavy-duty boxes & premium protection',
      image: '/images/box_icon.jpg',
      features: ['5-ply heavy corrugated boxes', 'Crockery & fragile glassware care', 'Unpacking & debris cleanup'],
      badge: 'All Supplies Included'
    }
  ];

  return (
    <section className="services-section" id="services">
      <div className="container">
        <div className="services-grid">
          {services.map((service) => (
            <div 
              key={service.id} 
              className="service-card"
              onClick={() => onSelectService(service)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onSelectService(service);
                }
              }}
              aria-label={`View details for ${service.title}`}
            >
              {/* Card Illustration */}
              <div className="service-icon-container">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="service-card-img"
                  loading="lazy"
                />
              </div>

              {/* Content & Action Row */}
              <div className="service-card-body">
                <div className="service-card-info">
                  <h3 className="service-card-title">{service.title}</h3>
                  <p className="service-card-subtitle">{service.subtitle}</p>
                </div>

                <div className="service-arrow-btn" aria-hidden="true">
                  <ArrowRight size={20} className="service-arrow-icon" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
