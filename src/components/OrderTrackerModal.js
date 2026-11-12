'use client';

import React, { useState, useEffect } from 'react';
import { useFood } from '@/context/FoodContext';
import { CloseIcon, BikeIcon, PhoneIcon, CheckIcon } from './Icons';

export default function OrderTrackerModal() {
  const { isTrackerOpen, setIsTrackerOpen, activeOrder, setActiveOrder, showToast } = useFood();

  const [currentStep, setCurrentStep] = useState(activeOrder?.statusStep || 2);
  const [eta, setEta] = useState(activeOrder?.etaMinutes || 24);

  // Sync step if activeOrder updates
  useEffect(() => {
    if (activeOrder) {
      setCurrentStep(activeOrder.statusStep || 2);
      setEta(activeOrder.etaMinutes || 24);
    }
  }, [activeOrder]);

  // Countdown timer simulation
  useEffect(() => {
    if (!isTrackerOpen || currentStep >= 4) return;
    const interval = setInterval(() => {
      setEta(prev => (prev > 1 ? prev - 1 : 1));
    }, 12000);
    return () => clearInterval(interval);
  }, [isTrackerOpen, currentStep]);

  if (!isTrackerOpen || !activeOrder) return null;

  const steps = [
    { id: 1, label: 'Order Confirmed', icon: '📝', sub: 'Restaurant accepted your order' },
    { id: 2, label: 'In Kitchen', icon: '👨‍🍳', sub: 'Chef is preparing your fresh meal' },
    { id: 3, label: 'Out for Delivery', icon: '🛵', sub: 'Rider is speeding to your address' },
    { id: 4, label: 'Delivered', icon: '🎉', sub: 'Enjoy your hot meal!' },
  ];

  const handleAdvanceStep = () => {
    if (currentStep < 4) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      const updatedOrder = {
        ...activeOrder,
        statusStep: nextStep,
        status: nextStep === 4 ? 'delivered' : nextStep === 3 ? 'on_the_way' : 'preparing',
        etaMinutes: nextStep === 4 ? 0 : Math.max(5, eta - 10),
      };
      setActiveOrder(updatedOrder);
      if (nextStep === 4) {
        showToast('🎉 Order delivered! Enjoy your meal!');
      } else {
        showToast(`Order status updated to: ${steps[nextStep - 1].label}`);
      }
    }
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsTrackerOpen(false)}>
      <div className="modal-content tracker-modal" onClick={e => e.stopPropagation()}>
        <div className="tracker-modal-header">
          <div className="flex-row items-center gap-2">
            <span className="live-pulse-dot"></span>
            <div>
              <h2 className="modal-title">Live Order Tracker</h2>
              <span className="tracker-order-id">Order #{activeOrder.orderId}</span>
            </div>
          </div>
          <button
            className="modal-close-btn"
            onClick={() => setIsTrackerOpen(false)}
            title="Close"
          >
            <CloseIcon size={22} />
          </button>
        </div>

        {/* ETA Header Card */}
        <div className="tracker-eta-card">
          <div className="eta-info">
            <span className="eta-label">Estimated Delivery Time</span>
            <span className="eta-timer">
              {currentStep === 4 ? 'Delivered!' : `${eta} Minutes`}
            </span>
            <span className="eta-destination">
              Delivering to: <strong>{activeOrder.customer?.address || 'Your Address'}</strong>
            </span>
          </div>
          <div className="eta-badge-animation">
            <BikeIcon size={40} className="animated-bike-icon" />
          </div>
        </div>

        {/* Progress Stepper */}
        <div className="stepper-wrapper">
          <div className="stepper-line-track">
            <div
              className="stepper-line-fill"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            ></div>
          </div>

          <div className="stepper-steps">
            {steps.map(step => {
              const isDone = currentStep >= step.id;
              const isCurrent = currentStep === step.id;
              return (
                <div key={step.id} className={`step-node ${isDone ? 'completed' : ''} ${isCurrent ? 'active' : ''}`}>
                  <div className="step-circle">
                    {isDone ? (
                      step.id < currentStep ? <CheckIcon size={16} /> : step.icon
                    ) : (
                      <span>{step.id}</span>
                    )}
                  </div>
                  <span className="step-title">{step.label}</span>
                  <span className="step-sub">{step.sub}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Simulated Map Visualizer */}
        <div className="simulated-map-container">
          <div className="map-road-bg">
            <div className="restaurant-pin">
              <span className="pin-icon">🏪</span>
              <span className="pin-label">Kitchen</span>
            </div>

            <div
              className="delivery-rider-indicator"
              style={{
                left: `${currentStep === 1 ? '15%' : currentStep === 2 ? '30%' : currentStep === 3 ? '70%' : '90%'}`,
              }}
            >
              <span className="rider-scooter-emoji">🛵💨</span>
            </div>

            <div className="destination-pin">
              <span className="pin-icon">🏠</span>
              <span className="pin-label">Home</span>
            </div>
          </div>
        </div>

        {/* Delivery Partner Card */}
        {activeOrder.rider && (
          <div className="rider-profile-card">
            <img
              src={activeOrder.rider.avatar}
              alt={activeOrder.rider.name}
              className="rider-avatar"
            />
            <div className="rider-meta">
              <div className="rider-name-row">
                <h4 className="rider-name">{activeOrder.rider.name}</h4>
                <span className="rider-rating">⭐ {activeOrder.rider.rating}</span>
              </div>
              <p className="rider-vehicle">{activeOrder.rider.vehicle}</p>
              <span className="rider-safety-tag">🛡️ Vaccinated & Sanitized</span>
            </div>

            <button
              className="rider-call-btn"
              onClick={() => showToast(`Calling ${activeOrder.rider.name} at ${activeOrder.rider.phone}...`)}
            >
              <PhoneIcon size={16} /> Call
            </button>
          </div>
        )}

        {/* Order Items Summary */}
        <div className="tracker-order-summary">
          <h4 className="tracker-section-title">Order Items ({activeOrder.items?.length})</h4>
          <div className="tracker-items-list">
            {activeOrder.items?.map((item, idx) => (
              <div key={idx} className="tracker-item-row">
                <span>{item.quantity}x {item.name}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="tracker-total-row">
            <span>Total Paid ({activeOrder.paymentMethod})</span>
            <span className="tracker-total-val">₹{activeOrder.pricing?.total}</span>
          </div>
        </div>

        {/* Interactive Simulation Controls */}
        <div className="tracker-sim-actions">
          <button
            className="sim-advance-btn"
            disabled={currentStep >= 4}
            onClick={handleAdvanceStep}
          >
            {currentStep < 4 ? '⚡ Simulate Next Step' : 'Order Completed 🎉'}
          </button>
        </div>
      </div>
    </div>
  );
}
