import React, { useState } from 'react';
import { 
  Plus, X, Truck, Users, CheckCircle2, 
  AlertCircle, ChevronDown, Phone, ShieldCheck 
} from 'lucide-react';

export default function AdminVehiclesWorkers({ onShowToast }) {
  const [activeTab, setActiveTab] = useState('Vehicles');
  const [showAddProviderModal, setShowAddProviderModal] = useState(false);
  const [showAddWorkerModal, setShowAddWorkerModal] = useState(false);

  // Form states for vehicle provider
  const [providerName, setProviderName] = useState('Shree Transport Services');
  const [contactPerson, setContactPerson] = useState('Vikram Shetty');
  const [phoneNumber, setPhoneNumber] = useState('98XXXX1123');
  const [serviceType, setServiceType] = useState('Intra-city moving support');

  // Vehicles list
  const [vehicles, setVehicles] = useState([
    {
      plate: 'MH12 AB 1234',
      type: 'Tata 407',
      capacity: '1200 kg',
      driver: 'Ramesh Y.',
      area: 'Pune',
      availability: 'Available'
    },
    {
      plate: 'MH12 CD 5678',
      type: 'Mahindra Bolero',
      capacity: '800 kg',
      driver: 'Imran S.',
      area: 'Pune',
      availability: 'Available'
    },
    {
      plate: 'MH12 EF 9012',
      type: 'Tata Ace',
      capacity: '600 kg',
      driver: 'Suresh P.',
      area: 'Pune',
      availability: 'Busy'
    },
    {
      plate: 'MH12 GH 3456',
      type: 'Eicher 14ft',
      capacity: '2500 kg',
      driver: 'Manoj K.',
      area: 'Pune',
      availability: 'Available'
    }
  ]);

  // Workers list
  const [workers, setWorkers] = useState([
    {
      name: 'Ramesh Yadav',
      skills: 'Loading, Unloading',
      availability: 'Available',
      contact: '98XXXX6712'
    },
    {
      name: 'Imran Shaikh',
      skills: 'Packing, Furniture',
      availability: 'Available',
      contact: '98XXXX2281'
    },
    {
      name: 'Suresh Patil',
      skills: 'Packing',
      availability: 'Busy',
      contact: '98XXXX4456'
    },
    {
      name: 'Amit Kumar',
      skills: 'Loading',
      availability: 'Available',
      contact: '98XXXX9930'
    }
  ]);

  const handleAddProviderSubmit = (e) => {
    e.preventDefault();
    setShowAddProviderModal(false);
    if (onShowToast) {
      onShowToast(`Vehicle provider "${providerName}" added successfully!`);
    } else {
      alert(`Provider "${providerName}" added!`);
    }
  };

  return (
    <div className="admin-vehicles-workers-view">
      {/* Top Tabs */}
      <div className="admin-tab-filter-row" style={{ marginBottom: '28px' }}>
        <button
          type="button"
          className={`admin-filter-tab ${activeTab === 'Vehicles' ? 'active' : ''}`}
          onClick={() => setActiveTab('Vehicles')}
        >
          Vehicles
        </button>
        <button
          type="button"
          className={`admin-filter-tab ${activeTab === 'Workers' ? 'active' : ''}`}
          onClick={() => setActiveTab('Workers')}
        >
          Workers
        </button>
      </div>

      {/* SECTION 1: VEHICLES */}
      <div className="admin-section-block">
        <div className="admin-section-block-header">
          <div>
            <h2 className="admin-section-block-title">Vehicles</h2>
            <p className="admin-section-block-sub">Manage your vehicles and driver details.</p>
          </div>
          <button 
            type="button" 
            className="admin-btn-dark-green"
            onClick={() => setShowAddProviderModal(true)}
          >
            <Plus size={18} />
            <span>Add vehicle</span>
          </button>
        </div>

        <div className="admin-table-section" style={{ padding: '8px 16px' }}>
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Type</th>
                <th>Usable capacity</th>
                <th>Driver</th>
                <th>Area</th>
                <th>Availability</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v, i) => (
                <tr key={i}>
                  <td className="admin-move-id">{v.plate}</td>
                  <td><strong>{v.type}</strong></td>
                  <td>{v.capacity}</td>
                  <td>{v.driver}</td>
                  <td>{v.area}</td>
                  <td>
                    <span className={`admin-badge ${v.availability.toLowerCase()}`}>
                      {v.availability}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: WORKERS */}
      <div className="admin-section-block">
        <div className="admin-section-block-header">
          <div>
            <h2 className="admin-section-block-title">Workers</h2>
            <p className="admin-section-block-sub">Manage worker profiles, skills and availability.</p>
          </div>
          <button 
            type="button" 
            className="admin-btn-dark-green"
            onClick={() => {
              if (onShowToast) onShowToast('Add worker form opened.');
            }}
          >
            <Plus size={18} />
            <span>Add worker</span>
          </button>
        </div>

        <div className="admin-table-section" style={{ padding: '8px 16px' }}>
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Skills</th>
                <th>Availability</th>
                <th>Contact</th>
              </tr>
            </thead>
            <tbody>
              {workers.map((w, i) => (
                <tr key={i}>
                  <td className="admin-customer-name">{w.name}</td>
                  <td>{w.skills}</td>
                  <td>
                    <span className={`admin-badge ${w.availability.toLowerCase()}`}>
                      {w.availability}
                    </span>
                  </td>
                  <td style={{ color: '#4b635c', fontFamily: 'monospace' }}>{w.contact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* POPUP MODAL: ADD VEHICLE PROVIDER (Image 4 bottom-left) */}
      {showAddProviderModal && (
        <div className="admin-modal-overlay" onClick={() => setShowAddProviderModal(false)}>
          <div className="admin-provider-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">Add vehicle provider</h3>
              <button 
                type="button" 
                className="admin-modal-close-btn"
                onClick={() => setShowAddProviderModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddProviderSubmit} className="admin-modal-form">
              <div className="form-group">
                <label className="admin-form-label" style={{ fontSize: '0.84rem' }}>
                  Provider name
                </label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={providerName}
                  onChange={(e) => setProviderName(e.target.value)}
                  required 
                />
              </div>

              <div className="form-group">
                <label className="admin-form-label" style={{ fontSize: '0.84rem' }}>
                  Contact person
                </label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  required 
                />
              </div>

              <div className="form-group">
                <label className="admin-form-label" style={{ fontSize: '0.84rem' }}>
                  Phone number
                </label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required 
                />
              </div>

              <div className="form-group">
                <label className="admin-form-label" style={{ fontSize: '0.84rem' }}>
                  Service
                </label>
                <div style={{ position: 'relative' }}>
                  <select 
                    className="form-input" 
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    style={{ appearance: 'none', background: '#ffffff', cursor: 'pointer' }}
                  >
                    <option value="Intra-city moving support">Intra-city moving support</option>
                    <option value="Inter-city long haul">Inter-city long haul</option>
                    <option value="Commercial freight & container">Commercial freight & container</option>
                  </select>
                  <ChevronDown size={16} style={{ position: 'absolute', right: '14px', top: '14px', pointerEvents: 'none', color: '#637f77' }} />
                </div>
              </div>

              <div className="admin-modal-actions">
                <button 
                  type="button" 
                  className="admin-btn-secondary"
                  onClick={() => setShowAddProviderModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="admin-btn-dark-green"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Add provider
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
