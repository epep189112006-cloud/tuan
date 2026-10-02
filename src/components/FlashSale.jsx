import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaBolt, FaHeart, FaShoppingCart } from "react-icons/fa";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";
import Rating from "./Rating";

const DISCOUNT = 30;

function pad(n) {
  return String(n).padStart(2, "0");
}

export default function FlashSale({ books }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlist } = useWishlist();

  const [secondsLeft, setSecondsLeft] = useState(3 * 60 * 60 + 42 * 60 + 15);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 3 * 60 * 60));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

  const salePrice = (book) => Math.round(book.price * (1 - DISCOUNT / 100));

  return (
    <div className="flash-sale">
      <div className="flash-sale-head">
        <h2 className="flash-sale-title">
          <FaBolt />
          Flash Sale
        </h2>
        <div className="flash-sale-countdown">
          <span className="label">Kết thúc sau</span>
          <span className="time-box">{pad(hours)}</span>
          <span>:</span>
          <span className="time-box">{pad(minutes)}</span>
          <span>:</span>
          <span className="time-box">{pad(seconds)}</span>
        </div>
      </div>

      <div className="flash-sale-body">
        <div className="row g-3 row-cols-2 row-cols-md-3 row-cols-lg-5">
          {books.map((book) => {
            const soldPercent = Math.min(95, Math.round(((book.sold || 0) / (book.sold + book.quantity || 1)) * 100));
            return (
              <div className="col" key={book.id}>
                <div className="card product-card h-100 shadow-sm">
                  <div className="product-thumb position-relative">
                    <img src={book.image} alt={book.name} />
                    <span className="discount-badge">-{DISCOUNT}%</span>
                    <button
                      className="btn wishlist-btn"
                      onClick={() => toggleWishlist(book)}
                      title="Yêu thích"
                    >
                      <FaHeart className={isWishlist(book.id) ? "text-danger" : "text-secondary"} />
                    </button>
                  </div>
                  <div className="card-body d-flex flex-column">
                    <Link to={`/books/${book.id}`} className="product-name">
                      {book.name}
                    </Link>
                    <div className="my-1">
                      <Rating rating={book.rating || 5} readOnly />
                    </div>
                    <div className="product-price">
                      <b>{salePrice(book).toLocaleString("vi-VN")}đ</b>
                      <span className="flash-old-price">{book.price.toLocaleString("vi-VN")}đ</span>
                    </div>
                    <div className="flash-progress">
                      <span style={{ width: `${soldPercent}%` }}></span>
                    </div>
                    <div className="flash-sold">Đã bán {soldPercent}%</div>
                    <div className="mt-auto d-flex gap-2">
                      <Link to={`/books/${book.id}`} className="btn btn-outline-primary btn-sm flex-fill">
                        Chi tiết
                      </Link>
                      <button className="btn btn-danger btn-sm" onClick={() => addToCart(book)}>
                        <FaShoppingCart />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <Link to="/books?sort=best" className="flash-see-more">
          Xem tất cả sách đang Flash Sale →
        </Link>
      </div>
    </div>
  );
}
