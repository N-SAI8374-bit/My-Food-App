'use client';

import React from 'react';
import { useFood } from '@/context/FoodContext';

export default function Toast() {
  const { notification } = useFood();

  if (!notification) return null;

  return (
    <div className={`toast-notification toast-${notification.type || 'success'}`}>
      <div className="toast-content">
        <span className="toast-dot"></span>
        <span className="toast-message">{notification.message}</span>
      </div>
    </div>
  );
}
