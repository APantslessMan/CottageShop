import React from "react";
import ReactDOM from "react-dom/client";
import "./css/index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import CartWrapper from "./components/utils/CartWrapper";
import AuthProvider from "./components/utils/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartWrapper>
          <App />
        </CartWrapper>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
