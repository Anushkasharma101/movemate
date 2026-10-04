import React, { useState } from 'react';
import { 
  Plus, AlertCircle, Check, X, Search, Bell, Filter, 
  ChevronDown, Send, User, Calendar, Truck, Users 
} from 'lucide-react';

export default function AdminRequestsAssignments({ 
  onNavigateCoordinator 
}) {
  const [activeTab, setActiveTab] = useState('new'); // 'new' | 'assigned' | 'quoted' | 'confirmed' | 'completed'
  const [selectedId, setSelectedId] = useState('MM-1048');

  // Requests Table Data
  const [requests, setRequests] = useState([
    { id: 'MM-1048', date: '4 Oct 2026', customer: 'Anjali Verma', phone: '+91 91234 56789', moveType: '1 BHK', moveDate: '8 Oct 2026', notes: 'Need packing service. Prefer morning slot.', status: 'New' },
    { id: 'MM-1047', date: '4 Oct 2026', customer: 'Rohan Desai', phone: '+91 98220 12345', moveType: '2 BHK', moveDate: '10 Oct 2026', notes: 'Fragile antique items included.', status: 'Quotation' },
    { id: 'MM-1046', date: '3 Oct 2026', customer: 'Sandeep Jadhav', phone: '+91 97654 89012', moveType: '1 BHK', moveDate: '7 Oct 2026', notes: 'Has pet cat, please handle with care.', status: 'New' },
    { id: 'MM-1045', date: '3 Oct 2026', customer: 'Priya Nair', phone: '+91 99887 65432', moveType: '3 BHK', moveDate: '5 Oct 2026', notes: 'Full villa relocation.', status: 'Assigned' }
  ]);

  // Assignment Form State for selected request
  const [coordinator, setCoordinator] = useState('Rohit Sharma');
  const [vehicle, setVehicle] = useState('14 ft Closed Truck (1 BHK)');
  const [assignedWorkers, setAssignedWorkers] = useState(['Amit Singh', 'Suresh Patil']);
  const [manualQuote, setManualQuote] = useState('4,500');
  const [showConflict, setShowConflict] = useState(true);

  const selectedRequest = requests.find(r => r.id === selectedId) || requests[0];

  const removeWorkerTag = (workerName) => {
    setAssignedWorkers(prev => prev.filter(w => w !== workerName));
    if (workerName === 'Amit Singh') {
      setShowConflict(false);
    }
  };

  const handleSendQuote = () => {
    alert(`Quote of ₹${manualQuote} sent to customer ${selectedRequest.customer} for Move ${selectedRequest.id}! Coordinator ${coordinator} assigned.`);
    setRequests(prev => prev.map(r => 
      r.id === selectedId ? { ...r, status: 'Quoted' } : r
    ));
  };

  return (
    <div className="admin-requests-container animate-fade-in">
      
      {/* Header Row: Title & New Request Button */}
      <div className="admin-header-row">
        <h1 className="admin-page-title">Moving requests</h1>
        <button 
          type="button" 
          className="btn-new-request-teal"
          onClick={() => alert('New request modal: Enter customer details & inventory')}
        >
          <Plus size={16} /> New request
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="admin-req-tabs">
        <button 
          type="button" 
          className={`admin-tab-btn ${activeTab === 'new' ? 'active' : ''}`}
          onClick={() => setActiveTab('new')}
        >
          New requests
        </button>
        <button 
          type="button" 
          className={`admin-tab-btn ${activeTab === 'assigned' ? 'active' : ''}`}
          onClick={() => setActiveTab('assigned')}
        >
          Assigned
        </button>
        <button 
          type="button" 
          className={`admin-tab-btn ${activeTab === 'quoted' ? 'active' : ''}`}
          onClick={() => setActiveTab('quoted')}
        >
          Quoted
        </button>
        <button 
          type="button" 
          className={`admin-tab-btn ${activeTab === 'confirmed' ? 'active' : ''}`}
          onClick={() => setActiveTab('confirmed')}
        >
          Confirmed
        </button>
        <button 
          type="button" 
          className={`admin-tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed
        </button>
      </div>

      {/* Table of Requests */}
      <div className="admin-table-card">
        <div className="admin-table-wrapper">
          <table className="admin-requests-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Move type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr 
                  key={req.id} 
                  className={`admin-req-row ${selectedId === req.id ? 'selected-row' : ''}`}
                  onClick={() => setSelectedId(req.id)}
                >
                  <td className="font-bold text-primary">{req.id}</td>
                  <td>{req.date}</td>
                  <td className="font-semibold">{req.customer}</td>
                  <td>{req.moveType}</td>
                  <td>
                    {req.status === 'New' && <span className="badge-req-new">New</span>}
                    {req.status === 'Quotation' && <span className="badge-req-quote">Quotation</span>}
                    {req.status === 'Assigned' && <span className="badge-req-assigned">Assigned</span>}
                    {req.status === 'Quoted' && <span className="badge-req-quoted">Quoted</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Split Details Card: Request Details – MM-1048 */}
      <div className="admin-split-details-card">
        
        {/* Left Side: Customer & Move details */}
        <div className="admin-details-left">
          <div className="details-header-tag">
            <h2 className="admin-card-title">Request details – {selectedRequest.id}</h2>
            <span className="badge-req-new">Status: {selectedRequest.status}</span>
          </div>

          <div className="admin-req-fields">
            <div className="field-group">
              <span className="field-label">Customer</span>
              <strong className="field-val-bold">{selectedRequest.customer}</strong>
              <span className="field-sub">{selectedRequest.phone}</span>
            </div>

            <div className="two-col-fields">
              <div className="field-group">
                <span className="field-label">Move type</span>
                <span className="field-val">{selectedRequest.moveType}</span>
              </div>
              <div className="field-group">
                <span className="field-label">Move date</span>
                <span className="field-val">{selectedRequest.moveDate}</span>
              </div>
            </div>

            <div className="field-group">
              <span className="field-label">Additional notes</span>
              <p className="field-notes">{selectedRequest.notes}</p>
            </div>
          </div>
        </div>

        {/* Right Side: Assignment & Manual Quote */}
        <div className="admin-details-right">
          <h2 className="admin-card-title">Assignment</h2>

          <div className="assignment-form">
            <div className="assign-form-group">
              <label className="assign-label">Assign coordinator</label>
              <select 
                value={coordinator}
                onChange={(e) => setCoordinator(e.target.value)}
                className="assign-select"
              >
                <option value="Rohit Sharma">Rohit Sharma</option>
                <option value="Aarav Sharma">Aarav Sharma</option>
                <option value="Vikram Malhotra">Vikram Malhotra</option>
              </select>
            </div>

            <div className="assign-form-group">
              <label className="assign-label">Vehicle (capacity)</label>
              <select 
                value={vehicle}
                onChange={(e) => setVehicle(e.target.value)}
                className="assign-select"
              >
                <option value="14 ft Closed Truck (1 BHK)">14 ft Closed Truck (1 BHK)</option>
                <option value="17 ft Container Truck (2 BHK)">17 ft Container Truck (2 BHK)</option>
                <option value="19 ft Large Truck (3 BHK)">19 ft Large Truck (3 BHK)</option>
              </select>
            </div>

            <div className="assign-form-group">
              <label className="assign-label">Workers</label>
              <div className="worker-tags-box">
                {assignedWorkers.map((worker) => (
                  <span key={worker} className="worker-tag-pill">
                    {worker}
                    <button 
                      type="button" 
                      onClick={() => removeWorkerTag(worker)}
                      className="tag-remove-x"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Red Conflict Warning Banner */}
            {showConflict && (
              <div className="worker-conflict-alert">
                <div className="conflict-icon-circle">!</div>
                <div className="conflict-text">
                  <strong>Amit Singh is not available on {selectedRequest.moveDate}.</strong>
                  <p>Please choose another worker.</p>
                </div>
              </div>
            )}

            {/* Bottom Row: Manual Quote & Send */}
            <div className="quote-send-row">
              <div className="quote-input-col">
                <label className="assign-label">Manual quote (INR)</label>
                <input 
                  type="text" 
                  value={manualQuote}
                  onChange={(e) => setManualQuote(e.target.value)}
                  className="quote-manual-input"
                />
              </div>

              <button 
                type="button" 
                className="btn-send-quote-coral"
                onClick={handleSendQuote}
              >
                Send quote
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
