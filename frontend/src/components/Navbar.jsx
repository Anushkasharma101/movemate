import React, { useState, useEffect } from 'react';
import { 
  Menu, X, ArrowRight, MapPin, ChevronDown, User, 
  LogOut, Package, Settings, ShieldCheck 
} from 'lucide-react';

export default function Navbar({ 
  onPlanMoveClick, 
  onSignInClick, 
  onNavigateSection, 
  activeCity, 
  onCityChange, 
  user, 
  onProfileClick,
  onDashboardClick, 
  onAdminClick,
  onSignOut 
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const cities = ['Pune', 'Mumbai', 'Bengaluru', 'Delhi NCR', 'Hyderabad', 'Chennai'];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.city-pill-wrapper')) {
        setCityDropdownOpen(false);
      }
      if (!e.target.closest('.user-profile-menu-wrapper')) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const handleProfileClick = () => {
    setProfileDropdownOpen(false);
    if (onProfileClick) {
      onProfileClick();
    } else if (onDashboardClick) {
      onDashboardClick();
    }
  };

  return (
    <header className={`navbar-wrapper ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        {/* Brand Logo */}
        <a href="#" className="brand-logo" aria-label="MoveMate Home">
          <img 
            src="/images/single_color_mark.png" 
            alt="MoveMate Icon" 
            className="brand-icon" 
          />
          <span className="brand-text">MoveMate</span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav">
          {/* City Selector Pill in nav */}
          <div className="city-pill-wrapper">
            <button 
              type="button"
              className="city-selector-btn"
              onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
              aria-expanded={cityDropdownOpen}
              aria-label="Select City"
            >
              <MapPin size={14} className="city-pin-icon" />
              <span className="city-name">{activeCity}</span>
              <ChevronDown size={13} className={`city-arrow ${cityDropdownOpen ? 'rotated' : ''}`} />
            </button>
            
            {cityDropdownOpen && (
              <div className="city-dropdown-menu">
                <div className="city-dropdown-header">Select your city</div>
                {cities.map((city) => (
                  <button
                    key={city}
                    type="button"
                    className={`city-dropdown-item ${city === activeCity ? 'active' : ''}`}
                    onClick={() => {
                      onCityChange(city);
                      setCityDropdownOpen(false);
                    }}
                  >
                    <span className="city-item-dot"></span>
                    {city}
                    {city === activeCity && <span className="current-badge">Active</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button 
            type="button" 
            className="nav-link-btn"
            onClick={() => onNavigateSection('how-it-works')}
          >
            How it works
          </button>

          <button 
            type="button" 
            className="nav-link-btn"
            onClick={() => onNavigateSection('services')}
          >
            Services
          </button>

          {/* Direct Admin Panel Switcher */}
          <button 
            type="button" 
            className="nav-link-btn"
            onClick={onAdminClick}
            style={{ 
              color: '#0d473b', 
              fontWeight: '600',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '9999px',
              background: '#e6f7f0',
              border: '1px solid #c8edd9'
            }}
            title="Open MoveMate Admin Panel"
          >
            <ShieldCheck size={14} />
            <span>Admin</span>
          </button>
          
          {/* Sign In button or User Profile Icon */}
          {user ? (
            <div className="user-profile-menu-wrapper">
              <button 
                type="button" 
                className="nav-profile-pill-btn"
                onClick={handleProfileClick}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setProfileDropdownOpen(!profileDropdownOpen);
                }}
                title={`${user.name || 'User'} - Click to view Profile Details`}
                aria-label="User profile and settings"
              >
                <div className="nav-avatar-circle">
                  {user.initials || user.name?.charAt(0) || 'U'}
                </div>
                <span className="nav-profile-name">{user.name || 'Profile'}</span>
                <ChevronDown 
                  size={14} 
                  className={`profile-arrow-icon ${profileDropdownOpen ? 'rotated' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setProfileDropdownOpen(!profileDropdownOpen);
                  }}
                />
              </button>

              {profileDropdownOpen && (
                <div className="profile-dropdown-menu animate-scale-up">
                  <div className="profile-dropdown-header">
                    <div className="dropdown-avatar-circle">
                      {user.initials || user.name?.charAt(0) || 'U'}
                    </div>
                    <div className="dropdown-meta">
                      <strong className="dropdown-name">{user.name}</strong>
                      <span className="dropdown-email">{user.email || user.phone || 'Customer Account'}</span>
                    </div>
                  </div>

                  <div className="dropdown-divider"></div>

                  <button 
                    type="button" 
                    className="profile-dropdown-item active-highlight"
                    onClick={handleProfileClick}
                  >
                    <User size={16} />
                    <span>Profile & Account Details</span>
                  </button>

                  <button 
                    type="button" 
                    className="profile-dropdown-item"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      if (onDashboardClick) onDashboardClick();
                    }}
                  >
                    <Package size={16} />
                    <span>{user?.role === 'coordinator' ? 'Coordinator Portal' : 'My Move & Dashboard'}</span>
                  </button>

                  <button 
                    type="button" 
                    className="profile-dropdown-item"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      if (onAdminClick) onAdminClick();
                    }}
                  >
                    <ShieldCheck size={16} />
                    <span>MoveMate Admin Panel</span>
                  </button>

                  <div className="dropdown-divider"></div>

                  <button 
                    type="button" 
                    className="profile-dropdown-item text-danger"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      if (onSignOut) onSignOut();
                    }}
                  >
                    <LogOut size={16} />
                    <span>Sign out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              type="button" 
              className="nav-link-btn"
              onClick={onSignInClick}
            >
              Sign in
            </button>
          )}
          
          <button 
            type="button" 
            className="btn-primary-pill"
            onClick={onPlanMoveClick}
            id="nav-plan-move-btn"
          >
            Plan my move
          </button>
        </nav>

        {/* Mobile Hamburger Toggle */}
        <button 
          type="button" 
          className="mobile-toggle-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <div className="mobile-nav-links">
            <button 
              type="button" 
              className="mobile-nav-item"
              onClick={() => {
                onNavigateSection('how-it-works');
                setMobileMenuOpen(false);
              }}
            >
              How it works
            </button>

            <button 
              type="button" 
              className="mobile-nav-item"
              onClick={() => {
                onNavigateSection('services');
                setMobileMenuOpen(false);
              }}
            >
              Services
            </button>

            <button 
              type="button" 
              className="mobile-nav-item"
              onClick={() => {
                if (onAdminClick) onAdminClick();
                setMobileMenuOpen(false);
              }}
              style={{ color: '#0d473b', fontWeight: '600' }}
            >
              <ShieldCheck size={18} />
              <span>Admin Panel</span>
            </button>

            {user ? (
              <>
                <button 
                  type="button" 
                  className="mobile-nav-item mobile-user-highlight"
                  onClick={() => {
                    handleProfileClick();
                    setMobileMenuOpen(false);
                  }}
                >
                  <User size={18} />
                  <span>{user.name} — Profile Details</span>
                </button>

                <button 
                  type="button" 
                  className="mobile-nav-item"
                  onClick={() => {
                    if (onDashboardClick) onDashboardClick();
                    setMobileMenuOpen(false);
                  }}
                >
                  <Package size={18} />
                  <span>My Move & Dashboard</span>
                </button>

                <button 
                  type="button" 
                  className="mobile-nav-item text-danger"
                  onClick={() => {
                    if (onSignOut) onSignOut();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut size={18} />
                  <span>Sign out</span>
                </button>
              </>
            ) : (
              <button 
                type="button" 
                className="mobile-nav-item"
                onClick={() => {
                  onSignInClick();
                  setMobileMenuOpen(false);
                }}
              >
                Sign in
              </button>
            )}

            <button 
              type="button" 
              className="btn-primary-pill mobile-cta"
              onClick={() => {
                onPlanMoveClick();
                setMobileMenuOpen(false);
              }}
            >
              Plan my move <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
