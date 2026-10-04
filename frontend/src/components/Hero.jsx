import React from 'react';
import { ArrowRight, Users, Truck, ShieldCheck, Sparkles, MapPin } from 'lucide-react';

export default function Hero({ onPlanMoveClick, activeCity, onCitySelectClick }) {
  return (
    <section className="hero-section" id="home">
      <div className="container hero-container">
        {/* Left Column: Copy & Actions */}
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot"></span>
            <Sparkles size={14} className="badge-sparkle" />
            <span>Smart Relocation in {activeCity}</span>
          </div>

          <h1 className="hero-title">
            <span className="title-dark">Your move.</span>
            <span className="title-peach">Managed.</span>
          </h1>

          <p className="hero-subtitle">
            A coordinator, vehicle and crew for your moving day.
          </p>

          <div className="hero-actions">
            <button
              type="button"
              className="btn-hero-primary"
              onClick={onPlanMoveClick}
              id="hero-plan-move-btn"
            >
              <span>Plan my move</span>
              <div className="hero-arrow-circle">
                <ArrowRight size={18} />
              </div>
            </button>
          </div>

          {/* 3 Trust Feature Items from Reference Image */}
          <div className="hero-trust-features">
            <div className="trust-pill-item">
              <div className="trust-icon-box">
                <Users size={18} className="trust-icon" />
              </div>
              <span className="trust-text">Trusted crew and vehicles</span>
            </div>

            <div className="trust-pill-item">
              <div className="trust-icon-box">
                <Truck size={18} className="trust-icon" />
              </div>
              <span className="trust-text">End-to-end coordination</span>
            </div>

            <div className="trust-pill-item">
              <div className="trust-icon-box">
                <ShieldCheck size={18} className="trust-icon" />
              </div>
              <span className="trust-text">Focus on what matters</span>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Visual Illustration */}
        <div className="hero-visual-wrapper">
          <div className="hero-image-frame">
            {/* Main Hero Moving Illustration */}
            <img
              src="/images/move-city.png"
              alt={`MoveMate moving truck and professional movers in ${activeCity}`}
              className="hero-main-image"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
