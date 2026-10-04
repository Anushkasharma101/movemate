import React, { useState } from 'react';
import { 
  Briefcase, Calendar, MessageSquare, User, Settings, Bell, 
  Search, Shield, CheckCircle2, AlertTriangle, ArrowLeft,
  Users, Truck, FileText, Layers, RefreshCw, ChevronRight, Home
} from 'lucide-react';
import CoordinatorOverview from './CoordinatorOverview';
import JobBriefCrew from './JobBriefCrew';
import ExecutionChecklist from './ExecutionChecklist';
import ReportIssueApproval from './ReportIssueApproval';
import AdminRequestsAssignments from './AdminRequestsAssignments';
import AdminProvidersSupport from './AdminProvidersSupport';

export default function CoordinatorPortal({ 
  onNavigateHome, 
  onNavigateCustomerPortal,
  initialScreen = 'coord_overview', // 'coord_overview' | 'job_brief' | 'execution' | 'report_issue' | 'admin_requests' | 'admin_providers'
  user,
  onSignOut
}) {
  const [currentScreen, setCurrentScreen] = useState(initialScreen);
  const [activeSidebarNav, setActiveSidebarNav] = useState('jobs'); // 'jobs' | 'providers' | 'messages' | 'profile'
  const [searchQuery, setSearchQuery] = useState('');

  // User profile
  const [userRole, setUserRole] = useState((currentScreen === 'admin_requests' || currentScreen === 'admin_providers') ? 'admin' : 'coordinator');
  
  const coordinatorUser = {
    name: user?.name || 'Rohit Sharma',
    role: 'Coordinator',
    initials: user?.initials || (user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) : 'RS')
  };

  const adminUser = {
    name: 'Priya Deshmukh',
    role: 'Admin',
    initials: 'PD'
  };

  const activeUser = (currentScreen === 'admin_requests' || currentScreen === 'admin_providers' || userRole === 'admin') ? adminUser : coordinatorUser;

  return (
    <div className="dash-browser-canvas">
      {/* Top Browser URL Bar Simulation */}
      <div className="dash-browser-header">
        <div className="dash-browser-dots">
          <span className="dot-red"></span>
          <span className="dot-yellow"></span>
          <span className="dot-green"></span>
        </div>
        <div className="dash-url-pill">
          <span className="dash-url-lock">🔒</span>
          <span className="dash-url-text">
            https://partner.movemate.in/
            {currentScreen === 'coord_overview' && 'coordinator/overview'}
            {currentScreen === 'job_brief' && 'jobs/mm-1042/brief'}
            {currentScreen === 'execution' && 'jobs/mm-1042/execution'}
            {currentScreen === 'report_issue' && 'jobs/mm-1042/report-issue'}
            {currentScreen === 'admin_requests' && 'admin/requests'}
            {currentScreen === 'admin_providers' && 'admin/providers'}
          </span>
        </div>
        <div className="dash-browser-menu">
          <span></span><span></span><span></span>
        </div>
      </div>

      <div className="dash-layout-body">
        
        {/* ============================================================
            LEFT DARK TEAL SIDEBAR NAVIGATION
            ============================================================ */}
        <aside className="coord-sidebar-teal">
          
          {/* Brand Logo */}
          <div className="coord-sidebar-brand" onClick={onNavigateHome}>
            <img 
              src="/images/single_color_mark.png" 
              alt="MoveMate Mark" 
              className="coord-brand-mark" 
            />
            <span className="coord-brand-title">MoveMate</span>
          </div>

          {/* Navigation Items */}
          <nav className="coord-sidebar-nav">
            {(currentScreen === 'admin_requests' || currentScreen === 'admin_providers' || userRole === 'admin') ? (
              <>
                <button 
                  type="button" 
                  className={`coord-nav-item ${currentScreen === 'admin_requests' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveSidebarNav('requests');
                    setUserRole('admin');
                    setCurrentScreen('admin_requests');
                  }}
                >
                  <Layers size={18} />
                  <span>Requests</span>
                </button>

                <button 
                  type="button" 
                  className={`coord-nav-item ${currentScreen === 'admin_providers' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveSidebarNav('providers');
                    setUserRole('admin');
                    setCurrentScreen('admin_providers');
                  }}
                >
                  <Users size={18} />
                  <span>Providers</span>
                </button>

                <button 
                  type="button" 
                  className={`coord-nav-item ${activeSidebarNav === 'issues' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveSidebarNav('issues');
                    setUserRole('admin');
                    setCurrentScreen('admin_providers');
                  }}
                >
                  <AlertTriangle size={18} />
                  <span>Issues</span>
                  <span className="coord-unread-badge">1</span>
                </button>

                <button 
                  type="button" 
                  className={`coord-nav-item ${activeSidebarNav === 'settings' ? 'active' : ''}`}
                  onClick={() => alert('Admin Settings: Rate cards, partner payouts, fleet configuration.')}
                >
                  <Settings size={18} />
                  <span>Settings</span>
                </button>
              </>
            ) : (
              <>
                <button 
                  type="button" 
                  className={`coord-nav-item ${activeSidebarNav === 'jobs' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveSidebarNav('jobs');
                    setUserRole('coordinator');
                    setCurrentScreen('coord_overview');
                  }}
                >
                  <Briefcase size={18} />
                  <span>Jobs</span>
                </button>

                <button 
                  type="button" 
                  className={`coord-nav-item ${activeSidebarNav === 'calendar' ? 'active' : ''}`}
                  onClick={() => alert('Calendar: Sunday, 4 October 2026 (Move MM-1042 scheduled)')}
                >
                  <Calendar size={18} />
                  <span>Calendar</span>
                </button>

                <button 
                  type="button" 
                  className={`coord-nav-item ${activeSidebarNav === 'messages' ? 'active' : ''}`}
                  onClick={() => alert('Chat thread with Customer Pooja and Central Dispatch')}
                >
                  <MessageSquare size={18} />
                  <span>Messages</span>
                  <span className="coord-unread-badge">1</span>
                </button>

                <button 
                  type="button" 
                  className={`coord-nav-item ${activeSidebarNav === 'profile' ? 'active' : ''}`}
                  onClick={() => alert('Profile: Rohit Sharma (Move Coordinator ID: MM-COORD-44)')}
                >
                  <User size={18} />
                  <span>Profile</span>
                </button>
              </>
            )}
          </nav>

          {/* Bottom Profile Bar */}
          <div className="coord-sidebar-profile-footer">
            <div className="coord-footer-avatar">{activeUser.initials}</div>
            <div className="coord-footer-details">
              <strong className="coord-footer-name">{activeUser.name}</strong>
              <span className="coord-footer-role">{activeUser.role}</span>
            </div>
            {onSignOut && (
              <button 
                type="button" 
                className="coord-signout-btn"
                onClick={onSignOut}
                title="Sign out"
                aria-label="Sign out"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              </button>
            )}
          </div>
        </aside>

        {/* ============================================================
            MAIN CONTENT AREA
            ============================================================ */}
        <main className="coord-main-content">
          
          {/* Top Search & Actions Bar */}
          <header className="coord-top-bar">
            <div className="coord-search-wrap">
              <Search size={16} className="coord-search-icon" />
              <input 
                type="text" 
                className="coord-search-input"
                placeholder={(currentScreen === 'admin_requests' || currentScreen === 'admin_providers') ? "Search providers, vehicles, workers..." : "Search jobs, customers..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="coord-top-right-controls">
              <button 
                type="button" 
                className="coord-bell-btn"
                onClick={() => alert('1 Notification: Job MM-1042 ready for execution.')}
                aria-label="Notifications"
              >
                <Bell size={18} />
                <span className="coord-notif-dot"></span>
              </button>

              <div className="coord-top-user-pill">
                <div className="top-user-circle">{activeUser.initials}</div>
                <span className="top-user-name">{activeUser.name}</span>
              </div>
            </div>
          </header>

          {/* Flow Navigator Bar (All Coordinator & Admin Screens) */}
          <div className="demo-flow-tabs-bar coord-flow-bar">
            <span className="flow-bar-label">Coordinator / Admin Flow:</span>
            
            <button 
              type="button" 
              className={`flow-tab-btn ${currentScreen === 'coord_overview' ? 'active' : ''}`}
              onClick={() => {
                setUserRole('coordinator');
                setCurrentScreen('coord_overview');
              }}
            >
              13. Coordinator Overview
            </button>

            <button 
              type="button" 
              className={`flow-tab-btn ${currentScreen === 'job_brief' ? 'active' : ''}`}
              onClick={() => {
                setUserRole('coordinator');
                setCurrentScreen('job_brief');
              }}
            >
              14. Job Brief & Crew
            </button>

            <button 
              type="button" 
              className={`flow-tab-btn ${currentScreen === 'execution' ? 'active' : ''}`}
              onClick={() => {
                setUserRole('coordinator');
                setCurrentScreen('execution');
              }}
            >
              15. Execution Checklist
            </button>

            <button 
              type="button" 
              className={`flow-tab-btn ${currentScreen === 'report_issue' ? 'active' : ''}`}
              onClick={() => {
                setUserRole('coordinator');
                setCurrentScreen('report_issue');
              }}
            >
              16. Report Issue (Approval) ⚡
            </button>

            <button 
              type="button" 
              className={`flow-tab-btn admin-highlight-tab ${currentScreen === 'admin_requests' ? 'active' : ''}`}
              onClick={() => {
                setUserRole('admin');
                setCurrentScreen('admin_requests');
              }}
            >
              17. Admin Assignments 🛡️
            </button>

            <button 
              type="button" 
              className={`flow-tab-btn admin-highlight-tab ${currentScreen === 'admin_providers' ? 'active' : ''}`}
              onClick={() => {
                setUserRole('admin');
                setCurrentScreen('admin_providers');
              }}
            >
              18. Providers & Support 👥
            </button>

            <button 
              type="button" 
              className="flow-tab-btn customer-switch-tab"
              onClick={onNavigateCustomerPortal}
            >
              ← Customer Portal (07-12)
            </button>
          </div>

          {/* ============================================================
              VIEW ROUTING
              ============================================================ */}
          <div className="coord-viewport-body">
            
            {currentScreen === 'coord_overview' && (
              <CoordinatorOverview 
                onNavigateJobBrief={() => setCurrentScreen('job_brief')}
                onNavigateExecution={() => setCurrentScreen('execution')}
                onNavigateIssue={() => setCurrentScreen('report_issue')}
                coordinator={coordinatorUser}
              />
            )}

            {currentScreen === 'job_brief' && (
              <JobBriefCrew 
                onBack={() => setCurrentScreen('coord_overview')}
                onNavigateExecution={() => setCurrentScreen('execution')}
                onNavigateIssue={() => setCurrentScreen('report_issue')}
              />
            )}

            {currentScreen === 'execution' && (
              <ExecutionChecklist 
                onBack={() => setCurrentScreen('coord_overview')}
                onNavigateBrief={() => setCurrentScreen('job_brief')}
                onNavigateIssue={() => setCurrentScreen('report_issue')}
              />
            )}

            {currentScreen === 'report_issue' && (
              <ReportIssueApproval 
                onBack={() => setCurrentScreen('execution')}
                onSubmitSuccess={() => {
                  setCurrentScreen('execution');
                }}
              />
            )}

            {currentScreen === 'admin_requests' && (
              <AdminRequestsAssignments 
                onNavigateCoordinator={() => setCurrentScreen('coord_overview')}
              />
            )}

            {currentScreen === 'admin_providers' && (
              <AdminProvidersSupport 
                onNavigateRequests={() => setCurrentScreen('admin_requests')}
              />
            )}

          </div>

        </main>

      </div>
    </div>
  );
}
