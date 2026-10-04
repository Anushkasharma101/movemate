import React from 'react';
import { 
  Home, Hexagon, Users, Truck, UserCheck, 
  FileText, ShieldAlert, Settings, FileCheck2, 
  Layers, AlertTriangle, Shield
} from 'lucide-react';

export default function AdminSidebar({ 
  currentTab, 
  onSelectTab,
  onNavigateHome
}) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'move_requests', label: 'Move requests', icon: Hexagon, badge: 8 },
    { id: 'coordinators', label: 'Coordinators', icon: UserCheck, badge: 12 },
    { id: 'vehicles', label: 'Vehicles', icon: Truck },
    { id: 'workers', label: 'Workers', icon: Users },
    { id: 'quotes', label: 'Quotes', icon: FileText },
    { id: 'incidents', label: 'Incidents', icon: Shield, badge: 2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="admin-sidebar">
      {/* Brand logo in sidebar */}
      <div 
        className="admin-sidebar-brand" 
        onClick={onNavigateHome}
        style={{ cursor: 'pointer' }}
        title="MoveMate Home"
      >
        <div className="admin-sidebar-logo-icon">
          <img 
            src="/images/single_color_mark.png" 
            alt="M" 
            style={{ width: '20px', height: '20px', filter: 'brightness(0) invert(1)' }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
        <span className="admin-sidebar-logo-text">MoveMate</span>
      </div>

      {/* Nav items list */}
      <nav className="admin-sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id || 
            (currentTab === 'assign_team' && item.id === 'move_requests');
          
          return (
            <button
              key={item.id}
              type="button"
              className={`admin-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => onSelectTab(item.id)}
            >
              <Icon className="nav-icon" />
              <span>{item.label}</span>
              {item.badge && (
                <span className="admin-nav-badge">{item.badge}</span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
