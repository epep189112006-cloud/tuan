import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getBooks, getCategories, getAuthors } from "../services/api";
import BookCard from "../components/BookCard";
import Pagination from "../components/Pagination";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);

  const [searchParams, setSearchParams] = useSearchParams();

  const keyword = searchParams.get("keyword") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "";
  const [author, setAuthor] = useState("");
  const [publisher, setPublisher] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [page, setPage] = useState(1);
  const [dangTai, setDangTai] = useState(true);
  const [loi, setLoi] = useState("");

  useEffect(() => {
    let huy = false;
    setDangTai(true);
    setLoi("");

    Promise.all([getBooks(), getCategories(), getAuthors()])
      .then(([resBooks, resCats, resAuthors]) => {
        if (huy) return;
        setBooks(resBooks.data);
        setCategories(resCats.data);
        setAuthors(resAuthors.data);
      })
      .catch(() => {
        if (huy) return;
        setLoi("Không tải được danh sách sách. Hãy kiểm tra JSON Server đã chạy chưa (npm run server).");
      })
      .finally(() => {
        if (!huy) setDangTai(false);
      });

    return () => {
      huy = true;
    };
  }, []);

  useEffect(() => {
    setPage(1);
  }, [keyword, category, sort, author, publisher, maxPrice]);

  const publishers = [];
  books.forEach((b) => {
    if (b.publisher && !publishers.includes(b.publisher)) {
      publishers.push(b.publisher);
    }
  });

  let result = books.filter((b) => {
    const matchTen = b.name.toLowerCase().includes(keyword.toLowerCase());
    const matchCategory = category === "" || b.categoryId === Number(category);
    const matchAuthor = author === "" || b.authorId === Number(author);
    const matchNxb = publisher === "" || b.publisher === publisher;
    const matchGia = maxPrice === "" || b.price <= Number(maxPrice);
    return matchTen && matchCategory && matchAuthor && matchNxb && matchGia;
  });

  if (sort === "asc") result = [...result].sort((a, b) => a.price - b.price);
  if (sort === "desc") result = [...result].sort((a, b) => b.price - a.price);
  if (sort === "best") result = [...result].sort((a, b) => (b.sold || 0) - (a.sold || 0));

  const perPage = 8;
  const totalPages = Math.ceil(result.length / perPage);
  const currentPage = Math.min(page, Math.max(totalPages, 1));
  const visible = result.slice((currentPage - 1) * perPage, currentPage * perPage);

  const doiLoc = (setter, value) => {
    setter(value);
    setPage(1);
  };

  const doiUrl = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value === "") {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next);
  };

  return (
    <div className="container py-5">
      {dangTai && (
        <div className="text-center my-5">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
          <p className="text-muted mt-3">Đang tải danh sách sách...</p>
        </div>
      )}

      {!dangTai && loi && (
        <div className="alert alert-danger text-center">
          {loi}
          <button className="btn btn-sm btn-outline-danger ms-2" onClick={() => window.location.reload()}>
            Thử lại
          </button>
        </div>
      )}

      {!dangTai && !loi && (
      <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Danh mục sách</h1>
        <span className="text-muted">{result.length} kết quả</span>
      </div>

      <div className="filter-box p-3 mb-4">
        <div className="row g-2">
          <div className="col-md-3">
            <input
              className="form-control"
              placeholder="Tìm tên sách..."
              value={keyword}
              onChange={(e) => doiUrl("keyword", e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <select
              className="form-select"
              value={category}
              onChange={(e) => doiUrl("category", e.target.value)}
            >
              <option value="">Tất cả thể loại</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <select
              className="form-select"
              value={author}
              onChange={(e) => doiLoc(setAuthor, e.target.value)}
            >
              <option value="">Tất cả tác giả</option>
              {authors.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <select
              className="form-select"
              value={publisher}
              onChange={(e) => doiLoc(setPublisher, e.target.value)}
            >
              <option value="">Nhà xuất bản</option>
              {publishers.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>
          <div className="col-md-1">
            <select
              className="form-select"
              value={maxPrice}
              onChange={(e) => doiLoc(setMaxPrice, e.target.value)}
            >
              <option value="">Giá</option>
              <option value="100000">≤ 100k</option>
              <option value="200000">≤ 200k</option>
              <option value="500000">≤ 500k</option>
            </select>
          </div>
          <div className="col-md-2">
            <select
              className="form-select"
              value={sort}
              onChange={(e) => doiUrl("sort", e.target.value)}
            >
              <option value="">Sắp xếp</option>
              <option value="asc">Giá thấp → cao</option>
              <option value="desc">Giá cao → thấp</option>
              <option value="best">Bán chạy nhất</option>
            </select>
          </div>
        </div>
      </div>

      <div className="row g-3 row-cols-2 row-cols-md-4 row-cols-xl-5">
        {visible.map((book) => (
          <div className="col" key={book.id}>
            <BookCard book={book} />
          </div>
        ))}
      </div>

      {visible.length === 0 && (
        <div className="alert alert-warning mt-4 text-center">
          Không tìm thấy sách phù hợp với bộ lọc.
        </div>
      )}

      <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} />
      </>
      )}
    </div>
  );
}