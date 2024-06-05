import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItemCount, setCartItemCount] = useState(0);

  const incCartItem = () => {
    setCartItemCount((prevCount) => prevCount + 1);
  };

  const decCartItem = () => {
    setCartItemCount((prevCount) => Math.max(prevCount - 1, 0));
  };

  return (
    <CartContext.Provider value={{ cartItemCount, incCartItem, decCartItem }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
