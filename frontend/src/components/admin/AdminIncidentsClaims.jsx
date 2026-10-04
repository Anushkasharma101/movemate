import React, { useState } from 'react';
import { 
  AlertTriangle, CheckCircle2, XCircle, Clock, 
  ArrowRight, Plus, ExternalLink, ShieldCheck 
} from 'lucide-react';

export default function AdminIncidentsClaims({ onShowToast }) {
  const [activeTab, setActiveTab] = useState('All');
  const [selectedIncidentId, setSelectedIncidentId] = useState('INC-102');
  const [evidenceTab, setEvidenceTab] = useState('Pickup images');

  const [incidents, setIncidents] = useState([
    {
      id: 'INC-102',
      type: 'Damaged item',
      moveId: 'MM-1042',
      status: 'Under review',
      reportedDate: 'Reported 5 October 2026, 10:20 AM',
      item: 'Wooden dining chair',
      issue: 'Leg broken during transport',
      reportedBy: 'Customer',
      evidenceImages: ['/images/chair_icon.jpg', '/images/packing_furniture.jpg'],
      timeline: [
        { status: 'Picked up', time: '4 Oct 2026, 10:05 AM', completed: true },
        { status: 'In transit', time: '4 Oct 2026, 1:20 PM', completed: true },
        { status: 'Delivered', time: '4 Oct 2026, 4:45 PM', completed: false }
      ]
    },
    {
      id: 'INC-101',
      type: 'Missing item',
      moveId: 'MM-1038',
      status: 'Under review',
      reportedDate: 'Reported 4 October 2026, 6:15 PM',
      item: 'Kitchen blender carton',
      issue: 'Box missing from room 2 dropoff',
      reportedBy: 'Customer',
      evidenceImages: ['/images/packing_boxes.jpg'],
      timeline: [
        { status: 'Picked up', time: '4 Oct 2026, 9:00 AM', completed: true },
        { status: 'In transit', time: '4 Oct 2026, 11:30 AM', completed: true },
        { status: 'Delivered', time: '4 Oct 2026, 2:00 PM', completed: true }
      ]
    },
    {
      id: 'INC-100',
      type: 'Damaged item',
      moveId: 'MM-1035',
      status: 'Resolved',
      reportedDate: 'Reported 3 October 2026, 2:40 PM',
      item: 'Mirror frame',
      issue: 'Minor scratch on wooden corner',
      reportedBy: 'Coordinator',
      evidenceImages: ['/images/bubble_wrap.jpg'],
      timeline: [
        { status: 'Picked up', time: '3 Oct 2026, 10:00 AM', completed: true },
        { status: 'In transit', time: '3 Oct 2026, 1:00 PM', completed: true },
        { status: 'Delivered', time: '3 Oct 2026, 3:30 PM', completed: true }
      ]
    },
    {
      id: 'INC-099',
      type: 'Missing item',
      moveId: 'MM-1031',
      status: 'Closed',
      reportedDate: 'Reported 2 October 2026, 11:10 AM',
      item: 'Door mat & floor protectors',
      issue: 'Left in moving truck; returned same day',
      reportedBy: 'Customer',
      evidenceImages: ['/images/packing_sofa.jpg'],
      timeline: [
        { status: 'Picked up', time: '2 Oct 2026, 8:30 AM', completed: true },
        { status: 'In transit', time: '2 Oct 2026, 10:00 AM', completed: true },
        { status: 'Delivered', time: '2 Oct 2026, 12:00 PM', completed: true }
      ]
    },
    {
      id: 'INC-098',
      type: 'Damaged item',
      moveId: 'MM-1028',
      status: 'Resolved',
      reportedDate: 'Reported 1 October 2026, 4:25 PM',
      item: 'Ceramic lamp',
      issue: 'Insurance settlement processed INR 1,200',
      reportedBy: 'Customer',
      evidenceImages: ['/images/packing_boxes.jpg'],
      timeline: [
        { status: 'Picked up', time: '1 Oct 2026, 11:00 AM', completed: true },
        { status: 'In transit', time: '1 Oct 2026, 1:45 PM', completed: true },
        { status: 'Delivered', time: '1 Oct 2026, 4:00 PM', completed: true }
      ]
    }
  ]);

  const filteredIncidents = incidents.filter((inc) => {
    if (activeTab === 'Under review' && inc.status !== 'Under review') return false;
    if (activeTab === 'Resolved' && inc.status !== 'Resolved') return false;
    if (activeTab === 'Closed' && inc.status !== 'Closed') return false;
    return true;
  });

  const selectedIncident = incidents.find((i) => i.id === selectedIncidentId) || incidents[0];

  const handleResolve = () => {
    setIncidents((prev) => 
      prev.map((i) => i.id === selectedIncident.id ? { ...i, status: 'Resolved' } : i)
    );
    if (onShowToast) {
      onShowToast(`Incident ${selectedIncident.id} marked as resolved!`);
    } else {
      alert(`Incident ${selectedIncident.id} resolved.`);
    }
  };

  const handleSuspend = () => {
    if (onShowToast) {
      onShowToast(`Suspended team assignments for ${selectedIncident.moveId} pending investigation.`);
    } else {
      alert('Suspended new assignments.');
    }
  };

  return (
    <div className="admin-incidents-claims-view">
      {/* View Header */}
      <div className="admin-view-header">
        <div className="admin-view-title-group">
          <h1>Incidents and claims</h1>
          <p>Track and resolve issues raised during moves.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tab-filter-row">
        {[
          { id: 'All', count: incidents.length },
          { id: 'Under review', count: incidents.filter(i => i.status === 'Under review').length },
          { id: 'Resolved', count: incidents.filter(i => i.status === 'Resolved').length },
          { id: 'Closed', count: incidents.filter(i => i.status === 'Closed').length }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`admin-filter-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.id} ({tab.count})
          </button>
        ))}
      </div>

      {/* 2-Column Split Layout */}
      <div className="admin-split-layout">
        
        {/* Left Column: Incidents List */}
        <div className="admin-left-list-card">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Move ID</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredIncidents.map((inc) => {
                const isSelected = selectedIncidentId === inc.id;
                return (
                  <tr
                    key={inc.id}
                    className={`admin-clickable-row ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedIncidentId(inc.id)}
                  >
                    <td className="admin-move-id">{inc.id}</td>
                    <td>{inc.type}</td>
                    <td style={{ color: '#0d473b', fontWeight: '600' }}>{inc.moveId}</td>
                    <td>
                      <span className={`admin-badge ${inc.status === 'Under review' ? 'unassigned' : inc.status === 'Resolved' ? 'assigned' : 'completed'}`}>
                        {inc.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Right Column: Incident Detail Card */}
        {selectedIncident && (
          <div className="admin-detail-card">
            
            {/* Header */}
            <div className="admin-detail-card-header">
              <div>
                <h3 className="admin-detail-card-title">{selectedIncident.id}</h3>
                <span className="admin-detail-card-sub">
                  {selectedIncident.type} - {selectedIncident.moveId}
                </span>
                <div style={{ fontSize: '0.78rem', color: '#637f77', marginTop: '2px' }}>
                  {selectedIncident.reportedDate}
                </div>
              </div>
              <span className={`admin-badge ${selectedIncident.status === 'Under review' ? 'unassigned' : selectedIncident.status === 'Resolved' ? 'assigned' : 'completed'}`}>
                {selectedIncident.status}
              </span>
            </div>

            {/* Item details */}
            <div className="admin-id-doc-box" style={{ background: '#fbfdfc', marginBottom: '16px' }}>
              <h4 className="admin-instructions-title" style={{ marginBottom: '8px', fontSize: '0.86rem' }}>
                Item details
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', rowGap: '6px', fontSize: '0.84rem' }}>
                <span style={{ color: '#637f77' }}>Item:</span>
                <strong>{selectedIncident.item}</strong>
                <span style={{ color: '#637f77' }}>Issue:</span>
                <span style={{ color: '#1f3d35' }}>{selectedIncident.issue}</span>
                <span style={{ color: '#637f77' }}>Reported by:</span>
                <span>{selectedIncident.reportedBy}</span>
              </div>
            </div>

            {/* Evidence photos */}
            <div className="admin-evidence-row">
              <h4 className="admin-instructions-title" style={{ marginBottom: '8px', fontSize: '0.86rem' }}>
                Evidence
              </h4>
              <div className="admin-evidence-toggle">
                <button 
                  type="button" 
                  className={`admin-evidence-tab-btn ${evidenceTab === 'Pickup images' ? 'active' : ''}`}
                  onClick={() => setEvidenceTab('Pickup images')}
                >
                  Pickup images (2)
                </button>
                <button 
                  type="button" 
                  className={`admin-evidence-tab-btn ${evidenceTab === 'Delivery images' ? 'active' : ''}`}
                  onClick={() => setEvidenceTab('Delivery images')}
                >
                  Delivery images (2)
                </button>
              </div>

              <div className="admin-evidence-photos-grid">
                {selectedIncident.evidenceImages.map((src, i) => (
                  <img 
                    key={i} 
                    src={src} 
                    alt={`Evidence ${i+1}`} 
                    className="admin-evidence-thumb" 
                    onError={(e) => {
                      e.currentTarget.src = '/images/chair_icon.jpg';
                    }}
                  />
                ))}
                <div 
                  className="admin-add-photo-box"
                  onClick={() => {
                    if (onShowToast) onShowToast('Upload evidence document dialog opened.');
                  }}
                >
                  <Plus size={18} />
                  <span>Add</span>
                </div>
              </div>
            </div>

            {/* Custody Timeline */}
            <div className="admin-instructions-section" style={{ paddingTop: '12px', marginBottom: '14px' }}>
              <h4 className="admin-instructions-title" style={{ fontSize: '0.86rem', marginBottom: '10px' }}>
                Custody timeline
              </h4>
              <div className="admin-custody-timeline">
                {selectedIncident.timeline.map((step, idx) => (
                  <div key={idx} className="admin-timeline-step">
                    <div className={`admin-timeline-dot ${step.completed ? '' : 'outline'}`}></div>
                    <div className="admin-timeline-info">
                      <strong>{step.status}</strong>
                      <span>{step.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Appeal Row */}
            <div className="admin-appeal-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }}></span>
                <strong>Customer appeal</strong>
              </div>
              <button 
                type="button" 
                onClick={() => alert(`Reviewing customer appeal notes for ${selectedIncident.id}`)}
              >
                View appeal registration →
              </button>
            </div>

            {/* Bottom Actions */}
            <div className="admin-card-actions">
              <button 
                type="button" 
                className="admin-btn-reject"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                onClick={handleSuspend}
              >
                <AlertTriangle size={15} />
                <span>Suspend new assignments</span>
              </button>

              <button 
                type="button" 
                className="admin-btn-dark-green"
                onClick={handleResolve}
              >
                Mark as resolved
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
