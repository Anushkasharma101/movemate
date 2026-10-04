import React from 'react';
import { Phone, Mail, MapPin, ShieldCheck, Heart, ArrowRight } from 'lucide-react';

export default function Footer({ onPlanMoveClick, onSelectService, onCityChange, activeCity }) {
  const cities = ['Pune', 'Mumbai', 'Bengaluru', 'Delhi NCR', 'Hyderabad', 'Chennai'];

  return (
    <footer className="site-footer">
      <div className="container">
        {/* Top Footer Row */}
        <div className="footer-top-grid">
          {/* Brand Info */}
          <div className="footer-brand-col">
            <div className="footer-logo-wrap">
              <img 
                src="/images/web_logo.png" 
                alt="MoveMate - Your move. Managed." 
                className="footer-logo-img" 
              />
            </div>
            <p className="footer-brand-desc">
              India's premier hassle-free moving platform. We coordinate professional verified crews, modern dedicated vehicles, and expert packaging so you can focus on making your new house a home.
            </p>
            <div className="footer-contact-info">
              <div className="contact-item">
                <Phone size={16} className="contact-icon" />
                <span>+91 (020) 4862-MOVE (6683)</span>
              </div>
              <div className="contact-item">
                <Mail size={16} className="contact-icon" />
                <span>support@movemate.in</span>
              </div>
              <div className="contact-item">
                <MapPin size={16} className="contact-icon" />
                <span>MoveMate HQ, Baner Road, Pune 411045</span>
              </div>
            </div>
          </div>

          {/* Quick Services */}
          <div className="footer-col">
            <h4 className="footer-col-title">Services</h4>
            <ul className="footer-links-list">
              <li>
                <button 
                  type="button" 
                  className="footer-link-btn"
                  onClick={() => onSelectService({ id: 'home-shifting', title: 'Home Shifting' })}
                >
                  Home Shifting (1, 2, 3+ BHK)
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  className="footer-link-btn"
                  onClick={() => onSelectService({ id: 'office-relocation', title: 'Office Relocation' })}
                >
                  Office & Workplace Relocation
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  className="footer-link-btn"
                  onClick={() => onSelectService({ id: 'packing-services', title: 'Packing Services' })}
                >
                  Premium Packing & Supplies
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  className="footer-link-btn"
                  onClick={onPlanMoveClick}
                >
                  Inter-City Long Distance
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  className="footer-link-btn"
                  onClick={onPlanMoveClick}
                >
                  Vehicle & Bike Transport
                </button>
              </li>
            </ul>
          </div>

          {/* Cities Covered */}
          <div className="footer-col">
            <h4 className="footer-col-title">Cities Served</h4>
            <ul className="footer-links-list">
              {cities.map((city) => (
                <li key={city}>
                  <button 
                    type="button" 
                    className={`footer-link-btn ${city === activeCity ? 'active-city-link' : ''}`}
                    onClick={() => {
                      onCityChange(city);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    Packers & Movers in {city} {city === activeCity && '• (Selected)'}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter / Get Quote */}
          <div className="footer-col">
            <h4 className="footer-col-title">Get Moving Checklist</h4>
            <p className="footer-col-desc">
              Subscribe for our 21-point stress-free moving checklist & seasonal discounts.
            </p>
            <form className="footer-subscribe-form" onSubmit={(e) => { e.preventDefault(); alert('Thank you for subscribing! Check your inbox for the moving checklist.'); }}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="footer-input"
                required
              />
              <button type="submit" className="footer-submit-btn" aria-label="Subscribe to newsletter">
                <ArrowRight size={18} />
              </button>
            </form>
            <div className="footer-guarantee-badge">
              <ShieldCheck size={18} className="text-primary" />
              <span>₹0 Damage Guarantee & Transit Insurance</span>
            </div>
          </div>
        </div>

        {/* Bottom Footer Row */}
        <div className="footer-bottom-bar">
          <div className="copyright-text">
            © {new Date().getFullYear()} MoveMate Technologies Private Limited. All rights reserved.
          </div>
          <div className="footer-legal-links">
            <a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
            <span className="dot-sep">•</span>
            <a href="#terms" onClick={(e) => e.preventDefault()}>Terms of Service</a>
            <span className="dot-sep">•</span>
            <a href="#insurance" onClick={(e) => e.preventDefault()}>Insurance Policy</a>
            <span className="dot-sep">•</span>
            <a href="#safety" onClick={(e) => e.preventDefault()}>Safety Standards</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
