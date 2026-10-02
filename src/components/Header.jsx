import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaHeart, FaShoppingCart, FaUser, FaPhoneAlt, FaBook } from "react-icons/fa";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";
import { getCategories } from "../services/api";

export default function Header() {
  const { totalItems } = useCart();
  const { wishlist } = useWishlist();
  const [categories, setCategories] = useState([]);
  const [tuKhoa, setTuKhoa] = useState("");

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const oTimKiemRef = useRef(null);

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);


  useEffect(() => {
    const xuLyPhim = (e) => {
      const dangGoi = document.activeElement && document.activeElement.tagName;
      if (e.key === "/" && dangGoi !== "INPUT" && dangGoi !== "TEXTAREA") {
        e.preventDefault();
        oTimKiemRef.current?.focus();
      }
    };
    window.addEventListener("keydown", xuLyPhim);
    return () => window.removeEventListener("keydown", xuLyPhim);
  }, []);

  const timKiem = (e) => {
    e.preventDefault();
    navigate(tuKhoa.trim() ? `/books?keyword=${encodeURIComponent(tuKhoa.trim())}` : "/books");
    setTuKhoa("");
  };

  return (
    <header>
      {/* ===== Thanh trên cùng ===== */}
      <div className="topbar">
        <div className="container d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2 small">
            <FaPhoneAlt />
            <span>Hotline: 1900-1234</span>
            <span className="d-none d-md-inline">| Hệ thống nhà sách toàn quốc</span>
          </div>
          <div className="d-flex align-items-center gap-3 small">
            {user ? (
              <span className="topbar-user">
                <FaUser className="me-1" />
                {user.name}
              </span>
            ) : (
              <>
                <Link to="/login" className="topbar-link">Đăng nhập</Link>
                <span className="text-muted">/</span>
                <Link to="/register" className="topbar-link">Đăng ký</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ===== Header chính: logo + tìm kiếm + giỏ hàng ===== */}
      <div className="main-header">
        <div className="container d-flex align-items-center gap-3">
          <Link to="/" className="logo">
            <FaBook />
            TRI THỨC BOOK<span className="logo-dot">.</span>
          </Link>

          <form className="search-box flex-grow-1" onSubmit={timKiem}>
            <input
              className="form-control"
              placeholder="Tìm kiếm sách theo tên, tác giả..."
              value={tuKhoa}
              onChange={(e) => setTuKhoa(e.target.value)}
              ref={oTimKiemRef}
            />
            <button type="submit">
              <FaSearch />
            </button>
          </form>

          <div className="header-icons d-none d-md-flex">
            <Link to="/wishlist" className="header-icon">
              <FaHeart />
              <small>Yêu thích</small>
              {wishlist.length > 0 && <span className="badge-icon">{wishlist.length}</span>}
            </Link>
            <Link to="/cart" className="header-icon">
              <FaShoppingCart />
              <small>Giỏ hàng</small>
              {totalItems > 0 && <span className="badge-icon">{totalItems}</span>}
            </Link>
          </div>
        </div>
      </div>

      {/* ===== Thanh danh mục ===== */}
      <nav className="cat-nav">
        <div className="container d-flex align-items-center">
          <div className="dropdown">
            <button
              className="btn dropdown-toggle cat-dropdown"
              data-bs-toggle="dropdown"
              type="button"
            >
              <FaBook className="me-2" />
              Danh mục sản phẩm
            </button>
            <ul className="dropdown-menu">
              {categories.map((c) => (
                <li key={c.id}>
                  <Link className="dropdown-item" to={`/books?category=${c.id}`}>
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <Link className="cat-link" to="/">Trang chủ</Link>
          <Link className="cat-link" to="/books">Tất cả sách</Link>
          {categories.slice(0, 3).map((c) => (
            <Link className="cat-link d-none d-lg-inline" to={`/books?category=${c.id}`} key={c.id}>
              {c.name}
            </Link>
          ))}
          <Link className="cat-link" to="/orders">Đơn hàng</Link>
          <Link className="cat-link" to="/admin">Quản trị</Link>
        </div>
      </nav>
    </header>
  );
}