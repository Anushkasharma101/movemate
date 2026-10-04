import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronDown, User, LogOut, ArrowLeft, Home, 
  ExternalLink, ShieldCheck, RefreshCw 
} from 'lucide-react';

export default function AdminHeader({ 
  onNavigateHome, 
  onNavigateCustomerPortal, 
  onNavigateCoordinatorPortal,
  onSignOut 
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <header className="admin-top-header">
      {/* Brand Logo & Admin Panel Badge */}
      <div 
        className="admin-header-brand-wrap" 
        onClick={onNavigateHome}
        title="MoveMate Home"
      >
        <div className="admin-brand-icon-box">
          <img 
            src="/images/single_color_mark.png" 
            alt="MoveMate Mark" 
            onError={(e) => {
              // fallback if image not found
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement.innerHTML = '<strong>M</strong>';
            }}
          />
        </div>
        <div className="admin-brand-titles">
          <span className="admin-brand-logo-text">MoveMate</span>
          <span className="admin-brand-subtext">ADMIN PANEL</span>
        </div>
      </div>

      {/* Center & Right Meta */}
      <div className="admin-header-right">
        <div className="admin-header-tagline">
          <span>Movers. People. A smoother tomorrow.</span>
          <span className="divider"></span>
          <div className="admin-header-date">
            <strong>4 October 2026</strong>
            <span>Pune, India</span>
          </div>
        </div>

        {/* Admin Profile Dropdown */}
        <div className="admin-user-menu-wrapper" ref={menuRef}>
          <button 
            type="button" 
            className="admin-user-profile-btn"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-expanded={dropdownOpen}
          >
            <div className="admin-avatar-circle">
              A
            </div>
            <div className="admin-user-meta">
              <span className="admin-user-name">Admin</span>
              <span className="admin-user-role">
                System Administrator
                <ChevronDown size={13} style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </span>
            </div>
          </button>

          {dropdownOpen && (
            <div className="admin-dropdown-menu">
              <button 
                type="button" 
                className="admin-dropdown-item"
                onClick={() => {
                  setDropdownOpen(false);
                  if (onNavigateHome) onNavigateHome();
                }}
              >
                <Home size={15} />
                <span>MoveMate Homepage</span>
              </button>

              <button 
                type="button" 
                className="admin-dropdown-item"
                onClick={() => {
                  setDropdownOpen(false);
                  if (onNavigateCustomerPortal) onNavigateCustomerPortal();
                }}
              >
                <ExternalLink size={15} />
                <span>Customer Portal</span>
              </button>

              <button 
                type="button" 
                className="admin-dropdown-item"
                onClick={() => {
                  setDropdownOpen(false);
                  if (onNavigateCoordinatorPortal) onNavigateCoordinatorPortal();
                }}
              >
                <ExternalLink size={15} />
                <span>Coordinator Portal</span>
              </button>

              <div className="admin-dropdown-divider"></div>

              <button 
                type="button" 
                className="admin-dropdown-item text-danger"
                onClick={() => {
                  setDropdownOpen(false);
                  if (onSignOut) onSignOut();
                }}
              >
                <LogOut size={15} />
                <span>Sign out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
