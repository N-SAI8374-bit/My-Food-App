'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFood } from '@/context/FoodContext';
import Toast from '@/components/Toast';
import {
  MailIcon,
  LockIcon,
  UserIcon,
  PhoneIcon,
  EyeIcon,
  EyeOffIcon,
  ArrowLeftIcon,
  GoogleIcon,
  ShieldCheckIcon,
  StarIcon,
  SunIcon,
  MoonIcon,
  CloseIcon,
  CheckIcon,
} from '@/components/Icons';

export default function LoginPage() {
  const router = useRouter();
  const { user, loginUser, showToast, theme, toggleTheme } = useFood();

  // Mode: 'signin' or 'signup'
  const [authMode, setAuthMode] = useState('signin');

  // Sign In State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Sign Up State
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupAddress, setSignupAddress] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  // Loading & error status
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Forgot password modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  // Handle Sign In submission
  const handleSignIn = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!loginEmail || !loginPassword) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          email: loginEmail,
          password: loginPassword,
        }),
      });

      const data = await res.json();

      if (data.success && data.user) {
        loginUser(data.user);
        router.push('/');
      } else {
        setErrorMessage(data.message || 'Invalid credentials. Please try again.');
        showToast(data.message || 'Sign in failed', 'error');
      }
    } catch (err) {
      setErrorMessage('Network error during sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Sign Up submission
  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!signupName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!signupEmail.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (signupPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'signup',
          name: signupName,
          email: signupEmail,
          phone: signupPhone,
          address: signupAddress,
          password: signupPassword,
        }),
      });

      const data = await res.json();

      if (data.success && data.user) {
        loginUser(data.user);
        router.push('/');
      } else {
        setErrorMessage(data.message || 'Registration failed. Try again.');
        showToast(data.message || 'Registration failed', 'error');
      }
    } catch (err) {
      setErrorMessage('Network error during sign up. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick 1-click Demo Accounts
  const handleQuickDemoLogin = (email, password) => {
    setAuthMode('signin');
    setLoginEmail(email);
    setLoginPassword(password);
    setErrorMessage('');
  };

  // Social / Guest sign in simulation
  const handleSocialLogin = (provider) => {
    setIsLoading(true);
    setTimeout(() => {
      const dummyUser = {
        id: `usr-${provider.toLowerCase()}-${Date.now()}`,
        name: `${provider} Foodie`,
        email: `${provider.toLowerCase()}.user@flavorfleet.com`,
        phone: '+91 98888 77777',
        address: 'Downtown Metro, Boulevard Heights',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      };
      loginUser(dummyUser);
      setIsLoading(false);
      router.push('/');
    }, 800);
  };

  // Forgot password request
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail) return;

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'forgot-password',
          email: forgotEmail,
        }),
      });
      const data = await res.json();
      setForgotSubmitted(true);
      showToast(data.message);
    } catch (err) {
      showToast('Error requesting password reset', 'error');
    }
  };

  return (
    <div className="login-page-root">
      <Toast />

      {/* Top Navigation Strip */}
      <header className="login-top-bar">
        <div className="login-top-container">
          <Link href="/" className="back-home-link">
            <ArrowLeftIcon size={18} />
            <span>Back to Menu</span>
          </Link>

          <Link href="/" className="login-brand-logo">
            <span className="brand-logo-icon">🍔</span>
            <span className="brand-title">Flavor<span className="brand-accent">Fleet</span></span>
          </Link>

          <button
            className="nav-icon-btn theme-btn"
            onClick={toggleTheme}
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? <MoonIcon size={20} /> : <SunIcon size={20} />}
          </button>
        </div>
      </header>

      {/* Main Login Showcase & Form Container */}
      <main className="login-main-container">
        <div className="login-card-wrapper">
          {/* Left Column: Brand Hero & Benefits Showcase */}
          <aside className="login-hero-panel">
            <div className="login-hero-overlay"></div>
            <div className="login-hero-content">
              <div className="login-hero-badge">
                <span>🌟 Premium Food Experience</span>
              </div>
              <h2 className="login-hero-title">
                Savor Every Craving, Delivered Fresh & Hot.
              </h2>
              <p className="login-hero-sub">
                Sign in to your FlavorFleet account to unlock express 25-minute delivery, exclusive discounts, and live delivery rider tracking.
              </p>

              {/* Highlights List */}
              <div className="login-features-list">
                <div className="login-feature-item">
                  <div className="feature-icon-circle">⚡</div>
                  <div>
                    <h4 className="feature-item-title">Ultra-Fast 25-Min Delivery</h4>
                    <p className="feature-item-desc">From our master chefs right to your front door</p>
                  </div>
                </div>

                <div className="login-feature-item">
                  <div className="feature-icon-circle">🎁</div>
                  <div>
                    <h4 className="feature-item-title">VIP Member Coupons</h4>
                    <p className="feature-item-desc">Unlock codes like FEAST20 for up to ₹150 OFF</p>
                  </div>
                </div>

                <div className="login-feature-item">
                  <div className="feature-icon-circle">🛵</div>
                  <div>
                    <h4 className="feature-item-title">Real-Time GPS Order Tracker</h4>
                    <p className="feature-item-desc">Watch your delivery rider on the interactive live map</p>
                  </div>
                </div>
              </div>

              {/* Social Proof */}
              <div className="login-social-proof">
                <div className="proof-avatars-row">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80" alt="Customer" className="proof-avatar" />
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80" alt="Customer" className="proof-avatar" />
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80" alt="Customer" className="proof-avatar" />
                </div>
                <div className="proof-text-group">
                  <div className="proof-stars">
                    {[1, 2, 3, 4, 5].map(i => (
                      <StarIcon key={i} size={14} />
                    ))}
                  </div>
                  <span className="proof-subtitle">Trusted by 25,000+ happy foodies</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Column: Interactive Login / Register Form */}
          <section className="login-form-panel">
            {/* Tab Switcher */}
            <div className="auth-tab-switch">
              <button
                type="button"
                className={`auth-tab-btn ${authMode === 'signin' ? 'active' : ''}`}
                onClick={() => {
                  setAuthMode('signin');
                  setErrorMessage('');
                }}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`auth-tab-btn ${authMode === 'signup' ? 'active' : ''}`}
                onClick={() => {
                  setAuthMode('signup');
                  setErrorMessage('');
                }}
              >
                Create Account
              </button>
            </div>

            {/* Quick Demo Credentials Bar */}
            <div className="quick-demo-section">
              <span className="quick-demo-title">⚡ Quick Demo Logins (1-Click):</span>
              <div className="quick-demo-chips">
                <button
                  type="button"
                  className="demo-chip"
                  onClick={() => handleQuickDemoLogin('alex@example.com', 'password123')}
                  title="Load Alex's credentials"
                >
                  👤 Alex Johnson
                </button>
                <button
                  type="button"
                  className="demo-chip"
                  onClick={() => handleQuickDemoLogin('priya@example.com', 'password123')}
                  title="Load Priya's credentials"
                >
                  👩 Priya Sharma
                </button>
                <button
                  type="button"
                  className="demo-chip"
                  onClick={() => handleQuickDemoLogin('demo@flavorfleet.com', 'demo123')}
                  title="Load Demo credentials"
                >
                  🍕 Foodie Explorer
                </button>
              </div>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="auth-error-banner">
                <span className="error-icon">⚠️</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* 1. SIGN IN FORM */}
            {authMode === 'signin' && (
              <form onSubmit={handleSignIn} className="auth-form-content">
                <div className="auth-form-group">
                  <label htmlFor="login-email">Email or Username</label>
                  <div className="auth-input-wrapper">
                    <MailIcon size={18} className="auth-field-icon" />
                    <input
                      id="login-email"
                      type="email"
                      required
                      placeholder="e.g. alex@example.com"
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      className="auth-input"
                    />
                  </div>
                </div>

                <div className="auth-form-group">
                  <div className="password-label-row">
                    <label htmlFor="login-password">Password</label>
                    <button
                      type="button"
                      className="forgot-link-btn"
                      onClick={() => {
                        setForgotEmail(loginEmail);
                        setForgotSubmitted(false);
                        setShowForgotModal(true);
                      }}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="auth-input-wrapper">
                    <LockIcon size={18} className="auth-field-icon" />
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      className="auth-input"
                    />
                    <button
                      type="button"
                      className="auth-toggle-pwd"
                      onClick={() => setShowPassword(!showPassword)}
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                    </button>
                  </div>
                </div>

                <div className="auth-options-row">
                  <label className="auth-checkbox-label">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                    />
                    <span>Remember this device</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="auth-submit-btn"
                >
                  {isLoading ? (
                    <span className="spinner-text">Signing in...</span>
                  ) : (
                    <span>SignIn </span>
                  )}
                </button>
              </form>
            )}

            {/* 2. SIGN UP FORM */}
            {authMode === 'signup' && (
              <form onSubmit={handleSignUp} className="auth-form-content">
                <div className="auth-form-group">
                  <label htmlFor="signup-name">Full Name *</label>
                  <div className="auth-input-wrapper">
                    <UserIcon size={18} className="auth-field-icon" />
                    <input
                      id="signup-name"
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={signupName}
                      onChange={e => setSignupName(e.target.value)}
                      className="auth-input"
                    />
                  </div>
                </div>

                <div className="auth-form-row">
                  <div className="auth-form-group">
                    <label htmlFor="signup-email">Email Address *</label>
                    <div className="auth-input-wrapper">
                      <MailIcon size={18} className="auth-field-icon" />
                      <input
                        id="signup-email"
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={signupEmail}
                        onChange={e => setSignupEmail(e.target.value)}
                        className="auth-input"
                      />
                    </div>
                  </div>

                  <div className="auth-form-group">
                    <label htmlFor="signup-phone">Phone Number</label>
                    <div className="auth-input-wrapper">
                      <PhoneIcon size={18} className="auth-field-icon" />
                      <input
                        id="signup-phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={signupPhone}
                        onChange={e => setSignupPhone(e.target.value)}
                        className="auth-input"
                      />
                    </div>
                  </div>
                </div>

                <div className="auth-form-group">
                  <label htmlFor="signup-address">Default Delivery Address (Optional)</label>
                  <input
                    id="signup-address"
                    type="text"
                    placeholder="Apartment, Street Name, Area"
                    value={signupAddress}
                    onChange={e => setSignupAddress(e.target.value)}
                    className="auth-input"
                  />
                </div>

                <div className="auth-form-row">
                  <div className="auth-form-group">
                    <label htmlFor="signup-password">Password (min 6 chars) *</label>
                    <div className="auth-input-wrapper">
                      <LockIcon size={18} className="auth-field-icon" />
                      <input
                        id="signup-password"
                        type={showSignupPassword ? 'text' : 'password'}
                        required
                        placeholder="Create password"
                        value={signupPassword}
                        onChange={e => setSignupPassword(e.target.value)}
                        className="auth-input"
                      />
                      <button
                        type="button"
                        className="auth-toggle-pwd"
                        onClick={() => setShowSignupPassword(!showSignupPassword)}
                      >
                        {showSignupPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="auth-form-group">
                    <label htmlFor="signup-confirm">Confirm Password *</label>
                    <div className="auth-input-wrapper">
                      <LockIcon size={18} className="auth-field-icon" />
                      <input
                        id="signup-confirm"
                        type={showSignupPassword ? 'text' : 'password'}
                        required
                        placeholder="Repeat password"
                        value={signupConfirmPassword}
                        onChange={e => setSignupConfirmPassword(e.target.value)}
                        className="auth-input"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="auth-submit-btn"
                >
                  {isLoading ? (
                    <span className="spinner-text">Creating Account...</span>
                  ) : (
                    <span>Create My Account 🚀</span>
                  )}
                </button>
              </form>
            )}

            {/* Social Divider */}
            <div className="auth-divider">
              <span>Or sign in with</span>
            </div>

            {/* Social Sign-in Buttons */}
            <div className="social-auth-buttons">
              <button
                type="button"
                className="social-btn google-btn"
                onClick={() => handleSocialLogin('Google')}
              >
                <GoogleIcon size={18} />
                <span>Continue with Google</span>
              </button>

              <button
                type="button"
                className="social-btn guest-btn"
                onClick={() => handleSocialLogin('Guest')}
              >
                <span>⚡ Instant Guest Access</span>
              </button>
            </div>

            {/* Security Guarantee Badge */}
            <div className="auth-security-badge">
              <ShieldCheckIcon size={16} />
              <span>256-bit SSL encryption. Your credentials & addresses are completely safe.</span>
            </div>
          </section>
        </div>
      </main>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="modal-backdrop" onClick={() => setShowForgotModal(false)}>
          <div className="modal-content forgot-modal" onClick={e => e.stopPropagation()}>
            <button
              className="modal-close-btn"
              onClick={() => setShowForgotModal(false)}
              title="Close"
            >
              <CloseIcon size={20} />
            </button>

            <div className="forgot-modal-body">
              <div className="forgot-icon-wrap">🔑</div>
              <h3 className="modal-title">Reset Your Password</h3>
              <p className="modal-subtitle">
                Enter your registered email address and we will send you instructions to reset your password.
              </p>

              {forgotSubmitted ? (
                <div className="forgot-success-box">
                  <div className="success-icon-badge">✓</div>
                  <h4>Check Your Inbox</h4>
                  <p>A recovery link has been dispatched to <strong>{forgotEmail}</strong>.</p>
                  <button
                    className="explore-menu-btn mt-3"
                    onClick={() => setShowForgotModal(false)}
                  >
                    Back to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="forgot-form">
                  <div className="auth-form-group">
                    <label>Registered Email Address</label>
                    <div className="auth-input-wrapper">
                      <MailIcon size={18} className="auth-field-icon" />
                      <input
                        type="email"
                        required
                        placeholder="e.g. alex@example.com"
                        value={forgotEmail}
                        onChange={e => setForgotEmail(e.target.value)}
                        className="auth-input"
                      />
                    </div>
                  </div>

                  <button type="submit" className="auth-submit-btn mt-2">
                    Send Reset Link
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
