import React, { useState } from 'react';
import { 
  Mail, Lock, Eye, EyeOff, User, Users, ArrowRight, ArrowLeft, 
  CheckCircle2, ShieldCheck, FileText, Phone, Upload, AlertCircle, 
  MapPin, Check, Building2, HelpCircle, FileCheck, Clock
} from 'lucide-react';

export default function AuthScreen({ isOpen, onClose, initialTab = 'signin', onAuthSuccess, onNavigateHome }) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'signin' | 'signup'
  const [role, setRole] = useState('customer'); // 'customer' | 'coordinator'
  
  // Sign in state
  const [showPassword, setShowPassword] = useState(false);
  const [loginIdentifier, setLoginIdentifier] = useState('pooja.iyer@example.com');
  const [loginPassword, setLoginPassword] = useState('••••••••••••');

  // Customer Signup state (Short & focused)
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custPhoneOtp, setCustPhoneOtp] = useState('');
  const [custOtpSent, setCustOtpSent] = useState(false);
  const [custPhoneVerified, setCustPhoneVerified] = useState(false);
  const [custEmail, setCustEmail] = useState('');
  const [custPassword, setCustPassword] = useState('');
  const [custConfirmPassword, setCustConfirmPassword] = useState('');
  const [custAgreeTerms, setCustAgreeTerms] = useState(false);

  // Coordinator Application 3-step state
  const [coordStep, setCoordStep] = useState(1); // 1: Account, 2: Work Profile, 3: Verification, 4: Status/Review
  const [coordName, setCoordName] = useState('');
  const [coordPhone, setCoordPhone] = useState('');
  const [coordPhoneOtp, setCoordPhoneOtp] = useState('');
  const [coordOtpSent, setCoordOtpSent] = useState(false);
  const [coordPhoneVerified, setCoordPhoneVerified] = useState(false);
  const [coordEmail, setCoordEmail] = useState('');
  const [coordPassword, setCoordPassword] = useState('');
  const [coordConfirmPassword, setCoordConfirmPassword] = useState('');

  // Step 2: Work Profile
  const [coordCity, setCoordCity] = useState('Pune');
  const [coordServiceAreas, setCoordServiceAreas] = useState(['Baner', 'Kothrud', 'Hinjawadi', 'Wakad']);
  const [selectedLanguages, setSelectedLanguages] = useState(['English', 'Hindi', 'Marathi']);
  const [coordExperience, setCoordExperience] = useState('4');
  const [coordEntityType, setCoordEntityType] = useState('individual'); // 'individual' | 'company'
  const [coordCompanyName, setCoordCompanyName] = useState('');

  // Step 3: Verification & Compliance
  const [idType, setIdType] = useState('pan'); // 'pan' | 'dl' | 'passport' | 'voter' | 'aadhaar_offline'
  const [idNumber, setIdNumber] = useState('');
  const [idFileUploaded, setIdFileUploaded] = useState(false);
  const [addressProofType, setAddressProofType] = useState('utility_bill');
  const [addressFileUploaded, setAddressFileUploaded] = useState(false);
  const [refName, setRefName] = useState('');
  const [refOrg, setRefOrg] = useState('');
  const [refPhone, setRefPhone] = useState('');
  const [refConsentChecked, setRefConsentChecked] = useState(false);
  const [agreeConductPolicy, setAgreeConductPolicy] = useState(false);
  const [agreeVerificationChecks, setAgreeVerificationChecks] = useState(false);

  // Policy Modal
  const [showPolicyModal, setShowPolicyModal] = useState(false);

  // Application Submitted state
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState('');

  if (!isOpen) return null;

  // Language toggle
  const toggleLanguage = (lang) => {
    if (selectedLanguages.includes(lang)) {
      if (selectedLanguages.length > 1) {
        setSelectedLanguages(selectedLanguages.filter(l => l !== lang));
      }
    } else {
      setSelectedLanguages([...selectedLanguages, lang]);
    }
  };

  // Customer OTP simulation
  const handleSendCustOtp = () => {
    if (custPhone.length >= 10) {
      setCustOtpSent(true);
    } else {
      alert('Please enter a valid 10-digit mobile number.');
    }
  };

  const handleVerifyCustOtp = () => {
    if (custPhoneOtp.length === 4 || custPhoneOtp === '1234' || custPhoneOtp.length > 0) {
      setCustPhoneVerified(true);
    } else {
      alert('Please enter the 4-digit OTP.');
    }
  };

  // Coordinator OTP simulation
  const handleSendCoordOtp = () => {
    if (coordPhone.length >= 10) {
      setCoordOtpSent(true);
    } else {
      alert('Please enter a valid 10-digit mobile number.');
    }
  };

  const handleVerifyCoordOtp = () => {
    if (coordPhoneOtp.length === 4 || coordPhoneOtp === '1234' || coordPhoneOtp.length > 0) {
      setCoordPhoneVerified(true);
    } else {
      alert('Please enter the 4-digit OTP.');
    }
  };

  // Customer Signup Submit
  const handleCustomerSignup = (e) => {
    e.preventDefault();
    if (!custPhoneVerified) {
      alert('Please verify your mobile number with OTP before continuing.');
      return;
    }
    if (custPassword !== custConfirmPassword) {
      alert('Passwords do not match. Please verify.');
      return;
    }
    if (!custAgreeTerms) {
      alert('Please accept the Terms of Service and acknowledge the Privacy Notice.');
      return;
    }

    const user = {
      name: custName,
      initials: custName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'CU',
      email: custEmail || `${custPhone}@movemate.user`,
      phone: custPhone,
      role: 'customer'
    };
    onAuthSuccess(user);
  };

  // Sign in Submit
  const handleSignIn = (e) => {
    e.preventDefault();
    const user = {
      name: loginIdentifier.includes('pooja') ? 'Pooja' : (role === 'coordinator' ? 'Ramesh Patil' : 'Customer User'),
      initials: loginIdentifier.includes('pooja') ? 'PD' : (role === 'coordinator' ? 'RP' : 'CU'),
      email: loginIdentifier,
      role: role
    };
    onAuthSuccess(user);
  };

  // Coordinator Application Submit (Step 3 to Approval Flow)
  const handleCoordinatorSubmit = (e) => {
    e.preventDefault();
    if (!idNumber || !idFileUploaded) {
      alert('Please enter your identity document number and upload a clear document copy.');
      return;
    }
    if (!addressFileUploaded) {
      alert('Please upload your address verification document.');
      return;
    }
    if (!refName || !refPhone || !refConsentChecked) {
      alert('Please provide your professional reference details and confirm permission.');
      return;
    }
    if (!agreeConductPolicy) {
      alert('Please accept the Coordinator Service Agreement & Conduct Policy.');
      return;
    }
    if (!agreeVerificationChecks) {
      alert('Please consent to the identity and reference verification checks.');
      return;
    }

    const newAppId = 'CRD-PUN-' + Math.floor(10000 + Math.random() * 90000);
    setApplicationId(newAppId);
    setApplicationSubmitted(true);
  };

  return (
    <div className="auth-page-wrapper">
      {/* Header */}
      <header className="auth-header container">
        <button 
          type="button" 
          className="brand-logo" 
          onClick={onNavigateHome}
          aria-label="MoveMate Home"
        >
          <img 
            src="/images/single_color_mark.png" 
            alt="MoveMate Icon" 
            className="brand-icon" 
          />
          <span className="brand-text">MoveMate</span>
        </button>

        <div className="auth-header-links">
          <button type="button" className="nav-link-btn" onClick={onNavigateHome}>How it works</button>
          <button type="button" className="nav-link-btn" onClick={onNavigateHome}>Services</button>
          <button 
            type="button" 
            className={`nav-link-btn ${activeTab === 'signin' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('signin');
              setApplicationSubmitted(false);
            }}
          >
            Sign in
          </button>
          <button type="button" className="btn-primary-pill" onClick={onClose}>Plan my move</button>
        </div>
      </header>

      {/* Main Container */}
      <main className="container auth-main-container">
        <div className={`auth-split-card ${role === 'coordinator' && activeTab === 'signup' ? 'coordinator-expanded' : ''}`}>
          
          {/* Left Panel: Mint with Cat illustration */}
          <div className="auth-left-panel">
            <div className="auth-left-content">
              <h1 className="auth-left-title">
                <span>Same move.</span>
                <span>A smoother</span>
                <span>tomorrow.</span>
              </h1>
              <p className="auth-left-desc">
                {role === 'coordinator' && activeTab === 'signup' 
                  ? 'Join MoveMate as a verified Move Coordinator. Deliver seamless moving experiences with full operational support.'
                  : 'Create an account to plan, track and manage your move with ease.'}
              </p>
            </div>

            <div className="auth-illustration-wrap">
              <img 
                src="/images/signin_cat_illustration.jpg" 
                alt="MoveMate relaxed moving with sleeping cat and house plant" 
                className="auth-cat-img"
              />
            </div>
          </div>

          {/* Right Panel */}
          <div className="auth-right-panel">
            
            {/* Top Tab switchers */}
            {!applicationSubmitted && (
              <div className="auth-tabs-row">
                <button 
                  type="button" 
                  className={`auth-tab-btn ${activeTab === 'signin' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab('signin');
                    setApplicationSubmitted(false);
                  }}
                >
                  Sign in
                </button>
                <button 
                  type="button" 
                  className={`auth-tab-btn ${activeTab === 'signup' ? 'active' : ''}`}
                  onClick={() => setActiveTab('signup')}
                >
                  Create account
                </button>
              </div>
            )}

            {/* Role Switcher (Customer vs Coordinator) */}
            {!applicationSubmitted && (
              <div className="form-group role-selector-group">
                <label className="form-sublabel">I am a</label>
                <div className="role-cards-row">
                  <button
                    type="button"
                    className={`role-select-card ${role === 'customer' ? 'active' : ''}`}
                    onClick={() => {
                      setRole('customer');
                      setCoordStep(1);
                    }}
                  >
                    <div className="role-card-icon">
                      <User size={20} />
                    </div>
                    <div className="role-card-text">
                      <strong>Customer</strong>
                      <span>I want to move</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`role-select-card ${role === 'coordinator' ? 'active' : ''}`}
                    onClick={() => {
                      setRole('coordinator');
                    }}
                  >
                    <div className="role-card-icon">
                      <Users size={20} />
                    </div>
                    <div className="role-card-text">
                      <strong>Coordinator</strong>
                      <span>I provide moving services</span>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================
                VIEW 1: SIGN IN (Customer & Coordinator)
                ============================================================ */}
            {activeTab === 'signin' && !applicationSubmitted && (
              <form onSubmit={handleSignIn} className="auth-form animate-fade-in">
                <div className="form-group">
                  <label className="form-sublabel">
                    {role === 'coordinator' ? 'Coordinator Email or Mobile' : 'Email address or Mobile'}
                  </label>
                  <div className="input-with-icon-wrap">
                    <Mail size={18} className="input-inner-icon" />
                    <input 
                      type="text" 
                      className="form-input with-icon"
                      placeholder={role === 'coordinator' ? 'coordinator@example.com' : 'you@example.com'} 
                      required 
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-sublabel">Password</label>
                  <div className="input-with-icon-wrap">
                    <Lock size={18} className="input-inner-icon" />
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      className="form-input with-icon with-right-btn"
                      placeholder="Enter your password" 
                      required 
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                    <button 
                      type="button" 
                      className="password-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="terms-checkbox-wrap">
                  <label className="checkbox-custom-label">
                    <input type="checkbox" defaultChecked />
                    <span className="checkbox-text">
                      Keep me signed in on this device
                    </span>
                  </label>
                </div>

                <button type="submit" className="btn-auth-submit">
                  <span>Sign in as {role === 'coordinator' ? 'Coordinator' : 'Customer'}</span>
                  <ArrowRight size={18} />
                </button>

                <div className="auth-switch-prompt">
                  <p>
                    New to MoveMate?{' '}
                    <button 
                      type="button" 
                      className="link-switch-tab"
                      onClick={() => setActiveTab('signup')}
                    >
                      {role === 'coordinator' ? 'Apply as Coordinator' : 'Create an account'}
                    </button>
                  </p>
                </div>
              </form>
            )}

            {/* ============================================================
                VIEW 2: CUSTOMER SIGNUP (Short & Streamlined)
                ============================================================ */}
            {activeTab === 'signup' && role === 'customer' && !applicationSubmitted && (
              <form onSubmit={handleCustomerSignup} className="auth-form animate-fade-in">
                <div className="form-note-banner">
                  <span className="font-semibold">Quick 60-Second Signup:</span> Addresses, moving date, and inventory will be collected when booking your move.
                </div>

                {/* 1. Full Name (Required) */}
                <div className="form-group">
                  <label className="form-sublabel">
                    Full name <span className="req-star">*</span>
                  </label>
                  <div className="input-with-icon-wrap">
                    <User size={18} className="input-inner-icon" />
                    <input 
                      type="text" 
                      className="form-input with-icon"
                      placeholder="e.g. Pooja Iyer" 
                      required 
                      value={custName}
                      onChange={(e) => setCustName(e.target.value)}
                    />
                  </div>
                </div>

                {/* 2. Mobile Number with OTP Verification (Required) */}
                <div className="form-group">
                  <label className="form-sublabel">
                    Mobile number <span className="req-star">*</span> (with OTP Verification)
                  </label>
                  <div className="phone-otp-row">
                    <div className="input-with-icon-wrap flex-1">
                      <Phone size={18} className="input-inner-icon" />
                      <input 
                        type="tel" 
                        className="form-input with-icon"
                        placeholder="10-digit mobile number" 
                        required 
                        disabled={custPhoneVerified}
                        value={custPhone}
                        onChange={(e) => setCustPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      />
                    </div>
                    {!custPhoneVerified ? (
                      <button 
                        type="button" 
                        className="btn-otp-action"
                        onClick={handleSendCustOtp}
                      >
                        {custOtpSent ? 'Resend OTP' : 'Send OTP'}
                      </button>
                    ) : (
                      <div className="verified-badge-pill">
                        <CheckCircle2 size={16} />
                        <span>Verified</span>
                      </div>
                    )}
                  </div>

                  {custOtpSent && !custPhoneVerified && (
                    <div className="otp-verification-subrow animate-fade-in">
                      <input 
                        type="text" 
                        className="form-input otp-code-input"
                        placeholder="4-digit OTP (1234)"
                        maxLength="4"
                        value={custPhoneOtp}
                        onChange={(e) => setCustPhoneOtp(e.target.value)}
                      />
                      <button 
                        type="button" 
                        className="btn-verify-otp"
                        onClick={handleVerifyCustOtp}
                      >
                        Verify OTP
                      </button>
                    </div>
                  )}
                </div>

                {/* 3. Email Address (Optional initially) */}
                <div className="form-group">
                  <label className="form-sublabel">
                    Email address <span className="opt-tag">(Optional initially)</span>
                  </label>
                  <div className="input-with-icon-wrap">
                    <Mail size={18} className="input-inner-icon" />
                    <input 
                      type="email" 
                      className="form-input with-icon"
                      placeholder="you@example.com" 
                      value={custEmail}
                      onChange={(e) => setCustEmail(e.target.value)}
                    />
                  </div>
                </div>

                {/* 4. Password & Confirm Password (Required) */}
                <div className="two-col-inputs">
                  <div className="form-group">
                    <label className="form-sublabel">
                      Password <span className="req-star">*</span>
                    </label>
                    <div className="input-with-icon-wrap">
                      <Lock size={18} className="input-inner-icon" />
                      <input 
                        type="password" 
                        className="form-input with-icon"
                        placeholder="Create password" 
                        required 
                        value={custPassword}
                        onChange={(e) => setCustPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-sublabel">
                      Confirm password <span className="req-star">*</span>
                    </label>
                    <div className="input-with-icon-wrap">
                      <Lock size={18} className="input-inner-icon" />
                      <input 
                        type="password" 
                        className="form-input with-icon"
                        placeholder="Confirm password" 
                        required 
                        value={custConfirmPassword}
                        onChange={(e) => setCustConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* 5. Separate Terms & Privacy Consent Checkbox (Records agreement) */}
                <div className="terms-checkbox-wrap">
                  <label className="checkbox-custom-label">
                    <input 
                      type="checkbox" 
                      checked={custAgreeTerms}
                      onChange={(e) => setCustAgreeTerms(e.target.checked)}
                      required
                    />
                    <span className="checkbox-text">
                      I accept the <a href="#terms" onClick={(e) => e.preventDefault()}>Terms of Service</a> and acknowledge the <a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy Notice</a>.
                    </span>
                  </label>
                  <span className="consent-recording-hint">
                    Checking this records your agreement to platform terms and privacy handling.
                  </span>
                </div>

                <button type="submit" className="btn-auth-submit">
                  <span>Create Customer Account</span>
                  <ArrowRight size={18} />
                </button>

                <div className="auth-switch-prompt">
                  <p>
                    Already have an account?{' '}
                    <button 
                      type="button" 
                      className="link-switch-tab"
                      onClick={() => setActiveTab('signin')}
                    >
                      Sign in
                    </button>
                  </p>
                </div>
              </form>
            )}

            {/* ============================================================
                VIEW 3: COORDINATOR APPLICATION (3-Step Flow + Verification)
                ============================================================ */}
            {activeTab === 'signup' && role === 'coordinator' && !applicationSubmitted && (
              <div className="coordinator-wizard-flow animate-fade-in">
                
                {/* 3-Step Stepper Bar */}
                <div className="coord-mini-stepper">
                  <div className={`coord-step-pill ${coordStep >= 1 ? 'active' : ''}`}>
                    <span className="coord-step-num">1</span>
                    <span>Account</span>
                  </div>
                  <div className={`coord-step-line ${coordStep > 1 ? 'filled' : ''}`}></div>
                  
                  <div className={`coord-step-pill ${coordStep >= 2 ? 'active' : ''}`}>
                    <span className="coord-step-num">2</span>
                    <span>Work Profile</span>
                  </div>
                  <div className={`coord-step-line ${coordStep > 2 ? 'filled' : ''}`}></div>
                  
                  <div className={`coord-step-pill ${coordStep >= 3 ? 'active' : ''}`}>
                    <span className="coord-step-num">3</span>
                    <span>Verification</span>
                  </div>
                </div>

                {/* Coordinator Step 1: Account Information */}
                {coordStep === 1 && (
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (!coordPhoneVerified) {
                      alert('Please verify mobile number with OTP.');
                      return;
                    }
                    if (coordPassword !== coordConfirmPassword) {
                      alert('Passwords do not match.');
                      return;
                    }
                    setCoordStep(2);
                  }} className="coord-step-content animate-fade-in">
                    
                    <h3 className="coord-step-title">Step 1: Legal Account Information</h3>
                    <p className="coord-step-subtitle">Enter your legal details as registered on government identity documents.</p>

                    <div className="form-group">
                      <label className="form-sublabel">Full legal name <span className="req-star">*</span></label>
                      <div className="input-with-icon-wrap">
                        <User size={18} className="input-inner-icon" />
                        <input 
                          type="text" 
                          className="form-input with-icon"
                          placeholder="Legal name on identity document"
                          required
                          value={coordName}
                          onChange={(e) => setCoordName(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-sublabel">Mobile number with OTP <span className="req-star">*</span></label>
                      <div className="phone-otp-row">
                        <div className="input-with-icon-wrap flex-1">
                          <Phone size={18} className="input-inner-icon" />
                          <input 
                            type="tel" 
                            className="form-input with-icon"
                            placeholder="10-digit mobile number"
                            required
                            disabled={coordPhoneVerified}
                            value={coordPhone}
                            onChange={(e) => setCoordPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          />
                        </div>
                        {!coordPhoneVerified ? (
                          <button type="button" className="btn-otp-action" onClick={handleSendCoordOtp}>
                            {coordOtpSent ? 'Resend OTP' : 'Send OTP'}
                          </button>
                        ) : (
                          <div className="verified-badge-pill">
                            <CheckCircle2 size={16} />
                            <span>Verified</span>
                          </div>
                        )}
                      </div>

                      {coordOtpSent && !coordPhoneVerified && (
                        <div className="otp-verification-subrow animate-fade-in">
                          <input 
                            type="text" 
                            className="form-input otp-code-input"
                            placeholder="4-digit OTP (1234)"
                            maxLength="4"
                            value={coordPhoneOtp}
                            onChange={(e) => setCoordPhoneOtp(e.target.value)}
                          />
                          <button type="button" className="btn-verify-otp" onClick={handleVerifyCoordOtp}>
                            Verify
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-sublabel">Coordinator email address <span className="req-star">*</span></label>
                      <div className="input-with-icon-wrap">
                        <Mail size={18} className="input-inner-icon" />
                        <input 
                          type="email" 
                          className="form-input with-icon"
                          placeholder="coordinator@example.com"
                          required
                          value={coordEmail}
                          onChange={(e) => setCoordEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="two-col-inputs">
                      <div className="form-group">
                        <label className="form-sublabel">Password <span className="req-star">*</span></label>
                        <div className="input-with-icon-wrap">
                          <Lock size={18} className="input-inner-icon" />
                          <input 
                            type="password" 
                            className="form-input with-icon"
                            placeholder="Create password"
                            required
                            value={coordPassword}
                            onChange={(e) => setCoordPassword(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-sublabel">Confirm password <span className="req-star">*</span></label>
                        <div className="input-with-icon-wrap">
                          <Lock size={18} className="input-inner-icon" />
                          <input 
                            type="password" 
                            className="form-input with-icon"
                            placeholder="Confirm password"
                            required
                            value={coordConfirmPassword}
                            onChange={(e) => setCoordConfirmPassword(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="wizard-nav-actions right-align">
                      <button type="submit" className="btn-primary-pill">
                        Next: Work Profile <ArrowRight size={18} />
                      </button>
                    </div>
                  </form>
                )}

                {/* Coordinator Step 2: Work Profile */}
                {coordStep === 2 && (
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    setCoordStep(3);
                  }} className="coord-step-content animate-fade-in">
                    
                    <h3 className="coord-step-title">Step 2: Relocation Work Profile</h3>
                    <p className="coord-step-subtitle">Tell us about your moving operations, service regions and experience.</p>

                    {/* Entity Type: Individual vs Company */}
                    <div className="form-group">
                      <label className="form-sublabel">Operating structure</label>
                      <div className="entity-type-toggle">
                        <button
                          type="button"
                          className={`entity-pill ${coordEntityType === 'individual' ? 'active' : ''}`}
                          onClick={() => setCoordEntityType('individual')}
                        >
                          <User size={16} /> Individual Coordinator
                        </button>
                        <button
                          type="button"
                          className={`entity-pill ${coordEntityType === 'company' ? 'active' : ''}`}
                          onClick={() => setCoordEntityType('company')}
                        >
                          <Building2 size={16} /> Registered Moving Agency / Company
                        </button>
                      </div>
                    </div>

                    {coordEntityType === 'company' && (
                      <div className="form-group animate-fade-in">
                        <label className="form-sublabel">Registered company / agency name <span className="req-star">*</span></label>
                        <input 
                          type="text" 
                          className="form-input"
                          placeholder="e.g. Pune City Movers & Logistics Pvt Ltd"
                          required
                          value={coordCompanyName}
                          onChange={(e) => setCoordCompanyName(e.target.value)}
                        />
                      </div>
                    )}

                    {/* City & Service Areas */}
                    <div className="two-col-inputs">
                      <div className="form-group">
                        <label className="form-sublabel">Primary operating city</label>
                        <select 
                          className="form-select"
                          value={coordCity}
                          onChange={(e) => setCoordCity(e.target.value)}
                        >
                          <option value="Pune">Pune</option>
                          <option value="Mumbai">Mumbai</option>
                          <option value="Bengaluru">Bengaluru</option>
                          <option value="Delhi NCR">Delhi NCR</option>
                          <option value="Hyderabad">Hyderabad</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-sublabel">Years of moving experience</label>
                        <select 
                          className="form-select"
                          value={coordExperience}
                          onChange={(e) => setCoordExperience(e.target.value)}
                        >
                          <option value="1-2">1 - 2 Years (50+ moves)</option>
                          <option value="3-5">3 - 5 Years (250+ moves)</option>
                          <option value="5+">5+ Years (500+ moves)</option>
                        </select>
                      </div>
                    </div>

                    {/* Languages Spoken */}
                    <div className="form-group">
                      <label className="form-sublabel">Languages spoken (Select all that apply)</label>
                      <div className="languages-chip-grid">
                        {['English', 'Hindi', 'Marathi', 'Kannada', 'Tamil', 'Telugu', 'Gujarati'].map(lang => (
                          <button
                            key={lang}
                            type="button"
                            className={`lang-chip ${selectedLanguages.includes(lang) ? 'active' : ''}`}
                            onClick={() => toggleLanguage(lang)}
                          >
                            {selectedLanguages.includes(lang) && <Check size={13} />}
                            {lang}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="wizard-nav-actions space-between">
                      <button type="button" className="btn-outline-pill" onClick={() => setCoordStep(1)}>
                        <ArrowLeft size={18} /> Back
                      </button>
                      <button type="submit" className="btn-primary-pill">
                        Next: Verification & Consent <ArrowRight size={18} />
                      </button>
                    </div>
                  </form>
                )}

                {/* Coordinator Step 3: Verification & Conduct Policy */}
                {coordStep === 3 && (
                  <form onSubmit={handleCoordinatorSubmit} className="coord-step-content animate-fade-in">
                    <h3 className="coord-step-title">Step 3: Verification, Reference & Policy</h3>
                    <p className="coord-step-subtitle">Submit identity for offline verification and accept coordinator conduct rules.</p>

                    {/* 1. Identity Document Selection with Viable Alternatives & UIDAI Guidance */}
                    <div className="verification-box">
                      <div className="verif-box-header">
                        <ShieldCheck size={20} className="text-primary" />
                        <div>
                          <strong>1. Government Identity Verification</strong>
                          <span className="verif-sub-note">Choose your preferred valid government document.</span>
                        </div>
                      </div>

                      <div className="id-type-options-row">
                        {[
                          { id: 'pan', label: 'PAN Card' },
                          { id: 'dl', label: 'Driving License' },
                          { id: 'passport', label: 'Passport' },
                          { id: 'voter', label: 'Voter ID' },
                          { id: 'aadhaar_offline', label: 'Aadhaar (Offline XML / e-Aadhaar)' }
                        ].map(doc => (
                          <button
                            key={doc.id}
                            type="button"
                            className={`id-type-btn ${idType === doc.id ? 'active' : ''}`}
                            onClick={() => setIdType(doc.id)}
                          >
                            {doc.label}
                          </button>
                        ))}
                      </div>

                      {/* Explicit UIDAI Compliant Privacy & Purpose Notice */}
                      <div className="privacy-purpose-notice">
                        <div className="notice-title">
                          <Lock size={14} />
                          <span>Purpose of Document Collection & Privacy Notice</span>
                        </div>
                        <p>
                          Identity documents are collected strictly for offline background verification before moving job assignment. Documents are stored in an encrypted vault with restricted access. <strong>Identity documents are never shared with unauthorized third parties or unverified AI services.</strong> Viable non-Aadhaar alternatives (PAN, Driving License, Passport, Voter ID) are equally accepted.
                        </p>
                      </div>

                      <div className="two-col-inputs mt-3">
                        <div className="form-group">
                          <label className="form-sublabel">Document ID number <span className="req-star">*</span></label>
                          <input 
                            type="text" 
                            className="form-input"
                            placeholder="Enter document number"
                            required
                            value={idNumber}
                            onChange={(e) => setIdNumber(e.target.value)}
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-sublabel">Upload clear photo/scan <span className="req-star">*</span></label>
                          <div 
                            className={`upload-drop-card ${idFileUploaded ? 'uploaded' : ''}`}
                            onClick={() => setIdFileUploaded(true)}
                          >
                            <Upload size={18} />
                            <span>{idFileUploaded ? '✓ Document Attached (id_document.pdf)' : 'Click to attach document'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 2. Address Verification */}
                    <div className="verification-box">
                      <div className="verif-box-header">
                        <MapPin size={20} className="text-primary" />
                        <div>
                          <strong>2. Address Verification Proof</strong>
                          <span className="verif-sub-note">Utility bill, registered rental agreement, or bank statement.</span>
                        </div>
                      </div>

                      <div className="two-col-inputs">
                        <div className="form-group">
                          <label className="form-sublabel">Proof type</label>
                          <select 
                            className="form-select"
                            value={addressProofType}
                            onChange={(e) => setAddressProofType(e.target.value)}
                          >
                            <option value="utility_bill">Electricity / Water Utility Bill</option>
                            <option value="rental_agreement">Registered Rental Agreement</option>
                            <option value="bank_statement">Bank Account Statement</option>
                            <option value="passport_address">Passport Address Page</option>
                          </select>
                        </div>

                        <div className="form-group">
                          <label className="form-sublabel">Upload address proof <span className="req-star">*</span></label>
                          <div 
                            className={`upload-drop-card ${addressFileUploaded ? 'uploaded' : ''}`}
                            onClick={() => setAddressFileUploaded(true)}
                          >
                            <Upload size={18} />
                            <span>{addressFileUploaded ? '✓ Proof Attached (address_proof.pdf)' : 'Click to attach address proof'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 3. Professional Reference Contact */}
                    <div className="verification-box">
                      <div className="verif-box-header">
                        <FileCheck size={20} className="text-primary" />
                        <div>
                          <strong>3. Professional Reference Contact</strong>
                          <span className="verif-sub-note">Past employer, client, or logistics supervisor who can vouch for your work.</span>
                        </div>
                      </div>

                      <div className="two-col-inputs">
                        <div className="form-group">
                          <label className="form-sublabel">Reference name <span className="req-star">*</span></label>
                          <input 
                            type="text" 
                            className="form-input"
                            placeholder="e.g. Anand Kulkarni"
                            required
                            value={refName}
                            onChange={(e) => setRefName(e.target.value)}
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-sublabel">Reference mobile number <span className="req-star">*</span></label>
                          <input 
                            type="tel" 
                            className="form-input"
                            placeholder="10-digit mobile number"
                            required
                            value={refPhone}
                            onChange={(e) => setRefPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          />
                        </div>
                      </div>

                      <div className="terms-checkbox-wrap">
                        <label className="checkbox-custom-label">
                          <input 
                            type="checkbox" 
                            checked={refConsentChecked}
                            onChange={(e) => setRefConsentChecked(e.target.checked)}
                            required
                          />
                          <span className="checkbox-text">
                            I confirm that I have obtained explicit permission from this reference to share their contact details for verification.
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* 4. Conduct Policy Summary & Separate Unchecked Checkboxes */}
                    <div className="conduct-policy-summary-box">
                      <div className="conduct-header">
                        <FileText size={20} className="text-primary" />
                        <div>
                          <strong>MoveMate Coordinator Conduct Policy Overview</strong>
                          <button 
                            type="button" 
                            className="btn-view-full-policy"
                            onClick={() => setShowPolicyModal(true)}
                          >
                            Read Full Policy Details
                          </button>
                        </div>
                      </div>

                      <ul className="conduct-rules-list">
                        <li><strong>Inventory & Handling:</strong> Strictly follow confirmed inventory, fragility tags, and handling guidelines.</li>
                        <li><strong>Condition Logs:</strong> Record and timestamp item conditions at pickup and destination before signing off.</li>
                        <li><strong>Authorized Crew & Vehicles:</strong> Use only registered, assigned crew and dedicated container vehicles; obtain approval for any substitution.</li>
                        <li><strong>Transparent Pricing:</strong> Never request unapproved extra cash/charges without customer and platform authorization.</li>
                        <li><strong>Prompt Incident Reporting:</strong> Report suspected theft, missing items, or damage immediately to MoveMate trust & safety.</li>
                        <li><strong>Customer Privacy:</strong> Protect customer addresses, phone numbers, and home photos; never retain personal data.</li>
                        <li><strong>Fair Liability:</strong> Loss or damage is reviewed transparently based on photographic evidence (no arbitrary fault assumption).</li>
                      </ul>

                      {/* Separate Unchecked Checkboxes */}
                      <div className="separate-checkboxes-block">
                        <label className="checkbox-custom-label">
                          <input 
                            type="checkbox" 
                            checked={agreeConductPolicy}
                            onChange={(e) => setAgreeConductPolicy(e.target.checked)}
                            required
                          />
                          <span className="checkbox-text">
                            <strong>I agree to the Coordinator Service Agreement and Conduct Policy.</strong>
                          </span>
                        </label>

                        <label className="checkbox-custom-label mt-2">
                          <input 
                            type="checkbox" 
                            checked={agreeVerificationChecks}
                            onChange={(e) => setAgreeVerificationChecks(e.target.checked)}
                            required
                          />
                          <span className="checkbox-text">
                            <strong>I consent to the identity, address, and reference checks described in the notice above.</strong>
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="wizard-nav-actions space-between mt-4">
                      <button type="button" className="btn-outline-pill" onClick={() => setCoordStep(2)}>
                        <ArrowLeft size={18} /> Back
                      </button>
                      <button type="submit" className="btn-auth-submit-coord">
                        <span>Submit Application for Admin Review</span>
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* ============================================================
                VIEW 4: POST-SUBMISSION STATUS & ADMIN APPROVAL FLOW
                ============================================================ */}
            {applicationSubmitted && (
              <div className="application-status-view animate-fade-in">
                <div className="status-badge-in-review">
                  <Clock size={16} />
                  <span>Application Status: Under Admin Review</span>
                </div>

                <h2 className="status-main-title">Coordinator Application Submitted</h2>
                <p className="status-lead">
                  Thank you, <strong>{coordName || 'Coordinator'}</strong>. Your application <strong className="app-id-tag">{applicationId}</strong> has been received by our compliance team.
                </p>

                {/* Status Timeline Flow */}
                <div className="admin-flow-timeline">
                  <div className="flow-step-item completed">
                    <div className="flow-step-dot">✓</div>
                    <div className="flow-step-text">
                      <strong>1. Application Submitted</strong>
                      <span>Account credentials & work profile registered</span>
                    </div>
                  </div>

                  <div className="flow-step-item in-progress">
                    <div className="flow-step-dot">2</div>
                    <div className="flow-step-text">
                      <strong>2. Admin Document & Reference Review</strong>
                      <span>Identity, address verification, and reference check underway (24–48 hrs)</span>
                    </div>
                  </div>

                  <div className="flow-step-item pending">
                    <div className="flow-step-dot">3</div>
                    <div className="flow-step-text">
                      <strong>3. Onboarding Decision: Approved / Needs Changes</strong>
                      <span>Only approved coordinators receive moving jobs on MoveMate</span>
                    </div>
                  </div>
                </div>

                {/* Fact-Based Verification Badges Explanation */}
                <div className="verification-badges-explanation-card">
                  <h4>Factual Badges Earned Upon Successful Checks:</h4>
                  <div className="badges-earned-row">
                    <div className="badge-preview-item">
                      <CheckCircle2 size={16} className="text-primary" />
                      <div>
                        <strong>Identity Checked</strong>
                        <span>Verified with {idType.toUpperCase()}</span>
                      </div>
                    </div>

                    <div className="badge-preview-item">
                      <CheckCircle2 size={16} className="text-primary" />
                      <div>
                        <strong>Address Verified</strong>
                        <span>Verified with utility proof</span>
                      </div>
                    </div>

                    <div className="badge-preview-item">
                      <CheckCircle2 size={16} className="text-primary" />
                      <div>
                        <strong>Reference Confirmed</strong>
                        <span>Supervisory check completed</span>
                      </div>
                    </div>
                  </div>
                  <p className="badge-disclaimer-note">
                    *MoveMate displays specific, fact-based verification badges once respective checks conclude, rather than general claims of absolute trustworthiness.
                  </p>
                </div>

                {/* Important Onboarding Notes */}
                <div className="onboarding-notes-box">
                  <div className="note-row">
                    <AlertCircle size={18} className="text-primary flex-shrink-0" />
                    <span><strong>Payout Information:</strong> Bank account & payout details will be collected securely only after onboarding approval when payments are due.</span>
                  </div>
                  <div className="note-row">
                    <AlertCircle size={18} className="text-primary flex-shrink-0" />
                    <span><strong>Fleet & Crew Submission:</strong> If you provide dedicated vehicles or mover crews, fleet forms will be available in your approved Coordinator Dashboard.</span>
                  </div>
                </div>

                <div className="status-actions-row">
                  <button 
                    type="button" 
                    className="btn-primary-pill"
                    onClick={onNavigateHome}
                  >
                    Return to Homepage
                  </button>
                  <button 
                    type="button" 
                    className="btn-outline-pill"
                    onClick={() => {
                      setActiveTab('signin');
                      setApplicationSubmitted(false);
                    }}
                  >
                    Sign in to check status
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      {/* Full Conduct Policy Modal */}
      {showPolicyModal && (
        <div className="modal-overlay" onClick={() => setShowPolicyModal(false)}>
          <div className="modal-container conduct-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-wrap">
                <div className="modal-badge">
                  <ShieldCheck size={14} />
                  <span>Platform Standards</span>
                </div>
                <h2>MoveMate Coordinator Conduct Policy & Service Rules</h2>
              </div>
              <button 
                type="button" 
                className="modal-close-btn" 
                onClick={() => setShowPolicyModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="conduct-modal-body">
              <div className="policy-clause">
                <h4>1. Inventory & Handling Protocol</h4>
                <p>Coordinators and assigned crews must adhere strictly to the customer's confirmed inventory and room placement plan. Fragile tagged items require double-layer bubble wrap and corner edge guards.</p>
              </div>

              <div className="policy-clause">
                <h4>2. Timestamped Item Condition Records</h4>
                <p>Coordinators must inspect and document existing scratches, dents, or pre-existing flaws with photos at the pickup location before loading, and re-verify condition upon unloading at the destination.</p>
              </div>

              <div className="policy-clause">
                <h4>3. Assigned Crew & Vehicle Substitutions</h4>
                <p>Only vetted, background-checked personnel and platform-registered weatherproof vehicles are permitted. Any emergency replacement requires advance written approval through MoveMate dispatch.</p>
              </div>

              <div className="policy-clause">
                <h4>4. Customer Pre-Approval for Extra Services</h4>
                <p>No auxiliary charges (such as long-carry, additional stairs, or special crating) may be levied without explicit customer agreement and digital invoice logging in the MoveMate portal.</p>
              </div>

              <div className="policy-clause">
                <h4>5. Immediate Incident & Safety Reporting</h4>
                <p>Any damage, missing carton, vehicular breakdown, or suspected misconduct must be reported to MoveMate Trust & Safety within 30 minutes of occurrence.</p>
              </div>

              <div className="policy-clause">
                <h4>6. Confidentiality & Data Protection</h4>
                <p>Customer addresses, contact details, apartment floor access codes, and photos must be treated with strictest confidentiality and deleted upon move completion.</p>
              </div>

              <div className="policy-clause">
                <h4>7. Fair Liability Standards</h4>
                <p>Damage claims are evaluated through photo evidence, pickup condition logs, and transit records. Liability is determined based on objective facts rather than automated fault attribution.</p>
              </div>

              <button 
                type="button" 
                className="btn-primary-pill w-full mt-3"
                onClick={() => setShowPolicyModal(false)}
              >
                I Understand and Agree to These Conduct Standards
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
