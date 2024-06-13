import React from "react";
import ReactDOM from "react-dom/client";
import "./css/index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import CartWrapper from "./components/utils/CartWrapper";
import AuthProvider from "./components/utils/AuthContext";
import { DataProvider } from "./components/utils/DataContext";
import ErrorBoundary from "./components/utils/ErrorBoundary";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <AuthProvider>
          <CartWrapper>
            <DataProvider>
              <App />
            </DataProvider>
          </CartWrapper>
        </AuthProvider>
      </ErrorBoundary>
      ;
    </BrowserRouter>
  </React.StrictMode>
);
