import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Books from "./pages/Books";
import BookDetail from "./pages/BookDetail";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./admin/Dashboard";
import ManageBooks from "./admin/Books";
import ManageCategories from "./admin/Categories";
import ManageAuthors from "./admin/Authors";
import ManageInventory from "./admin/Inventory";
import ManageOrders from "./admin/Orders";
import ManagePromotions from "./admin/Promotions";

export default function App() {
  return (
    <>
      <Header />
      <main className="min-vh-100">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<Books />} />
          <Route path="/books/:id" element={<BookDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/books" element={<ManageBooks />} />
          <Route path="/admin/categories" element={<ManageCategories />} />
          <Route path="/admin/authors" element={<ManageAuthors />} />
          <Route path="/admin/inventory" element={<ManageInventory />} />
          <Route path="/admin/orders" element={<ManageOrders />} />
          <Route path="/admin/promotions" element={<ManagePromotions />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}