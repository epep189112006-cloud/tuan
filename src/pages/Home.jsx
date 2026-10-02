import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaBolt, FaPlus, FaFire, FaGift } from "react-icons/fa";
import { getBooks, getCategories } from "../services/api";
import BookCard from "../components/BookCard";
import FlashSale from "../components/FlashSale";
import Recommend from "../components/Recommend";

const banners = [
  {
    title: "Flash Sale - Giảm đến 30%",
    text: "Hàng loạt đầu sách bán chạy được giảm giá sốc trong thời gian giới hạn.",
    emoji: "⚡",
    bg: "linear-gradient(135deg, #e52d27, #b31217)"
  },
  {
    title: "Sách mới về & bạn đọc yêu thích",
    text: "Cập nhật liên tục những tựa sách mới nhất trong và ngoài nước.",
    emoji: "📚",
    bg: "linear-gradient(135deg, #0d6efd, #6610f2)"
  },
  {
    title: "Back To School",
    text: "Ưu đãi lớn cho học sinh, sinh viên nhân dịp nhập học 2026.",
    emoji: "🎒",
    bg: "linear-gradient(135deg, #ff8c00, #e52d27)"
  }
];

export default function Home() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [dangTai, setDangTai] = useState(true);
  const [loi, setLoi] = useState("");

  useEffect(() => {
    let huy = false;
    setDangTai(true);
    setLoi("");

    Promise.all([getBooks(), getCategories()])
      .then(([resBooks, resCats]) => {
        if (huy) return;
        setBooks(resBooks.data);
        setCategories(resCats.data);
      })
      .catch(() => {
        if (huy) return;
        setLoi("Không tải được dữ liệu. Hãy kiểm tra JSON Server đã chạy chưa (npm run server).");
      })
      .finally(() => {
        if (!huy) setDangTai(false);
      });

    return () => {
      huy = true;
    };
  }, []);

  const bestSellers = [...books]
    .sort((a, b) => (b.sold || 0) - (a.sold || 0))
    .slice(0, 5);

  const newest = [...books].sort((a, b) => a.id - b.id).slice(0, 5);

  const flashBooks = [...books]
    .sort((a, b) => (b.sold || 0) - (a.sold || 0))
    .slice(0, 10);

  return (
    <>
      {/* ===== Trạng thái tải dữ liệu ===== */}
      {dangTai && (
        <div className="container py-5 text-center">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
          <p className="text-muted mt-3">Đang tải sách...</p>
        </div>
      )}

      {!dangTai && loi && (
        <div className="container py-5">
          <div className="alert alert-danger text-center">
            {loi}
            <button className="btn btn-sm btn-outline-danger ms-2" onClick={() => window.location.reload()}>
              Thử lại
            </button>
          </div>
        </div>
      )}

      {!dangTai && !loi && (
      <>
      {/* ===== Banner Slider ===== */}
      <div id="mainSlider" className="carousel slide carousel-fade" data-bs-ride="carousel">
        <div className="carousel-indicators">
          {banners.map((b, i) => (
            <button
              key={i}
              type="button"
              data-bs-target="#mainSlider"
              data-bs-slide-to={i}
              className={i === 0 ? "active" : ""}
            ></button>
          ))}
        </div>
        <div className="carousel-inner">
          {banners.map((b, i) => (
            <div className={"carousel-item" + (i === 0 ? " active" : "")} key={i}>
              <div className="banner-slide" style={{ background: b.bg }}>
                <div className="container">
                  <div className="row align-items-center justify-content-between">
                    <div className="col-md-7 text-white">
                      <h2 className="fw-bold">{b.title}</h2>
                      <p>{b.text}</p>
                      <Link to="/books" className="btn btn-light fw-bold px-4">
                        Mua ngay →
                      </Link>
                    </div>
                    <div className="col-md-4 text-center banner-emoji">{b.emoji}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== Thanh tiện ích ===== */}
      <div className="container">
        <div className="promo-strip row text-center">
          <div className="col-6 col-md-3">
            <Link to="/books" className="promo-item">
              <span className="promo-icon bg-sale">
                <FaBolt />
              </span>
              <small>Flash Sale</small>
            </Link>
          </div>
          <div className="col-6 col-md-3">
            <Link to="/books" className="promo-item">
              <span className="promo-icon bg-new">
                <FaPlus />
              </span>
              <small>Sách mới</small>
            </Link>
          </div>
          <div className="col-6 col-md-3">
            <Link to="/books?sort=best" className="promo-item">
              <span className="promo-icon bg-hot">
                <FaFire />
              </span>
              <small>Bán chạy</small>
            </Link>
          </div>
          <div className="col-6 col-md-3">
            <Link to="/admin/promotions" className="promo-item">
              <span className="promo-icon bg-gift">
                <FaGift />
              </span>
              <small>Khuyến mại</small>
            </Link>
          </div>
        </div>

        {/* ===== Flash Sale ===== */}
        <div className="mt-4">
          <FlashSale books={flashBooks} />
        </div>

        {/* ===== Đoạn sách bán chạy ===== */}
        <div className="d-flex justify-content-between align-items-center mb-3 mt-4">
          <h2 className="section-title mb-0">Sách bán chạy</h2>
          <Link to="/books?sort=best" className="text-decoration-none">Xem tất cả →</Link>
        </div>
        <div className="row g-3 row-cols-2 row-cols-md-4 row-cols-xl-5">
          {bestSellers.map((book) => (
            <div className="col" key={book.id}>
              <BookCard book={book} />
            </div>
          ))}
        </div>

        {/* ===== Danh mục sản phẩm ===== */}
        <h2 className="section-title mb-3 mt-5">Danh mục sản phẩm</h2>
        <div className="row g-3">
          {categories.map((c, i) => (
            <div className="col-6 col-md-3" key={c.id}>
              <Link to={`/books?category=${c.id}`} className="cat-chip">
                <span>{String(i + 1).padStart(2, "0")}</span>
                {c.name}
              </Link>
            </div>
          ))}
        </div>

        {/* ===== Sách mới ===== */}
        <div className="d-flex justify-content-between align-items-center mb-3 mt-5">
          <h2 className="section-title mb-0">Sách mới về</h2>
          <Link to="/books" className="text-decoration-none">Xem tất cả →</Link>
        </div>
        <div className="row g-3 row-cols-2 row-cols-md-4 row-cols-xl-5 mb-3">
          {newest.map((book) => (
            <div className="col" key={book.id}>
              <BookCard book={book} />
            </div>
          ))}
        </div>

        {/* ===== Gợi ý cho bạn ===== */}
        <Recommend books={books} categories={categories} />
      </div>
      </>
      )}
    </>
  );
}