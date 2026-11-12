'use client';

import React from 'react';
import { useFood } from '@/context/FoodContext';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import CategoryFilter from '@/components/CategoryFilter';
import FoodCard from '@/components/FoodCard';
import FoodDetailModal from '@/components/FoodDetailModal';
import CartDrawer from '@/components/CartDrawer';
import CheckoutModal from '@/components/CheckoutModal';
import OrderTrackerModal from '@/components/OrderTrackerModal';
import FavoritesModal from '@/components/FavoritesModal';
import OrderHistoryModal from '@/components/OrderHistoryModal';
import Footer from '@/components/Footer';
import Toast from '@/components/Toast';
import { CartIcon } from '@/components/Icons';

export default function HomePage() {
  const {
    filteredFoods,
    setSelectedCategory,
    setSearchQuery,
    setDietFilter,
    cartItemCount,
    grandTotal,
    setIsCartOpen,
  } = useFood();

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setDietFilter('all');
  };

  return (
    <div className="app-layout">
      {/* Toast Notification Container */}
      <Toast />

      {/* Main Navigation */}
      <Navbar />

      <main className="main-content">
        {/* Hero Section */}
        <Hero />

        {/* Categories & Filter Bar */}
        <section id="menu-section" className="menu-container">
          <CategoryFilter />

          {/* Food Cards Grid */}
          {filteredFoods.length === 0 ? (
            <div className="no-results-box">
              <span className="no-results-emoji">🔍</span>
              <h3>No matching dishes found</h3>
              <p>Try searching for another dish or reset your dietary & category filters.</p>
              <button className="reset-filter-btn" onClick={handleResetFilters}>
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="food-grid">
              {filteredFoods.map(dish => (
                <FoodCard key={dish.id} dish={dish} />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Sticky Mobile Floating Cart Bar */}
      {cartItemCount > 0 && (
        <aside className="mobile-floating-cart" onClick={() => setIsCartOpen(true)}>
          <div className="floating-cart-info">
            <span className="floating-cart-count">{cartItemCount} {cartItemCount === 1 ? 'item' : 'items'}</span>
            <span className="floating-cart-total">₹{grandTotal}</span>
          </div>
          <div className="floating-cart-action">
            <span>View Cart</span>
            <CartIcon size={18} />
          </div>
        </aside>
      )}

      {/* Interactive Modals & Drawers */}
      <FoodDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderTrackerModal />
      <FavoritesModal />
      <OrderHistoryModal />

      {/* Footer */}
      <Footer />
    </div>
  );
}
