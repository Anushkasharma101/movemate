import React, { useState } from 'react';
import { Smartphone, CheckCircle, Star, QrCode, Download, ShieldCheck, ArrowRight } from 'lucide-react';

export default function AppPromo() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [sentLink, setSentLink] = useState(false);

  const handleSendLink = (e) => {
    e.preventDefault();
    if (phoneNumber.trim().length >= 10) {
      setSentLink(true);
      setTimeout(() => setSentLink(false), 4000);
      setPhoneNumber('');
    }
  };

  return (
    <section className="app-promo-section" id="mobile-app">
      <div className="container">
        <div className="app-promo-card">
          <div className="app-promo-content">
            <div className="app-badge-pill">
              <Smartphone size={15} />
              <span>MoveMate Mobile App</span>
            </div>
            
            <h2 className="app-promo-title">
              Track your move in real-time, right from your phone.
            </h2>
            
            <p className="app-promo-desc">
              Download the MoveMate app for instant driver GPS tracking, direct chat with your dedicated move coordinator, digital item inventory check-off, and one-tap support.
            </p>

            <ul className="app-features-list">
              <li>
                <CheckCircle size={18} className="feat-check" />
                <span>Live GPS location of your moving truck on moving day</span>
              </li>
              <li>
                <CheckCircle size={18} className="feat-check" />
                <span>Instant photo inventory of every packed box</span>
              </li>
              <li>
                <CheckCircle size={18} className="feat-check" />
                <span>Direct private channel to your assigned coordinator</span>
              </li>
            </ul>

            <form className="sms-link-form" onSubmit={handleSendLink}>
              <div className="sms-input-group">
                <span className="sms-country-code">+91</span>
                <input 
                  type="tel" 
                  placeholder="Enter 10-digit mobile number" 
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  aria-label="Mobile Number for app download link"
                />
                <button type="submit" className="sms-submit-btn">
                  Get App Link
                </button>
              </div>
              {sentLink && (
                <div className="sms-success-msg">
                  ✓ Link sent! Check your SMS to download the app.
                </div>
              )}
            </form>

            <div className="app-store-badges">
              <a href="#download" className="store-badge-btn" onClick={(e) => e.preventDefault()}>
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-2 .6-2.65 1.35-.58.67-1.09 1.74-.95 2.78.99.08 2.06-.53 2.68-1.28"/>
                </svg>
                <div className="store-badge-text">
                  <span className="store-small">Download on the</span>
                  <span className="store-bold">App Store</span>
                </div>
              </a>

              <a href="#download" className="store-badge-btn" onClick={(e) => e.preventDefault()}>
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a2.03 2.03 0 0 1-.22-.962V2.776c0-.36.08-.692.219-.962zm11.235 11.238l2.585 2.585-11.45 6.611 8.865-9.196zm2.585-2.052L14.844 8.415 5.979.79l11.45 6.61 0 0zm1.318 1.318c.453.262.753.743.753 1.29s-.3 1.028-.753 1.29l-1.89 1.091-2.029-2.03 2.029-2.031 1.89 1.09z"/>
                </svg>
                <div className="store-badge-text">
                  <span className="store-small">GET IT ON</span>
                  <span className="store-bold">Google Play</span>
                </div>
              </a>
            </div>
          </div>

          {/* App Logo Display & Phone Mockup */}
          <div className="app-promo-visual">
            <div className="app-phone-card">
              <div className="app-icon-highlight">
                <img 
                  src="/images/app_logo.png" 
                  alt="MoveMate App Icon" 
                  className="app-icon-img" 
                />
                <div className="app-rating-chip">
                  <Star size={14} fill="#f59e0b" color="#f59e0b" />
                  <span>4.9 / 5 on App Store</span>
                </div>
              </div>

              <div className="app-screen-preview">
                <div className="app-screen-header">
                  <span className="app-screen-time">Move status</span>
                  <span className="app-screen-live">LIVE</span>
                </div>
                <div className="app-screen-body">
                  <div className="screen-tracker-card">
                    <div className="tracker-top">
                      <div className="truck-pulse-dot"></div>
                      <div>
                        <strong>Truck en-route to Baner</strong>
                        <p>ETA: 18 mins • Driver: Suresh K.</p>
                      </div>
                    </div>
                    <div className="tracker-progress-bar">
                      <div className="progress-fill" style={{ width: '78%' }}></div>
                    </div>
                  </div>

                  <div className="screen-crew-card">
                    <div className="crew-avatar-group">
                      <div className="crew-avatar">SK</div>
                      <div className="crew-avatar">RM</div>
                      <div className="crew-avatar">AK</div>
                    </div>
                    <div className="crew-status-text">
                      <strong>3 Movers Assigned</strong>
                      <p>All verified & vaccinated</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
