'use client';

import React from 'react';
import { useFood } from '@/context/FoodContext';
import { HeartIcon, StarIcon, ClockIcon, FlameIcon, PlusIcon, MinusIcon } from './Icons';

export default function FoodCard({ dish }) {
  const {
    cart,
    addToCart,
    updateCartQuantity,
    favorites,
    toggleFavorite,
    setSelectedDishForDetail,
  } = useFood();

  const isFavorite = favorites.includes(dish.id);

  // Check how many of this base dish are in the cart
  const cartEntries = cart.filter(item => item.dishId === dish.id);
  const totalInCart = cartEntries.reduce((sum, item) => sum + item.quantity, 0);

  const discountPercent = dish.originalPrice
    ? Math.round(((dish.originalPrice - dish.price) / dish.originalPrice) * 100)
    : null;

  return (
    <div className="food-card">
      <div className="food-card-img-container">
        <img
          src={dish.image}
          alt={dish.name}
          className="food-card-img"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Veg / Non-Veg Indicator */}
        <div className={`diet-badge-indicator ${dish.isVeg ? 'veg-badge' : 'non-veg-badge'}`}>
          <div className="diet-badge-circle"></div>
        </div>

        {/* Special tag (Popular / Spicy) */}
        {dish.isPopular && (
          <span className="card-floating-tag popular-tag">
            <FlameIcon size={12} /> Bestseller
          </span>
        )}
        {dish.isSpicy && !dish.isPopular && (
          <span className="card-floating-tag spicy-tag">
            🌶️ Spicy
          </span>
        )}

        {/* Favorite Button */}
        <button
          className={`card-fav-btn ${isFavorite ? 'favorited' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(dish.id);
          }}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <HeartIcon size={18} filled={isFavorite} />
        </button>

        {discountPercent && (
          <span className="card-discount-pill">{discountPercent}% OFF</span>
        )}
      </div>

      <div className="food-card-body">
        {/* Meta info: Rating & Time */}
        <div className="food-card-meta">
          <div className="rating-pill">
            <StarIcon size={14} />
            <span className="rating-score">{dish.rating}</span>
            <span className="rating-count">({dish.reviewsCount})</span>
          </div>
          <div className="prep-time-pill">
            <ClockIcon size={13} />
            <span>{dish.prepTime}</span>
          </div>
          <div className="calories-pill">
            <span>{dish.calories}</span>
          </div>
        </div>

        <h3 className="food-card-title" onClick={() => setSelectedDishForDetail(dish)}>
          {dish.name}
        </h3>

        <p className="food-card-desc">
          {dish.description}
        </p>

        {/* Price & Action Row */}
        <div className="food-card-footer">
          <div className="card-price-block">
            <span className="currency-symbol">₹</span>
            <span className="current-price">{dish.price}</span>
            {dish.originalPrice && (
              <span className="original-price">₹{dish.originalPrice}</span>
            )}
          </div>

          <div className="card-action-block">
            {totalInCart > 0 ? (
              <div className="cart-qty-pill">
                <button
                  className="qty-btn"
                  onClick={() => {
                    // Update first matching cart item
                    const item = cartEntries[0];
                    if (item) updateCartQuantity(item.cartItemId, -1);
                  }}
                  title="Decrease"
                >
                  <MinusIcon size={14} />
                </button>
                <span className="qty-number">{totalInCart}</span>
                <button
                  className="qty-btn"
                  onClick={() => {
                    const item = cartEntries[0];
                    if (item) updateCartQuantity(item.cartItemId, 1);
                  }}
                  title="Increase"
                >
                  <PlusIcon size={14} />
                </button>
              </div>
            ) : (
              <button
                className="add-to-cart-btn"
                onClick={() => {
                  if (dish.customizationOptions?.sizes?.length > 1 || dish.customizationOptions?.addOns?.length) {
                    setSelectedDishForDetail(dish);
                  } else {
                    addToCart(dish);
                  }
                }}
              >
                <PlusIcon size={15} />
                <span>Add</span>
              </button>
            )}

            {dish.customizationOptions?.addOns?.length > 0 && (
              <button
                className="customize-link-btn"
                onClick={() => setSelectedDishForDetail(dish)}
                title="Customize toppings & size"
              >
                Customizable
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
