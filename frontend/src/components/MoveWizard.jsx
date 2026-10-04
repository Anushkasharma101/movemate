import React, { useState } from 'react';
import { 
  MapPin, Calendar, Home, ArrowRight, ArrowLeft, Plus, Minus, Trash2, 
  FileText, Clock, Check, CheckCircle2, ShieldCheck, Truck, Users, 
  Package, Tv, BedDouble, Archive, Sparkles, ChevronDown, User, AlertCircle,
  RefreshCw, Edit3, Key, Lock, HelpCircle, Building2
} from 'lucide-react';

export default function MoveWizard({ 
  isOpen, 
  onClose, 
  onNavigateHome, 
  onSubmitRequest,
  userProfile = { name: 'Pooja', initials: 'PD' } 
}) {
  const [currentStep, setCurrentStep] = useState(1); // 1: Details, 2: Inventory, 3: Plan (AI Draft), 4: Confirm (Request Summary)

  // Step 1: Move Details State
  const [details, setDetails] = useState({
    pickupAddress: 'Flat B-S02, Orchid Residency, Baner, Pune 411045',
    pickupFloor: '5th floor',
    pickupLift: 'Yes',
    destAddress: 'Flat 1203, Skyline Apartments, Kharadi, Pune 411014',
    destFloor: '12th floor',
    destLift: 'Yes',
    moveDate: '2025-06-14',
    moveDateFormatted: 'Sat, 14 Jun 2025',
    homeSize: '2 BHK',
    accessPersonPickup: 'Pooja Sharma (Self)',
    accessPersonDelivery: 'Rahul Sharma (Spouse)',
    accessNotes: 'Service lift operational from 9 AM to 6 PM. Gate pass required at Baner society.'
  });

  // Step 2: Inventory Items State
  const [inventory, setInventory] = useState([
    { id: 1, name: 'Bed (King)', type: 'bed', qty: 1, fragile: false, notes: 'Wooden with hydraulic storage' },
    { id: 2, name: 'Refrigerator', type: 'fridge', qty: 1, fragile: false, notes: 'Double door 340L' },
    { id: 3, name: 'Monitor / TV', type: 'tv', qty: 2, fragile: true, notes: '32 inch desktop monitor & 55 inch TV' },
    { id: 4, name: 'Packing boxes (Standard)', type: 'box', qty: 10, fragile: false, notes: 'Books, kitchenware, linens' }
  ]);

  const [specialInstructions, setSpecialInstructions] = useState('Please keep my work laptop and documents unpacked.');
  const [unavailableHours, setUnavailableHours] = useState('11:00 AM – 1:00 PM');
  const [isRegeneratingPlan, setIsRegeneratingPlan] = useState(false);
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [accessAuthorized, setAccessAuthorized] = useState(true);

  if (!isOpen) return null;

  // Quantity handlers
  const updateQty = (id, delta) => {
    setInventory(inventory.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  const toggleFragile = (id) => {
    setInventory(inventory.map(item => {
      if (item.id === id) {
        return { ...item, fragile: !item.fragile };
      }
      return item;
    }));
  };

  const updateNotes = (id, notes) => {
    setInventory(inventory.map(item => {
      if (item.id === id) {
        return { ...item, notes };
      }
      return item;
    }));
  };

  const removeItem = (id) => {
    if (inventory.length <= 1) {
      alert('Please keep at least one item in your inventory.');
      return;
    }
    setInventory(inventory.filter(item => item.id !== id));
  };

  const addNewItem = (itemName, type = 'box') => {
    const newItem = {
      id: Date.now(),
      name: itemName,
      type: type,
      qty: 1,
      fragile: false,
      notes: ''
    };
    setInventory([...inventory, newItem]);
  };

  const getItemIcon = (type) => {
    switch (type) {
      case 'bed': return <BedDouble size={18} className="inv-icon-svg" />;
      case 'fridge': return <Archive size={18} className="inv-icon-svg" />;
      case 'tv': return <Tv size={18} className="inv-icon-svg" />;
      case 'box':
      default: return <Package size={18} className="inv-icon-svg" />;
    }
  };

  const handleRegeneratePlan = () => {
    setIsRegeneratingPlan(true);
    setTimeout(() => {
      setIsRegeneratingPlan(false);
    }, 600);
  };

  const handleSubmitRequest = () => {
    if (onSubmitRequest) {
      onSubmitRequest({
        id: 'MM-1042',
        details,
        inventory,
        date: details.moveDateFormatted || '4 October 2026'
      });
    }
  };

  return (
    <div className="wizard-page-wrapper">
      {/* Top App Header */}
      <header className="wizard-header container">
        <button 
          type="button" 
          className="brand-logo"
          onClick={onNavigateHome}
          aria-label="MoveMate Home"
        >
          <img 
            src="/images/single_color_mark.png" 
            alt="MoveMate Icon" 
            className="brand-icon" 
          />
          <span className="brand-text">MoveMate</span>
        </button>

        {/* Top Step Stepper Bar */}
        <div className="wizard-top-stepper">
          {/* Step 1 */}
          <div className={`stepper-node ${currentStep === 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
            <span className="stepper-circle">
              {currentStep > 1 ? <Check size={14} /> : '1'}
            </span>
            <span className="stepper-label">Details</span>
          </div>

          <div className={`stepper-line ${currentStep > 1 ? 'filled' : ''}`}></div>

          {/* Step 2 */}
          <div className={`stepper-node ${currentStep === 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
            <span className="stepper-circle">
              {currentStep > 2 ? <Check size={14} /> : '2'}
            </span>
            <span className="stepper-label">Inventory</span>
          </div>

          <div className={`stepper-line ${currentStep > 2 ? 'filled' : ''}`}></div>

          {/* Step 3 */}
          <div className={`stepper-node ${currentStep === 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>
            <span className="stepper-circle">
              {currentStep > 3 ? <Check size={14} /> : '3'}
            </span>
            <span className="stepper-label">Plan</span>
          </div>

          <div className={`stepper-line ${currentStep > 3 ? 'filled' : ''}`}></div>

          {/* Step 4 */}
          <div className={`stepper-node ${currentStep === 4 ? 'active' : ''}`}>
            <span className="stepper-circle">4</span>
            <span className="stepper-label">Confirm</span>
          </div>
        </div>

        {/* User profile dropdown pill */}
        <div className="wizard-user-pill">
          <div className="user-avatar-circle">{userProfile.initials || 'PD'}</div>
          <span className="user-name-text">{userProfile.name || 'Pooja'}</span>
          <ChevronDown size={14} className="user-chevron" />
        </div>
      </header>

      {/* Main Wizard Content Card */}
      <main className="container wizard-main-container">
        <div className="wizard-card-surface">
          
          {/* ============================================================
              STEP 1: MOVE DETAILS
              ============================================================ */}
          {currentStep === 1 && (
            <div className="wizard-step-body animate-fade-in">
              <div className="step-title-header">
                <h1 className="step-main-title">Tell us about your move</h1>
                <p className="step-main-subtitle">We'll use this to create a personalized AI plan.</p>
              </div>

              <div className="move-details-grid">
                {/* Left Column: Pickup details */}
                <div className="details-col">
                  {/* Pickup Address */}
                  <div className="form-group">
                    <label className="form-input-label">Pickup address (Current home)</label>
                    <div className="input-with-icon-wrap address-input-wrap">
                      <MapPin size={18} className="input-inner-icon text-primary" />
                      <input 
                        type="text" 
                        className="form-input with-icon"
                        value={details.pickupAddress}
                        onChange={(e) => setDetails({ ...details, pickupAddress: e.target.value })}
                        placeholder="Enter pickup flat, building, area and pincode"
                      />
                    </div>
                  </div>

                  {/* Floor & Lift Row */}
                  <div className="details-two-col-row">
                    <div className="form-group">
                      <label className="form-input-label">Floor</label>
                      <div className="select-dropdown-wrap">
                        <select 
                          className="form-select"
                          value={details.pickupFloor}
                          onChange={(e) => setDetails({ ...details, pickupFloor: e.target.value })}
                        >
                          <option value="Ground floor">Ground floor</option>
                          <option value="1st floor">1st floor</option>
                          <option value="2nd floor">2nd floor</option>
                          <option value="3rd floor">3rd floor</option>
                          <option value="4th floor">4th floor</option>
                          <option value="5th floor">5th floor</option>
                          <option value="12th floor">12th floor</option>
                          <option value="15th+ floor">15th+ floor</option>
                        </select>
                        <ChevronDown size={16} className="select-chevron" />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-input-label">Lift available?</label>
                      <div className="select-dropdown-wrap">
                        <select 
                          className="form-select"
                          value={details.pickupLift}
                          onChange={(e) => setDetails({ ...details, pickupLift: e.target.value })}
                        >
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                          <option value="Service Lift Only">Service Lift Only</option>
                        </select>
                        <ChevronDown size={16} className="select-chevron" />
                      </div>
                    </div>
                  </div>

                  {/* Moving Date */}
                  <div className="form-group">
                    <label className="form-input-label">Moving date</label>
                    <div className="input-with-icon-wrap">
                      <Calendar size={18} className="input-inner-icon text-primary" />
                      <input 
                        type="date" 
                        className="form-input with-icon"
                        value={details.moveDate}
                        onChange={(e) => {
                          const val = e.target.value;
                          setDetails({ 
                            ...details, 
                            moveDate: val,
                            moveDateFormatted: new Date(val).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
                          });
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column: Destination details */}
                <div className="details-col">
                  {/* Destination Address */}
                  <div className="form-group">
                    <label className="form-input-label">Destination address (New home)</label>
                    <div className="input-with-icon-wrap address-input-wrap">
                      <MapPin size={18} className="input-inner-icon text-primary" />
                      <input 
                        type="text" 
                        className="form-input with-icon"
                        value={details.destAddress}
                        onChange={(e) => setDetails({ ...details, destAddress: e.target.value })}
                        placeholder="Enter destination flat, building, area and pincode"
                      />
                    </div>
                  </div>

                  {/* Floor & Lift Row */}
                  <div className="details-two-col-row">
                    <div className="form-group">
                      <label className="form-input-label">Floor</label>
                      <div className="select-dropdown-wrap">
                        <select 
                          className="form-select"
                          value={details.destFloor}
                          onChange={(e) => setDetails({ ...details, destFloor: e.target.value })}
                        >
                          <option value="Ground floor">Ground floor</option>
                          <option value="1st floor">1st floor</option>
                          <option value="2nd floor">2nd floor</option>
                          <option value="3rd floor">3rd floor</option>
                          <option value="4th floor">4th floor</option>
                          <option value="5th floor">5th floor</option>
                          <option value="12th floor">12th floor</option>
                          <option value="15th+ floor">15th+ floor</option>
                        </select>
                        <ChevronDown size={16} className="select-chevron" />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-input-label">Lift available?</label>
                      <div className="select-dropdown-wrap">
                        <select 
                          className="form-select"
                          value={details.destLift}
                          onChange={(e) => setDetails({ ...details, destLift: e.target.value })}
                        >
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                          <option value="Service Lift Only">Service Lift Only</option>
                        </select>
                        <ChevronDown size={16} className="select-chevron" />
                      </div>
                    </div>
                  </div>

                  {/* Home size */}
                  <div className="form-group">
                    <label className="form-input-label">Home size</label>
                    <div className="select-dropdown-wrap">
                      <Home size={18} className="select-left-icon text-primary" />
                      <select 
                        className="form-select with-left-icon"
                        value={details.homeSize}
                        onChange={(e) => setDetails({ ...details, homeSize: e.target.value })}
                      >
                        <option value="1 RK / Studio">1 RK / Studio</option>
                        <option value="1 BHK">1 BHK</option>
                        <option value="2 BHK">2 BHK</option>
                        <option value="3 BHK">3 BHK</option>
                        <option value="4+ BHK / Villa">4+ BHK / Villa</option>
                        <option value="Office (1-20 Desks)">Office (1-20 Desks)</option>
                      </select>
                      <ChevronDown size={16} className="select-chevron" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Nav Buttons */}
              <div className="wizard-bottom-actions">
                <button 
                  type="button" 
                  className="btn-wizard-back"
                  onClick={onNavigateHome}
                >
                  <ArrowLeft size={18} /> Back
                </button>
                <button 
                  type="button" 
                  className="btn-wizard-continue"
                  onClick={() => setCurrentStep(2)}
                >
                  Continue <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* ============================================================
              STEP 2: INVENTORY
              ============================================================ */}
          {currentStep === 2 && (
            <div className="wizard-step-body animate-fade-in">
              <div className="step-title-header">
                <h1 className="step-main-title">What are you moving?</h1>
                <p className="step-main-subtitle">Add major items to help AI generate a personalized moving schedule.</p>
              </div>

              {/* Inventory List */}
              <div className="inventory-items-container">
                {inventory.map(item => (
                  <div key={item.id} className="inv-row-card">
                    <div className="inv-item-main">
                      <div className="inv-icon-wrap">
                        {getItemIcon(item.type)}
                      </div>
                      <div className="inv-item-details">
                        <span className="inv-name">{item.name}</span>
                        <input 
                          type="text" 
                          className="inv-notes-input"
                          placeholder="Add details (e.g. dimensions, fragile, disassembly)"
                          value={item.notes}
                          onChange={(e) => updateNotes(item.id, e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="inv-controls-group">
                      <button 
                        type="button" 
                        className={`fragile-toggle-pill ${item.fragile ? 'active' : ''}`}
                        onClick={() => toggleFragile(item.id)}
                      >
                        <ShieldCheck size={14} />
                        <span>Fragile</span>
                      </button>

                      <div className="qty-stepper-control">
                        <button type="button" className="qty-btn" onClick={() => updateQty(item.id, -1)}>
                          <Minus size={13} />
                        </button>
                        <span className="qty-num">{item.qty}</span>
                        <button type="button" className="qty-btn" onClick={() => updateQty(item.id, 1)}>
                          <Plus size={13} />
                        </button>
                      </div>

                      <button 
                        type="button" 
                        className="btn-remove-item"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Add Items */}
              <div className="quick-add-wrap">
                <span className="quick-add-title">Quick add common items:</span>
                <div className="quick-add-chips">
                  {[
                    { name: 'Sofa (3 Seater)', type: 'bed' },
                    { name: 'Dining Table & Chairs', type: 'bed' },
                    { name: 'Washing Machine', type: 'fridge' },
                    { name: 'Wardrobe / Cupboard', type: 'bed' },
                    { name: 'Microwave Oven', type: 'tv' }
                  ].map(opt => (
                    <button 
                      key={opt.name}
                      type="button"
                      className="quick-add-chip"
                      onClick={() => addNewItem(opt.name, opt.type)}
                    >
                      <Plus size={13} /> {opt.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Special Instructions & Unavailable hours */}
              <div className="inv-extra-options-row">
                <div className="form-group">
                  <label className="form-input-label">Special handling instructions</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="e.g. Keep laptop bag unpacked, dismantle bed carefully"
                  />
                </div>

                <div className="form-group">
                  <label className="form-input-label">Unavailable hours / meeting times</label>
                  <div className="input-with-icon-wrap">
                    <Clock size={18} className="input-inner-icon text-primary" />
                    <input 
                      type="text" 
                      className="form-input with-icon"
                      value={unavailableHours}
                      onChange={(e) => setUnavailableHours(e.target.value)}
                      placeholder="e.g. 11:00 AM – 1:00 PM"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Nav Buttons */}
              <div className="wizard-bottom-actions">
                <button 
                  type="button" 
                  className="btn-wizard-back"
                  onClick={() => setCurrentStep(1)}
                >
                  <ArrowLeft size={18} /> Back
                </button>
                <button 
                  type="button" 
                  className="btn-wizard-continue"
                  onClick={() => setCurrentStep(3)}
                >
                  Generate plan <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* ============================================================
              STEP 3: REVIEW AI PLAN (Your personalized moving plan - Screen 4)
              ============================================================ */}
          {currentStep === 3 && (
            <div className="wizard-step-body animate-fade-in">
              <div className="plan-step-top-header">
                <div>
                  <div className="plan-title-row">
                    <h1 className="step-main-title">Your personalized moving plan</h1>
                    <span className="badge-ai-draft">
                      <Sparkles size={13} /> AI Draft
                    </span>
                  </div>
                  <p className="step-main-subtitle">Here's a plan based on your details. You can edit anything before confirming.</p>
                </div>

                <button 
                  type="button" 
                  className={`btn-regenerate-plan ${isRegeneratingPlan ? 'spinning' : ''}`}
                  onClick={handleRegeneratePlan}
                >
                  <RefreshCw size={15} />
                  <span>Regenerate plan</span>
                </button>
              </div>

              {/* Two Column Grid: Summary & Proposed Schedule */}
              <div className="ai-plan-split-grid">
                {/* Left Column: Move summary & Inventory */}
                <div className="ai-plan-left-col">
                  {/* Move Summary Card */}
                  <div className="plan-summary-card">
                    <div className="plan-card-header">
                      <div className="plan-header-title-wrap">
                        <Home size={18} className="text-primary" />
                        <h3>Move summary</h3>
                      </div>
                      <button 
                        type="button" 
                        className="btn-edit-link"
                        onClick={() => setCurrentStep(1)}
                      >
                        <Edit3 size={14} /> Edit
                      </button>
                    </div>

                    <div className="plan-summary-fields">
                      <div className="plan-field-row">
                        <MapPin size={16} className="plan-field-icon text-primary" />
                        <div>
                          <span className="field-label">Pickup</span>
                          <p className="field-value">{details.pickupAddress}</p>
                        </div>
                      </div>

                      <div className="plan-field-row">
                        <MapPin size={16} className="plan-field-icon text-primary" />
                        <div>
                          <span className="field-label">Drop</span>
                          <p className="field-value">{details.destAddress}</p>
                        </div>
                      </div>

                      <div className="plan-field-row">
                        <Calendar size={16} className="plan-field-icon text-primary" />
                        <div>
                          <span className="field-label">Date</span>
                          <p className="field-value">{details.moveDateFormatted || 'Sat, 14 Jun 2025'}</p>
                        </div>
                      </div>

                      <div className="plan-field-row">
                        <Home size={16} className="plan-field-icon text-primary" />
                        <div>
                          <span className="field-label">Home size</span>
                          <p className="field-value">{details.homeSize}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Inventory (4 items) Card */}
                  <div className="plan-summary-card mt-3">
                    <div className="plan-card-header">
                      <div className="plan-header-title-wrap">
                        <Package size={18} className="text-primary" />
                        <h3>Inventory ({inventory.length} items)</h3>
                      </div>
                      <button 
                        type="button" 
                        className="btn-edit-link"
                        onClick={() => setCurrentStep(2)}
                      >
                        <Edit3 size={14} /> Edit
                      </button>
                    </div>

                    <div className="plan-inventory-list">
                      {inventory.map(item => (
                        <div key={item.id} className="plan-inv-row">
                          <div className="plan-inv-name-wrap">
                            {getItemIcon(item.type)}
                            <span>{item.name}</span>
                          </div>
                          <span className="plan-inv-qty">{item.qty}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Proposed Schedule & Access Needed */}
                <div className="ai-plan-right-col">
                  {/* Proposed Schedule Card */}
                  <div className="proposed-schedule-card">
                    <div className="plan-card-header">
                      <div className="plan-header-title-wrap">
                        <Clock size={18} className="text-primary" />
                        <h3>Proposed schedule</h3>
                      </div>
                    </div>

                    <div className="schedule-vertical-timeline">
                      <div className="sched-timeline-node">
                        <div className="sched-dot-green"></div>
                        <div className="sched-time-badge">8:00 AM</div>
                        <div className="sched-text-block">
                          <strong>Crew arrives at pickup location</strong>
                          <p>Packing and loading begins</p>
                        </div>
                      </div>

                      <div className="sched-timeline-node">
                        <div className="sched-dot-green"></div>
                        <div className="sched-time-badge">10:30 AM</div>
                        <div className="sched-text-block">
                          <strong>Loading complete</strong>
                          <p>Transit to new home (~ 30 mins)</p>
                        </div>
                      </div>

                      {/* Peach Highlighted Meeting Break */}
                      <div className="sched-timeline-node highlight-meeting">
                        <div className="sched-dot-peach"></div>
                        <div className="sched-time-badge peach">11:00 AM – 1:00 PM</div>
                        <div className="sched-text-block">
                          <strong className="text-peach-dark">Your meeting (no work scheduled)</strong>
                        </div>
                      </div>

                      <div className="sched-timeline-node">
                        <div className="sched-dot-green"></div>
                        <div className="sched-time-badge">1:00 PM</div>
                        <div className="sched-text-block">
                          <strong>Unloading and unpacking</strong>
                          <p>Furniture setup</p>
                        </div>
                      </div>

                      <div className="sched-timeline-node">
                        <div className="sched-dot-green"></div>
                        <div className="sched-time-badge">4:00 PM</div>
                        <div className="sched-text-block">
                          <strong>Estimated completion</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Amber "A few details we still need" Card */}
                  <div className="access-needed-callout-card">
                    <div className="callout-left-icon">
                      <Key size={20} className="text-orange" />
                    </div>
                    <div className="callout-content-wrap">
                      <span className="callout-pre-title">A few details we still need</span>
                      <h4 className="callout-main-title">Who will provide access at both homes?</h4>
                      <p className="callout-desc">Let us know who will be present to give access for pickup and at the new home for delivery.</p>
                      
                      <button 
                        type="button" 
                        className="btn-add-access-details"
                        onClick={() => setShowAccessModal(true)}
                      >
                        <span>Add details</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Nav Actions */}
              <div className="wizard-bottom-actions space-between">
                <button 
                  type="button" 
                  className="btn-wizard-back"
                  onClick={() => setCurrentStep(2)}
                >
                  <ArrowLeft size={18} /> Back
                </button>

                <div className="right-action-buttons-group">
                  <button 
                    type="button" 
                    className="btn-wizard-outline"
                    onClick={() => setCurrentStep(1)}
                  >
                    <Edit3 size={16} />
                    <span>Edit details</span>
                  </button>
                  <button 
                    type="button" 
                    className="btn-wizard-continue"
                    onClick={() => setCurrentStep(4)}
                  >
                    <span>Confirm details</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================
              STEP 4: REQUEST SUMMARY (Screen 3)
              ============================================================ */}
          {currentStep === 4 && (
            <div className="wizard-step-body animate-fade-in">
              <div className="step-title-header">
                <h1 className="step-main-title">Request summary</h1>
                <p className="step-main-subtitle">Review your details and submit the request. We'll confirm availability and share a quote soon.</p>
              </div>

              {/* Two Column Grid: Request Summary */}
              <div className="request-summary-grid">
                {/* Left Column: Move details & Inventory */}
                <div className="req-summary-left-col">
                  {/* Move Details Card */}
                  <div className="summary-section-card">
                    <div className="plan-card-header">
                      <div className="plan-header-title-wrap">
                        <Home size={18} className="text-primary" />
                        <h3>Move details</h3>
                      </div>
                      <button 
                        type="button" 
                        className="btn-edit-link"
                        onClick={() => setCurrentStep(1)}
                      >
                        <Edit3 size={14} /> Edit
                      </button>
                    </div>

                    <div className="summary-fields-table">
                      <div className="summary-row">
                        <span className="sum-label"><Calendar size={15} /> Date</span>
                        <span className="sum-value">{details.moveDateFormatted || 'Sat, 14 Jun 2025'}</span>
                      </div>
                      <div className="summary-row">
                        <span className="sum-label"><MapPin size={15} /> Pickup</span>
                        <span className="sum-value">{details.pickupAddress}</span>
                      </div>
                      <div className="summary-row">
                        <span className="sum-label"><MapPin size={15} /> Drop</span>
                        <span className="sum-value">{details.destAddress}</span>
                      </div>
                      <div className="summary-row">
                        <span className="sum-label"><Home size={15} /> Home size</span>
                        <span className="sum-value">{details.homeSize}</span>
                      </div>
                      <div className="summary-row">
                        <span className="sum-label"><Building2 size={15} /> Floors & lift</span>
                        <span className="sum-value">{details.pickupFloor} (Lift: {details.pickupLift}) → {details.destFloor} (Lift: {details.destLift})</span>
                      </div>
                    </div>
                  </div>

                  {/* Inventory (4 items) Card */}
                  <div className="summary-section-card mt-3">
                    <div className="plan-card-header">
                      <div className="plan-header-title-wrap">
                        <Package size={18} className="text-primary" />
                        <h3>Inventory ({inventory.length} items)</h3>
                      </div>
                      <button 
                        type="button" 
                        className="btn-edit-link"
                        onClick={() => setCurrentStep(2)}
                      >
                        <Edit3 size={14} /> Edit
                      </button>
                    </div>

                    <div className="plan-inventory-list">
                      {inventory.map(item => (
                        <div key={item.id} className="plan-inv-row">
                          <div className="plan-inv-name-wrap">
                            {getItemIcon(item.type)}
                            <span>{item.name}</span>
                          </div>
                          <span className="plan-inv-qty">{item.qty}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Status Cards & Authorization */}
                <div className="req-summary-right-col">
                  {/* Coordinator Status Card */}
                  <div className="summary-status-card">
                    <div className="status-card-header">
                      <div className="plan-header-title-wrap">
                        <User size={18} className="text-primary" />
                        <h3>Coordinator</h3>
                      </div>
                      <span className="badge-pending-peach">Not yet assigned</span>
                    </div>
                    <p className="status-card-text">
                      A verified MoveMate coordinator will be assigned based on your requirements.
                    </p>
                  </div>

                  {/* Quote Status Card */}
                  <div className="summary-status-card mt-3">
                    <div className="status-card-header">
                      <div className="plan-header-title-wrap">
                        <span className="rupee-icon">₹</span>
                        <h3>Quote</h3>
                      </div>
                      <span className="badge-pending-peach">Quote pending</span>
                    </div>
                    <p className="status-card-text">
                      We'll review your request and share a custom quote shortly.
                    </p>
                  </div>

                  {/* Vehicle & Crew Status Card */}
                  <div className="summary-status-card mt-3">
                    <div className="status-card-header">
                      <div className="plan-header-title-wrap">
                        <Truck size={18} className="text-primary" />
                        <h3>Vehicle & crew</h3>
                      </div>
                      <span className="badge-pending-peach">Pending review</span>
                    </div>
                    <p className="status-card-text">
                      Recommended vehicle and crew size will be confirmed with the quote.
                    </p>
                  </div>

                  {/* Access Authorization Mint Card */}
                  <div className="access-authorization-card mt-3">
                    <div className="access-auth-header">
                      <Lock size={18} className="text-primary" />
                      <h4>Access authorization</h4>
                    </div>
                    <label className="checkbox-custom-label">
                      <input 
                        type="checkbox"
                        checked={accessAuthorized}
                        onChange={(e) => setAccessAuthorized(e.target.checked)}
                        required
                      />
                      <span className="checkbox-text">
                        I confirm that someone will be available to provide access at both the pickup and destination addresses on the scheduled date.
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Bottom Nav Buttons */}
              <div className="wizard-bottom-actions space-between">
                <button 
                  type="button" 
                  className="btn-wizard-back"
                  onClick={() => setCurrentStep(3)}
                >
                  <ArrowLeft size={18} /> Back
                </button>

                <button 
                  type="button" 
                  className="btn-wizard-continue"
                  onClick={handleSubmitRequest}
                >
                  <span>Submit request</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Access Details Modal */}
      {showAccessModal && (
        <div className="modal-overlay" onClick={() => setShowAccessModal(false)}>
          <div className="modal-container service-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-wrap">
                <div className="modal-badge">
                  <Key size={14} />
                  <span>Access Logistics</span>
                </div>
                <h2>Move-Day Access Details</h2>
              </div>
              <button 
                type="button" 
                className="modal-close-btn" 
                onClick={() => setShowAccessModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="service-modal-body">
              <p className="service-lead">Specify who will be present at both locations to receive the crew and hand over the keys.</p>
              
              <div className="two-col-inputs mt-3">
                <div className="form-group">
                  <label className="form-sublabel">Pickup location contact (Baner)</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={details.accessPersonPickup}
                    onChange={(e) => setDetails({ ...details, accessPersonPickup: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-sublabel">Drop location contact (Kharadi)</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={details.accessPersonDelivery}
                    onChange={(e) => setDetails({ ...details, accessPersonDelivery: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group mt-3">
                <label className="form-sublabel">Society & Service Lift Rules</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={details.accessNotes}
                  onChange={(e) => setDetails({ ...details, accessNotes: e.target.value })}
                />
              </div>

              <button 
                type="button" 
                className="btn-primary-pill w-full mt-4"
                onClick={() => setShowAccessModal(false)}
              >
                Save Access Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
