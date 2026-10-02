import React, { useEffect, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api, { getAuthors, getBook, getBooks, getCategories, getReviews } from "../services/api";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";
import { useRecentlyViewed } from "../contexts/RecentlyViewedContext";
import Rating from "../components/Rating";
import BookCard from "../components/BookCard";

export default function BookDetail() {
  const { id } = useParams();

  const [book, setBook] = useState(null);
  const [author, setAuthor] = useState(null);
  const [category, setCategory] = useState(null);
  const [allBooks, setAllBooks] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [daMua, setDaMua] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [qty, setQty] = useState(1);

  const { addToCart } = useCart();
  const { toggleWishlist, isWishlist } = useWishlist();
  const { addViewed } = useRecentlyViewed();
  const navigate = useNavigate();
  const dauTrangRef = useRef(null);

  useEffect(() => {
    setQty(1);
    dauTrangRef.current?.scrollIntoView({ behavior: "smooth" });
    getBook(id).then((res) => {
      setBook(res.data);
      addViewed(res.data);
      getAuthor(res.data.authorId);
      getCategory(res.data.categoryId);
    });
    getBooks().then((res) => setAllBooks(res.data));
    getReviews().then((res) => {
      const rs = res.data.filter((r) => r.bookId === Number(id));
      setReviews(rs);
    });
    kiemTraDaMua(id);
  }, [id]);

  const getAuthor = (authorId) => {
    getAuthors().then((res) => {
      const a = res.data.find((x) => x.id === authorId);
      setAuthor(a || null);
    });
  };

  const getCategory = (categoryId) => {
    getCategories().then((res) => {
      const c = res.data.find((x) => x.id === categoryId);
      setCategory(c || null);
    });
  };

  const kiemTraDaMua = (bookId) => {
    api
      .get("/orders")
      .then((res) => {
        const orders = res.data;
        const coMua = orders.some(
          (o) => o.items && o.items.some((item) => item.id === Number(bookId))
        );
        setDaMua(coMua);
      })
      .catch(() => setDaMua(false));
  };

  const guiDanhGia = () => {
    if (!daMua) {
      alert("Bạn chỉ có thể đánh giá sau khi đã mua sách.");
      return;
    }
    if (comment.trim() === "") {
      alert("Vui lòng nhập nội dung nhận xét.");
      return;
    }
    const newReview = {
      bookId: book.id,
      rating: rating,
      comment: comment,
      user: "Khách hàng",
      date: new Date().toLocaleDateString("vi-VN")
    };
    api.post("/reviews", newReview).then(() => {
      setReviews([...reviews, newReview]);
      setComment("");
      alert("Đã gửi đánh giá. Cảm ơn bạn!");
    });
  };

  const muaNgay = () => {
    addToCart(book, qty);
    navigate("/checkout");
  };

  if (!book) {
    return (
      <div className="container py-5 text-center" ref={dauTrangRef}>
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
        <p className="text-muted mt-3">Đang tải thông tin sách...</p>
      </div>
    );
  }

  const sachCungTacGia = allBooks.filter(
    (b) => b.authorId === book.authorId && b.id !== book.id
  );

  return (
    <div className="container py-5" ref={dauTrangRef}>
      <nav className="mb-3">
        <Link to="/books" className="text-muted">
          ← Về danh mục sách
        </Link>
      </nav>

      <div className="row g-5">
        <div className="col-md-5 text-center">
          <img src={book.image} className="detail-image" alt={book.name} />
        </div>
        <div className="col-md-7">
          <h1>{book.name}</h1>
          <div className="mb-2">
            <Rating rating={book.rating || 5} readOnly />
          </div>
          <h2 className="text-danger my-3">{book.price.toLocaleString("vi-VN")}đ</h2>
          <p className="lead">{book.description}</p>
          <div className="book-info">
            <p><b>Tác giả:</b> {author ? author.name : "Đang cập nhật"}</p>
            <p><b>Thể loại:</b> {category ? category.name : "Đang cập nhật"}</p>
            <p><b>Nhà xuất bản:</b> {book.publisher}</p>
            <p><b>Năm xuất bản:</b> {book.year || "2025"}</p>
            <p><b>ISBN:</b> {book.isbn || "Đang cập nhật"}</p>
            <p><b>Số trang:</b> {book.pages || "Đang cập nhật"}</p>
            <p>
              <b>Tồn kho:</b>{" "}
              <span className={book.quantity <= 5 ? "text-danger fw-bold" : "text-success"}>
                {book.quantity}
              </span>
            </p>
          </div>
          <div className="purchase-box mt-3">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <span className="fw-bold">Số lượng:</span>
              <div className="qty-stepper">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty((q) => Math.min(book.quantity, q + 1))}>
                  +
                </button>
              </div>
            </div>
            <div className="d-grid gap-2">
              <button
                className="btn btn-danger btn-lg"
                disabled={!book.quantity}
                onClick={muaNgay}
              >
                MUA NGAY
              </button>
              <button
                className="btn btn-primary btn-lg"
                disabled={!book.quantity}
                onClick={() => addToCart(book, qty)}
              >
                Thêm vào giỏ hàng
              </button>
            </div>
            <button
              className="btn btn-outline-danger w-100 mt-2"
              onClick={() => toggleWishlist(book)}
            >
              {isWishlist(book.id) ? "♥ Đã yêu thích" : "♡ Yêu thích"}
            </button>
            <small className="text-muted d-block mt-3">
              🚚 Giao hàng toàn quốc, phí vận chuyển được tính theo khu vực khi đặt hàng.
            </small>
          </div>
        </div>
      </div>

      <div className="card p-4 mt-5">
        <h3>Đánh giá và nhận xét</h3>

        {daMua ? (
          <div>
            <p className="text-success mb-1">
              ✓ Bạn đã mua sách này, hãy chia sẻ đánh giá của bạn.
            </p>
            <div className="my-2">
              <Rating rating={rating} onChange={setRating} />
              <small className="ms-2 text-muted">({rating} sao)</small>
            </div>
            <textarea
              className="form-control my-2"
              rows="4"
              placeholder="Viết nhận xét của bạn về cuốn sách..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button className="btn btn-success" onClick={guiDanhGia}>
              Gửi đánh giá
            </button>
          </div>
        ) : (
          <div className="alert alert-info">
            Bạn cần mua cuốn sách này trước khi có thể viết đánh giá.
          </div>
        )}

        <hr />

        {reviews.length === 0 ? (
          <p className="text-muted">Chưa có nhận xét nào cho cuốn sách này.</p>
        ) : (
          reviews.map((r, index) => (
            <div className="border-bottom py-3" key={r.id || index}>
              <div className="d-flex justify-content-between">
                <b>{r.user}</b>
                <small className="text-muted">{r.date}</small>
              </div>
              <Rating rating={r.rating} readOnly />
              <p className="mb-0 mt-1">{r.comment}</p>
            </div>
          ))
        )}
      </div>

      <h3 className="mt-5">Sách cùng tác giả: {author ? author.name : ""}</h3>
      <div className="row g-4">
        {sachCungTacGia.map((b) => (
          <div className="col-6 col-md-3" key={b.id}>
            <BookCard book={b} />
          </div>
        ))}
      </div>
      {sachCungTacGia.length === 0 && (
        <p className="text-muted">Không có sách nào khác cùng tác giả.</p>
      )}
    </div>
  );
}