import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./index.css";
import App from "./App";
import { CartProvider } from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import { RecentlyViewedProvider } from "./contexts/RecentlyViewedContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <CartProvider>
        <WishlistProvider>
          <RecentlyViewedProvider>
            <App />
          </RecentlyViewedProvider>
        </WishlistProvider>
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
);