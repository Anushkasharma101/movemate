import React, { useState } from 'react';
import { 
  Eye, EyeOff, CheckCircle2, XCircle, 
  AlertCircle, ShieldCheck, FileCheck, Plus 
} from 'lucide-react';

export default function AdminCoordinators({ onShowToast }) {
  const [activeTab, setActiveTab] = useState('Pending');
  const [selectedApplicantId, setSelectedApplicantId] = useState('RA');
  const [showMaskedId, setShowMaskedId] = useState(false);
  const [referenceStatus, setReferenceStatus] = useState('Not started');

  const [applicants, setApplicants] = useState([
    {
      id: 'RA',
      name: 'Rahul A.',
      city: 'Pune, Maharashtra',
      appliedDate: '2 Oct 2026',
      appliedFullDate: 'Applied 2 October 2026',
      status: 'Pending',
      experience: [
        '3 years as moving coordinator',
        'Handled ~120+ moves'
      ],
      languages: 'English, Hindi, Marathi',
      idType: 'Aadhaar Card',
      idNumberMasked: 'XXXX XXXX 1234',
      idNumberReal: '5428 9912 1234',
      docStatus: 'Not yet checked',
      consentText: 'I consent to background verification and document check.',
      consentDate: 'Given on 2 October 2026, 10:24 AM'
    },
    {
      id: 'SP',
      name: 'Sneha P.',
      city: 'Pune, Maharashtra',
      appliedDate: '1 Oct 2026',
      appliedFullDate: 'Applied 1 October 2026',
      status: 'Pending',
      experience: [
        '4 years in logistics and dispatch',
        'Managed 200+ intercity shifts'
      ],
      languages: 'English, Marathi, Hindi',
      idType: 'Driving License / PAN',
      idNumberMasked: 'XXXX XXXX 8832',
      idNumberReal: 'MH12 20190048832',
      docStatus: 'Not yet checked',
      consentText: 'I consent to background verification and document check.',
      consentDate: 'Given on 1 October 2026, 03:15 PM'
    },
    {
      id: 'VK',
      name: 'Vikram K.',
      city: 'Pimpri-Chinchwad, Pune',
      appliedDate: '1 Oct 2026',
      appliedFullDate: 'Applied 1 October 2026',
      status: 'Pending',
      experience: [
        '2.5 years packing supervisor',
        'Specialist in fragile item packaging'
      ],
      languages: 'Hindi, Marathi',
      idType: 'Aadhaar Card',
      idNumberMasked: 'XXXX XXXX 4190',
      idNumberReal: '7104 2209 4190',
      docStatus: 'Not yet checked',
      consentText: 'I consent to background verification and document check.',
      consentDate: 'Given on 1 October 2026, 11:40 AM'
    },
    {
      id: 'MJ',
      name: 'Mahesh J.',
      city: 'Pune, Maharashtra',
      appliedDate: '30 Sep 2026',
      appliedFullDate: 'Applied 30 September 2026',
      status: 'Pending',
      experience: [
        '5 years fleet manager & moving coordinator',
        'Handled 350+ commercial relocations'
      ],
      languages: 'English, Hindi, Gujarati, Marathi',
      idType: 'Aadhaar Card',
      idNumberMasked: 'XXXX XXXX 9012',
      idNumberReal: '8820 1192 9012',
      docStatus: 'Not yet checked',
      consentText: 'I consent to background verification and document check.',
      consentDate: 'Given on 30 September 2026, 09:12 AM'
    },
    {
      id: 'AP',
      name: 'Aditi P.',
      city: 'Kothrud, Pune',
      appliedDate: '29 Sep 2026',
      appliedFullDate: 'Applied 29 September 2026',
      status: 'Pending',
      experience: [
        '2 years customer operations & logistics coordinator',
        'Expert in client communication and dispute resolution'
      ],
      languages: 'English, Hindi, Marathi',
      idType: 'PAN Card',
      idNumberMasked: 'XXXX XXXX 6723',
      idNumberReal: 'ABCDE 6723 F',
      docStatus: 'Not yet checked',
      consentText: 'I consent to background verification and document check.',
      consentDate: 'Given on 29 September 2026, 04:30 PM'
    },
    {
      id: 'SS',
      name: 'Sagar S.',
      city: 'Hadapsar, Pune',
      appliedDate: '28 Sep 2026',
      appliedFullDate: 'Applied 28 September 2026',
      status: 'Pending',
      experience: [
        '3 years heavy goods driver & moving lead',
        'Commercial driver license holder'
      ],
      languages: 'Marathi, Hindi',
      idType: 'Commercial DL',
      idNumberMasked: 'XXXX XXXX 3311',
      idNumberReal: 'MH14 20180013311',
      docStatus: 'Not yet checked',
      consentText: 'I consent to background verification and document check.',
      consentDate: 'Given on 28 September 2026, 01:20 PM'
    },
    {
      id: 'DG',
      name: 'Deepak G.',
      city: 'Viman Nagar, Pune',
      appliedDate: '28 Sep 2026',
      appliedFullDate: 'Applied 28 September 2026',
      status: 'Pending',
      experience: [
        '4 years residential move supervisor',
        'Inventory audit certified'
      ],
      languages: 'English, Hindi',
      idType: 'Aadhaar Card',
      idNumberMasked: 'XXXX XXXX 5567',
      idNumberReal: '3310 9942 5567',
      docStatus: 'Not yet checked',
      consentText: 'I consent to background verification and document check.',
      consentDate: 'Given on 28 September 2026, 11:05 AM'
    },
    {
      id: 'PK',
      name: 'Pooja K.',
      city: 'Aundh, Pune',
      appliedDate: '27 Sep 2026',
      appliedFullDate: 'Applied 27 September 2026',
      status: 'Pending',
      experience: [
        '1.5 years moving assistant',
        'Customer satisfaction rating 4.9/5'
      ],
      languages: 'English, Hindi, Marathi',
      idType: 'Aadhaar Card',
      idNumberMasked: 'XXXX XXXX 2289',
      idNumberReal: '9920 4410 2289',
      docStatus: 'Not yet checked',
      consentText: 'I consent to background verification and document check.',
      consentDate: 'Given on 27 September 2026, 02:45 PM'
    }
  ]);

  const selectedApplicant = applicants.find((a) => a.id === selectedApplicantId) || applicants[0];

  const handleApprove = () => {
    setApplicants((prev) => 
      prev.map((app) => app.id === selectedApplicant.id ? { ...app, status: 'Approved' } : app)
    );
    if (onShowToast) {
      onShowToast(`Approved ${selectedApplicant.name} as verified Coordinator!`);
    } else {
      alert(`Approved ${selectedApplicant.name} as MoveMate Coordinator!`);
    }
  };

  const handleReject = () => {
    setApplicants((prev) => 
      prev.map((app) => app.id === selectedApplicant.id ? { ...app, status: 'Rejected' } : app)
    );
    if (onShowToast) {
      onShowToast(`Rejected application for ${selectedApplicant.name}`);
    } else {
      alert(`Rejected application for ${selectedApplicant.name}`);
    }
  };

  const handleRequestChanges = () => {
    if (onShowToast) {
      onShowToast(`Notification sent to ${selectedApplicant.name} to upload clearer document copies.`);
    } else {
      alert(`Requested document updates from ${selectedApplicant.name}`);
    }
  };

  return (
    <div className="admin-coordinators-view">
      {/* View Header */}
      <div className="admin-view-header">
        <div className="admin-view-title-group">
          <h1>Coordinator applications</h1>
          <p>Review applications and verify documents before approval.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tab-filter-row">
        {[
          { id: 'Pending', count: applicants.filter(a => a.status === 'Pending').length || 12 },
          { id: 'Approved', count: applicants.filter(a => a.status === 'Approved').length || 18 },
          { id: 'Rejected', count: applicants.filter(a => a.status === 'Rejected').length || 4 }
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
        
        {/* Left Column: Applicant List Table */}
        <div className="admin-left-list-card">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Applied on</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {applicants.map((app) => {
                const isSelected = selectedApplicantId === app.id;
                return (
                  <tr
                    key={app.id}
                    className={`admin-clickable-row ${isSelected ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedApplicantId(app.id);
                      setShowMaskedId(false);
                    }}
                  >
                    <td>
                      <div className="admin-applicant-cell">
                        <div className="admin-applicant-avatar-sm">
                          {app.id}
                        </div>
                        <span className="admin-customer-name">{app.name}</span>
                      </div>
                    </td>
                    <td>{app.appliedDate}</td>
                    <td>
                      <span className={`admin-badge ${app.status.toLowerCase()}`}>
                        {app.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Right Column: Applicant Details Card */}
        {selectedApplicant && (
          <div className="admin-detail-card">
            
            {/* Header */}
            <div className="admin-detail-card-header">
              <div>
                <h3 className="admin-detail-card-title">{selectedApplicant.name}</h3>
                <span className="admin-detail-card-sub">{selectedApplicant.appliedFullDate}</span>
              </div>
              <span className={`admin-badge ${selectedApplicant.status.toLowerCase()}`}>
                {selectedApplicant.status}
              </span>
            </div>

            {/* Profile Avatar & Location */}
            <div className="admin-applicant-profile-box">
              <div className="admin-applicant-avatar-lg">
                {selectedApplicant.id}
              </div>
              <div className="admin-applicant-details-meta">
                <strong>{selectedApplicant.name}</strong>
                <span>{selectedApplicant.city}</span>
              </div>
            </div>

            {/* Work History */}
            <div className="admin-info-block">
              <h4 className="admin-info-block-title">Work history</h4>
              <ul className="admin-info-list-bullets">
                {selectedApplicant.experience.map((exp, idx) => (
                  <li key={idx}>{exp}</li>
                ))}
              </ul>
            </div>

            {/* Languages */}
            <div className="admin-info-block">
              <h4 className="admin-info-block-title">Languages</h4>
              <p style={{ fontSize: '0.86rem', color: '#39534c' }}>
                {selectedApplicant.languages}
              </p>
            </div>

            {/* Identity document (masked) */}
            <div className="admin-id-doc-box">
              <div className="admin-id-doc-header">
                <span className="admin-id-doc-label">
                  Government ID ({selectedApplicant.idType})
                </span>
                <span className="admin-badge-not-checked">
                  {selectedApplicant.docStatus}
                </span>
              </div>
              <div className="admin-id-doc-number-row">
                <span>
                  {showMaskedId ? selectedApplicant.idNumberReal : selectedApplicant.idNumberMasked}
                </span>
                <button 
                  type="button" 
                  className="admin-btn-eye"
                  onClick={() => setShowMaskedId(!showMaskedId)}
                  title={showMaskedId ? 'Mask ID' : 'Unmask ID'}
                >
                  {showMaskedId ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Reference check */}
            <div className="admin-ref-check-box">
              <div>
                <span className="admin-ref-check-label">Reference check</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="admin-badge" style={{ background: '#f1f5f3', color: '#55726a' }}>
                  {referenceStatus}
                </span>
                <button 
                  type="button" 
                  className="admin-btn-add-states"
                  onClick={() => {
                    const next = referenceStatus === 'Not started' ? 'In progress' : 'Verified';
                    setReferenceStatus(next);
                  }}
                >
                  Add states
                </button>
              </div>
            </div>

            {/* Applicant's consent */}
            <div className="admin-consent-box">
              <h4 className="admin-consent-title">Applicant's consent</h4>
              <p className="admin-consent-text">
                "{selectedApplicant.consentText}"
              </p>
              <span className="admin-consent-time">
                {selectedApplicant.consentDate}
              </span>
            </div>

            {/* Bottom Actions */}
            <div className="admin-card-actions">
              <button 
                type="button" 
                className="admin-btn-secondary"
                onClick={handleRequestChanges}
              >
                Request changes
              </button>

              <button 
                type="button" 
                className="admin-btn-reject"
                onClick={handleReject}
              >
                Reject
              </button>

              <button 
                type="button" 
                className="admin-btn-approve"
                onClick={handleApprove}
              >
                Approve
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
