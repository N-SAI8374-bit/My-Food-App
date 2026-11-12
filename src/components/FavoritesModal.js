'use client';

import React from 'react';
import { useFood } from '@/context/FoodContext';
import { CloseIcon, HeartIcon, PlusIcon, StarIcon, TrashIcon } from './Icons';

export default function FavoritesModal() {
  const {
    isFavoritesOpen,
    setIsFavoritesOpen,
    favorites,
    foods,
    toggleFavorite,
    addToCart,
    setSelectedDishForDetail,
  } = useFood();

  if (!isFavoritesOpen) return null;

  const favoriteDishes = foods.filter(dish => favorites.includes(dish.id));

  return (
    <div className="modal-backdrop" onClick={() => setIsFavoritesOpen(false)}>
      <div className="modal-content fav-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-top-bar">
          <div className="flex-row items-center gap-2">
            <HeartIcon size={22} filled={true} />
            <h2 className="modal-title">My Wishlist & Favorites</h2>
            <span className="badge-count-pill">{favoriteDishes.length}</span>
          </div>
          <button
            className="modal-close-btn"
            onClick={() => setIsFavoritesOpen(false)}
            title="Close"
          >
            <CloseIcon size={20} />
          </button>
        </div>

        {favoriteDishes.length === 0 ? (
          <div className="empty-fav-state">
            <span className="empty-heart-icon">💔</span>
            <h3>No favorites saved yet</h3>
            <p>Tap the heart icon on any mouth-watering dish to save it here for fast ordering!</p>
            <button
              className="explore-menu-btn mt-3"
              onClick={() => setIsFavoritesOpen(false)}
            >
              Browse Dishes
            </button>
          </div>
        ) : (
          <div className="fav-items-grid">
            {favoriteDishes.map(dish => (
              <div key={dish.id} className="fav-dish-card">
                <img src={dish.image} alt={dish.name} className="fav-dish-img" />
                <div className="fav-dish-content">
                  <div className="fav-dish-top">
                    <span className="rating-pill">
                      <StarIcon size={12} /> {dish.rating}
                    </span>
                    <button
                      className="fav-remove-icon-btn"
                      onClick={() => toggleFavorite(dish.id)}
                      title="Remove from wishlist"
                    >
                      <TrashIcon size={15} />
                    </button>
                  </div>
                  <h4 className="fav-dish-title" onClick={() => {
                    setIsFavoritesOpen(false);
                    setSelectedDishForDetail(dish);
                  }}>
                    {dish.name}
                  </h4>
                  <div className="fav-dish-footer">
                    <span className="fav-dish-price">₹{dish.price}</span>
                    <button
                      className="fav-add-cart-btn"
                      onClick={() => {
                        addToCart(dish);
                      }}
                    >
                      <PlusIcon size={14} /> Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
