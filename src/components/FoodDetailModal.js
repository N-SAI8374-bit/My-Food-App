'use client';

import React, { useState, useEffect } from 'react';
import { useFood } from '@/context/FoodContext';
import { CloseIcon, StarIcon, ClockIcon, FlameIcon, CheckIcon } from './Icons';

export default function FoodDetailModal() {
  const { selectedDishForDetail, setSelectedDishForDetail, addToCart } = useFood();

  const dish = selectedDishForDetail;

  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Reset defaults when modal opens with new dish
  useEffect(() => {
    if (dish) {
      if (dish.customizationOptions?.sizes?.length) {
        setSelectedSize(dish.customizationOptions.sizes[0]);
      } else {
        setSelectedSize(null);
      }
      setSelectedAddOns([]);
      setSpecialInstructions('');
    }
  }, [dish]);

  if (!dish) return null;

  const sizeDiff = selectedSize ? selectedSize.priceDiff : 0;
  const addOnsTotal = selectedAddOns.reduce((sum, item) => sum + item.price, 0);
  const finalUnitPrice = dish.price + sizeDiff + addOnsTotal;

  const handleToggleAddOn = (addOn) => {
    setSelectedAddOns(prev => {
      const exists = prev.find(item => item.id === addOn.id);
      if (exists) {
        return prev.filter(item => item.id !== addOn.id);
      } else {
        return [...prev, addOn];
      }
    });
  };

  const handleAddToCart = () => {
    addToCart(dish, selectedSize, selectedAddOns, specialInstructions);
    setSelectedDishForDetail(null);
  };

  return (
    <div className="modal-backdrop" onClick={() => setSelectedDishForDetail(null)}>
      <div className="modal-content customize-modal" onClick={e => e.stopPropagation()}>
        <button
          className="modal-close-btn"
          onClick={() => setSelectedDishForDetail(null)}
          title="Close"
        >
          <CloseIcon size={22} />
        </button>

        <div className="customize-modal-grid">
          {/* Dish image & overview */}
          <div className="customize-img-panel">
            <img src={dish.image} alt={dish.name} className="customize-large-img" />
            <div className="customize-img-overlay">
              <span className={`diet-pill ${dish.isVeg ? 'veg' : 'non-veg'}`}>
                {dish.isVeg ? '🌱 100% Pure Vegetarian' : '🍗 Non-Vegetarian'}
              </span>
            </div>
          </div>

          {/* Customization Controls */}
          <div className="customize-controls-panel">
            <div className="customize-header">
              <div className="flex-row items-center gap-2">
                <span className="customize-category-badge">{dish.category.toUpperCase()}</span>
                <span className="rating-pill">
                  <StarIcon size={14} /> {dish.rating} ({dish.reviewsCount})
                </span>
                <span className="prep-time-pill">
                  <ClockIcon size={14} /> {dish.prepTime}
                </span>
              </div>
              <h2 className="customize-title">{dish.name}</h2>
              <p className="customize-desc">{dish.description}</p>
            </div>

            {/* Size options */}
            {dish.customizationOptions?.sizes?.length > 0 && (
              <div className="customize-section">
                <h4 className="section-heading">Choose Portion Size <span className="required-tag">Required</span></h4>
                <div className="options-list">
                  {dish.customizationOptions.sizes.map((size) => {
                    const isSelected = selectedSize?.name === size.name;
                    return (
                      <label
                        key={size.name}
                        className={`option-row ${isSelected ? 'selected' : ''}`}
                        onClick={() => setSelectedSize(size)}
                      >
                        <div className="flex-row items-center gap-3">
                          <input
                            type="radio"
                            name="dishSize"
                            checked={isSelected}
                            onChange={() => setSelectedSize(size)}
                          />
                          <span className="option-name">{size.name}</span>
                        </div>
                        <span className="option-price">
                          {size.priceDiff === 0 ? 'Standard' : `+₹${size.priceDiff}`}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Add-ons options */}
            {dish.customizationOptions?.addOns?.length > 0 && (
              <div className="customize-section">
                <h4 className="section-heading">Extra Delicious Add-ons <span className="optional-tag">Optional</span></h4>
                <div className="options-list">
                  {dish.customizationOptions.addOns.map((addOn) => {
                    const isChecked = selectedAddOns.some(item => item.id === addOn.id);
                    return (
                      <label
                        key={addOn.id}
                        className={`option-row ${isChecked ? 'selected' : ''}`}
                        onClick={() => handleToggleAddOn(addOn)}
                      >
                        <div className="flex-row items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleAddOn(addOn)}
                          />
                          <span className="option-name">{addOn.name}</span>
                        </div>
                        <span className="option-price">+₹{addOn.price}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Special Instructions */}
            <div className="customize-section">
              <h4 className="section-heading">Special Cooking Instructions</h4>
              <textarea
                placeholder="e.g. Less spicy, dressing on the side, well done..."
                value={specialInstructions}
                onChange={e => setSpecialInstructions(e.target.value)}
                className="instructions-textarea"
                rows="2"
              ></textarea>
            </div>

            {/* Modal Footer CTA */}
            <div className="customize-modal-footer">
              <div className="customize-final-price">
                <span className="price-label">Total Item Price</span>
                <span className="price-val">₹{finalUnitPrice}</span>
              </div>
              <button className="confirm-add-btn" onClick={handleAddToCart}>
                Add to Order • ₹{finalUnitPrice}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
