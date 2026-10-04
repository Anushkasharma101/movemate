import React, { useState } from 'react';
import { X, Phone, Mail, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function SignInModal({ isOpen, onClose }) {
  const [authMode, setAuthMode] = useState('phone'); // 'phone' | 'email'
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState(['', '', '', '']);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (phone.length >= 10) {
      setOtpSent(true);
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setTimeout(() => {
      setIsLoggedIn(false);
      setOtpSent(false);
      setPhone('');
      onClose();
    }, 2000);
  };

  const handleEmailLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      setIsLoggedIn(true);
      setTimeout(() => {
        setIsLoggedIn(false);
        onClose();
      }, 2000);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container signin-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="signin-brand-header">
            <img src="/images/single_color_mark.png" alt="MoveMate" className="signin-logo" />
            <h3>Welcome to MoveMate</h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {isLoggedIn ? (
          <div className="signin-success-view">
            <CheckCircle2 size={54} className="text-primary" />
            <h3>Signed In Successfully!</h3>
            <p>Welcome back to your MoveMate dashboard.</p>
          </div>
        ) : (
          <div className="signin-body">
            <div className="signin-tabs">
              <button 
                type="button" 
                className={`signin-tab ${authMode === 'phone' ? 'active' : ''}`}
                onClick={() => setAuthMode('phone')}
              >
                <Phone size={16} /> Phone OTP
              </button>
              <button 
                type="button" 
                className={`signin-tab ${authMode === 'email' ? 'active' : ''}`}
                onClick={() => setAuthMode('email')}
              >
                <Mail size={16} /> Email & Password
              </button>
            </div>

            {authMode === 'phone' ? (
              !otpSent ? (
                <form onSubmit={handleSendOtp} className="signin-form">
                  <p className="signin-help">
                    Enter your mobile number to view active moves, quotes, and driver GPS.
                  </p>
                  <div className="form-group">
                    <label className="form-sublabel">Mobile Number</label>
                    <div className="phone-input-wrap">
                      <span className="phone-prefix">+91</span>
                      <input 
                        type="tel"
                        className="form-input phone-input"
                        placeholder="10-digit number"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn-primary-pill w-full">
                    Send OTP Verification <ArrowRight size={18} />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="signin-form">
                  <p className="signin-help">
                    Enter the 4-digit code sent to <strong>+91 {phone}</strong>
                  </p>
                  <div className="otp-input-row">
                    {[0, 1, 2, 3].map((idx) => (
                      <input
                        key={idx}
                        type="text"
                        maxLength="1"
                        className="otp-digit"
                        value={otpCode[idx] || ''}
                        onChange={(e) => {
                          const newOtp = [...otpCode];
                          newOtp[idx] = e.target.value;
                          setOtpCode(newOtp);
                          if (e.target.value && e.target.nextSibling) {
                            e.target.nextSibling.focus();
                          }
                        }}
                      />
                    ))}
                  </div>
                  <button type="submit" className="btn-primary-pill w-full mt-3">
                    Verify & Continue <ArrowRight size={18} />
                  </button>
                  <button 
                    type="button" 
                    className="btn-link-resend"
                    onClick={() => setOtpSent(false)}
                  >
                    Change Phone Number
                  </button>
                </form>
              )
            ) : (
              <form onSubmit={handleEmailLogin} className="signin-form">
                <div className="form-group">
                  <label className="form-sublabel">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-sublabel">Password</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Enter your password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn-primary-pill w-full">
                  Sign In <ArrowRight size={18} />
                </button>
              </form>
            )}

            <div className="signin-footer-note">
              <ShieldCheck size={14} />
              <span>Your personal info is encrypted & 100% confidential.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
