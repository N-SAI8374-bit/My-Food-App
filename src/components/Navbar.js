'use client';

import React from 'react';
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
} from './Icons';

export default function Navbar() {
  const {
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

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Brand Logo */}
        <div className="brand-wrapper" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="brand-logo-icon">🍔</div>
          <div className="brand-text-group">
            <span className="brand-title">Flavor<span className="brand-accent">Fleet</span></span>
            <span className="brand-subtitle">Fast & Fresh Food</span>
          </div>
        </div>

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
