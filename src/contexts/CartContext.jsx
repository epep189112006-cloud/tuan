import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const data = localStorage.getItem("cartItems");
    return data ? JSON.parse(data) : [];
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (book, qty = 1) => {
    if (book.quantity <= 0) {
      alert("Sách đã hết hàng!");
      return;
    }
    setCartItems((prev) => {
      const found = prev.find((item) => item.id === book.id);
      const daCo = found ? found.quantity : 0;
      const themDuoc = Math.min(book.quantity - daCo, qty);
      if (themDuoc <= 0) {
        alert("Số lượng trong giỏ đã đạt tối đa tồn kho!");
        return prev;
      }
      if (found) {
        return prev.map((item) =>
          item.id === book.id ? { ...item, quantity: item.quantity + themDuoc } : item
        );
      }
      return [...prev, { ...book, quantity: themDuoc }];
    });
  };

  const tangSoLuong = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const giamSoLuong = (id) => {
    setCartItems((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        tangSoLuong,
        giamSoLuong,
        removeItem,
        clearCart,
        totalPrice,
        totalItems
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}