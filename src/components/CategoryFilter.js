'use client';

import React from 'react';
import { useFood } from '@/context/FoodContext';

export default function CategoryFilter() {
  const {
    categories,
    selectedCategory,
    setSelectedCategory,
    dietFilter,
    setDietFilter,
    sortBy,
    setSortBy,
    filteredFoods,
  } = useFood();

  return (
    <div className="filter-section">
      <div className="filter-container">
        {/* Category horizontal scrolling bar */}
        <div className="category-scroll-wrapper">
          <div className="category-list">
            {categories.map(cat => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  className={`category-chip ${isActive ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  <span className="cat-icon">{cat.icon}</span>
                  <span className="cat-name">{cat.name}</span>
                  <span className="cat-count">({cat.count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Secondary controls: Veg/Non-Veg & Sort dropdown */}
        <div className="filter-controls-row">
          <div className="diet-filters">
            <button
              className={`diet-btn ${dietFilter === 'all' ? 'active' : ''}`}
              onClick={() => setDietFilter('all')}
            >
              All Dishes
            </button>
            <button
              className={`diet-btn veg ${dietFilter === 'veg' ? 'active' : ''}`}
              onClick={() => setDietFilter('veg')}
            >
              <span className="diet-dot veg-dot"></span> Pure Veg
            </button>
            <button
              className={`diet-btn non-veg ${dietFilter === 'non-veg' ? 'active' : ''}`}
              onClick={() => setDietFilter('non-veg')}
            >
              <span className="diet-dot non-veg-dot"></span> Non-Veg
            </button>
          </div>

          <div className="sort-group">
            <span className="results-counter">
              Showing <strong>{filteredFoods.length}</strong> items
            </span>
            <label htmlFor="sort-select" className="sort-label">Sort By:</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="sort-dropdown"
            >
              <option value="popular">Most Popular 🔥</option>
              <option value="rating">Highest Rated ⭐</option>
              <option value="price-low">Price: Low to High ↑</option>
              <option value="price-high">Price: High to Low ↓</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
