import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function getCartItemId(product, selectedVariants) {
  if (!selectedVariants || Object.keys(selectedVariants).length === 0) {
    return String(product.id);
  }
  const variantString = Object.entries(selectedVariants)
    .sort(([k1], [k2]) => k1.localeCompare(k2))
    .map(([k, v]) => `${k}:${v}`)
    .join('|');
  return `${product.id}-${variantString}`;
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('premmobile_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to load cart from localStorage', e);
      return [];
    }
  });

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  // Promo code state
  const [appliedPromo, setAppliedPromo] = useState(() => {
    try {
      const savedPromo = localStorage.getItem('premmobile_promo');
      return savedPromo ? JSON.parse(savedPromo) : null;
    } catch (e) {
      return null;
    }
  });
  const [promoError, setPromoError] = useState(null);
  const [promoSuccess, setPromoSuccess] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('premmobile_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      if (appliedPromo) {
        localStorage.setItem('premmobile_promo', JSON.stringify(appliedPromo));
      } else {
        localStorage.removeItem('premmobile_promo');
      }
    } catch (e) {
      console.error('Failed to save promo code to localStorage', e);
    }
  }, [appliedPromo]);

  const showToast = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const addToCart = (product, quantity = 1, selectedVariants = null) => {
    // If selectedVariants is null, pick default variants if available
    let variantsToUse = selectedVariants;
    if (!variantsToUse && product.variants) {
      variantsToUse = {};
      Object.keys(product.variants).forEach((key) => {
        variantsToUse[key] = product.variants[key][0];
      });
    }

    const cartItemId = getCartItemId(product, variantsToUse);

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.cartItemId === cartItemId || (item.id === product.id && !item.selectedVariants && !variantsToUse));
      
      if (existingIndex > -1) {
        return prevCart.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [
        ...prevCart,
        {
          ...product,
          cartItemId,
          selectedVariants: variantsToUse,
          quantity
        }
      ];
    });

    const variantDesc = variantsToUse
      ? ` (${Object.values(variantsToUse).join(', ')})`
      : '';
    showToast(`Added "${product.name.slice(0, 20)}${variantDesc}" to Cart!`);
  };

  const removeFromCart = (cartItemId) => {
    setCart((prevCart) => prevCart.filter((item) => (item.cartItemId || item.id) !== cartItemId));
    showToast('Item removed from cart');
  };

  const updateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        (item.cartItemId || item.id) === cartItemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const updateItemVariant = (cartItemId, newVariants) => {
    setCart((prevCart) => {
      const targetItem = prevCart.find((item) => (item.cartItemId || item.id) === cartItemId);
      if (!targetItem) return prevCart;

      const newCartItemId = getCartItemId(targetItem, newVariants);
      
      // Check if item with target new variant already exists
      const existingOther = prevCart.find(
        (item) => (item.cartItemId || item.id) === newCartItemId && (item.cartItemId || item.id) !== cartItemId
      );

      if (existingOther) {
        // Merge quantity into existing item and remove current item
        return prevCart
          .filter((item) => (item.cartItemId || item.id) !== cartItemId)
          .map((item) =>
            (item.cartItemId || item.id) === newCartItemId
              ? { ...item, quantity: item.quantity + targetItem.quantity }
              : item
          );
      } else {
        // Update variant and cartItemId
        return prevCart.map((item) =>
          (item.cartItemId || item.id) === cartItemId
            ? { ...item, cartItemId: newCartItemId, selectedVariants: newVariants }
            : item
        );
      }
    });
    showToast('Item variation updated!');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedPromo(null);
    showToast('Cart cleared');
  };

  // Promo Code Validation & Application
  const PROMO_CODES = {
    PREM10: { type: 'percentage', value: 10, description: '10% OFF on all items' },
    GWALIOR100: { type: 'flat', value: 100, minSubtotal: 500, description: '₹100 OFF on orders above ₹500' },
    FESTIVE15: { type: 'percentage', value: 15, minSubtotal: 1000, description: '15% OFF on orders above ₹1,000' },
    SUPERDEAL: { type: 'flat', value: 250, minSubtotal: 1500, description: '₹250 OFF on orders above ₹1,500' }
  };

  const applyPromoCode = (codeStr) => {
    setPromoError(null);
    setPromoSuccess(null);

    if (!codeStr || !codeStr.trim()) {
      setPromoError('Please enter a coupon or promo code.');
      return false;
    }

    const cleanCode = codeStr.trim().toUpperCase();
    const promo = PROMO_CODES[cleanCode];

    if (!promo) {
      setPromoError('Invalid promo code. Try using "PREM10" or "GWALIOR100".');
      return false;
    }

    if (promo.minSubtotal && subtotal < promo.minSubtotal) {
      setPromoError(`Code "${cleanCode}" requires a minimum order of ₹${promo.minSubtotal.toLocaleString('en-IN')}.`);
      return false;
    }

    const newAppliedPromo = {
      code: cleanCode,
      ...promo
    };

    setAppliedPromo(newAppliedPromo);
    setPromoSuccess(`🎉 Promo code "${cleanCode}" applied! ${promo.description}`);
    showToast(`Applied ${cleanCode}!`);
    return true;
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    setPromoError(null);
    setPromoSuccess(null);
    showToast('Promo code removed');
  };

  // Computations
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const totalOriginalAmount = cart.reduce(
    (acc, item) => acc + (item.originalPrice || item.price) * item.quantity,
    0
  );

  // Calculate promo discount amount
  let promoDiscount = 0;
  if (appliedPromo && subtotal > 0) {
    if (appliedPromo.type === 'percentage') {
      promoDiscount = Math.round((subtotal * appliedPromo.value) / 100);
    } else if (appliedPromo.type === 'flat') {
      promoDiscount = Math.min(subtotal, appliedPromo.value);
    }
  }

  const finalTotal = Math.max(0, subtotal - promoDiscount);
  const totalSavings = Math.max(0, (totalOriginalAmount - subtotal) + promoDiscount);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartItems: cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateItemVariant,
        clearCart,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        totalItems,
        subtotal,
        totalAmount: subtotal,
        totalOriginalAmount,
        totalSavings,
        notification,
        showToast,
        // Promo system
        appliedPromo,
        promoError,
        promoSuccess,
        applyPromoCode,
        removePromoCode,
        promoDiscount,
        finalTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
