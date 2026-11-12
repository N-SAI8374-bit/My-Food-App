'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useFood } from '@/context/FoodContext';
import {
  CartIcon,
  HeartIcon,
  SearchIcon,
  LocationIcon,
  HistoryIcon,
  SunIcon,
  MoonIcon,
  BikeIcon,
  UserIcon,
} from './Icons';

export default function Navbar() {
  const {
    user,
    logoutUser,
    cartItemCount,
    favorites,
    activeOrder,
    theme,
    toggleTheme,
    setIsCartOpen,
    setIsTrackerOpen,
    setIsFavoritesOpen,
    setIsHistoryOpen,
    searchQuery,
    setSearchQuery,
  } = useFood();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Brand Logo */}
        <Link href="/" className="brand-wrapper">
          <div className="brand-logo-icon">🍔</div>
          <div className="brand-text-group">
            <span className="brand-title">Flavor<span className="brand-accent">Fleet</span></span>
            <span className="brand-subtitle">Fast & Fresh Food</span>
          </div>
        </Link>

        {/* Location selector */}
        <div className="location-pill">
          <LocationIcon size={16} className="location-icon" />
          <div className="location-info">
            <span className="location-label">Deliver to:</span>
            <span className="location-address">Downtown Metro, 5th Ave</span>
          </div>
          <span className="location-badge">⚡ 25 min</span>
        </div>

        {/* Global Search */}
        <div className="nav-search-bar">
          <SearchIcon size={18} className="nav-search-icon" />
          <input
            type="text"
            placeholder="Search pizza, spicy burger, biryani, ramen..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="nav-search-input"
          />
          {searchQuery && (
            <button
              className="clear-search-btn"
              onClick={() => setSearchQuery('')}
              title="Clear search"
            >
              ×
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="nav-actions">
          {/* Active Order Tracker Pill (pulsing if active order exists) */}
          {activeOrder && (
            <button
              className="nav-btn tracker-btn pulsing"
              onClick={() => setIsTrackerOpen(true)}
              title="Track Active Order"
            >
              <BikeIcon size={18} />
              <span className="tracker-btn-text">Track Order</span>
            </button>
          )}

          {/* Order History */}
          <button
            className="nav-icon-btn"
            onClick={() => setIsHistoryOpen(true)}
            title="Past Orders"
          >
            <HistoryIcon size={20} />
            <span className="icon-btn-label">Orders</span>
          </button>

          {/* Wishlist / Favorites */}
          <button
            className="nav-icon-btn"
            onClick={() => setIsFavoritesOpen(true)}
            title="Wishlist"
          >
            <div className="icon-with-badge">
              <HeartIcon size={20} filled={favorites.length > 0} />
              {favorites.length > 0 && (
                <span className="badge-count fav-badge">{favorites.length}</span>
              )}
            </div>
            <span className="icon-btn-label">Saved</span>
          </button>

          {/* Theme Switcher */}
          <button
            className="nav-icon-btn theme-btn"
            onClick={toggleTheme}
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? <MoonIcon size={20} /> : <SunIcon size={20} />}
          </button>

          {/* User Account / Profile Menu */}
          {user ? (
            <div className="nav-profile-menu-container" ref={profileMenuRef}>
              <button
                className="nav-profile-trigger"
                onClick={() => setIsProfileMenuOpen(prev => !prev)}
                title="Account Menu"
              >
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="nav-profile-avatar" />
                ) : (
                  <div className="nav-profile-initials">
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                )}
                <span className="nav-profile-name">{user.name.split(' ')[0]}</span>
                <span className="nav-profile-caret">▾</span>
              </button>

              {isProfileMenuOpen && (
                <div className="nav-profile-dropdown">
                  <div className="nav-dropdown-header">
                    <div className="nav-dropdown-avatar-wrap">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="dropdown-avatar" />
                      ) : (
                        <div className="dropdown-avatar-placeholder">
                          {user.name ? user.name[0].toUpperCase() : 'U'}
                        </div>
                      )}
                    </div>
                    <div className="nav-dropdown-user-info">
                      <h4 className="dropdown-user-name">{user.name}</h4>
                      <p className="dropdown-user-email">{user.email}</p>
                      {user.phone && <p className="dropdown-user-phone">{user.phone}</p>}
                    </div>
                  </div>

                  <div className="nav-dropdown-divider"></div>

                  <button
                    className="nav-dropdown-item"
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      setIsHistoryOpen(true);
                    }}
                  >
                    <HistoryIcon size={16} />
                    <span>My Past Orders</span>
                  </button>

                  <button
                    className="nav-dropdown-item"
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      setIsFavoritesOpen(true);
                    }}
                  >
                    <HeartIcon size={16} filled={true} />
                    <span>Saved Favorites</span>
                  </button>

                  <div className="nav-dropdown-divider"></div>

                  <button
                    className="nav-dropdown-item signout-item"
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      logoutUser();
                    }}
                  >
                    <span className="signout-icon">🚪</span>
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="login-nav-btn" title="Sign In or Register">
              <UserIcon size={18} />
              <span className="login-btn-text">Sign In</span>
            </Link>
          )}

          {/* Cart Button */}
          <button
            className="cart-nav-btn"
            onClick={() => setIsCartOpen(true)}
            title="Open Cart"
          >
            <CartIcon size={20} />
            <span className="cart-nav-text">Cart</span>
            {cartItemCount > 0 && (
              <span className="cart-badge-bounce">{cartItemCount}</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
