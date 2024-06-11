import React, { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";
import apiService from "../api/apiService";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const auth = useAuth();
  const { isLoggedIn } = auth;
  const [cartItems, setCartItems] = useState([]); // [{ product: {}, quantity: 1 }]

  const loadCart = (cartItems) => {
    setCartItems(cartItems);
  };
  const clearCart = () => {
    setCartItems([]);
  };
  const incCartItem = (product) => {
    setCartItems((prevItems) => {
      const itemIndex = prevItems.findIndex((item) => item.product === product);

      // TODO: Check for user logged in and save cart to DB on change. save to localstorage
      if (isLoggedIn) {
        apiService.addcart("add", product, 1);
      }
      if (itemIndex > -1) {
        const updatedItems = [...prevItems];
        updatedItems[itemIndex].quantity += 1;
        return updatedItems;
      } else {
        return [...prevItems, { product, quantity: 1 }];
      }
    });
    if (!isLoggedIn) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  };

  const decCartItem = (product) => {
    setCartItems((prevItems) => {
      const itemIndex = prevItems.findIndex((item) => item.product === product);
      if (isLoggedIn) {
        apiService.delcart("del", product);
      }
      if (itemIndex > -1) {
        const updatedItems = [...prevItems];
        if (updatedItems[itemIndex].quantity > 1) {
          updatedItems[itemIndex].quantity -= 1;
        } else {
          // Remove item if quantity is 1
          updatedItems.splice(itemIndex, 1);
        }
        return updatedItems;
      } else {
        return prevItems;
      }
    });
    if (!isLoggedIn) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  };

  const cartItemCount = cartItems.reduce(
    (count, item) => count + item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartItemCount,
        incCartItem,
        decCartItem,
        loadCart,
        clearCart,
        setCartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
