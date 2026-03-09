import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const addToCart = (product, quantity = 1) => {
    const existing = cart.find(item => item.id === product.id);
    let newCart;
    if (existing) {
      newCart = cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
          : item
      );
    } else {
      newCart = [...cart, { ...product, quantity }];
    }
    saveCart(newCart);
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const newCart = cart.map(item =>
      item.id === productId ? { ...item, quantity } : item
    );
    saveCart(newCart);
  };

  const removeFromCart = (productId) => {
    saveCart(cart.filter(item => item.id !== productId));
  };

  const clearCart = () => saveCart([]);

  const SHIPPING_CHARGE = 50;
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartTotal = cartSubtotal + (cartSubtotal > 0 ? SHIPPING_CHARGE : 0);
  const cartSubtotalDisplay = cartSubtotal;
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

return (
  <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart, cartTotal, cartSubtotal: cartSubtotalDisplay, cartCount }}>
    {children}
  </CartContext.Provider>
);
};

export const useCart = () => useContext(CartContext);
