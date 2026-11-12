'use client';

import React, { useState } from 'react';
import { useFood } from '@/context/FoodContext';
import { CloseIcon, TrashIcon, PlusIcon, MinusIcon, TagIcon } from './Icons';

export default function CartDrawer() {
  const {
    isCartOpen,
    setIsCartOpen,
    setIsCheckoutOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    deliveryFee,
    discountAmount,
    taxesAndRestaurantCharges,
    tip,
    setTip,
    grandTotal,
    appliedCoupon,
    couponError,
    applyCouponCode,
    removeCoupon,
  } = useFood();

  const [inputCoupon, setInputCoupon] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (inputCoupon.trim()) {
      applyCouponCode(inputCoupon.trim());
      setInputCoupon('');
    }
  };

  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="drawer-overlay" onClick={() => setIsCartOpen(false)}>
      <aside className="drawer-container" onClick={e => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-title-group">
            <h2 className="drawer-title">My Cart</h2>
            <span className="drawer-count">({cart.length} {cart.length === 1 ? 'item' : 'items'})</span>
          </div>
          <button
            className="drawer-close-btn"
            onClick={() => setIsCartOpen(false)}
            title="Close Cart"
          >
            <CloseIcon size={20} />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="empty-cart-state">
            <div className="empty-cart-emoji">🍽️</div>
            <h3 className="empty-cart-title">Your cart is empty</h3>
            <p className="empty-cart-sub">Looks like you haven&apos;t added any delicious food yet!</p>
            <button
              className="explore-menu-btn"
              onClick={() => setIsCartOpen(false)}
            >
              Explore Menu
            </button>
          </div>
        ) : (
          <div className="drawer-body">
            {/* Free Delivery Bar */}
            <div className="free-shipping-progress">
              {cartSubtotal >= 499 ? (
                <div className="free-shipping-active">
                  🎉 Congratulations! You have unlocked <strong>FREE Delivery</strong>
                </div>
              ) : (
                <div className="free-shipping-pending">
                  <span>Add <strong>₹{499 - cartSubtotal}</strong> more for <strong>FREE Delivery</strong></span>
                  <div className="progress-bar-track">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${Math.min(100, (cartSubtotal / 499) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Cart Items List */}
            <div className="cart-items-list">
              {cart.map(item => (
                <div key={item.cartItemId} className="cart-item-row">
                  <img src={item.image} alt={item.name} className="cart-item-img" />

                  <div className="cart-item-details">
                    <div className="cart-item-header">
                      <h4 className="cart-item-title">{item.name}</h4>
                      <button
                        className="cart-item-remove-btn"
                        onClick={() => removeFromCart(item.cartItemId)}
                        title="Remove"
                      >
                        <TrashIcon size={16} />
                      </button>
                    </div>

                    {item.selectedSize && (
                      <span className="cart-item-tag">Size: {item.selectedSize}</span>
                    )}

                    {item.selectedAddOns?.length > 0 && (
                      <div className="cart-addons-text">
                        Add-ons: {item.selectedAddOns.map(a => a.name).join(', ')}
                      </div>
                    )}

                    {item.specialInstructions && (
                      <p className="cart-item-instructions">
                        Note: &ldquo;{item.specialInstructions}&rdquo;
                      </p>
                    )}

                    <div className="cart-item-price-row">
                      <div className="cart-qty-pill">
                        <button
                          className="qty-btn"
                          onClick={() => updateCartQuantity(item.cartItemId, -1)}
                        >
                          <MinusIcon size={13} />
                        </button>
                        <span className="qty-number">{item.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() => updateCartQuantity(item.cartItemId, 1)}
                        >
                          <PlusIcon size={13} />
                        </button>
                      </div>

                      <div className="cart-item-total-price">
                        ₹{item.unitPrice * item.quantity}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupons Section */}
            <div className="cart-coupon-section">
              <form onSubmit={handleApplyCoupon} className="coupon-form">
                <div className="coupon-input-wrapper">
                  <TagIcon size={16} className="coupon-tag-icon" />
                  <input
                    type="text"
                    placeholder="Enter Coupon (e.g. FEAST20)"
                    value={inputCoupon}
                    onChange={e => setInputCoupon(e.target.value.toUpperCase())}
                    className="coupon-input"
                  />
                </div>
                <button type="submit" className="apply-coupon-btn">
                  Apply
                </button>
              </form>

              {appliedCoupon && (
                <div className="applied-coupon-tag">
                  <div className="flex-row items-center gap-2">
                    <span className="coupon-success-badge">✓ {appliedCoupon.code}</span>
                    <span className="coupon-saved-text">Saved ₹{discountAmount}</span>
                  </div>
                  <button className="remove-coupon-btn" onClick={removeCoupon}>
                    Remove
                  </button>
                </div>
              )}

              {couponError && (
                <div className="coupon-error-message">{couponError}</div>
              )}

              {/* Quick coupons preview */}
              {!appliedCoupon && (
                <div className="quick-coupons-row">
                  <span className="quick-coupon-chip" onClick={() => applyCouponCode('FEAST20')}>
                    FEAST20 (20% OFF)
                  </span>
                  <span className="quick-coupon-chip" onClick={() => applyCouponCode('TASTY50')}>
                    TASTY50 (Flat ₹50)
                  </span>
                </div>
              )}
            </div>

            {/* Delivery Partner Tip */}
            <div className="tip-section">
              <div className="tip-header">
                <span className="tip-title">Say thanks with a Tip to Rider 🚴</span>
              </div>
              <div className="tip-options">
                {[0, 20, 30, 50, 100].map(amt => (
                  <button
                    key={amt}
                    className={`tip-btn ${tip === amt ? 'active' : ''}`}
                    onClick={() => setTip(amt)}
                  >
                    {amt === 0 ? 'None' : `₹${amt}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Bill Details */}
            <div className="bill-details-section">
              <h4 className="bill-title">Bill Summary</h4>
              <div className="bill-row">
                <span>Item Subtotal</span>
                <span>₹{cartSubtotal}</span>
              </div>
              <div className="bill-row">
                <span>Delivery Fee</span>
                <span>
                  {deliveryFee === 0 ? (
                    <span className="free-text">FREE</span>
                  ) : (
                    `₹${deliveryFee}`
                  )}
                </span>
              </div>
              <div className="bill-row">
                <span>Taxes & Charges (5% GST)</span>
                <span>₹{taxesAndRestaurantCharges}</span>
              </div>
              {discountAmount > 0 && (
                <div className="bill-row discount-row">
                  <span>Coupon Discount</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}
              {tip > 0 && (
                <div className="bill-row">
                  <span>Delivery Partner Tip</span>
                  <span>₹{tip}</span>
                </div>
              )}
              <div className="bill-divider"></div>
              <div className="bill-row grand-total-row">
                <span>To Pay</span>
                <span>₹{grandTotal}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <div className="cart-drawer-footer">
              <button
                className="checkout-proceed-btn"
                onClick={handleProceedCheckout}
              >
                <span>Proceed to Checkout</span>
                <span>₹{grandTotal} →</span>
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
