import React, { useState } from 'react';
import { 
  Home, Package, MessageSquare, HelpCircle, Settings, Bell, 
  ArrowLeft, ArrowRight, Phone, CheckCircle2, Clock, Check, 
  ShieldCheck, Truck, Users, Calendar, MapPin, AlertCircle, 
  ChevronRight, RefreshCw, Sparkles, Send, User, ExternalLink,
  Info, Eye, X, Image as ImageIcon, CheckSquare, Star, FileText,
  LogOut, ChevronDown
} from 'lucide-react';
import AdditionalRequestView from './AdditionalRequestView';
import DeliveryChecklistView from './DeliveryChecklistView';
import AccountSupportView from './AccountSupportView';

export default function CustomerDashboard({ 
  onNavigateHome, 
  onNavigateWizard,
  onNavigateCoordinator,
  onSignOut,
  initialTab = 'overview', // 'overview' | 'quote' | 'progress' | 'additional_request' | 'delivery_checklist' | 'messages' | 'help' | 'settings'
  user = { name: 'Pooja', city: 'Pune', initials: 'PD', email: 'pooja@example.com', phone: '+91 98765 43210' } 
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [moveStatus, setMoveStatus] = useState('in_progress'); // 'quote_pending' | 'quote_ready' | 'quote_accepted' | 'in_progress' | 'delivered'
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  // Dynamic move state
  const [currentUser, setCurrentUser] = useState(user);
  const [extraAmountApproved, setExtraAmountApproved] = useState(0); // 0 or 300
  const [extraReqStatus, setExtraReqStatus] = useState('pending'); // 'pending' | 'approved' | 'declined'
  
  // Progress simulation step
  const [progressStage, setProgressStage] = useState(2); // 1: Packing, 2: Loading, 3: In Transit, 4: Delivered
  
  // Support & Chat drawer
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'Aarav (Coordinator)', text: 'Hello Pooja! I have prepared your customized quote (MM-1042) for 4th October. Please review it whenever you are ready.', time: '09:15 AM' },
    { id: 2, sender: 'Aarav (Coordinator)', text: 'Our crew of 2 trained movers and 1 small container truck are on standby for your Baner to Kharadi move.', time: '09:16 AM' },
    { id: 3, sender: 'Aarav (Coordinator)', text: 'Hi Pooja, we need a few additional packing materials for fragile items. Please check the additional request tab.', time: '10:15 AM' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Lightbox for packing photos
  const [activePhotoModal, setActivePhotoModal] = useState(null);

  // Send message simulation
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const newMsg = {
      id: Date.now(),
      sender: 'You',
      text: chatInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages([...chatMessages, newMsg]);
    setChatInput('');

    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'Aarav (Coordinator)',
          text: 'Got it! I am noting down these instructions for the moving day crew.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1000);
  };

  const handleAcceptQuote = () => {
    setMoveStatus('in_progress');
    setActiveTab('progress');
  };

  const handleAdvanceLiveStep = () => {
    setProgressStage((prev) => {
      const next = prev < 4 ? prev + 1 : 1;
      if (next === 4) {
        setMoveStatus('delivered');
      }
      return next;
    });
  };

  const handleAdditionalApproveSuccess = (amt) => {
    setExtraAmountApproved(amt);
    setExtraReqStatus('approved');
  };

  return (
    <div className="dash-browser-canvas">
      {/* Top Browser URL Bar simulation */}
      <div className="dash-browser-header">
        <div className="dash-browser-dots">
          <span className="dot-red"></span>
          <span className="dot-yellow"></span>
          <span className="dot-green"></span>
        </div>
        <div className="dash-url-pill">
          <span className="dash-url-lock">🔒</span>
          <span className="dash-url-text">
            https://app.movemate.in/
            {activeTab === 'overview' && 'overview'}
            {activeTab === 'quote' && 'moves/mm-1042/quote'}
            {activeTab === 'progress' && 'moves/mm-1042/progress'}
            {activeTab === 'additional_request' && 'moves/mm-1042/additional-request'}
            {activeTab === 'delivery_checklist' && 'moves/mm-1042/delivery-checklist'}
            {activeTab === 'messages' && 'messages'}
            {activeTab === 'help' && 'help'}
            {activeTab === 'settings' && 'account-support'}
          </span>
        </div>
        <div className="dash-browser-menu">
          <span></span><span></span><span></span>
        </div>
      </div>

      <div className="dash-layout-body">
        {/* ============================================================
            LEFT SIDEBAR NAVIGATION
            ============================================================ */}
        <aside className="dash-sidebar">
          <div className="sidebar-brand" onClick={onNavigateHome}>
            <img 
              src="/images/single_color_mark.png" 
              alt="MoveMate Mark" 
              className="sidebar-brand-mark" 
            />
            <span className="sidebar-brand-title">MoveMate</span>
          </div>

          <nav className="sidebar-nav-list">
            <button 
              type="button"
              className={`sidebar-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <Home size={18} />
              <span>Overview</span>
            </button>

            <button 
              type="button"
              className={`sidebar-nav-item ${(activeTab === 'quote' || activeTab === 'progress' || activeTab === 'additional_request' || activeTab === 'delivery_checklist') ? 'active' : ''}`}
              onClick={() => {
                if (progressStage === 4) {
                  setActiveTab('delivery_checklist');
                } else if (moveStatus === 'in_progress') {
                  setActiveTab('progress');
                } else {
                  setActiveTab('quote');
                }
              }}
            >
              <Package size={18} />
              <span>My moves</span>
            </button>

            <button 
              type="button"
              className={`sidebar-nav-item ${activeTab === 'messages' ? 'active' : ''}`}
              onClick={() => setActiveTab('messages')}
            >
              <MessageSquare size={18} />
              <span>Messages</span>
              <span className="unread-dot-badge">1</span>
            </button>

            <button 
              type="button" 
              className={`sidebar-nav-item ${activeTab === 'help' ? 'active' : ''}`}
              onClick={() => setActiveTab('help')}
            >
              <HelpCircle size={18} />
              <span>Help</span>
            </button>

            <button 
              type="button" 
              className={`sidebar-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <Settings size={18} />
              <span>Settings</span>
            </button>
          </nav>

          <div className="sidebar-bottom-support">
            <p className="support-card-title">Need help?</p>
            <p className="support-card-sub">We're here for you.</p>
            <button 
              type="button" 
              className="btn-message-support"
              onClick={() => setShowSupportModal(true)}
            >
              Message support
            </button>
          </div>
        </aside>

        {/* ============================================================
            MAIN VIEWPORT CONTENT AREA
            ============================================================ */}
        <main className="dash-main-content">
          
          {/* Top Bar with user & notification icons */}
          <header className="dash-top-bar">
            <div>
              <h1 className="dash-welcome-title">Hello {currentUser.name} 👋</h1>
              <p className="dash-welcome-sub">Here's your upcoming move.</p>
            </div>

            <div className="dash-user-controls">
              <button 
                type="button" 
                className="dash-icon-btn"
                onClick={() => {
                  alert('Notifications: Aarav requested ₹300 for extra packing materials on MM-1042.');
                  setActiveTab('additional_request');
                }}
                aria-label="Notifications"
                title="1 New Notification"
              >
                <Bell size={18} />
                <span className="notif-ping"></span>
              </button>

              <div className="dash-user-dropdown-wrapper">
                <div 
                  className="dash-user-pill-btn" 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  title="Click for Profile Menu"
                >
                  <div className="dash-user-avatar">{currentUser.name?.charAt(0) || 'P'}</div>
                  <div className="dash-user-info">
                    <span className="dash-user-name">{currentUser.name}</span>
                    <span className="dash-user-city">{currentUser.city || 'Pune'}</span>
                  </div>
                  <ChevronDown size={14} className={`dash-arrow ${userMenuOpen ? 'rotated' : ''}`} />
                </div>

                {userMenuOpen && (
                  <div className="dash-user-dropdown-menu animate-scale-up">
                    <div className="dash-dropdown-header">
                      <strong className="dash-dropdown-name">{currentUser.name}</strong>
                      <span className="dash-dropdown-sub">{currentUser.email || '+91 98765 43210'}</span>
                    </div>

                    <div className="dropdown-divider"></div>

                    <button 
                      type="button" 
                      className="dash-dropdown-item"
                      onClick={() => {
                        setUserMenuOpen(false);
                        setActiveTab('settings');
                      }}
                    >
                      <Settings size={15} />
                      <span>Profile & Settings</span>
                    </button>

                    <button 
                      type="button" 
                      className="dash-dropdown-item"
                      onClick={() => {
                        setUserMenuOpen(false);
                        onNavigateHome();
                      }}
                    >
                      <Home size={15} />
                      <span>MoveMate Homepage</span>
                    </button>

                    <div className="dropdown-divider"></div>

                    <button 
                      type="button" 
                      className="dash-dropdown-item text-danger"
                      onClick={() => {
                        setUserMenuOpen(false);
                        if (onSignOut) onSignOut();
                      }}
                    >
                      <LogOut size={15} />
                      <span>Log out</span>
                    </button>
                  </div>
                )}
              </div>

              {onSignOut && (
                <button 
                  type="button"
                  className="btn-header-logout-pill"
                  onClick={onSignOut}
                  title="Log out of MoveMate"
                >
                  <LogOut size={14} />
                  <span>Log out</span>
                </button>
              )}

              <button 
                type="button"
                className="btn-exit-portal"
                onClick={onNavigateHome}
                title="Return to MoveMate Homepage"
              >
                Homepage
              </button>
            </div>
          </header>

          {/* Flow Navigator Bar (All Customer & Coordinator Screens) */}
          <div className="demo-flow-tabs-bar">
            <span className="flow-bar-label">Customer Flow:</span>
            <button 
              type="button"
              className={`flow-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              07. Overview
            </button>
            <button 
              type="button"
              className={`flow-tab-btn ${activeTab === 'quote' ? 'active' : ''}`}
              onClick={() => setActiveTab('quote')}
            >
              08. Quote
            </button>
            <button 
              type="button"
              className={`flow-tab-btn ${activeTab === 'progress' ? 'active' : ''}`}
              onClick={() => setActiveTab('progress')}
            >
              09. Move Progress
            </button>
            <button 
              type="button"
              className={`flow-tab-btn highlight-tab ${activeTab === 'additional_request' ? 'active' : ''}`}
              onClick={() => setActiveTab('additional_request')}
            >
              10. Additional Request (Aarav) ⚡
            </button>
            <button 
              type="button"
              className={`flow-tab-btn highlight-tab ${activeTab === 'delivery_checklist' ? 'active' : ''}`}
              onClick={() => setActiveTab('delivery_checklist')}
            >
              11. Delivery Checklist ⭐
            </button>
            <button 
              type="button"
              className={`flow-tab-btn highlight-tab ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              12. Account & Support ⚙️
            </button>

            <span className="flow-bar-divider">|</span>
            <span className="flow-bar-label">Coordinator / Admin:</span>
            <button 
              type="button"
              className="flow-tab-btn coord-switch-tab"
              onClick={() => onNavigateCoordinator && onNavigateCoordinator('coord_overview')}
            >
              13-17. Coordinator Flow →
            </button>
          </div>

          {/* ============================================================
              SCREEN 07: CUSTOMER OVERVIEW – UPCOMING MOVE
              ============================================================ */}
          {activeTab === 'overview' && (
            <div className="dash-view-container animate-fade-in">
              
              {/* Upcoming Move Hero Card */}
              <div className="upcoming-move-card">
                <div className="upcoming-move-header">
                  <div>
                    <span className="upcoming-tag">UPCOMING MOVE</span>
                    <h2 className="upcoming-move-title">1 BHK Move</h2>
                    <div className="upcoming-meta-row">
                      <span className="meta-item"><MapPin size={14} className="meta-icon" /> Pune, Maharashtra</span>
                      <span className="meta-item"><Calendar size={14} className="meta-icon" /> 4 October 2026</span>
                    </div>
                  </div>

                  <div className="upcoming-right-art">
                    <span className="request-id-badge">Request ID<br /><strong>MM-1042</strong></span>
                    <div className="upcoming-art-container">
                      <div className="art-house">🏡</div>
                      <div className="art-truck">
                        <img src="/images/single_color_mark.png" alt="MoveMate Truck" className="truck-mark" />
                        <span className="truck-body">🚛</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sub-cards Row: Coordinator & Quiet Hours */}
                <div className="overview-subcards-grid">
                  <div className="overview-subcard coord-card">
                    <img 
                      src="/images/aarav_avatar.jpg" 
                      alt="Aarav" 
                      className="coord-avatar-img"
                    />
                    <div>
                      <span className="subcard-role">Coordinator</span>
                      <strong className="subcard-name">Aarav</strong>
                      <span className="subcard-desc">Your move coordinator</span>
                    </div>
                  </div>

                  <div className="overview-subcard quiet-card">
                    <div className="quiet-icon-wrap">
                      <Clock size={20} className="quiet-icon" />
                    </div>
                    <div>
                      <span className="subcard-role">Quiet hours</span>
                      <strong className="subcard-name">11:00 AM – 1:00 PM</strong>
                      <span className="subcard-desc">(Please avoid calls)</span>
                    </div>
                  </div>
                </div>

                {/* Move Stage Stepper */}
                <div className="overview-stepper-bar">
                  <div className="ov-step-node completed">
                    <div className="ov-step-dot"><Check size={14} /></div>
                    <span className="ov-step-title">Quote</span>
                  </div>
                  <div className="ov-step-line filled"></div>
                  <div className={`ov-step-node ${progressStage >= 1 ? 'active' : 'upcoming'}`}>
                    <div className="ov-step-dot">2</div>
                    <span className="ov-step-title">Packing</span>
                  </div>
                  <div className={`ov-step-line ${progressStage >= 2 ? 'filled' : ''}`}></div>
                  <div className={`ov-step-node ${progressStage >= 3 ? 'active' : 'upcoming'}`}>
                    <div className="ov-step-dot">3</div>
                    <span className="ov-step-title">Moving</span>
                  </div>
                  <div className={`ov-step-line ${progressStage >= 4 ? 'filled' : ''}`}></div>
                  <div className={`ov-step-node ${progressStage >= 4 ? 'active' : 'upcoming'}`}>
                    <div className="ov-step-dot">4</div>
                    <span className="ov-step-title">Delivered</span>
                  </div>
                </div>

                {/* Next Action Banners */}
                <div className="next-action-card">
                  <div className="next-action-left">
                    <div className="next-action-icon-wrap">
                      <Package size={22} className="text-orange" />
                    </div>
                    <div>
                      <span className="next-action-label">Live status</span>
                      <h4 className="next-action-title">Move is in progress (Loading stage)</h4>
                      <p className="next-action-desc">Track live milestones, team arrival, and packing photos.</p>
                    </div>
                  </div>

                  <button 
                    type="button" 
                    className="btn-review-quote-action"
                    onClick={() => setActiveTab('progress')}
                  >
                    <span>View live progress</span>
                    <ArrowRight size={18} />
                  </button>
                </div>

                {/* Additional Request Attention Banner */}
                {extraReqStatus === 'pending' && (
                  <div className="pending-req-alert-card" onClick={() => setActiveTab('additional_request')}>
                    <div className="alert-left">
                      <div className="alert-warning-circle">!</div>
                      <div>
                        <strong>Action Needed: Additional request from Aarav</strong>
                        <p>Aarav requested ₹300 for glassware extra packing materials. Please review.</p>
                      </div>
                    </div>
                    <button type="button" className="btn-alert-review">
                      Review request →
                    </button>
                  </div>
                )}
              </div>

              {/* Previous Moves Section */}
              <div className="previous-moves-card">
                <h3 className="section-subtitle">Previous moves</h3>
                <div className="empty-previous-box">
                  <div className="empty-box-icon">
                    <Package size={24} />
                  </div>
                  <div>
                    <strong>No previous moves yet</strong>
                    <p>Your past move requests will appear here.</p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ============================================================
              SCREEN 08: TEAM & QUOTE
              ============================================================ */}
          {activeTab === 'quote' && (
            <div className="dash-view-container animate-fade-in">
              {/* Back to overview link */}
              <button 
                type="button" 
                className="btn-back-breadcrumb"
                onClick={() => setActiveTab('overview')}
              >
                <ArrowLeft size={16} /> Back to overview
              </button>

              <div className="quote-header-title">
                <h2>Move request MM-1042</h2>
                <p>Pune • 4 October 2026 • 1 BHK</p>
              </div>

              {/* Card 1: Your Move Team */}
              <div className="team-summary-card">
                <h3 className="card-section-title">Your Move Team</h3>

                <div className="team-coordinator-row">
                  <div className="coord-profile-left">
                    <img 
                      src="/images/aarav_avatar.jpg" 
                      alt="Aarav" 
                      className="team-coord-avatar"
                    />
                    <div>
                      <strong className="team-coord-name">Aarav</strong>
                      <span className="team-coord-title">Move Coordinator</span>
                    </div>
                  </div>

                  <div className="coord-contact-actions">
                    <button 
                      type="button" 
                      className="btn-team-contact"
                      onClick={() => alert('Calling Coordinator Aarav at +91 98230 XXXXX...')}
                    >
                      <Phone size={16} /> Call
                    </button>
                    <button 
                      type="button" 
                      className="btn-team-contact"
                      onClick={() => {
                        setActiveTab('messages');
                      }}
                    >
                      <MessageSquare size={16} /> Message
                    </button>
                  </div>
                </div>

                {/* Assigned Team for moving day */}
                <div className="assigned-resources-block">
                  <h4 className="assigned-block-title">Assigned team for moving day</h4>
                  <div className="assigned-boxes-grid">
                    <div className="assigned-box-item">
                      <div className="assigned-graphic truck-graphic">
                        <Truck size={28} className="text-primary" />
                      </div>
                      <div>
                        <strong>1 × Small truck</strong>
                        <span>(For 1 BHK)</span>
                      </div>
                    </div>

                    <div className="assigned-box-item">
                      <div className="assigned-graphic movers-graphic">
                        <Users size={28} className="text-primary" />
                      </div>
                      <div>
                        <strong>2 × Moving workers</strong>
                        <span>Trained professionals</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Quote Details */}
              <div className="quote-details-card">
                <div className="quote-card-header">
                  <h3 className="card-section-title">Quote details</h3>
                  <span className="badge-demo-quote">Demo quote</span>
                </div>

                <div className="quote-table-wrapper">
                  <table className="quote-table">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th className="text-right">Amount (INR)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Packing materials (boxes, tape, etc.)</td>
                        <td className="text-right font-medium">₹ 1,200</td>
                      </tr>
                      {extraAmountApproved > 0 && (
                        <tr className="approved-extra-row">
                          <td>Additional packing material (Approved add-on)</td>
                          <td className="text-right font-medium text-primary">+ ₹ {extraAmountApproved}</td>
                        </tr>
                      )}
                      <tr>
                        <td>Transport (small truck)</td>
                        <td className="text-right font-medium">₹ 2,000</td>
                      </tr>
                      <tr>
                        <td>Labour charges (2 workers)</td>
                        <td className="text-right font-medium">₹ 1,300</td>
                      </tr>
                      <tr className="total-row">
                        <td><strong>Total (Demo quote)</strong></td>
                        <td className="text-right total-amount">
                          ₹ {(4500 + extraAmountApproved).toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="quote-bottom-row">
                  <div className="quote-info-notice">
                    <Info size={18} className="text-info flex-shrink-0" />
                    <span>This is a verified quote for your review. No unexpected charges without approval.</span>
                  </div>

                  <button 
                    type="button" 
                    className="btn-accept-quote"
                    onClick={handleAcceptQuote}
                  >
                    Accept quote & track move
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================
              SCREEN 09: MOVE PROGRESS (LIVE)
              ============================================================ */}
          {activeTab === 'progress' && (
            <div className="dash-view-container animate-fade-in">
              <div className="progress-top-nav">
                <button 
                  type="button" 
                  className="btn-back-breadcrumb"
                  onClick={() => setActiveTab('quote')}
                >
                  <ArrowLeft size={16} /> Back to move details
                </button>

                <div className="progress-top-actions">
                  <button 
                    type="button" 
                    className="btn-simulate-step"
                    onClick={handleAdvanceLiveStep}
                    title="Click to simulate live moving milestone updates"
                  >
                    <RefreshCw size={14} /> Advance Milestone ({progressStage}/4)
                  </button>
                </div>
              </div>

              {/* Pending Request Alert Callout inside Move Progress */}
              {extraReqStatus === 'pending' && (
                <div className="progress-pending-banner" onClick={() => setActiveTab('additional_request')}>
                  <div className="banner-left">
                    <div className="banner-warn-icon">!</div>
                    <div>
                      <strong>Additional request from Aarav: Extra packing material (₹300)</strong>
                      <p>Aarav has shared an evidence photo. Please approve or decline.</p>
                    </div>
                  </div>
                  <button type="button" className="btn-review-now-pill">
                    Review & Decide →
                  </button>
                </div>
              )}

              <div className="progress-header-row">
                <div>
                  <h2 className="progress-main-title">Move progress</h2>
                  <p className="progress-sub-meta">MM-1042 • Pune • 4 October 2026</p>
                </div>

                <div className="quiet-hours-badge-top">
                  <Clock size={16} className="text-orange" />
                  <div>
                    <strong>Quiet hours</strong>
                    <span>11:00 AM – 1:00 PM</span>
                  </div>
                </div>
              </div>

              {/* 4-Stage Progress Stepper Bar */}
              <div className="progress-stepper-card">
                <div className={`prog-step-item ${progressStage >= 1 ? (progressStage === 1 ? 'active' : 'completed') : ''}`}>
                  <div className="prog-step-circle">
                    {progressStage > 1 ? <Check size={16} /> : <div className="pulse-inner-dot"></div>}
                  </div>
                  <strong className="prog-step-label">Packing</strong>
                  <span className="prog-step-time">8:30 AM</span>
                </div>

                <div className={`prog-step-connector ${progressStage > 1 ? 'filled' : ''}`}></div>

                <div className={`prog-step-item ${progressStage >= 2 ? (progressStage === 2 ? 'active' : 'completed') : ''}`}>
                  <div className="prog-step-circle">
                    {progressStage > 2 ? <Check size={16} /> : <div className="pulse-inner-dot"></div>}
                  </div>
                  <strong className="prog-step-label">Loading</strong>
                  <span className="prog-step-time">{progressStage >= 2 ? '10:00 AM' : '(Upcoming)'}</span>
                </div>

                <div className={`prog-step-connector ${progressStage > 2 ? 'filled' : ''}`}></div>

                <div className={`prog-step-item ${progressStage >= 3 ? (progressStage === 3 ? 'active' : 'completed') : ''}`}>
                  <div className="prog-step-circle">
                    {progressStage > 3 ? <Check size={16} /> : progressStage === 3 ? <div className="pulse-inner-dot"></div> : '3'}
                  </div>
                  <strong className="prog-step-label">In transit</strong>
                  <span className="prog-step-time">{progressStage >= 3 ? '01:30 PM' : '(Upcoming)'}</span>
                </div>

                <div className={`prog-step-connector ${progressStage > 3 ? 'filled' : ''}`}></div>

                <div className={`prog-step-item ${progressStage >= 4 ? 'completed active' : ''}`}>
                  <div className="prog-step-circle">
                    {progressStage === 4 ? <Check size={16} /> : '4'}
                  </div>
                  <strong className="prog-step-label">Delivered</strong>
                  <span className="prog-step-time">{progressStage === 4 ? '04:15 PM' : '(Upcoming)'}</span>
                </div>
              </div>

              {/* When Delivered: Highlight Delivery Checklist */}
              {progressStage === 4 && (
                <div className="delivered-action-callout" onClick={() => setActiveTab('delivery_checklist')}>
                  <div className="del-callout-icon">
                    <CheckCircle2 size={28} className="text-primary" />
                  </div>
                  <div className="del-callout-content">
                    <h3>Move Delivered! Complete Delivery Checklist</h3>
                    <p>Confirm item condition and share your review for the crew.</p>
                  </div>
                  <button type="button" className="btn-open-checklist">
                    Open Checklist & Rate →
                  </button>
                </div>
              )}

              {/* Two Column Grid: Latest Updates & Packing Photos */}
              <div className="progress-two-col-grid">
                {/* Left: Latest Updates */}
                <div className="progress-updates-card">
                  <h3 className="card-section-title">Latest updates</h3>

                  <div className="live-timeline-list">
                    {progressStage >= 4 && (
                      <div className="live-timeline-item active">
                        <span className="timeline-time">4:15 PM</span>
                        <div className="timeline-dot-green pulse"></div>
                        <div className="timeline-text-wrap">
                          <strong>Delivery completed at Kharadi</strong>
                          <p>All items unloaded. Ready for customer checklist sign-off.</p>
                        </div>
                      </div>
                    )}

                    {progressStage >= 3 && (
                      <div className="live-timeline-item active">
                        <span className="timeline-time">1:30 PM</span>
                        <div className="timeline-dot-green"></div>
                        <div className="timeline-text-wrap">
                          <strong>Truck in transit</strong>
                          <p>Driver is moving via Pune bypass route to destination.</p>
                        </div>
                      </div>
                    )}

                    {progressStage >= 2 && (
                      <div className="live-timeline-item active">
                        <span className="timeline-time">10:35 AM</span>
                        <div className="timeline-dot-green pulse"></div>
                        <div className="timeline-text-wrap">
                          <strong>Loading in progress</strong>
                          <p>Items are being carefully loaded into the container truck.</p>
                        </div>
                      </div>
                    )}

                    <div className="live-timeline-item">
                      <span className="timeline-time">9:45 AM</span>
                      <div className="timeline-dot-green"></div>
                      <div className="timeline-text-wrap">
                        <strong>Packing completed</strong>
                        <p>All items packed at your Baner location.</p>
                      </div>
                    </div>

                    <div className="live-timeline-item">
                      <span className="timeline-time">8:30 AM</span>
                      <div className="timeline-dot-green"></div>
                      <div className="timeline-text-wrap">
                        <strong>Team arrived</strong>
                        <p>Aarav and team reached your location on time.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Packing Photos Gallery */}
                <div className="progress-photos-card">
                  <div className="photos-header">
                    <h3 className="card-section-title">Packing photos</h3>
                    <span className="photos-count-badge">4 photos</span>
                  </div>

                  <div className="photos-gallery-grid">
                    <div 
                      className="photo-thumb-card" 
                      onClick={() => setActivePhotoModal({
                        url: '/images/bubble_wrap.jpg',
                        caption: 'Fragile Kitchenware & Glassware – Extra bubble wrap & foam padding'
                      })}
                    >
                      <img src="/images/bubble_wrap.jpg" alt="Bubble wrap evidence" />
                      <div className="photo-zoom-overlay">
                        <Eye size={18} />
                      </div>
                    </div>

                    <div 
                      className="photo-thumb-card" 
                      onClick={() => setActivePhotoModal({
                        url: '/images/packing_sofa.jpg',
                        caption: 'Living Room Sofa – Double layer shrink wrap & corner foam pads applied'
                      })}
                    >
                      <img src="/images/packing_sofa.jpg" alt="Packed Sofa" />
                      <div className="photo-zoom-overlay">
                        <Eye size={18} />
                      </div>
                    </div>

                    <div 
                      className="photo-thumb-card"
                      onClick={() => setActivePhotoModal({
                        url: '/images/packing_boxes.jpg',
                        caption: 'Standard Cartons – Labelled by room (Living Room, Bedroom, Kitchen)'
                      })}
                    >
                      <img src="/images/packing_boxes.jpg" alt="Packed Boxes" />
                      <div className="photo-zoom-overlay">
                        <Eye size={18} />
                      </div>
                    </div>

                    <div 
                      className="photo-thumb-card"
                      onClick={() => setActivePhotoModal({
                        url: '/images/packing_furniture.jpg',
                        caption: 'Master Bedroom Wardrobe – Heavy corrugated padding & safety strapping'
                      })}
                    >
                      <img src="/images/packing_furniture.jpg" alt="Packed Wardrobe" />
                      <div className="photo-zoom-overlay">
                        <Eye size={18} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Card: Inventory Checklist */}
              <div className="inventory-checklist-card">
                <div className="checklist-header">
                  <div>
                    <h3 className="card-section-title">Inventory checklist</h3>
                    <span className="checklist-subcount">12 of 14 items checked</span>
                  </div>
                  <button 
                    type="button" 
                    className="btn-view-all-items"
                    onClick={() => setActiveTab('delivery_checklist')}
                  >
                    Open Delivery Checklist <ArrowRight size={14} />
                  </button>
                </div>

                {/* Progress bar (86%) */}
                <div className="checklist-bar-wrapper">
                  <div className="checklist-bar-fill" style={{ width: '86%' }}></div>
                </div>
                <span className="checklist-pct-label">86%</span>

                {/* 2x2 Grid of Checked Items */}
                <div className="checked-items-grid">
                  <div className="checked-item-pill">
                    <div className="checked-icon-box">
                      <Check size={16} />
                    </div>
                    <div>
                      <strong>Bed</strong>
                      <span className="text-checked">Checked</span>
                    </div>
                  </div>

                  <div className="checked-item-pill">
                    <div className="checked-icon-box">
                      <Check size={16} />
                    </div>
                    <div>
                      <strong>Monitor</strong>
                      <span className="text-checked">Checked</span>
                    </div>
                  </div>

                  <div className="checked-item-pill">
                    <div className="checked-icon-box">
                      <Check size={16} />
                    </div>
                    <div>
                      <strong>Fridge</strong>
                      <span className="text-checked">Checked</span>
                    </div>
                  </div>

                  <div className="checked-item-pill">
                    <div className="checked-icon-box">
                      <Check size={16} />
                    </div>
                    <div>
                      <strong>Moving boxes</strong>
                      <span className="text-checked">Checked</span>
                    </div>
                  </div>
                </div>

                <div className="checklist-footer-meta">
                  <Clock size={14} />
                  <span>Last updated: 10:35 AM</span>
                </div>
              </div>

            </div>
          )}

          {/* ============================================================
              SCREEN 10: ADDITIONAL REQUEST FROM AARAV (IMAGE 1)
              ============================================================ */}
          {activeTab === 'additional_request' && (
            <AdditionalRequestView 
              onBack={() => setActiveTab('progress')}
              onApproveSuccess={handleAdditionalApproveSuccess}
              user={currentUser}
            />
          )}

          {/* ============================================================
              SCREEN 11: DELIVERY CHECKLIST & RATING (IMAGE 2)
              ============================================================ */}
          {activeTab === 'delivery_checklist' && (
            <DeliveryChecklistView 
              onBack={() => setActiveTab('progress')}
              onDeliveryConfirmed={(ratingData) => {
                alert(`Thank you ${currentUser.name}! You rated your move ${ratingData.rating} stars.`);
                setActiveTab('overview');
              }}
              user={currentUser}
            />
          )}

          {/* ============================================================
              SCREEN 12: ACCOUNT & SUPPORT / SETTINGS (IMAGE 3)
              ============================================================ */}
          {activeTab === 'settings' && (
            <AccountSupportView 
              user={currentUser}
              onSignOut={onSignOut}
              onUpdateUser={(updated) => setCurrentUser(prev => ({ ...prev, ...updated }))}
              onCancelMove={(reason) => {
                alert(`Move MM-1042 cancellation request received. Reason: "${reason}". Coordinator Aarav has been notified.`);
              }}
            />
          )}

          {/* ============================================================
              MESSAGES TAB VIEW
              ============================================================ */}
          {activeTab === 'messages' && (
            <div className="dash-view-container animate-fade-in">
              <div className="messages-layout-card">
                <div className="chat-thread-header">
                  <div className="chat-partner-info">
                    <img src="/images/aarav_avatar.jpg" alt="Aarav" className="chat-avatar" />
                    <div>
                      <strong>Aarav (Move Coordinator)</strong>
                      <span className="chat-status-online">● Online • Assigned to Move MM-1042</span>
                    </div>
                  </div>
                  <button type="button" className="btn-call-mini" onClick={() => alert('Dialing Aarav at +91 98230 XXXXX...')}>
                    <Phone size={14} /> Call Aarav
                  </button>
                </div>

                <div className="chat-bubbles-container">
                  {chatMessages.map(msg => (
                    <div 
                      key={msg.id} 
                      className={`chat-bubble-row ${msg.sender === 'You' ? 'sent' : 'received'}`}
                    >
                      <div className="chat-bubble-bubble">
                        <span className="bubble-author">{msg.sender}</span>
                        <p className="bubble-text">{msg.text}</p>
                        <span className="bubble-timestamp">{msg.time}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="chat-input-bar">
                  <input 
                    type="text"
                    className="chat-text-input"
                    placeholder="Type your message to Aarav or MoveMate dispatch..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                  />
                  <button type="submit" className="btn-chat-send">
                    <Send size={16} />
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ============================================================
              HELP TAB VIEW
              ============================================================ */}
          {activeTab === 'help' && (
            <div className="dash-view-container animate-fade-in">
              <div className="help-center-card">
                <h2>MoveMate Support & Resolution Center</h2>
                <p className="help-lead">Need assistance with your move MM-1042? We provide instant dedicated dispatch support.</p>

                <div className="help-cards-grid">
                  <div className="help-item-box" onClick={() => setShowSupportModal(true)}>
                    <MessageSquare size={24} className="text-primary" />
                    <strong>24/7 Live Support Chat</strong>
                    <p>Connect with MoveMate central operations team.</p>
                  </div>
                  <div className="help-item-box" onClick={() => alert('Emergency Hotline: 1800-MOVE-MATE (toll free)')}>
                    <Phone size={24} className="text-primary" />
                    <strong>Emergency Dispatch Hotline</strong>
                    <p>Toll-free 1800-MOVE-MATE for immediate issues.</p>
                  </div>
                  <div className="help-item-box" onClick={() => alert('Transit Policy: ₹0 damage protection active for MM-1042.')}>
                    <ShieldCheck size={24} className="text-primary" />
                    <strong>Transit Insurance & Guarantee</strong>
                    <p>Details on item condition logs and claims.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Photo Lightbox Modal */}
      {activePhotoModal && (
        <div className="modal-overlay" onClick={() => setActivePhotoModal(null)}>
          <div className="modal-container photo-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Packing Verification Photo</h3>
              <button 
                type="button" 
                className="modal-close-btn"
                onClick={() => setActivePhotoModal(null)}
              >
                <X size={18} />
              </button>
            </div>
            <div className="photo-lightbox-body">
              <img src={activePhotoModal.url} alt="Packing photo" className="lightbox-img" />
              <p className="lightbox-caption">{activePhotoModal.caption}</p>
            </div>
          </div>
        </div>
      )}

      {/* Message Support Modal */}
      {showSupportModal && (
        <div className="modal-overlay" onClick={() => setShowSupportModal(false)}>
          <div className="modal-container support-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-wrap">
                <div className="modal-badge">
                  <ShieldCheck size={14} />
                  <span>Central Support</span>
                </div>
                <h2>MoveMate Support Desk</h2>
              </div>
              <button 
                type="button" 
                className="modal-close-btn"
                onClick={() => setShowSupportModal(false)}
              >
                <X size={18} />
              </button>
            </div>
            <div className="support-modal-body">
              <p>Our dedicated operations manager is connected to move <strong>MM-1042</strong>.</p>
              <div className="support-quick-options">
                <button 
                  type="button" 
                  className="quick-sup-btn"
                  onClick={() => {
                    alert('Callback requested. An agent will call +91 98765 43210 within 5 mins.');
                    setShowSupportModal(false);
                  }}
                >
                  Request instant callback (5 min)
                </button>
                <button 
                  type="button" 
                  className="quick-sup-btn"
                  onClick={() => {
                    setShowSupportModal(false);
                    setActiveTab('messages');
                  }}
                >
                  Chat with move coordinator Aarav
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
