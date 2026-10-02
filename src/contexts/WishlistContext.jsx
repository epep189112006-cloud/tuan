import React, { createContext, useContext, useEffect, useState } from "react";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    const data = localStorage.getItem("wishlist");
    return data ? JSON.parse(data) : [];
  });

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (book) => {
    const exists = wishlist.some((item) => item.id === book.id);
    if (exists) {
      setWishlist(wishlist.filter((item) => item.id !== book.id));
    } else {
      setWishlist([...wishlist, book]);
    }
  };

  const isWishlist = (id) => {
    return wishlist.some((item) => item.id === id);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}