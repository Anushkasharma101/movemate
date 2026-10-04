import React, { useState } from 'react';
import { 
  Bell, Check, X, ChevronDown, Paperclip, Upload, 
  MapPin, Shield, HelpCircle, Phone, MessageSquare, 
  AlertTriangle, CheckCircle2, Clock, Plus, Trash2, Edit3,
  LogOut
} from 'lucide-react';

export default function AccountSupportView({ 
  user = { name: 'Pooja', email: 'pooja@example.com', phone: '+91 98765 43210', city: 'Pune' },
  onUpdateUser,
  onCancelMove,
  onSignOut
}) {
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'addresses' | 'notifications' | 'support'
  
  // Profile Form State
  const [fullName, setFullName] = useState(user?.name || 'Pooja');
  const [email, setEmail] = useState(user?.email || 'pooja@example.com');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [profileSaved, setProfileSaved] = useState(false);

  // Notification Preferences State
  const [notifMoveUpdates, setNotifMoveUpdates] = useState(true);
  const [notifCoordinator, setNotifCoordinator] = useState(true);
  const [notifPromos, setNotifPromos] = useState(false);
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(true);
  const [quietStart, setQuietStart] = useState('11:00 AM');
  const [quietEnd, setQuietEnd] = useState('1:00 PM');

  // Support Ticket Form State
  const [ticketType, setTicketType] = useState('ID / Document issue');
  const [ticketDesc, setTicketDesc] = useState('My ID document is not updated in the request. Please help me fix this.');
  const [attachedFile, setAttachedFile] = useState('id-photo.jpg');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  // Cancellation Modal State
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('Plans changed');
  const [isMoveCancelled, setIsMoveCancelled] = useState(false);

  // Saved Addresses State
  const [addresses, setAddresses] = useState([
    { id: 1, type: 'Pickup Address', tag: 'Current Home', address: 'Flat 402, Green Meadows, Baner, Pune - 411045', isDefault: true },
    { id: 2, type: 'Delivery Address', tag: 'New Apartment', address: 'Tower B-1204, Rohan Heights, Kharadi, Pune - 411014', isDefault: false }
  ]);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setProfileSaved(true);
    if (onUpdateUser) {
      onUpdateUser({ name: fullName, email, phone, city: user?.city || 'Pune' });
    }
    setTimeout(() => setProfileSaved(false), 2500);
  };

  const handleSubmitTicket = (e) => {
    e.preventDefault();
    setTicketSubmitted(true);
    setTimeout(() => {
      alert(`Support ticket submitted successfully! Ticket ID: #TKT-7824\nOur operations team will review your ID document and update your move request.`);
      setTicketSubmitted(false);
    }, 500);
  };

  const handleConfirmCancellation = () => {
    setIsMoveCancelled(true);
    setShowCancelModal(false);
    if (onCancelMove) {
      onCancelMove(cancelReason);
    }
  };

  return (
    <div className="account-support-container animate-fade-in">
      {/* Top Header Row with User Avatar, Log out & Notification Bell */}
      <div className="acc-header-row">
        <div>
          <h1 className="acc-page-title">Account & support</h1>
        </div>

        <div className="acc-user-header-controls">
          <button 
            type="button" 
            className="acc-bell-btn"
            onClick={() => alert('You have 1 new update on Move MM-1042.')}
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="acc-bell-dot"></span>
          </button>

          <div className="acc-user-badge">
            <div className="acc-avatar-circle">
              {fullName?.charAt(0) || 'P'}
            </div>
            <div className="acc-user-text">
              <span className="acc-username">{fullName}</span>
              <span className="acc-usercity">{user?.city || 'Pune'}</span>
            </div>
          </div>

          {onSignOut && (
            <button 
              type="button" 
              className="btn-acc-logout"
              onClick={onSignOut}
              title="Log out of MoveMate"
            >
              <LogOut size={16} />
              <span>Log out</span>
            </button>
          )}
        </div>
      </div>

      {/* Account Navigation Tabs */}
      <div className="acc-nav-tabs">
        <button 
          type="button" 
          className={`acc-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button 
          type="button" 
          className={`acc-tab-btn ${activeTab === 'addresses' ? 'active' : ''}`}
          onClick={() => setActiveTab('addresses')}
        >
          Addresses
        </button>
        <button 
          type="button" 
          className={`acc-tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          Notifications
        </button>
        <button 
          type="button" 
          className={`acc-tab-btn ${activeTab === 'support' ? 'active' : ''}`}
          onClick={() => setActiveTab('support')}
        >
          Support
        </button>
      </div>

      {/* ============================================================
          TAB 1: PROFILE (Screen 3 - 2x2 Grid)
          ============================================================ */}
      {activeTab === 'profile' && (
        <div className="acc-grid-2x2 animate-fade-in">
          
          {/* Card 1 (Top Left): Profile Information */}
          <div className="acc-card profile-info-card">
            <h2 className="acc-card-title">Profile information</h2>
            <form onSubmit={handleSaveProfile} className="acc-form">
              <div className="acc-form-group">
                <label className="acc-label">Full name</label>
                <input 
                  type="text" 
                  className="acc-input" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div className="acc-form-group">
                <label className="acc-label">Email</label>
                <input 
                  type="email" 
                  className="acc-input" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  required
                />
              </div>

              <div className="acc-form-group">
                <label className="acc-label">Phone number</label>
                <input 
                  type="tel" 
                  className="acc-input" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  required
                />
              </div>

              <div className="profile-form-actions-row">
                <button type="submit" className="btn-acc-primary">
                  {profileSaved ? 'Changes Saved ✓' : 'Save changes'}
                </button>

                {onSignOut && (
                  <button 
                    type="button" 
                    className="btn-acc-logout-outline"
                    onClick={onSignOut}
                    title="Log out from this browser"
                  >
                    <LogOut size={15} /> Log out
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Card 2 (Top Right): Notification Preferences */}
          <div className="acc-card notif-pref-card">
            <h2 className="acc-card-title">Notification preferences</h2>
            
            <div className="notif-checkbox-list">
              <label className="acc-checkbox-label">
                <input 
                  type="checkbox" 
                  checked={notifMoveUpdates} 
                  onChange={(e) => setNotifMoveUpdates(e.target.checked)}
                />
                <span className="acc-custom-chk">
                  {notifMoveUpdates && <Check size={12} className="chk-icon" />}
                </span>
                <span className="acc-chk-text">Move updates</span>
              </label>

              <label className="acc-checkbox-label">
                <input 
                  type="checkbox" 
                  checked={notifCoordinator} 
                  onChange={(e) => setNotifCoordinator(e.target.checked)}
                />
                <span className="acc-custom-chk">
                  {notifCoordinator && <Check size={12} className="chk-icon" />}
                </span>
                <span className="acc-chk-text">Messages from coordinator</span>
              </label>

              <label className="acc-checkbox-label">
                <input 
                  type="checkbox" 
                  checked={notifPromos} 
                  onChange={(e) => setNotifPromos(e.target.checked)}
                />
                <span className="acc-custom-chk">
                  {notifPromos && <Check size={12} className="chk-icon" />}
                </span>
                <span className="acc-chk-text">Promotional offers</span>
              </label>

              {/* Quiet Hours Sub-Section */}
              <div className="quiet-hours-section">
                <label className="acc-checkbox-label quiet-main-chk">
                  <input 
                    type="checkbox" 
                    checked={quietHoursEnabled} 
                    onChange={(e) => setQuietHoursEnabled(e.target.checked)}
                  />
                  <span className="acc-custom-chk">
                    {quietHoursEnabled && <Check size={12} className="chk-icon" />}
                  </span>
                  <div>
                    <strong className="acc-chk-text-bold">Quiet hours</strong>
                    <p className="quiet-hours-subtext">
                      We will not send calls or notifications during this time.
                    </p>
                  </div>
                </label>

                {quietHoursEnabled && (
                  <div className="quiet-time-pickers-row">
                    <div className="time-select-wrap">
                      <select 
                        value={quietStart}
                        onChange={(e) => setQuietStart(e.target.value)}
                        className="time-select"
                      >
                        <option value="09:00 AM">09:00 AM</option>
                        <option value="10:00 AM">10:00 AM</option>
                        <option value="11:00 AM">11:00 AM</option>
                        <option value="12:00 PM">12:00 PM</option>
                        <option value="01:00 PM">01:00 PM</option>
                        <option value="02:00 PM">02:00 PM</option>
                      </select>
                      <ChevronDown size={14} className="time-arrow" />
                    </div>

                    <span className="time-to-separator">to</span>

                    <div className="time-select-wrap">
                      <select 
                        value={quietEnd}
                        onChange={(e) => setQuietEnd(e.target.value)}
                        className="time-select"
                      >
                        <option value="12:00 PM">12:00 PM</option>
                        <option value="1:00 PM">1:00 PM</option>
                        <option value="2:00 PM">2:00 PM</option>
                        <option value="3:00 PM">3:00 PM</option>
                        <option value="4:00 PM">4:00 PM</option>
                      </select>
                      <ChevronDown size={14} className="time-arrow" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Card 3 (Bottom Left): Support Ticket */}
          <div className="acc-card support-ticket-card">
            <h2 className="acc-card-title">Support ticket</h2>
            <p className="acc-card-subtitle">Request help from our team.</p>

            <form onSubmit={handleSubmitTicket} className="acc-form">
              <div className="acc-form-group">
                <label className="acc-label">Request type</label>
                <div className="acc-select-wrap">
                  <select 
                    className="acc-select"
                    value={ticketType}
                    onChange={(e) => setTicketType(e.target.value)}
                  >
                    <option value="ID / Document issue">ID / Document issue</option>
                    <option value="Address correction">Address correction</option>
                    <option value="Payment or Invoice">Payment or Invoice</option>
                    <option value="Date / Slot Reschedule">Date / Slot Reschedule</option>
                    <option value="Other Query">Other Query</option>
                  </select>
                  <ChevronDown size={14} className="select-arrow-icon" />
                </div>
              </div>

              <div className="acc-form-group">
                <label className="acc-label">Description</label>
                <textarea 
                  className="acc-textarea"
                  rows={3}
                  value={ticketDesc}
                  onChange={(e) => setTicketDesc(e.target.value)}
                  placeholder="Describe your issue or request..."
                  required
                />
              </div>

              <div className="acc-form-group">
                <label className="acc-label">Attach photo (optional)</label>
                {attachedFile ? (
                  <div className="attached-file-chip">
                    <div className="chip-left">
                      <span className="chip-doc-icon">📄</span>
                      <span className="chip-btn-choose">Choose file</span>
                      <span className="chip-filename">{attachedFile}</span>
                    </div>
                    <button 
                      type="button" 
                      className="chip-remove-btn"
                      onClick={() => setAttachedFile(null)}
                      title="Remove attachment"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <button 
                    type="button" 
                    className="btn-add-attachment"
                    onClick={() => setAttachedFile('id-document-scan.jpg')}
                  >
                    <Paperclip size={14} /> Attach document / photo
                  </button>
                )}
              </div>

              <button type="submit" className="btn-acc-primary">
                Submit ticket
              </button>
            </form>
          </div>

          {/* Card 4 (Bottom Right): Cancel this move request */}
          <div className="acc-card cancel-move-card">
            <h2 className="acc-cancel-title">Cancel this move request</h2>
            <p className="acc-cancel-desc">
              You can cancel your move request if your plans have changed.
            </p>

            {isMoveCancelled ? (
              <div className="cancel-success-box">
                <AlertTriangle size={18} className="text-danger" />
                <div>
                  <strong>Move MM-1042 Cancelled</strong>
                  <p>Reason: {cancelReason}. Refund processed if applicable.</p>
                </div>
                <button 
                  type="button" 
                  className="btn-undo-cancel"
                  onClick={() => setIsMoveCancelled(false)}
                >
                  Reactivate move
                </button>
              </div>
            ) : (
              <button 
                type="button" 
                className="btn-cancel-request-outline"
                onClick={() => setShowCancelModal(true)}
              >
                Cancel request
              </button>
            )}
          </div>

        </div>
      )}

      {/* ============================================================
          TAB 2: ADDRESSES
          ============================================================ */}
      {activeTab === 'addresses' && (
        <div className="acc-addresses-tab animate-fade-in">
          <div className="addresses-header-action">
            <h3>Saved Moving Addresses</h3>
            <button 
              type="button" 
              className="btn-acc-secondary"
              onClick={() => alert('Add Address: Enter pickup or drop address in Pune/Mumbai/Bengaluru.')}
            >
              <Plus size={16} /> Add New Address
            </button>
          </div>

          <div className="addresses-grid">
            {addresses.map((addr) => (
              <div key={addr.id} className="address-card">
                <div className="address-card-top">
                  <span className="address-type-badge">{addr.type}</span>
                  {addr.isDefault && <span className="default-badge">Primary</span>}
                </div>
                <div className="address-location-row">
                  <MapPin size={18} className="text-primary flex-shrink-0" />
                  <div>
                    <strong>{addr.tag}</strong>
                    <p>{addr.address}</p>
                  </div>
                </div>
                <div className="address-card-actions">
                  <button type="button" className="btn-addr-action">
                    <Edit3 size={14} /> Edit
                  </button>
                  <button type="button" className="btn-addr-action text-danger">
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================
          TAB 3: NOTIFICATIONS
          ============================================================ */}
      {activeTab === 'notifications' && (
        <div className="acc-notif-tab animate-fade-in">
          <h3>Recent Notifications</h3>
          <div className="notif-history-list">
            <div className="notif-history-item unread">
              <div className="notif-icon-circle bg-mint">
                <Check size={16} className="text-primary" />
              </div>
              <div className="notif-content-col">
                <strong>Additional packing material request from Aarav</strong>
                <p>Aarav requested ₹300 for glassware bubble wrap on Move MM-1042.</p>
                <span className="notif-time-ago">10:15 AM today</span>
              </div>
            </div>

            <div className="notif-history-item">
              <div className="notif-icon-circle bg-light">
                <Bell size={16} className="text-primary" />
              </div>
              <div className="notif-content-col">
                <strong>Move Quote Ready (MM-1042)</strong>
                <p>Your custom quote for 1 BHK Pune move has been generated.</p>
                <span className="notif-time-ago">9:15 AM today</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          TAB 4: SUPPORT
          ============================================================ */}
      {activeTab === 'support' && (
        <div className="acc-support-tab animate-fade-in">
          <div className="support-overview-grid">
            <div className="support-channel-card">
              <Phone size={24} className="text-primary" />
              <h4>24/7 Helpline</h4>
              <p>Direct priority access for booked customers.</p>
              <strong>1800-MOVE-MATE</strong>
            </div>

            <div className="support-channel-card">
              <MessageSquare size={24} className="text-primary" />
              <h4>Live Coordinator Chat</h4>
              <p>Real-time chat with coordinator Aarav.</p>
              <button 
                type="button" 
                className="btn-acc-primary btn-sm mt-2"
                onClick={() => alert('Switching to Messages tab...')}
              >
                Open Chat
              </button>
            </div>

            <div className="support-channel-card">
              <Shield size={24} className="text-primary" />
              <h4>Transit Insurance</h4>
              <p>All items covered under ₹0 deductible guarantee.</p>
              <span className="badge-approved-status mt-2">Active Policy</span>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          CANCELLATION CONFIRMATION MODAL (As shown in Screenshot 3)
          ============================================================ */}
      {showCancelModal && (
        <div className="modal-overlay" onClick={() => setShowCancelModal(false)}>
          <div 
            className="modal-container cancel-modal-container animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="cancel-modal-header">
              <h2 className="cancel-modal-title">Cancel move request?</h2>
              <button 
                type="button" 
                className="modal-close-btn"
                onClick={() => setShowCancelModal(false)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="cancel-modal-body">
              <p className="cancel-modal-instruction">
                Please tell us the reason for cancellation.
              </p>

              <div className="cancel-reason-select-wrap">
                <select 
                  className="cancel-reason-select"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                >
                  <option value="Plans changed">Plans changed</option>
                  <option value="Found another service">Found another service</option>
                  <option value="Cost too high">Cost too high</option>
                  <option value="Moving date delayed">Moving date delayed</option>
                  <option value="Other">Other</option>
                </select>
                <ChevronDown size={14} className="cancel-arrow-icon" />
              </div>

              <div className="cancel-modal-actions">
                <button 
                  type="button" 
                  className="btn-keep-request"
                  onClick={() => setShowCancelModal(false)}
                >
                  Keep request
                </button>

                <button 
                  type="button" 
                  className="btn-confirm-cancellation"
                  onClick={handleConfirmCancellation}
                >
                  Confirm cancellation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
