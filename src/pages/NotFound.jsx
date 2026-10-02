import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCategories } from "../services/api";

export default function NotFound() {
  const navigate = useNavigate();
  const dauTrangRef = useRef(null);

  useEffect(() => {
    dauTrangRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const veTrangChu = () => navigate("/");

  return (
    <div className="container py-5 text-center not-found" ref={dauTrangRef}>
      <div className="not-found-code">404</div>
      <h1 className="not-found-title">Không tìm thấy trang</h1>
      <p className="text-muted mb-4">
        Rất tiếc, đường dẫn bạn truy cập không tồn tại hoặc đã bị xoá.
        <br />
        Có thể bạn gõ sai địa chỉ, hoặc trang đã được chuyển đi nơi khác.
      </p>
      <div className="d-flex justify-content-center gap-2 flex-wrap">
        <button className="btn btn-danger px-4" onClick={veTrangChu}>
          Về trang chủ
        </button>
        <Link to="/books" className="btn btn-outline-secondary px-4">
          Xem tất cả sách
        </Link>
      </div>

      <div className="not-found-cats">
        <p className="text-muted small mb-2">Hoặc thử các thể loại sau:</p>
        <div className="d-flex justify-content-center gap-2 flex-wrap">
          <DanhMucNhanh />
        </div>
      </div>
    </div>
  );
}

function DanhMucNhanh() {
  const [danhMuc, setDanhMuc] = React.useState([]);

  useEffect(() => {
    getCategories()
      .then((res) => setDanhMuc(res.data))
      .catch(() => setDanhMuc([]));
  }, []);

  return danhMuc.map((c) => (
    <Link key={c.id} to={`/books?category=${c.id}`} className="btn btn-sm btn-outline-primary">
      {c.name}
    </Link>
  ));
}
