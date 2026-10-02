import React, { createContext, useContext, useEffect, useState } from "react";

const RecentlyViewedContext = createContext();

const MAX_ITEMS = 12;

export function RecentlyViewedProvider({ children }) {
  const [viewed, setViewed] = useState(() => {
    const data = localStorage.getItem("recentlyViewed");
    return data ? JSON.parse(data) : [];
  });

  useEffect(() => {
    localStorage.setItem("recentlyViewed", JSON.stringify(viewed));
  }, [viewed]);

  const addViewed = (book) => {
    setViewed((prev) => {
      const khac = prev.filter((item) => item.id !== book.id);
      return [{ ...book }, ...khac].slice(0, MAX_ITEMS);
    });
  };

  const clearViewed = () => {
    setViewed([]);
  };

  return (
    <RecentlyViewedContext.Provider value={{ viewed, addViewed, clearViewed }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  return useContext(RecentlyViewedContext);
}
