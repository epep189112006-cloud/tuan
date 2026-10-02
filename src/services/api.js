import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000"
});

export const getBooks = () => api.get("/books");
export const getBook = (id) => api.get(`/books/${id}`);
export const getCategories = () => api.get("/categories");
export const getAuthors = () => api.get("/authors");
export const getOrders = () => api.get("/orders");
export const getReviews = () => api.get("/reviews");
export const getPromotions = () => api.get("/promotions");

export default api;