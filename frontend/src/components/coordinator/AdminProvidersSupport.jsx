import React, { useState } from 'react';
import { 
  Plus, MoreHorizontal, Phone, UploadCloud, X, Check, 
  AlertCircle, ShieldCheck, ChevronDown, Search, Truck, 
  Users, CheckCircle2, AlertTriangle, ExternalLink, Edit3, Trash2,
  ArrowRight, Upload
} from 'lucide-react';

export default function AdminProvidersSupport({ 
  onNavigateRequests 
}) {
  const [activeTab, setActiveTab] = useState('coordinators'); // 'coordinators' | 'vehicles' | 'workers' | 'support'
  const [showAddModal, setShowAddModal] = useState(false);
  const [issueResolved, setIssueResolved] = useState(false);
  const [resolutionNote, setResolutionNote] = useState(
    'Will arrange replacement through insurance. Customer informed.'
  );

  // Coordinators List with portrait avatars
  const [coordinators, setCoordinators] = useState([
    {
      id: 1,
      name: 'Rohit Sharma',
      contact: '+91 90000 11111',
      status: 'Active',
      availability: 'Available',
      avatar: '/images/aarav_avatar.jpg',
      initials: 'RS'
    },
    {
      id: 2,
      name: 'Neha Gupta',
      contact: '+91 90000 22222',
      status: 'Active',
      availability: 'On job',
      avatar: '/images/pooja_avatar.jpg',
      initials: 'NG'
    },
    {
      id: 3,
      name: 'Vikram Joshi',
      contact: '+91 90000 33333',
      status: 'Active',
      availability: 'Available',
      avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><radialGradient id="bgv" cx="50%" cy="40%" r="60%"><stop offset="0%" stop-color="%23dbeafe"/><stop offset="100%" stop-color="%2393c5fd"/></radialGradient><radialGradient id="skin" cx="50%" cy="45%" r="50%"><stop offset="0%" stop-color="%23fed7aa"/><stop offset="100%" stop-color="%23f97316"/></radialGradient></defs><rect width="100" height="100" rx="50" fill="url(%23bgv)"/><path d="M 28 40 Q 50 18 72 40 Q 75 25 50 20 Q 25 25 28 40 Z" fill="%2318181b"/><ellipse cx="50" cy="50" rx="22" ry="25" fill="%23fbb48a"/><path d="M 30 35 Q 50 26 70 35 Q 68 23 50 22 Q 32 23 30 35 Z" fill="%2318181b"/><circle cx="42" cy="48" r="3" fill="%231e293b"/><circle cx="58" cy="48" r="3" fill="%231e293b"/><path d="M 46 54 L 50 58 L 47 59" stroke="%23ea580c" stroke-width="1.5" fill="none"/><path d="M 43 65 Q 50 71 57 65" stroke="%239a3412" stroke-width="2.5" stroke-linecap="round" fill="none"/><path d="M 18 96 C 18 76 32 68 50 68 C 68 68 82 76 82 96 Z" fill="%231e3a8a"/></svg>',
      initials: 'VJ'
    },
    {
      id: 4,
      name: 'Sneha Kulkarni',
      contact: '+91 90000 44444',
      status: 'Inactive',
      availability: 'Unavailable',
      avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><radialGradient id="bgs" cx="50%" cy="40%" r="60%"><stop offset="0%" stop-color="%23fce7f3"/><stop offset="100%" stop-color="%23f472b6"/></radialGradient></defs><rect width="100" height="100" rx="50" fill="url(%23bgs)"/><path d="M 20 55 C 18 25 40 16 50 16 C 60 16 82 25 80 55 C 80 75 75 85 75 85 C 75 85 68 70 68 60 C 68 30 32 30 32 60 C 32 70 25 85 25 85 C 25 85 20 75 20 55 Z" fill="%23171717"/><ellipse cx="50" cy="50" rx="20" ry="24" fill="%23fbb48a"/><circle cx="43" cy="48" r="2.5" fill="%231e293b"/><circle cx="57" cy="48" r="2.5" fill="%231e293b"/><path d="M 47 54 L 50 57 L 48 58" stroke="%23ea580c" stroke-width="1.5" fill="none"/><path d="M 44 64 Q 50 69 56 64" stroke="%23e11d48" stroke-width="2.5" stroke-linecap="round" fill="none"/><circle cx="50" cy="43" r="1.5" fill="%23991b1b"/><path d="M 20 98 C 20 78 33 72 50 72 C 67 72 80 78 80 98 Z" fill="%23831843"/></svg>',
      initials: 'SK'
    }
  ]);

  // Vehicles List
  const [vehicles, setVehicles] = useState([
    { id: 'V-01', model: '14 ft Closed Container', plate: 'MH 12 AB 1234', capacity: '1 BHK (1200 kg)', status: 'Active', assignedJob: 'MM-1042' },
    { id: 'V-02', model: '17 ft Closed Truck', plate: 'MH 12 CD 5678', capacity: '2 BHK (2400 kg)', status: 'Active', assignedJob: 'MM-1043' },
    { id: 'V-03', model: '19 ft Heavy Container', plate: 'MH 14 EF 9012', capacity: '3 BHK / Villa (4500 kg)', status: 'Maintenance', assignedJob: 'None' }
  ]);

  // Workers List
  const [workers, setWorkers] = useState([
    { id: 'W-01', name: 'Amit Singh', role: 'Team Lead', moves: 142, rating: 4.9, status: 'Active', available: 'Available' },
    { id: 'W-02', name: 'Suresh Patil', role: 'Mover & Packer', moves: 98, rating: 4.8, status: 'Active', available: 'On job' },
    { id: 'W-03', name: 'Imran Shaikh', role: 'Mover & Packer', moves: 76, rating: 4.8, status: 'Active', available: 'Available' },
    { id: 'W-04', name: 'Deepak Rao', role: 'Specialist Packer', moves: 110, rating: 4.9, status: 'Active', available: 'On job' }
  ]);

  // Add Provider Form State
  const [newType, setNewType] = useState('coordinator');
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const handleAddProviderSubmit = (e) => {
    e.preventDefault();
    if (!newName || !newPhone) return;

    if (newType === 'coordinator') {
      setCoordinators(prev => [
        ...prev,
        {
          id: Date.now(),
          name: newName,
          contact: newPhone,
          status: 'Active',
          availability: 'Available',
          avatar: null,
          initials: newName.split(' ').map(n => n[0]).join('').toUpperCase()
        }
      ]);
    } else if (newType === 'worker') {
      setWorkers(prev => [
        ...prev,
        {
          id: 'W-' + (prev.length + 1),
          name: newName,
          role: 'Mover & Packer',
          moves: 0,
          rating: 5.0,
          status: 'Active',
          available: 'Available'
        }
      ]);
    }

    alert(`New ${newType} "${newName}" successfully registered in Pune fleet.`);
    setShowAddModal(false);
    setNewName('');
    setNewPhone('');
  };

  const handleResolveIssue = () => {
    setIssueResolved(true);
    alert('Ticket #ISS-021 marked as Resolved! ₹2,500 damage compensation approved via MoveMate Assurance.');
  };

  return (
    <div className="admin-providers-container animate-fade-in">
      
      {/* Top Navigation Tabs & Add Provider Button */}
      <div className="admin-top-nav-row">
        <div className="admin-provider-tabs">
          <button 
            type="button" 
            className={`prov-tab-btn ${activeTab === 'coordinators' ? 'active' : ''}`}
            onClick={() => setActiveTab('coordinators')}
          >
            Coordinators
          </button>
          <button 
            type="button" 
            className={`prov-tab-btn ${activeTab === 'vehicles' ? 'active' : ''}`}
            onClick={() => setActiveTab('vehicles')}
          >
            Vehicles
          </button>
          <button 
            type="button" 
            className={`prov-tab-btn ${activeTab === 'workers' ? 'active' : ''}`}
            onClick={() => setActiveTab('workers')}
          >
            Workers
          </button>
          <button 
            type="button" 
            className={`prov-tab-btn ${activeTab === 'support' ? 'active' : ''}`}
            onClick={() => setActiveTab('support')}
          >
            Support
          </button>
        </div>

        <button 
          type="button" 
          className="btn-add-provider-solid"
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={16} /> Add provider
        </button>
      </div>

      {/* ============================================================
          SECTION 1: COORDINATORS TABLE (Exact match to screenshot)
          ============================================================ */}
      {activeTab === 'coordinators' && (
        <div className="prov-section-card animate-fade-in">
          <h2 className="prov-section-title">Coordinators ({coordinators.length})</h2>

          <div className="prov-table-wrapper">
            <table className="prov-table">
              <thead>
                <tr>
                  <th className="th-name">Name</th>
                  <th className="th-contact">Contact</th>
                  <th className="th-status">Status</th>
                  <th className="th-avail">Availability</th>
                  <th className="th-actions text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coordinators.map((coord) => (
                  <tr key={coord.id} className="prov-row">
                    <td className="td-name">
                      <div className="coord-user-cell">
                        {coord.avatar ? (
                          <img src={coord.avatar} alt={coord.name} className="coord-table-avatar" />
                        ) : (
                          <div className="coord-table-initials">{coord.initials}</div>
                        )}
                        <span className="coord-name-text">{coord.name}</span>
                      </div>
                    </td>

                    <td className="td-contact font-medium text-slate">
                      {coord.contact}
                    </td>

                    <td className="td-status">
                      {coord.status === 'Active' ? (
                        <span className="badge-pill-active">Active</span>
                      ) : (
                        <span className="badge-pill-inactive">Inactive</span>
                      )}
                    </td>

                    <td className="td-avail">
                      {coord.availability === 'Available' && (
                        <span className="badge-pill-available">Available</span>
                      )}
                      {coord.availability === 'On job' && (
                        <span className="badge-pill-onjob">On job</span>
                      )}
                      {coord.availability === 'Unavailable' && (
                        <span className="badge-pill-unavailable">Unavailable</span>
                      )}
                    </td>

                    <td className="td-actions text-right">
                      <button 
                        type="button" 
                        className="btn-action-dots"
                        onClick={() => alert(`Coordinator Options for ${coord.name}: View jobs, edit contact, reassign routes.`)}
                        title="Options"
                      >
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================
          VEHICLES TAB
          ============================================================ */}
      {activeTab === 'vehicles' && (
        <div className="prov-section-card animate-fade-in">
          <h2 className="prov-section-title">Fleet & Vehicles ({vehicles.length})</h2>
          <div className="prov-table-wrapper">
            <table className="prov-table">
              <thead>
                <tr>
                  <th>Vehicle Model</th>
                  <th>License Plate</th>
                  <th>Capacity</th>
                  <th>Status</th>
                  <th>Current Job</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((v) => (
                  <tr key={v.id}>
                    <td className="font-bold">{v.model}</td>
                    <td>{v.plate}</td>
                    <td>{v.capacity}</td>
                    <td>
                      <span className={v.status === 'Active' ? 'badge-pill-active' : 'badge-pill-inactive'}>
                        {v.status}
                      </span>
                    </td>
                    <td className="font-semibold text-primary">{v.assignedJob}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================
          WORKERS TAB
          ============================================================ */}
      {activeTab === 'workers' && (
        <div className="prov-section-card animate-fade-in">
          <h2 className="prov-section-title">Field Moving Workers ({workers.length})</h2>
          <div className="prov-table-wrapper">
            <table className="prov-table">
              <thead>
                <tr>
                  <th>Worker Name</th>
                  <th>Role</th>
                  <th>Moves Completed</th>
                  <th>Rating</th>
                  <th>Availability</th>
                </tr>
              </thead>
              <tbody>
                {workers.map((w) => (
                  <tr key={w.id}>
                    <td className="font-bold">{w.name}</td>
                    <td>{w.role}</td>
                    <td>{w.moves} moves</td>
                    <td>⭐ {w.rating}</td>
                    <td>
                      <span className={w.available === 'Available' ? 'badge-pill-available' : 'badge-pill-onjob'}>
                        {w.available}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================
          SECTION 2: SUPPORT – CUSTOMER ISSUE TICKETS (Exact match)
          ============================================================ */}
      <div className="support-tickets-section">
        <div className="support-section-header">
          <h2 className="prov-section-title">Support – Customer issue tickets</h2>
          <button 
            type="button" 
            className="btn-view-all-issues"
            onClick={() => alert('Viewing all 3 historical resolution tickets.')}
          >
            View all issues →
          </button>
        </div>

        {/* Support Ticket Card #ISS-021 */}
        <div className="customer-ticket-card">
          
          {/* Top Pill Badges Row */}
          <div className="ticket-badges-header">
            <div className="badges-left-group">
              <span className="ticket-id-pill">#ISS-021</span>
              <span className="ticket-type-pill">Missing / damaged item</span>
              <span className={`ticket-status-pill ${issueResolved ? 'resolved' : 'open'}`}>
                {issueResolved ? 'Resolved' : 'Open'}
              </span>
            </div>
            <span className="ticket-move-id-pill">MM-1042</span>
          </div>

          {/* 3-Column Split Content */}
          <div className="ticket-content-split">
            
            {/* Column 1: Customer & Description */}
            <div className="ticket-col-customer">
              <div className="ticket-field-block">
                <span className="ticket-sublabel">Customer</span>
                <strong className="ticket-cust-name">Pooja</strong>
                <span className="ticket-cust-phone">+91 98765 43210</span>
              </div>

              <div className="ticket-field-block mt-3">
                <span className="ticket-sublabel">Description</span>
                <p className="ticket-desc-text">
                  Monitor screen damaged during move.
                </p>
              </div>
            </div>

            {/* Column 2: Evidence Photos */}
            <div className="ticket-col-evidence">
              <span className="ticket-sublabel">Evidence photos</span>
              <div className="ticket-photos-row">
                <div className="ticket-photo-thumb" title="Damaged LCD Monitor">
                  {/* Photo 1: Monitor thumbnail with crack */}
                  <svg viewBox="0 0 100 100" className="evidence-svg-art">
                    <rect width="100" height="100" fill="#2d3748" />
                    {/* Monitor frame */}
                    <rect x="16" y="14" width="68" height="48" rx="3" fill="#111827" stroke="#374151" strokeWidth="1.5" />
                    {/* Screen */}
                    <rect x="20" y="18" width="60" height="40" rx="1" fill="#1f2937" />
                    {/* Screen glare gradient */}
                    <path d="M 20 18 L 45 18 L 20 45 Z" fill="#374151" opacity="0.4" />
                    {/* Screen Crack */}
                    <path d="M 52 20 L 48 30 L 54 36 L 46 44 L 50 52 L 47 58" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.9" />
                    <path d="M 48 30 L 42 27" stroke="#e2e8f0" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.7" />
                    <path d="M 54 36 L 62 39" stroke="#e2e8f0" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.7" />
                    <path d="M 46 44 L 38 46" stroke="#e2e8f0" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.7" />
                    {/* Stand neck and base */}
                    <rect x="46" y="62" width="8" height="14" fill="#374151" />
                    <ellipse cx="50" cy="78" rx="18" ry="4" fill="#1f2937" stroke="#4b5563" strokeWidth="1" />
                  </svg>
                </div>

                <div className="ticket-photo-thumb" title="Subwoofer / Speaker Packed">
                  {/* Photo 2: Speaker cube in room */}
                  <svg viewBox="0 0 100 100" className="evidence-svg-art">
                    <rect width="100" height="100" fill="#e2e8f0" />
                    {/* Floor & Wall */}
                    <polygon points="0,0 100,0 100,60 0,60" fill="#cbd5e1" />
                    <polygon points="0,60 100,60 100,100 0,100" fill="#e2e8f0" />
                    {/* Speaker Cube 3D */}
                    {/* Top Face */}
                    <polygon points="46,24 74,32 56,42 28,34" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1" />
                    {/* Left Face */}
                    <polygon points="28,34 56,42 56,80 28,70" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
                    {/* Right/Front Face */}
                    <polygon points="56,42 74,32 74,70 56,80" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1" />
                    {/* Speaker Grille Circle on Front */}
                    <ellipse cx="42" cy="56" rx="9" ry="12" fill="#334155" stroke="#1e293b" strokeWidth="1" />
                    <ellipse cx="42" cy="56" rx="4" ry="5" fill="#0f172a" />
                    {/* Small port */}
                    <ellipse cx="42" cy="42" rx="3" ry="4" fill="#64748b" />
                  </svg>
                </div>

                <button 
                  type="button" 
                  className="btn-add-ticket-photo-dashed"
                  onClick={() => alert('Photo upload dialog opened.')}
                >
                  <UploadCloud size={16} />
                  <span>Add photo</span>
                </button>
              </div>
            </div>

            {/* Column 3: Resolution Notes */}
            <div className="ticket-col-resolution">
              <span className="ticket-sublabel">Resolution notes</span>
              <div className="resolution-notes-box">
                <p>{resolutionNote}</p>
              </div>
            </div>

          </div>

          {/* Bottom Row: Customer contact & Resolve button */}
          <div className="ticket-footer-row">
            <div className="ticket-contact-wrap">
              <span className="ticket-sublabel">Customer contact</span>
              <a href="tel:+919876543210" className="ticket-call-link">
                <Phone size={14} className="text-primary" />
                <strong>+91 98765 43210</strong>
              </a>
            </div>

            {issueResolved ? (
              <div className="ticket-resolved-badge">
                <CheckCircle2 size={16} />
                <span>Issue resolved & insurance claim disbursed</span>
              </div>
            ) : (
              <button 
                type="button" 
                className="btn-resolve-issue-teal"
                onClick={handleResolveIssue}
              >
                Resolve issue
              </button>
            )}
          </div>

        </div>
      </div>

      {/* ============================================================
          ADD PROVIDER MODAL
          ============================================================ */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div 
            className="modal-container add-provider-modal animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Add New MoveMate Provider</h2>
              <button 
                type="button" 
                className="modal-close-btn"
                onClick={() => setShowAddModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddProviderSubmit} className="add-provider-form">
              <div className="form-group">
                <label className="form-sublabel">Provider Type</label>
                <select 
                  className="form-input" 
                  value={newType} 
                  onChange={(e) => setNewType(e.target.value)}
                >
                  <option value="coordinator">Move Coordinator</option>
                  <option value="worker">Moving Worker / Packer</option>
                  <option value="vehicle">Truck / Vehicle Partner</option>
                </select>
              </div>

              <div className="form-group mt-3">
                <label className="form-sublabel">Full Name / Model</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Ramesh Kulkarni"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group mt-3">
                <label className="form-sublabel">Contact Number / Registration Plate</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="+91 9XXXX XXXXX"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  required
                />
              </div>

              <div className="modal-actions-right mt-4">
                <button 
                  type="button" 
                  className="btn-cancel-modal"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-acc-primary"
                >
                  Save Provider
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
