import React, { useState, useId } from 'react';
import { X, ArrowRight, ArrowLeft, Check, ShieldCheck, Truck, Users, Calendar, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';

export default function PlanMoveModal({ isOpen, onClose, initialService = 'home-shifting', activeCity = 'Pune' }) {
  const [step, setStep] = useState(1);
  const [serviceType, setServiceType] = useState(initialService);
  const [houseSize, setHouseSize] = useState('2-bhk');
  const [pickupCity, setPickupCity] = useState(activeCity);
  const [pickupLocality, setPickupLocality] = useState('Kothrud');
  const [pickupFloor, setPickupFloor] = useState('2');
  const [hasPickupLift, setHasPickupLift] = useState(true);
  
  const [dropCity, setDropCity] = useState(activeCity);
  const [dropLocality, setDropLocality] = useState('Baner');
  const [dropFloor, setDropFloor] = useState('4');
  const [hasDropLift, setHasDropLift] = useState(true);

  const [moveDate, setMoveDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 4);
    return d.toISOString().split('T')[0];
  });

  const [addons, setAddons] = useState({
    unpacking: true,
    acService: false,
    insurance: true,
    tvMount: false
  });

  const [isBooked, setIsBooked] = useState(false);
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');

  if (!isOpen) return null;

  // Pricing formula simulation
  const sizeMultiplier = {
    '1-rk': { base: 4500, crew: 2, truck: 'Tata Ace (7 ft)' },
    '1-bhk': { base: 6500, crew: 3, truck: 'Bolero Maxi (9 ft)' },
    '2-bhk': { base: 9500, crew: 4, truck: 'Eicher 14 ft Container' },
    '3-bhk': { base: 14500, crew: 5, truck: 'Eicher 17 ft Container' },
    '4-bhk': { base: 19500, crew: 6, truck: 'Eicher 19 ft Closed Container' },
    'office-small': { base: 12000, crew: 4, truck: 'Eicher 17 ft Closed' },
    'office-large': { base: 28000, crew: 8, truck: '2x 17 ft Containers' },
  }[houseSize] || { base: 9500, crew: 4, truck: 'Eicher 14 ft Container' };

  const addonPrices = {
    unpacking: 1200,
    acService: 1500,
    insurance: 499,
    tvMount: 750
  };

  let addonTotal = 0;
  if (addons.unpacking) addonTotal += addonPrices.unpacking;
  if (addons.acService) addonTotal += addonPrices.acService;
  if (addons.insurance) addonTotal += addonPrices.insurance;
  if (addons.tvMount) addonTotal += addonPrices.tvMount;

  const totalEstimate = sizeMultiplier.base + addonTotal;

  const handleBooking = (e) => {
    e.preventDefault();
    if (!userName || !userPhone) {
      alert('Please fill in your name and phone number');
      return;
    }
    setIsBooked(true);
  };

  const handleClose = () => {
    setIsBooked(false);
    setStep(1);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container plan-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-badge">
              <Sparkles size={14} />
              <span>Instant Price Calculator</span>
            </div>
            <h2>Plan Your Move with MoveMate</h2>
          </div>
          <button type="button" className="modal-close-btn" onClick={handleClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Progress Bar */}
        {!isBooked && (
          <div className="wizard-progress-bar">
            <div className={`wizard-step-node ${step >= 1 ? 'active' : ''}`}>1. Size & Type</div>
            <div className={`wizard-step-node ${step >= 2 ? 'active' : ''}`}>2. Locations</div>
            <div className={`wizard-step-node ${step >= 3 ? 'active' : ''}`}>3. Estimate</div>
            <div 
              className="wizard-progress-fill" 
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            ></div>
          </div>
        )}

        {/* Step 1: Type and Size */}
        {!isBooked && step === 1 && (
          <div className="wizard-step-content">
            <div className="form-group">
              <label className="form-label">Select Service Type</label>
              <div className="service-type-selector">
                <button
                  type="button"
                  className={`type-chip ${serviceType === 'home-shifting' ? 'active' : ''}`}
                  onClick={() => setServiceType('home-shifting')}
                >
                  🏠 Home Shifting
                </button>
                <button
                  type="button"
                  className={`type-chip ${serviceType === 'office-relocation' ? 'active' : ''}`}
                  onClick={() => setServiceType('office-relocation')}
                >
                  🏢 Office Relocation
                </button>
                <button
                  type="button"
                  className={`type-chip ${serviceType === 'packing-services' ? 'active' : ''}`}
                  onClick={() => setServiceType('packing-services')}
                >
                  📦 Packing Only
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                {serviceType === 'office-relocation' ? 'Select Office Scale' : 'Select Home Configuration'}
              </label>
              
              {serviceType === 'office-relocation' ? (
                <div className="bhk-grid">
                  {[
                    { id: 'office-small', label: '1 - 25 Desks', sub: 'Startup / Branch' },
                    { id: 'office-large', label: '25 - 100+ Desks', sub: 'Corporate Floor' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`bhk-card ${houseSize === item.id ? 'active' : ''}`}
                      onClick={() => setHouseSize(item.id)}
                    >
                      <div className="bhk-title">{item.label}</div>
                      <div className="bhk-sub">{item.sub}</div>
                      {houseSize === item.id && <Check size={16} className="bhk-check" />}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="bhk-grid">
                  {[
                    { id: '1-rk', label: '1 RK / Studio', sub: 'Minimal items' },
                    { id: '1-bhk', label: '1 BHK', sub: 'Standard single/couple' },
                    { id: '2-bhk', label: '2 BHK', sub: 'Most common family' },
                    { id: '3-bhk', label: '3 BHK', sub: 'Spacious flat' },
                    { id: '4-bhk', label: '4+ BHK / Villa', sub: 'Large household' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`bhk-card ${houseSize === item.id ? 'active' : ''}`}
                      onClick={() => setHouseSize(item.id)}
                    >
                      <div className="bhk-title">{item.label}</div>
                      <div className="bhk-sub">{item.sub}</div>
                      {houseSize === item.id && <Check size={16} className="bhk-check" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="wizard-nav-actions right-align">
              <button 
                type="button" 
                className="btn-primary-pill"
                onClick={() => setStep(2)}
              >
                Next: Add Locations <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Location and Date */}
        {!isBooked && step === 2 && (
          <div className="wizard-step-content">
            <div className="locations-two-col">
              {/* Pickup */}
              <div className="location-box">
                <div className="loc-box-title">
                  <MapPin size={16} className="text-primary" />
                  <span>Pickup Address ({pickupCity})</span>
                </div>
                <div className="form-group">
                  <label className="form-sublabel">Locality / Area</label>
                  <input
                    type="text"
                    className="form-input"
                    value={pickupLocality}
                    onChange={(e) => setPickupLocality(e.target.value)}
                    placeholder="e.g. Kothrud, Pune"
                  />
                </div>
                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-sublabel">Floor</label>
                    <input
                      type="number"
                      className="form-input"
                      value={pickupFloor}
                      onChange={(e) => setPickupFloor(e.target.value)}
                      min="0"
                    />
                  </div>
                  <div className="form-group flex-checkbox">
                    <label className="checkbox-container">
                      <input
                        type="checkbox"
                        checked={hasPickupLift}
                        onChange={(e) => setHasPickupLift(e.target.checked)}
                      />
                      <span>Elevator Available</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Dropoff */}
              <div className="location-box">
                <div className="loc-box-title">
                  <MapPin size={16} className="text-peach" />
                  <span>Drop-off Address ({dropCity})</span>
                </div>
                <div className="form-group">
                  <label className="form-sublabel">Locality / Area</label>
                  <input
                    type="text"
                    className="form-input"
                    value={dropLocality}
                    onChange={(e) => setDropLocality(e.target.value)}
                    placeholder="e.g. Baner, Pune"
                  />
                </div>
                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-sublabel">Floor</label>
                    <input
                      type="number"
                      className="form-input"
                      value={dropFloor}
                      onChange={(e) => setDropFloor(e.target.value)}
                      min="0"
                    />
                  </div>
                  <div className="form-group flex-checkbox">
                    <label className="checkbox-container">
                      <input
                        type="checkbox"
                        checked={hasDropLift}
                        onChange={(e) => setHasDropLift(e.target.checked)}
                      />
                      <span>Elevator Available</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Date Selection */}
            <div className="form-group mt-3">
              <label className="form-label">Preferred Moving Date</label>
              <div className="date-input-wrap">
                <Calendar size={18} className="date-icon" />
                <input
                  type="date"
                  className="form-input date-input"
                  value={moveDate}
                  onChange={(e) => setMoveDate(e.target.value)}
                />
              </div>
            </div>

            <div className="wizard-nav-actions space-between">
              <button 
                type="button" 
                className="btn-outline-pill"
                onClick={() => setStep(1)}
              >
                <ArrowLeft size={18} /> Back
              </button>
              <button 
                type="button" 
                className="btn-primary-pill"
                onClick={() => setStep(3)}
              >
                Calculate Quote <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Breakdown & Confirm */}
        {!isBooked && step === 3 && (
          <div className="wizard-step-content">
            <div className="estimate-summary-layout">
              {/* Left Column: Summary & Addons */}
              <div className="estimate-left">
                <div className="route-summary-pill">
                  <span>{pickupLocality}, {pickupCity}</span>
                  <ArrowRight size={16} />
                  <span>{dropLocality}, {dropCity}</span>
                </div>

                <div className="assigned-details-chips">
                  <div className="assigned-chip">
                    <Truck size={15} />
                    <span>Vehicle: <strong>{sizeMultiplier.truck}</strong></span>
                  </div>
                  <div className="assigned-chip">
                    <Users size={15} />
                    <span>Crew: <strong>{sizeMultiplier.crew} Movers + 1 Coordinator</strong></span>
                  </div>
                </div>

                <h4 className="addons-title">Optional Add-on Care Services</h4>
                <div className="addons-list">
                  <label className={`addon-item ${addons.unpacking ? 'selected' : ''}`}>
                    <input
                      type="checkbox"
                      checked={addons.unpacking}
                      onChange={(e) => setAddons({ ...addons, unpacking: e.target.checked })}
                    />
                    <div className="addon-info">
                      <div className="addon-name">Complete Unpacking & Box Removal</div>
                      <div className="addon-desc">We unpack and arrange items in your new rooms.</div>
                    </div>
                    <div className="addon-price">+₹1,200</div>
                  </label>

                  <label className={`addon-item ${addons.insurance ? 'selected' : ''}`}>
                    <input
                      type="checkbox"
                      checked={addons.insurance}
                      onChange={(e) => setAddons({ ...addons, insurance: e.target.checked })}
                    />
                    <div className="addon-info">
                      <div className="addon-name">Full Value Transit Insurance</div>
                      <div className="addon-desc">Zero deductible coverage up to ₹5,00,000.</div>
                    </div>
                    <div className="addon-price">+₹499</div>
                  </label>

                  <label className={`addon-item ${addons.acService ? 'selected' : ''}`}>
                    <input
                      type="checkbox"
                      checked={addons.acService}
                      onChange={(e) => setAddons({ ...addons, acService: e.target.checked })}
                    />
                    <div className="addon-info">
                      <div className="addon-name">AC Dismantling & Re-installation</div>
                      <div className="addon-desc">Certified technician unmounts and installs Split/Window AC.</div>
                    </div>
                    <div className="addon-price">+₹1,500</div>
                  </label>
                </div>
              </div>

              {/* Right Column: Price Box & User Form */}
              <div className="estimate-right">
                <div className="price-card">
                  <div className="price-tagline">Estimated Moving Cost</div>
                  <div className="price-amount">
                    ₹{totalEstimate.toLocaleString('en-IN')}
                  </div>
                  <div className="price-note">All-inclusive transparent pricing (Taxes, Fuel & Tolls)</div>

                  <hr className="price-divider" />

                  <form onSubmit={handleBooking} className="booking-contact-form">
                    <div className="form-group">
                      <label className="form-sublabel">Your Full Name</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Rahul Sharma"
                        required
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-sublabel">Phone Number for WhatsApp Updates</label>
                      <input
                        type="tel"
                        className="form-input"
                        placeholder="10-digit mobile number"
                        required
                        value={userPhone}
                        onChange={(e) => setUserPhone(e.target.value)}
                      />
                    </div>

                    <button type="submit" className="btn-confirm-booking">
                      Reserve Move & Lock Price
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <div className="wizard-nav-actions space-between mt-3">
              <button 
                type="button" 
                className="btn-outline-pill"
                onClick={() => setStep(2)}
              >
                <ArrowLeft size={18} /> Back
              </button>
            </div>
          </div>
        )}

        {/* Booking Confirmation Success View */}
        {isBooked && (
          <div className="booking-success-view">
            <div className="success-icon-wrap">
              <CheckCircle2 size={64} className="success-check-icon" />
            </div>
            <h3>Move Reserved Successfully!</h3>
            <p className="success-lead">
              Thank you, <strong>{userName}</strong>! Your moving booking for <strong>{moveDate}</strong> has been registered.
            </p>
            
            <div className="success-card">
              <div className="success-item">
                <span>Route:</span>
                <strong>{pickupLocality} → {dropLocality} ({pickupCity})</strong>
              </div>
              <div className="success-item">
                <span>Locked Estimate:</span>
                <strong>₹{totalEstimate.toLocaleString('en-IN')}</strong>
              </div>
              <div className="success-item">
                <span>Vehicle & Crew:</span>
                <strong>{sizeMultiplier.truck} with {sizeMultiplier.crew} Movers</strong>
              </div>
            </div>

            <p className="success-note">
              Our Move Coordinator will call you at <strong>+91 {userPhone}</strong> within 15 minutes to confirm inventory checklist and elevator timings.
            </p>

            <button type="button" className="btn-primary-pill" onClick={handleClose}>
              Done & Return Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
