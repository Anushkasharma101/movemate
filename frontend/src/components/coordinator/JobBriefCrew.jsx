import React, { useState } from 'react';
import { 
  ArrowLeft, ArrowRight, MapPin, Phone, Compass, Check, 
  X, AlertTriangle, AlertCircle, Truck, Users, Plus, 
  Edit3, CheckSquare, Sparkles, ExternalLink, ShieldAlert
} from 'lucide-react';

export default function JobBriefCrew({ 
  onBack, 
  onNavigateExecution,
  onNavigateIssue 
}) {
  const [activeTab, setActiveTab] = useState('brief'); // 'brief' | 'items' | 'crew' | 'notes'
  
  // Checklist state
  const [checklist, setChecklist] = useState([
    { id: 1, label: 'Packing materials ready', checked: true },
    { id: 2, label: 'Fragile items marked', checked: true },
    { id: 3, label: 'Laptop excluded', checked: true },
    { id: 4, label: 'Building access confirmed', checked: false },
    { id: 5, label: 'Customer walkthrough done', checked: false }
  ]);

  // Workers state
  const [workers, setWorkers] = useState([
    { id: 1, name: 'Amit Singh', role: 'Team Lead', avatar: 'AS' },
    { id: 2, name: 'Suresh Patil', role: 'Mover', avatar: 'SP' },
    { id: 3, name: 'Imran Shaikh', role: 'Mover', avatar: 'IS' }
  ]);

  const [selectedVehicle, setSelectedVehicle] = useState('14 ft Closed Truck (suitable for 1 BHK)');

  const toggleChecklistItem = (id) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const removeWorker = (id) => {
    setWorkers(prev => prev.filter(w => w.id !== id));
  };

  const addWorker = () => {
    const name = prompt('Enter worker name to assign:');
    if (name) {
      setWorkers(prev => [...prev, {
        id: Date.now(),
        name,
        role: 'Mover',
        avatar: name.split(' ').map(n => n[0]).join('').toUpperCase()
      }]);
    }
  };

  return (
    <div className="coord-job-brief-container animate-fade-in">
      
      {/* Top Breadcrumbs & Back */}
      <div className="coord-breadcrumbs-row">
        <button type="button" className="btn-back-breadcrumb" onClick={onBack}>
          <ArrowLeft size={16} /> Jobs
        </button>
        <span className="breadcrumb-sep">&gt;</span>
        <span className="breadcrumb-current">MM-1042</span>
      </div>

      {/* Header with Badges and Customer Photo */}
      <div className="job-brief-header">
        <div className="job-brief-title-wrap">
          <div className="title-with-pill">
            <h1 className="job-id-title">MM-1042</h1>
            <span className="badge-ai-confirmed">
              <Sparkles size={13} /> AI draft confirmed by customer
            </span>
          </div>
          <p className="job-brief-meta">1 BHK Move • 4 October 2026</p>
        </div>

        <div className="job-customer-badge">
          <img 
            src="/images/pooja_avatar.jpg" 
            alt="Customer Pooja" 
            className="job-customer-img"
          />
          <span className="job-customer-name">Customer: Pooja</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="job-brief-tabs">
        <button 
          type="button" 
          className={`job-tab-btn ${activeTab === 'brief' ? 'active' : ''}`}
          onClick={() => setActiveTab('brief')}
        >
          Job brief
        </button>
        <button 
          type="button" 
          className={`job-tab-btn ${activeTab === 'items' ? 'active' : ''}`}
          onClick={() => setActiveTab('items')}
        >
          Items & checklist
        </button>
        <button 
          type="button" 
          className={`job-tab-btn ${activeTab === 'crew' ? 'active' : ''}`}
          onClick={() => setActiveTab('crew')}
        >
          Crew & vehicle
        </button>
        <button 
          type="button" 
          className={`job-tab-btn ${activeTab === 'notes' ? 'active' : ''}`}
          onClick={() => setActiveTab('notes')}
        >
          Notes
        </button>
      </div>

      {/* ============================================================
          TAB 1: JOB BRIEF (Screen 14 Layout - 3x2 Grid)
          ============================================================ */}
      {activeTab === 'brief' && (
        <div className="job-cards-grid-3x2 animate-fade-in">
          
          {/* Card 1: Pickup Address */}
          <div className="brief-card">
            <h3 className="brief-card-title">Pickup address</h3>
            <div className="brief-address-content">
              <div className="address-pin-row">
                <MapPin size={16} className="text-primary flex-shrink-0" />
                <p className="address-text">
                  A-301, Sai Residency, Paud Road, Kothrud, Pune 411038
                </p>
              </div>
              <div className="address-contact-row">
                <Phone size={14} className="text-muted" />
                <span>Pooja &bull; +91 98765 43210</span>
              </div>
              <button 
                type="button" 
                className="btn-open-maps"
                onClick={() => alert('Opening Google Maps navigation to Kothrud pickup...')}
              >
                <Compass size={14} /> Open in Maps
              </button>
            </div>
          </div>

          {/* Card 2: Drop Address */}
          <div className="brief-card">
            <h3 className="brief-card-title">Drop address</h3>
            <div className="brief-address-content">
              <div className="address-pin-row">
                <MapPin size={16} className="text-primary flex-shrink-0" />
                <p className="address-text">
                  B-702, Green View Apartments, Wakad, Pune 411057
                </p>
              </div>
              <div className="address-contact-row">
                <Phone size={14} className="text-muted" />
                <span>Pooja &bull; +91 98765 43210</span>
              </div>
              <button 
                type="button" 
                className="btn-open-maps"
                onClick={() => alert('Opening Google Maps navigation to Wakad drop...')}
              >
                <Compass size={14} /> Open in Maps
              </button>
            </div>
          </div>

          {/* Card 3: Access & Restrictions */}
          <div className="brief-card">
            <h3 className="brief-card-title">Access & restrictions</h3>
            <div className="access-info-list">
              <div className="access-item">
                <span className="access-bullet">🏢</span>
                <span>Pickup: 3rd floor (lift available)</span>
              </div>
              <div className="access-item">
                <span className="access-bullet">🏢</span>
                <span>Drop: 7th floor (lift available)</span>
              </div>
              <div className="access-item">
                <span className="access-bullet">🅿️</span>
                <span>Parking: Apartment parking</span>
              </div>
              <div className="access-item">
                <span className="access-bullet">⏰</span>
                <span>Move time restrictions: Quiet hours 11:00 – 13:00</span>
              </div>

              {/* Special Instruction Pills */}
              <div className="special-alert-pills">
                <div className="alert-pill alert-red">
                  <ShieldAlert size={14} />
                  <span>Do not pack laptop (Keep with customer)</span>
                </div>
                <div className="alert-pill alert-yellow">
                  <AlertTriangle size={14} />
                  <span>Monitor – fragile item (Use bubble wrap)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Vehicle Selection */}
          <div className="brief-card">
            <h3 className="brief-card-title">Vehicle selection</h3>
            <div className="vehicle-selection-content">
              <select 
                value={selectedVehicle}
                onChange={(e) => setSelectedVehicle(e.target.value)}
                className="vehicle-dropdown-select"
              >
                <option value="14 ft Closed Truck (suitable for 1 BHK)">14 ft Closed Truck (suitable for 1 BHK)</option>
                <option value="17 ft Medium Container (suitable for 2 BHK)">17 ft Medium Container (suitable for 2 BHK)</option>
                <option value="19 ft Large Truck (suitable for 3 BHK)">19 ft Large Truck (suitable for 3 BHK)</option>
              </select>

              <div className="vehicle-img-preview-box">
                <img 
                  src="/images/closed_truck.jpg" 
                  alt="14 ft Closed Truck" 
                  className="vehicle-preview-img"
                />
              </div>

              <button 
                type="button" 
                className="btn-view-vehicles-link"
                onClick={() => alert('MoveMate Fleet details: 14ft container, hydraulic lift, GPS tracking.')}
              >
                View all vehicles
              </button>
            </div>
          </div>

          {/* Card 5: Workers Assigned */}
          <div className="brief-card">
            <h3 className="brief-card-title">Workers assigned</h3>
            <div className="workers-list-content">
              {workers.map((worker) => (
                <div key={worker.id} className="worker-row-item">
                  <div className="worker-left">
                    <div className="worker-avatar-circle">{worker.avatar}</div>
                    <div className="worker-names">
                      <strong>{worker.name}</strong>
                      <span>{worker.role}</span>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    className="btn-remove-worker"
                    onClick={() => removeWorker(worker.id)}
                    title="Remove worker"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}

              <button 
                type="button" 
                className="btn-add-worker-outline"
                onClick={addWorker}
              >
                <Plus size={14} /> Add worker
              </button>
            </div>
          </div>

          {/* Card 6: Job Checklist (Editable) */}
          <div className="brief-card">
            <div className="checklist-card-header-flex">
              <h3 className="brief-card-title">Job checklist (editable)</h3>
              <button 
                type="button" 
                className="btn-edit-checklist"
                onClick={() => {
                  const newTask = prompt('Add new checklist item:');
                  if (newTask) {
                    setChecklist(prev => [...prev, { id: Date.now(), label: newTask, checked: false }]);
                  }
                }}
              >
                <Edit3 size={13} /> Edit
              </button>
            </div>

            <div className="brief-checklist-items">
              {checklist.map((item) => (
                <label key={item.id} className="brief-check-row">
                  <input 
                    type="checkbox" 
                    checked={item.checked} 
                    onChange={() => toggleChecklistItem(item.id)}
                  />
                  <span className="brief-custom-chk">
                    {item.checked && <Check size={12} className="text-white" />}
                  </span>
                  <span className={`brief-check-text ${item.checked ? 'completed' : ''}`}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Bottom Action Row: Proceed to Execution */}
      <div className="job-brief-bottom-actions">
        <button 
          type="button" 
          className="btn-report-issue-link"
          onClick={onNavigateIssue}
        >
          <AlertCircle size={16} /> Report issue or request extra material
        </button>

        <button 
          type="button" 
          className="btn-goto-execution"
          onClick={onNavigateExecution}
        >
          <span>Go to Execution Checklist</span>
          <ArrowRight size={16} />
        </button>
      </div>

    </div>
  );
}
