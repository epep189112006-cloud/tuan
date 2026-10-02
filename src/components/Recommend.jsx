import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaLightbulb, FaRedo } from "react-icons/fa";
import { useRecentlyViewed } from "../contexts/RecentlyViewedContext";
import BookCard from "./BookCard";

export default function Recommend({ books, categories }) {
  const { viewed, clearViewed } = useRecentlyViewed();
  const [goiY, setGoiY] = useState([]);

  useEffect(() => {
    if (books.length === 0) {
      setGoiY([]);
      return;
    }

    const daXem = viewed.map((b) => b.id);

    if (daXem.length === 0) {
      setGoiY(
        [...books]
          .sort((a, b) => (b.rating || 0) - (a.rating || 0) || (b.sold || 0) - (a.sold || 0))
          .slice(0, 10)
      );
      return;
    }

    const sachDaXem = books.filter((b) => daXem.includes(b.id));
    const tacGiaYeu = [...new Set(sachDaXem.map((b) => b.authorId))];
    const theLoaiYeu = [...new Set(sachDaXem.map((b) => b.categoryId))];

    const diem = (b) => {
      let s = 0;
      if (tacGiaYeu.includes(b.authorId)) s += 100;
      if (theLoaiYeu.includes(b.categoryId)) s += 40;
      s += (b.rating || 0) * 5;
      s += Math.min(Math.round((b.sold || 0) / 20), 20);
      return s;
    };

    setGoiY(
      books
        .filter((b) => !daXem.includes(b.id))
        .sort((a, b) => diem(b) - diem(a))
        .slice(0, 10)
    );
  }, [books, viewed]);

  if (goiY.length === 0) {
    return null;
  }

  const tenTheLoai = categories
    .filter((c) => c.id === viewed[0]?.categoryId)
    .map((c) => c.name)
    .join(", ");

  return (
    <div className="recommend mt-5">
      <div className="recommend-head">
        <h2 className="recommend-title">
          <FaLightbulb />
          Gợi ý cho bạn
        </h2>
        {viewed.length > 0 ? (
          <span className="recommend-note">
            Dựa trên {viewed.length} cuốn bạn đã xem
            {tenTheLoai ? ` • Thể loại bạn thích: ${tenTheLoai}` : ""}
          </span>
        ) : (
          <span className="recommend-note">Những cuốn sách được đề xuất nhiều nhất</span>
        )}
      </div>

      <div className="row g-3 row-cols-2 row-cols-md-3 row-cols-lg-5">
        {goiY.map((book) => (
          <div className="col" key={book.id}>
            <BookCard book={book} />
          </div>
        ))}
      </div>

      <div className="recommend-foot">
        <Link to="/books" className="recommend-link">
          Xem thêm sách khác →
        </Link>
        {viewed.length > 0 && (
          <button className="recommend-reset" onClick={clearViewed}>
            <FaRedo /> Xoá lịch sử xem
          </button>
        )}
      </div>
    </div>
  );
}
