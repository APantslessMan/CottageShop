import React from "react";
import ReactDOM from "react-dom/client";
import "./css/index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import CartWrapper from "./components/utils/CartWrapper";
import AuthProvider from "./components/utils/AuthContext";
import { DataProvider } from "./components/utils/DataContext";
import ErrorBoundary from "./components/utils/ErrorBoundary";
import SbProvider from "./components/utils/SbProvider";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <DataProvider>
        <SbProvider>
          <AuthProvider>
            <CartWrapper>
              <App />
            </CartWrapper>
          </AuthProvider>
        </SbProvider>
      </DataProvider>
    </BrowserRouter>
  </React.StrictMode>
);
