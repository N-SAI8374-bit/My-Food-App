'use client';

import React from 'react';
import { useFood } from '@/context/FoodContext';
import { CloseIcon, HistoryIcon, BikeIcon } from './Icons';

export default function OrderHistoryModal() {
  const {
    isHistoryOpen,
    setIsHistoryOpen,
    orders,
    setActiveOrder,
    setIsTrackerOpen,
    addToCart,
    foods,
    showToast,
  } = useFood();

  if (!isHistoryOpen) return null;

  const handleTrackOrder = (order) => {
    setActiveOrder(order);
    setIsHistoryOpen(false);
    setIsTrackerOpen(true);
  };

  const handleReorder = (order) => {
    order.items.forEach(orderItem => {
      const match = foods.find(f => f.id === orderItem.id);
      if (match) {
        addToCart(match);
      }
    });
    showToast('Past order items added to your cart! 🛒');
    setIsHistoryOpen(false);
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsHistoryOpen(false)}>
      <div className="modal-content history-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-top-bar">
          <div className="flex-row items-center gap-2">
            <HistoryIcon size={22} />
            <h2 className="modal-title">Order History</h2>
            <span className="badge-count-pill">{orders.length}</span>
          </div>
          <button
            className="modal-close-btn"
            onClick={() => setIsHistoryOpen(false)}
            title="Close"
          >
            <CloseIcon size={20} />
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="empty-history-state">
            <span className="empty-history-icon">🧾</span>
            <h3>No orders yet</h3>
            <p>Your previous orders and receipts will appear here.</p>
          </div>
        ) : (
          <div className="order-history-list">
            {orders.map(order => {
              const dateFormatted = new Date(order.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              const isDelivered = order.status === 'delivered';

              return (
                <div key={order.orderId} className="history-order-card">
                  <div className="history-card-header">
                    <div>
                      <span className="history-order-id">#{order.orderId}</span>
                      <span className="history-order-date">{dateFormatted}</span>
                    </div>
                    <span className={`status-pill ${isDelivered ? 'status-delivered' : 'status-live'}`}>
                      {isDelivered ? '✓ Delivered' : '🛵 In Transit'}
                    </span>
                  </div>

                  <div className="history-items-summary">
                    {order.items.map((item, idx) => (
                      <span key={idx} className="history-item-line">
                        {item.quantity}x {item.name} {item.size ? `(${item.size})` : ''}
                      </span>
                    ))}
                  </div>

                  <div className="history-card-footer">
                    <div className="history-price-info">
                      <span className="history-total-label">Total Paid:</span>
                      <span className="history-total-val">₹{order.pricing?.total}</span>
                    </div>

                    <div className="history-actions-row">
                      {!isDelivered && (
                        <button
                          className="history-track-btn"
                          onClick={() => handleTrackOrder(order)}
                        >
                          <BikeIcon size={16} /> Track Live
                        </button>
                      )}
                      <button
                        className="history-reorder-btn"
                        onClick={() => handleReorder(order)}
                      >
                        Reorder ↻
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
