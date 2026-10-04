import React, { useState } from 'react';
import { 
  Clock, MapPin, Package, Truck, User, 
  ChevronDown, Check, Calendar, ArrowRight, 
  AlertCircle, ShieldCheck, CheckCircle2 
} from 'lucide-react';

export default function AdminAssignTeam({ 
  moveData, 
  onAssignmentConfirmed,
  onCancel
}) {
  const move = moveData || {
    id: 'MM-1042',
    customer: 'Priya Sharma',
    timeWindow: '4 Oct 2026 • 9:00 AM – 5:00 PM',
    route: 'Kothrud, Pune → Viman Nagar, Pune',
    inventory: '2 BHK • ~42 items'
  };

  const [selectedCoordinator, setSelectedCoordinator] = useState('Sneha Patil (Available)');
  const [coordinatorDropdownOpen, setCoordinatorDropdownOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState('Tata 407');
  const [selectedWorkers, setSelectedWorkers] = useState(['Ramesh Yadav', 'Imran Shaikh']);
  const [date, setDate] = useState('4 Oct 2026');
  const [startTime, setStartTime] = useState('9:00 AM');
  const [endTime, setEndTime] = useState('5:00 PM');

  const coordinators = [
    { name: 'Sneha Patil (Available)', status: 'available' },
    { name: 'Rahul Mehta (Available)', status: 'available' },
    { name: 'Vikram Singh (On assignment until 1 PM)', status: 'busy' }
  ];

  const vehicles = [
    {
      id: 'Tata 407',
      name: 'Tata 407',
      capacity: 'Usable capacity: 1200 kg',
      status: 'Available',
      isAvailable: true
    },
    {
      id: 'Mahindra Bolero',
      name: 'Mahindra Bolero',
      capacity: 'Usable capacity: 800 kg',
      status: 'Available',
      isAvailable: true
    },
    {
      id: 'Tata Ace',
      name: 'Tata Ace',
      capacity: 'Busy (till 4 PM)',
      status: 'Busy',
      isAvailable: false
    }
  ];

  const workers = [
    {
      id: 'Ramesh Yadav',
      name: 'Ramesh Yadav',
      skills: 'Loading, Unloading, Packing',
      isAvailable: true
    },
    {
      id: 'Imran Shaikh',
      name: 'Imran Shaikh',
      skills: 'Furniture handling, Packing',
      isAvailable: true
    },
    {
      id: 'Suresh Patil',
      name: 'Suresh Patil',
      skills: 'Packing',
      isAvailable: false,
      unavailableReason: 'Unavailable (Overlapping job)'
    },
    {
      id: 'Amit Kumar',
      name: 'Amit Kumar',
      skills: 'Loading, Driving support',
      isAvailable: true
    }
  ];

  const toggleWorker = (workerId, isAvailable) => {
    if (!isAvailable) return;
    if (selectedWorkers.includes(workerId)) {
      if (selectedWorkers.length > 2) {
        setSelectedWorkers(selectedWorkers.filter(w => w !== workerId));
      } else {
        alert('Please select at least 2 workers for this move.');
      }
    } else {
      setSelectedWorkers([...selectedWorkers, workerId]);
    }
  };

  const handleConfirm = () => {
    if (onAssignmentConfirmed) {
      onAssignmentConfirmed({
        moveId: move.id,
        coordinator: selectedCoordinator,
        vehicle: selectedVehicle,
        workers: selectedWorkers,
        time: `${date}, ${startTime} - ${endTime}`
      });
    }
  };

  return (
    <div className="admin-assign-container">
      {/* View Header */}
      <div className="admin-view-header">
        <div className="admin-view-title-group">
          <h1>Assign team to {move.id}</h1>
          <p>Select coordinator, vehicle and workers for this move.</p>
        </div>
      </div>

      {/* Move Summary Card */}
      <div className="admin-summary-card">
        <div className="admin-summary-card-top">
          <h3 className="admin-summary-card-heading">
            Move summary
          </h3>
          <button type="button" className="admin-btn-edit-sm">
            Edit
          </button>
        </div>

        <div className="admin-summary-details-grid">
          <div className="admin-summary-row">
            <User className="row-icon" />
            <strong>{move.id} • {move.customer}</strong>
          </div>
          <div className="admin-summary-row">
            <Clock className="row-icon" />
            <span>{move.timeWindow || '4 Oct 2026 • 9:00 AM – 5:00 PM'}</span>
          </div>
          <div className="admin-summary-row">
            <MapPin className="row-icon" />
            <span>{move.route || `${move.pickup || 'Kothrud, Pune'} → ${move.drop || 'Viman Nagar, Pune'}`}</span>
          </div>
          <div className="admin-summary-row">
            <Package className="row-icon" />
            <span>{move.inventory || '2 BHK • ~42 items'}</span>
          </div>
        </div>
      </div>

      {/* Coordinator Dropdown */}
      <div className="admin-form-group">
        <label className="admin-form-label">Coordinator</label>
        <div style={{ position: 'relative' }}>
          <div 
            className="admin-coordinator-select-box"
            onClick={() => setCoordinatorDropdownOpen(!coordinatorDropdownOpen)}
          >
            <div className="admin-coordinator-pill-info">
              <span className="admin-online-dot"></span>
              <span>{selectedCoordinator}</span>
            </div>
            <ChevronDown size={16} />
          </div>

          {coordinatorDropdownOpen && (
            <div className="admin-dropdown-menu" style={{ width: '100%', top: 'calc(100% + 4px)' }}>
              {coordinators.map((c, i) => (
                <button
                  key={i}
                  type="button"
                  className="admin-dropdown-item"
                  onClick={() => {
                    setSelectedCoordinator(c.name);
                    setCoordinatorDropdownOpen(false);
                  }}
                >
                  <span className="admin-online-dot" style={{ background: c.status === 'available' ? '#10b981' : '#f59e0b' }}></span>
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2 Resource Columns: Vehicles & Workers */}
      <div className="admin-resources-grid">
        
        {/* Vehicles Column */}
        <div>
          <div className="admin-resource-col-header">
            <div className="admin-resource-col-title">
              Vehicles <small>(select one)</small>
            </div>
            <button type="button" className="admin-resource-link">
              View all
            </button>
          </div>

          <div className="admin-options-stack">
            {vehicles.map((v) => {
              const isSelected = selectedVehicle === v.id;
              return (
                <div
                  key={v.id}
                  className={`admin-option-card ${isSelected ? 'selected' : ''} ${!v.isAvailable ? 'disabled' : ''}`}
                  onClick={() => {
                    if (v.isAvailable) setSelectedVehicle(v.id);
                  }}
                >
                  <div className="admin-option-radio-circle">
                    {isSelected && <div className="admin-option-radio-inner"></div>}
                  </div>
                  <Truck className="admin-option-truck-icon" />
                  <div className="admin-option-meta">
                    <div className="admin-option-name">{v.name}</div>
                    <div className="admin-option-desc">{v.capacity}</div>
                    <div className={`admin-option-status ${v.isAvailable ? 'available' : 'busy'}`}>
                      {v.status === 'Available' ? 'Available' : 'Busy (till 4 PM)'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Workers Column */}
        <div>
          <div className="admin-resource-col-header">
            <div className="admin-resource-col-title">
              Workers <small>(select at least 2)</small>
            </div>
            <button type="button" className="admin-resource-link">
              View all
            </button>
          </div>

          <div className="admin-options-stack">
            {workers.map((w) => {
              const isSelected = selectedWorkers.includes(w.id);
              return (
                <div
                  key={w.id}
                  className={`admin-option-card ${isSelected ? 'selected' : ''} ${!w.isAvailable ? 'disabled' : ''}`}
                  onClick={() => toggleWorker(w.id, w.isAvailable)}
                >
                  <div className="admin-option-checkbox">
                    {isSelected && <Check size={14} />}
                  </div>
                  <div className="admin-option-meta">
                    <div className="admin-option-name">{w.name}</div>
                    <div className="admin-option-desc">{w.skills}</div>
                    {!w.isAvailable && (
                      <span className="admin-option-badge-unavailable">
                        {w.unavailableReason}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Booking Time Window */}
      <div className="admin-form-group">
        <label className="admin-form-label">Booking time window</label>
        <div className="admin-time-window-row">
          <div className="admin-time-window-item">
            <Calendar size={16} />
            <span>{date}</span>
          </div>
          <div className="admin-time-window-item" style={{ marginLeft: '18px' }}>
            <span>{startTime}</span>
          </div>
          <div className="admin-time-arrow">→</div>
          <div className="admin-time-window-item">
            <span>{endTime}</span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button 
        type="button" 
        className="admin-btn-confirm-full"
        onClick={handleConfirm}
      >
        Confirm assignment
      </button>

    </div>
  );
}
