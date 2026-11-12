'use client';

import React, { useState, useEffect } from 'react';
import { useFood } from '@/context/FoodContext';
import { CloseIcon, CheckIcon, LocationIcon } from './Icons';

export default function CheckoutModal() {
  const {
    user,
    isCheckoutOpen,
    setIsCheckoutOpen,
    setIsTrackerOpen,
    cart,
    cartSubtotal,
    deliveryFee,
    taxesAndRestaurantCharges,
    discountAmount,
    tip,
    grandTotal,
    clearCart,
    setActiveOrder,
    setOrders,
    showToast,
  } = useFood();

  const [formData, setFormData] = useState({
    name: 'Alex Johnson',
    phone: '+91 98765 43210',
    address: 'Flat 402, Royal Palms, Green Glen Layout',
    city: 'Downtown Metro',
    landmark: 'Near Central Park',
    deliveryInstructions: 'Ring bell and leave at door',
  });

  // Pre-fill user data if logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || prev.name,
        phone: user.phone || prev.phone,
        address: user.address || prev.address,
      }));
    }
  }, [user]);

  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi', 'card', 'cod'
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8920');
  const [upiId, setUpiId] = useState('alex@oksbi');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCheckoutOpen) return null;

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) {
      showToast('Please fill all required delivery details', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        items: cart.map(i => ({
          id: i.dishId,
          name: i.name,
          quantity: i.quantity,
          price: i.unitPrice,
          size: i.selectedSize,
          addOns: i.selectedAddOns,
        })),
        customer: formData,
        paymentMethod:
          paymentMethod === 'upi'
            ? `UPI (${upiId})`
            : paymentMethod === 'card'
            ? `Card (ending 8920)`
            : 'Cash on Delivery',
        pricing: {
          subtotal: cartSubtotal,
          discount: discountAmount,
          deliveryFee,
          taxes: taxesAndRestaurantCharges,
          tip,
          total: grandTotal,
        },
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (data.success && data.order) {
        setOrders(prev => [data.order, ...prev]);
        setActiveOrder(data.order);
        clearCart();
        setIsCheckoutOpen(false);
        setIsTrackerOpen(true);
        showToast(`🎉 Order ${data.order.orderId} placed successfully!`);
      } else {
        showToast(data.message || 'Order failed', 'error');
      }
    } catch (err) {
      showToast('Error placing order: ' + err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsCheckoutOpen(false)}>
      <div className="modal-content checkout-modal" onClick={e => e.stopPropagation()}>
        <div className="checkout-modal-header">
          <div className="flex-row items-center gap-2">
            <span className="checkout-header-icon">🛍️</span>
            <div>
              <h2 className="modal-title">Checkout & Place Order</h2>
              <p className="modal-subtitle">Review address and payment options</p>
            </div>
          </div>
          <button
            className="modal-close-btn"
            onClick={() => setIsCheckoutOpen(false)}
            title="Close"
          >
            <CloseIcon size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmitOrder} className="checkout-form">
          <div className="checkout-grid">
            {/* Left: Delivery details */}
            <div className="checkout-form-section">
              <h3 className="checkout-section-title">
                <LocationIcon size={18} /> Delivery Address
              </h3>

              <div className="form-group-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="checkout-input"
                    placeholder="Enter your name"
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="checkout-input"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Street Address / Apartment *</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="checkout-input"
                  placeholder="Flat No, Wing, Building Name"
                />
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label>City / Area</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    className="checkout-input"
                  />
                </div>
                <div className="form-group">
                  <label>Landmark (Optional)</label>
                  <input
                    type="text"
                    value={formData.landmark}
                    onChange={e => setFormData({ ...formData, landmark: e.target.value })}
                    className="checkout-input"
                    placeholder="Near water tank / Metro pillar"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Delivery Instructions</label>
                <input
                  type="text"
                  value={formData.deliveryInstructions}
                  onChange={e => setFormData({ ...formData, deliveryInstructions: e.target.value })}
                  className="checkout-input"
                  placeholder="Leave at door / do not ring bell..."
                />
              </div>

              {/* Payment Methods */}
              <h3 className="checkout-section-title mt-4">💳 Payment Method</h3>
              <div className="payment-options-grid">
                <label className={`payment-card-option ${paymentMethod === 'upi' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                  />
                  <div className="payment-opt-info">
                    <span className="payment-opt-title">UPI / QR Code</span>
                    <span className="payment-opt-sub">GPay, PhonePe, Paytm</span>
                  </div>
                </label>

                <label className={`payment-card-option ${paymentMethod === 'card' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                  />
                  <div className="payment-opt-info">
                    <span className="payment-opt-title">Credit / Debit Card</span>
                    <span className="payment-opt-sub">Visa, Mastercard, RuPay</span>
                  </div>
                </label>

                <label className={`payment-card-option ${paymentMethod === 'cod' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                  />
                  <div className="payment-opt-info">
                    <span className="payment-opt-title">Cash on Delivery</span>
                    <span className="payment-opt-sub">Pay cash or UPI at delivery</span>
                  </div>
                </label>
              </div>

              {paymentMethod === 'upi' && (
                <div className="payment-sub-detail">
                  <label className="text-sm">UPI ID:</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={e => setUpiId(e.target.value)}
                    className="checkout-input mt-1"
                    placeholder="username@upi"
                  />
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="payment-sub-detail">
                  <div className="form-group">
                    <label className="text-sm">Card Number:</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={e => setCardNumber(e.target.value)}
                      className="checkout-input mt-1"
                    />
                  </div>
                  <div className="form-group-row mt-2">
                    <input type="text" defaultValue="12/28" className="checkout-input" placeholder="MM/YY" />
                    <input type="password" defaultValue="•••" className="checkout-input" placeholder="CVV" />
                  </div>
                </div>
              )}
            </div>

            {/* Right: Order Summary */}
            <div className="checkout-summary-section">
              <h3 className="checkout-section-title">Order Summary ({cart.length} items)</h3>
              <div className="checkout-items-preview">
                {cart.map(item => (
                  <div key={item.cartItemId} className="checkout-item-preview-row">
                    <div className="flex-row items-center gap-2">
                      <span className="preview-item-qty">{item.quantity}x</span>
                      <span className="preview-item-name">{item.name}</span>
                    </div>
                    <span className="preview-item-price">₹{item.unitPrice * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="checkout-bill-box">
                <div className="bill-row">
                  <span>Subtotal</span>
                  <span>₹{cartSubtotal}</span>
                </div>
                <div className="bill-row">
                  <span>Delivery</span>
                  <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                </div>
                <div className="bill-row">
                  <span>GST Taxes</span>
                  <span>₹{taxesAndRestaurantCharges}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="bill-row discount-row">
                    <span>Discount</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                {tip > 0 && (
                  <div className="bill-row">
                    <span>Rider Tip</span>
                    <span>₹{tip}</span>
                  </div>
                )}
                <div className="bill-divider"></div>
                <div className="bill-row grand-total-row">
                  <span>Total Payable</span>
                  <span className="total-highlight">₹{grandTotal}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="place-order-submit-btn"
              >
                {isSubmitting ? (
                  <span className="spinner-text">Processing Order...</span>
                ) : (
                  <span>Confirm & Pay ₹{grandTotal}</span>
                )}
              </button>

              <div className="safe-checkout-badge">
                <CheckIcon size={14} /> 100% Secure Payment • Safe & Contactless Delivery
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
