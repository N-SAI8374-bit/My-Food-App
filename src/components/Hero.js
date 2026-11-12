'use client';

import React from 'react';
import { useFood } from '@/context/FoodContext';
import { TagIcon, FlameIcon, ClockIcon, StarIcon } from './Icons';

export default function Hero() {
  const { applyCouponCode, setIsCartOpen, cartItemCount } = useFood();

  const handleCopyCoupon = (code) => {
    applyCouponCode(code);
    if (cartItemCount > 0) {
      setIsCartOpen(true);
    }
  };

  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-pill-badge">
            <span className="pill-dot"></span>
            <span>⚡ Ultra-fast delivery within 25-35 minutes</span>
          </div>

          <h1 className="hero-title">
            Hungry? Discover The Best <span className="highlight-text">Flavors</span> In Town
          </h1>

          <p className="hero-description">
            From artisanal wood-fired sourdough pizzas to fiery Nashville fried burgers and aromatic Hyderabadi dum biryanis, freshly prepared by master chefs and delivered piping hot to your door.
          </p>

          {/* Promo Coupon Bar */}
          <div className="hero-promo-cards">
            <div className="hero-promo-tag" onClick={() => handleCopyCoupon('FEAST20')}>
              <div className="promo-tag-icon"><TagIcon size={16} /></div>
              <div className="promo-tag-text">
                <span className="promo-code">FEAST20</span>
                <span className="promo-detail">20% OFF up to ₹150</span>
              </div>
              <span className="apply-chip">Apply</span>
            </div>

            <div className="hero-promo-tag" onClick={() => handleCopyCoupon('TASTY50')}>
              <div className="promo-tag-icon"><TagIcon size={16} /></div>
              <div className="promo-tag-text">
                <span className="promo-code">TASTY50</span>
                <span className="promo-detail">Flat ₹50 OFF</span>
              </div>
              <span className="apply-chip">Apply</span>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">4.9 <StarIcon size={16} /></span>
              <span className="stat-label">25k+ Reviews</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">25 min</span>
              <span className="stat-label">Avg. Delivery</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">100%</span>
              <span className="stat-label">Fresh & Hygenic</span>
            </div>
          </div>
        </div>

        {/* Hero Visual Banner */}
        <div className="hero-visual">
          <div className="hero-image-wrapper">
            <img
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80"
              alt="Delicious Gourmet Food Selection"
              className="hero-main-img"
            />
            <div className="floating-badge floating-badge-top">
              <span className="floating-emoji">🔥</span>
              <div>
                <p className="floating-title">Trending Dish</p>
                <p className="floating-subtitle">Truffle Burrata Pizza</p>
              </div>
            </div>
            <div className="floating-badge floating-badge-bottom">
              <span className="floating-emoji">🛵</span>
              <div>
                <p className="floating-title">Fast Delivery</p>
                <p className="floating-subtitle">Hot & Fresh at Doorstep</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
