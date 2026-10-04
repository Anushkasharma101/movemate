import React, { useState } from 'react';
import { 
  ArrowLeft, Info, Phone, UploadCloud, Plus, X, 
  CheckCircle2, AlertTriangle, ShieldCheck 
} from 'lucide-react';

export default function ReportIssueApproval({ 
  onBack, 
  onSubmitSuccess 
}) {
  const [issueCategory, setIssueCategory] = useState('Additional materials needed');
  const [reason, setReason] = useState('Need 5 extra cardboard boxes and bubble wrap for additional kitchen items.');
  const [requestedAmount, setRequestedAmount] = useState('300');
  const [evidencePhotos, setEvidencePhotos] = useState([
    { id: 1, src: '/images/packing_boxes.jpg' },
    { id: 2, src: '/images/packing_furniture.jpg' },
    { id: 3, src: '/images/bubble_wrap.jpg' }
  ]);
  const [approvalStatus, setApprovalStatus] = useState('pending'); // 'draft' | 'pending' | 'approved'

  const baseAmount = 4500;
  const numAmount = parseInt(requestedAmount, 10) || 0;
  const revisedTotal = baseAmount + numAmount;

  const handleSendForApproval = (e) => {
    e.preventDefault();
    setApprovalStatus('pending');
    alert('Request for ₹' + requestedAmount + ' has been submitted to Admin (Priya) and Customer (Pooja) for review.');
    if (onSubmitSuccess) {
      onSubmitSuccess({
        category: issueCategory,
        reason,
        amount: numAmount,
        revisedTotal
      });
    }
  };

  const handleAddPhoto = () => {
    setEvidencePhotos(prev => [
      ...prev,
      { id: Date.now(), src: '/images/bubble_wrap.jpg' }
    ]);
  };

  const removePhoto = (id) => {
    setEvidencePhotos(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="coord-report-issue-container animate-fade-in">
      
      {/* Breadcrumb navigation */}
      <div className="coord-breadcrumbs-row">
        <button type="button" className="btn-back-breadcrumb" onClick={onBack}>
          <ArrowLeft size={16} /> MM-1042
        </button>
        <span className="breadcrumb-sep">&gt;</span>
        <span className="breadcrumb-current">Report issue</span>
      </div>

      {/* Screen Title & Badges */}
      <div className="report-issue-header">
        <div>
          <h1 className="report-issue-title">Report issue & request approval – MM-1042</h1>
          <p className="report-issue-meta">Pooja | 1 BHK Move | 4 October 2026</p>
        </div>

        <span className="badge-pending-approval-coord">Pending approval</span>
      </div>

      {/* Two Column Grid */}
      <div className="report-issue-grid">
        
        {/* Left Card: Issue details form */}
        <div className="issue-details-card">
          <h2 className="issue-section-title">Issue details</h2>

          <form onSubmit={handleSendForApproval} className="issue-form">
            <div className="issue-form-group">
              <label className="issue-label">Issue category</label>
              <select 
                value={issueCategory} 
                onChange={(e) => setIssueCategory(e.target.value)}
                className="issue-select"
              >
                <option value="Additional materials needed">Additional materials needed</option>
                <option value="Heavy / oversized item discovered">Heavy / oversized item discovered</option>
                <option value="Access elevator restricted">Access elevator restricted</option>
                <option value="Vehicle capacity extension">Vehicle capacity extension</option>
                <option value="Customer delay / waiting charges">Customer delay / waiting charges</option>
              </select>
            </div>

            <div className="issue-form-group">
              <label className="issue-label">Reason for additional materials</label>
              <textarea 
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="issue-textarea"
                required
              />
            </div>

            <div className="issue-form-group">
              <label className="issue-label">Requested amount (INR)</label>
              <input 
                type="number"
                value={requestedAmount}
                onChange={(e) => setRequestedAmount(e.target.value)}
                className="issue-input"
                required
              />
            </div>

            <div className="issue-form-group">
              <label className="issue-label">Upload evidence (photos)</label>
              <div className="evidence-upload-row">
                {evidencePhotos.map((photo) => (
                  <div key={photo.id} className="issue-evidence-thumb">
                    <img src={photo.src} alt="Evidence" />
                    <button 
                      type="button" 
                      className="btn-remove-thumb"
                      onClick={() => removePhoto(photo.id)}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}

                <button 
                  type="button" 
                  className="btn-add-photos-dashed"
                  onClick={handleAddPhoto}
                >
                  <UploadCloud size={18} />
                  <span>Add photos</span>
                </button>
              </div>
            </div>

            <div className="issue-form-group">
              <label className="issue-label">Proposed revised total (INR)</label>
              <input 
                type="text" 
                value={revisedTotal.toLocaleString()} 
                readOnly
                className="issue-input-readonly"
              />
              <span className="issue-hint-text">Current total + additional amount (to be approved)</span>
            </div>

            <div className="issue-actions-row">
              <button type="submit" className="btn-send-approval-coral">
                Send for approval
              </button>
              <button 
                type="button" 
                className="btn-cancel-white"
                onClick={onBack}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Approval Pending & Emergency Contact */}
        <div className="issue-right-col">
          
          {/* Card 1: Approval Pending */}
          <div className="issue-card approval-pending-card">
            <div className="approval-card-header">
              <div className="amber-info-circle">
                <Info size={18} />
              </div>
              <h3 className="approval-title">Approval pending</h3>
            </div>

            <p className="approval-desc">
              You will be notified once the admin approves this request. Please do not proceed with extra spending until approved.
            </p>

            <button 
              type="button" 
              className="btn-proceed-spending disabled"
              disabled
            >
              Proceed with extra spending
            </button>
            <span className="proceed-sub-hint">This will be enabled after approval.</span>
          </div>

          {/* Card 2: Emergency Contact */}
          <div className="issue-card emergency-contact-card">
            <div className="emergency-card-header">
              <div className="blue-phone-circle">
                <Phone size={18} />
              </div>
              <div>
                <h3 className="emergency-title">Emergency contact</h3>
                <p className="emergency-sub">Need urgent help? Contact admin for support.</p>
              </div>
            </div>

            <a href="tel:+919000011111" className="btn-call-admin-box">
              <Phone size={18} className="text-primary" />
              <div>
                <span className="call-admin-label">Call admin</span>
                <strong className="call-admin-number">+91 90000 11111</strong>
              </div>
            </a>
          </div>

        </div>

      </div>

    </div>
  );
}
