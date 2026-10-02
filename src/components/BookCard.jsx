import React from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";
import Rating from "./Rating";

export default function BookCard({ book }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlist } = useWishlist();

  return (
    <div className="card product-card h-100 shadow-sm">
      <div className="product-thumb position-relative">
        <img src={book.image} alt={book.name} />
        <button
          className="btn wishlist-btn"
          onClick={() => toggleWishlist(book)}
          title="Yêu thích"
        >
          <FaHeart className={isWishlist(book.id) ? "text-danger" : "text-secondary"} />
        </button>
      </div>
      <div className="card-body d-flex flex-column p-3">
        <Link to={`/books/${book.id}`} className="product-name">
          {book.name}
        </Link>
        <div className="my-1">
          <Rating rating={book.rating || 5} readOnly />
        </div>
        <div className="product-price">
          <b>{book.price.toLocaleString("vi-VN")}đ</b>
        </div>
        <small className="text-muted mb-2">Đã bán: {book.sold || 0}</small>
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
  );
}