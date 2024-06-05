import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import CartWrapper from "./utils/CartWrapper";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <CartWrapper>
        <App />
      </CartWrapper>
    </BrowserRouter>
  </React.StrictMode>
);
