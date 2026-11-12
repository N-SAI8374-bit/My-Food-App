'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { foodItems as initialFoods, categories as initialCategories, validCoupons } from '@/data/foodData';

const FoodContext = createContext();

export function FoodProvider({ children }) {
  const [foods, setFoods] = useState(initialFoods);
  const [categories, setCategories] = useState(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dietFilter, setDietFilter] = useState('all'); // 'all', 'veg', 'non-veg'
  const [sortBy, setSortBy] = useState('popular'); // 'popular', 'price-low', 'price-high', 'rating'

  // Cart state
  const [cart, setCart] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [tip, setTip] = useState(30);

  // Favorites state
  const [favorites, setFavorites] = useState([]);

  // Orders state
  const [orders, setOrders] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);

  // Authentication & User profile state
  const [user, setUser] = useState(null);

  // Theme
  const [theme, setTheme] = useState('light');

  // Modal open states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [selectedDishForDetail, setSelectedDishForDetail] = useState(null);
  const [notification, setNotification] = useState(null);

  // Toast notification helper
  const showToast = (message, type = 'success') => {
    setNotification({ message, type, id: Date.now() });
    setTimeout(() => {
      setNotification(prev => (prev?.message === message ? null : prev));
    }, 3200);
  };

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('flavorcraft_cart');
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedFavs = localStorage.getItem('flavorcraft_favs');
      if (savedFavs) setFavorites(JSON.parse(savedFavs));

      const savedUser = localStorage.getItem('flavorcraft_user');
      if (savedUser) setUser(JSON.parse(savedUser));

      const savedTheme = localStorage.getItem('flavorcraft_theme');
      if (savedTheme) {
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
      }
    } catch (e) {
      console.warn('Storage load error:', e);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('flavorcraft_cart', JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('flavorcraft_favs', JSON.stringify(favorites));
    } catch (e) {}
  }, [favorites]);

  // Theme change
  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('flavorcraft_theme', nextTheme);
  };

  // Fetch initial orders
  useEffect(() => {
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.orders) {
          setOrders(data.orders);
          // Set initial active order if one exists
          const active = data.orders.find(o => o.status !== 'delivered');
          if (active) setActiveOrder(active);
        }
      })
      .catch(err => console.log('Could not fetch initial orders:', err));
  }, []);

  // Filter and sort food items
  const filteredFoods = useMemo(() => {
    let result = [...foods];

    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter(item => item.category === selectedCategory);
    }

    if (dietFilter === 'veg') {
      result = result.filter(item => item.isVeg);
    } else if (dietFilter === 'non-veg') {
      result = result.filter(item => !item.isVeg);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        item =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'popular':
      default:
        result.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
        break;
    }

    return result;
  }, [foods, selectedCategory, dietFilter, searchQuery, sortBy]);

  // Cart operations
  const addToCart = (dish, customSize = null, customAddOns = [], specialInstructions = '') => {
    const size = customSize || (dish.customizationOptions?.sizes ? dish.customizationOptions.sizes[0] : null);
    const sizePriceDiff = size ? size.priceDiff : 0;
    const addOnsTotal = customAddOns.reduce((sum, addOn) => sum + addOn.price, 0);
    const unitPrice = dish.price + sizePriceDiff + addOnsTotal;

    const cartItemId = `${dish.id}-${size ? size.name : 'default'}-${customAddOns.map(a => a.id).sort().join(',')}`;

    setCart(prev => {
      const existing = prev.find(item => item.cartItemId === cartItemId);
      if (existing) {
        return prev.map(item =>
          item.cartItemId === cartItemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          cartItemId,
          dishId: dish.id,
          name: dish.name,
          category: dish.category,
          basePrice: dish.price,
          unitPrice,
          image: dish.image,
          isVeg: dish.isVeg,
          quantity: 1,
          selectedSize: size ? size.name : null,
          selectedAddOns: customAddOns,
          specialInstructions,
        },
      ];
    });

    showToast(`Added "${dish.name}" to cart! 🛒`);
  };

  const updateCartQuantity = (cartItemId, delta) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.cartItemId === cartItemId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = cartItemId => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Favorites
  const toggleFavorite = dishId => {
    setFavorites(prev => {
      const exists = prev.includes(dishId);
      if (exists) {
        showToast('Removed from favorites', 'info');
        return prev.filter(id => id !== dishId);
      } else {
        showToast('Added to favorites! ❤️');
        return [...prev, dishId];
      }
    });
  };

  // Coupon handling
  const applyCouponCode = async code => {
    setCouponError('');
    if (!code) return;

    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal: cartSubtotal }),
      });
      const data = await res.json();
      if (data.success) {
        setAppliedCoupon({
          code: data.code,
          discount: data.discount,
          freeDelivery: data.freeDelivery,
        });
        showToast(data.message);
      } else {
        setCouponError(data.message || 'Invalid coupon');
        showToast(data.message || 'Invalid coupon', 'error');
      }
    } catch (err) {
      setCouponError('Failed to validate coupon');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
    showToast('Coupon removed');
  };

  // Calculations
  const cartItemCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  }, [cart]);

  const deliveryFee = useMemo(() => {
    if (cart.length === 0) return 0;
    if (appliedCoupon?.freeDelivery) return 0;
    if (cartSubtotal >= 499) return 0; // Free delivery above 499
    return 40;
  }, [cartSubtotal, cart.length, appliedCoupon]);

  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.discount) return appliedCoupon.discount;
    return 0;
  }, [appliedCoupon]);

  const taxesAndRestaurantCharges = useMemo(() => {
    if (cart.length === 0) return 0;
    return Math.round(cartSubtotal * 0.05); // 5% GST
  }, [cartSubtotal, cart.length]);

  const grandTotal = useMemo(() => {
    if (cart.length === 0) return 0;
    const total = cartSubtotal + deliveryFee + taxesAndRestaurantCharges + tip - discountAmount;
    return Math.max(0, total);
  }, [cartSubtotal, deliveryFee, taxesAndRestaurantCharges, tip, discountAmount, cart.length]);

  // User Authentication Handlers
  const loginUser = (userData) => {
    setUser(userData);
    try {
      localStorage.setItem('flavorcraft_user', JSON.stringify(userData));
    } catch (e) {}
    showToast(`Welcome back, ${userData.name}! 👋`);
  };

  const logoutUser = () => {
    setUser(null);
    try {
      localStorage.removeItem('flavorcraft_user');
    } catch (e) {}
    showToast('Signed out successfully. Come back soon! 🍔', 'info');
  };

  const updateUser = (updates) => {
    setUser(prev => {
      const nextUser = { ...prev, ...updates };
      try {
        localStorage.setItem('flavorcraft_user', JSON.stringify(nextUser));
      } catch (e) {}
      return nextUser;
    });
    showToast('Profile updated successfully!');
  };

  return (
    <FoodContext.Provider
      value={{
        user,
        loginUser,
        logoutUser,
        updateUser,
        foods,
        categories,
        filteredFoods,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        dietFilter,
        setDietFilter,
        sortBy,
        setSortBy,
        cart,
        cartItemCount,
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
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        favorites,
        toggleFavorite,
        orders,
        setOrders,
        activeOrder,
        setActiveOrder,
        theme,
        toggleTheme,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isTrackerOpen,
        setIsTrackerOpen,
        isFavoritesOpen,
        setIsFavoritesOpen,
        isHistoryOpen,
        setIsHistoryOpen,
        selectedDishForDetail,
        setSelectedDishForDetail,
        notification,
        showToast,
      }}
    >
      {children}
    </FoodContext.Provider>
  );
}

export const useFood = () => useContext(FoodContext);
