import React from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../contexts/WishlistContext";
import BookCard from "../components/BookCard";

export default function Wishlist() {
  const { wishlist } = useWishlist();

  return (
    <div className="container py-5">
      <h1 className="mb-4">❤️ Danh sách yêu thích</h1>

      {wishlist.length === 0 ? (
        <div className="alert alert-info text-center">
          Bạn chưa yêu thích cuốn sách nào.{" "}
          <Link to="/books" className="alert-link">
            Khám phá sách ngay
          </Link>
        </div>
      ) : (
        <div className="row g-3 row-cols-2 row-cols-md-4 row-cols-xl-5">
          {wishlist.map((book) => (
            <div className="col" key={book.id}>
              <BookCard book={book} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}