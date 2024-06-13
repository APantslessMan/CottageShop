import React, { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";
import apiService from "../api/apiService";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const auth = useAuth();
  const { isLoggedIn } = auth;
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const loadCart = (cartItems) => {
    setCartItems(cartItems);
  };
  const clearCart = () => {
    setCartItems([]);
  };

  const updateLocalStorage = (items) => {
    localStorage.setItem("cartItems", JSON.stringify(items));
  };

  const incCartItem = (product) => {
    setCartItems((prevItems) => {
      const itemIndex = prevItems.findIndex((item) => item.product === product);

      if (isLoggedIn) {
        apiService.addcart("add", product, 1);
      }

      let updatedItems;
      if (itemIndex > -1) {
        updatedItems = [...prevItems];
        updatedItems[itemIndex].quantity += 1;
      } else {
        updatedItems = [...prevItems, { product, quantity: 1 }];
      }

      if (!isLoggedIn) {
        updateLocalStorage(updatedItems);
      }

      return updatedItems;
    });
  };

  const decCartItem = (product) => {
    setCartItems((prevItems) => {
      const itemIndex = prevItems.findIndex((item) => item.product === product);
      if (isLoggedIn) {
        apiService.delcart("del", product);
      }

      let updatedItems;
      if (itemIndex > -1) {
        updatedItems = [...prevItems];
        if (updatedItems[itemIndex].quantity > 1) {
          updatedItems[itemIndex].quantity -= 1;
        } else {
          updatedItems.splice(itemIndex, 1);
        }
      } else {
        updatedItems = prevItems;
      }

      if (!isLoggedIn) {
        updateLocalStorage(updatedItems);
      }

      return updatedItems;
    });
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
