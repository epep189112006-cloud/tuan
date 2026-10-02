import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaYoutube, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container py-4">
        <div className="row g-4">
          <div className="col-md-3">
            <h6>TRI THỨC BOOK</h6>
            <p className="small text-muted">
              Nền tảng mua sắm sách trực tuyến hàng đầu Việt Nam. Hàng chục
              nghìn đầu sách thuộc mọi thể loại.
            </p>
            <div className="d-flex gap-2 fs-5">
              <a href="#"><FaFacebook /></a>
              <a href="#"><FaYoutube /></a>
              <a href="#"><FaInstagram /></a>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <h6>VỀ CHÚNG TÔI</h6>
            <ul className="footer-list">
              <li><Link to="/books">Giới thiệu</Link></li>
              <li><Link to="/books">Tuyển dụng</Link></li>
              <li><Link to="/books">Tin tức</Link></li>
              <li><Link to="/books">Hệ thống cửa hàng</Link></li>
            </ul>
          </div>

          <div className="col-6 col-md-3">
            <h6>HỖ TRỢ KHÁCH HÀNG</h6>
            <ul className="footer-list">
              <li><Link to="/orders">Tra cứu đơn hàng</Link></li>
              <li><Link to="/cart">Giỏ hàng</Link></li>
              <li><Link to="/wishlist">Sản phẩm yêu thích</Link></li>
              <li><Link to="/admin">Hệ thống quản trị</Link></li>
            </ul>
          </div>

          <div className="col-md-3">
            <h6>LIÊN HỆ</h6>
            <ul className="footer-list">
              <li>Hotline: 1900-1234</li>
              <li>Email: support@trithucbook.vn</li>
              <li>Giao hàng toàn quốc</li>
              <li>Thanh toán COD / Chuyển khoản</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container text-center small py-2">
          © 2026 Tri Thức Book - Đồ án Lập trình Web với ReactJS
        </div>
      </div>
    </footer>
  );
}