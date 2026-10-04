import React, { useState } from 'react';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import AdminOverview from './AdminOverview';
import AdminMoveRequests from './AdminMoveRequests';
import AdminCoordinators from './AdminCoordinators';
import AdminAssignTeam from './AdminAssignTeam';
import AdminVehiclesWorkers from './AdminVehiclesWorkers';
import AdminQuoteManagement from './AdminQuoteManagement';
import AdminIncidentsClaims from './AdminIncidentsClaims';
import AdminSettingsAccess from './AdminSettingsAccess';
import { CheckCircle2 } from 'lucide-react';
import './admin.css';

export default function AdminPanel({ 
  onNavigateHome, 
  onNavigateCustomerPortal, 
  onNavigateCoordinatorPortal,
  onSignOut 
}) {
  // 'overview' (01) | 'move_requests' (02) | 'coordinators' (03) | 'assign_team' (04) | 
  // 'vehicles_workers' (05) | 'quotes' (06) | 'incidents' (07) | 'settings' (08)
  const [currentTab, setCurrentTab] = useState('overview');
  const [selectedMoveForAssignment, setSelectedMoveForAssignment] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Screen banner details mapped strictly to the screenshot numbers (01 to 08)
  const screenMeta = {
    overview: { number: '01', title: 'Overview' },
    move_requests: { number: '02', title: 'Move requests' },
    coordinators: { number: '03', title: 'Coordinator applications' },
    assign_team: { number: '04', title: 'Assign team' },
    vehicles_workers: { number: '05', title: 'Vehicles and workers' },
    vehicles: { number: '05', title: 'Vehicles and workers' },
    workers: { number: '05', title: 'Vehicles and workers' },
    quotes: { number: '06', title: 'Quote management' },
    incidents: { number: '07', title: 'Incidents and claims' },
    settings: { number: '08', title: 'Settings and access' }
  };

  const activeMeta = screenMeta[currentTab] || screenMeta.overview;

  const handleSelectMoveForAssign = (move) => {
    setSelectedMoveForAssignment(move);
    setCurrentTab('assign_team');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAssignmentConfirmed = (assignmentData) => {
    showToast(`Team successfully assigned to ${assignmentData.moveId}! Coordinator and crew notified.`);
    setCurrentTab('move_requests');
  };

  // Normalizing sidebar tab IDs to matching views
  const handleSelectSidebarTab = (tabId) => {
    if (tabId === 'vehicles' || tabId === 'workers') {
      setCurrentTab('vehicles_workers');
    } else {
      setCurrentTab(tabId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="admin-panel-container">
      {/* 1. TOP HEADER (Image 3) */}
      <AdminHeader 
        onNavigateHome={onNavigateHome}
        onNavigateCustomerPortal={onNavigateCustomerPortal}
        onNavigateCoordinatorPortal={onNavigateCoordinatorPortal}
        onSignOut={onSignOut}
      />

      {/* 2. FOREST GREEN SCREEN BANNER (01 to 08) */}
      <div className="admin-screen-banner">
        <div className="admin-screen-banner-title">
          <span className="admin-screen-number">{activeMeta.number}</span>
          <span className="admin-screen-name">{activeMeta.title}</span>
        </div>

        {/* Quick Screen Switcher matching all 8 screens */}
        <div className="admin-screen-switcher" style={{ flexWrap: 'wrap', gap: '4px' }}>
          {[
            { id: 'overview', num: '01', label: 'Overview' },
            { id: 'move_requests', num: '02', label: 'Move requests' },
            { id: 'coordinators', num: '03', label: 'Coordinators' },
            { id: 'assign_team', num: '04', label: 'Assign team' },
            { id: 'vehicles_workers', num: '05', label: 'Vehicles & workers' },
            { id: 'quotes', num: '06', label: 'Quotes' },
            { id: 'incidents', num: '07', label: 'Incidents' },
            { id: 'settings', num: '08', label: 'Settings' }
          ].map((screen) => {
            const isActive = currentTab === screen.id || 
              (screen.id === 'vehicles_workers' && (currentTab === 'vehicles' || currentTab === 'workers'));
            return (
              <button 
                key={screen.id}
                type="button"
                className={`admin-screen-tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => setCurrentTab(screen.id)}
              >
                <span>{screen.num}</span> {screen.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. MAIN BODY LAYOUT (SIDEBAR + CONTENT VIEW) */}
      <div className="admin-main-layout">
        <AdminSidebar 
          currentTab={currentTab}
          onSelectTab={handleSelectSidebarTab}
          onNavigateHome={onNavigateHome}
        />

        <main className="admin-content-view">
          {/* SCREEN 01: OVERVIEW */}
          {currentTab === 'overview' && (
            <AdminOverview 
              onNavigateTab={(tab) => {
                handleSelectSidebarTab(tab);
              }}
              onSelectMoveForAssign={handleSelectMoveForAssign}
            />
          )}

          {/* SCREEN 02: MOVE REQUESTS */}
          {currentTab === 'move_requests' && (
            <AdminMoveRequests 
              onAssignTeam={(move) => handleSelectMoveForAssign(move)}
              onOpenNewMoveModal={() => showToast('New move request creation modal opened.')}
            />
          )}

          {/* SCREEN 03: COORDINATOR APPLICATIONS */}
          {currentTab === 'coordinators' && (
            <AdminCoordinators 
              onShowToast={showToast}
            />
          )}

          {/* SCREEN 04: ASSIGN TEAM */}
          {currentTab === 'assign_team' && (
            <AdminAssignTeam 
              moveData={selectedMoveForAssignment}
              onAssignmentConfirmed={handleAssignmentConfirmed}
              onCancel={() => setCurrentTab('move_requests')}
            />
          )}

          {/* SCREEN 05: VEHICLES AND WORKERS */}
          {(currentTab === 'vehicles_workers' || currentTab === 'vehicles' || currentTab === 'workers') && (
            <AdminVehiclesWorkers 
              onShowToast={showToast}
            />
          )}

          {/* SCREEN 06: QUOTE MANAGEMENT */}
          {currentTab === 'quotes' && (
            <AdminQuoteManagement 
              onShowToast={showToast}
            />
          )}

          {/* SCREEN 07: INCIDENTS AND CLAIMS */}
          {currentTab === 'incidents' && (
            <AdminIncidentsClaims 
              onShowToast={showToast}
            />
          )}

          {/* SCREEN 08: SETTINGS AND ACCESS */}
          {currentTab === 'settings' && (
            <AdminSettingsAccess 
              onShowToast={showToast}
            />
          )}

        </main>
      </div>

      {/* Interactive Toast Notification */}
      {toastMessage && (
        <div className="admin-toast-alert">
          <CheckCircle2 size={18} color="#34d399" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
