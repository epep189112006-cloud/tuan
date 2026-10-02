import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user || user.role !== "admin") {
      alert("Bạn cần đăng nhập với tài khoản quản trị viên!");
      navigate("/login");
      return;
    }

    api.get("/books").then((res) => setBooks(res.data));
    api.get("/categories").then((res) => setCategories(res.data));
    api.get("/orders").then((res) => setOrders(res.data)).catch(() => setOrders([]));
  }, []);

  const doanhThu = orders
    .filter((o) => o.status !== "Đã hủy")
    .reduce((sum, o) => sum + (o.total || 0), 0);

  const bestSellers = [...books].sort((a, b) => (b.sold || 0) - (a.sold || 0)).slice(0, 5);

  const doanhThuTheoTheLoai = categories.map((c) => {
    let revenue = 0;
    orders
      .filter((o) => o.status !== "Đã hủy")
      .forEach((o) => {
        (o.items || []).forEach((item) => {
          if (item.categoryId === c.id) {
            revenue += item.price * item.quantity;
          }
        });
      });
    return { name: c.name, revenue: revenue };
  });

  const maxRevenue = Math.max(1, ...doanhThuTheoTheLoai.map((x) => x.revenue));

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>📊 Bảng điều khiển</h1>
        <div>
          <Link className="btn btn-outline-primary btn-sm" to="/admin/books">Sách</Link>{" "}
          <Link className="btn btn-outline-primary btn-sm" to="/admin/categories">Thể loại</Link>{" "}
          <Link className="btn btn-outline-primary btn-sm" to="/admin/authors">Tác giả</Link>{" "}
          <Link className="btn btn-outline-primary btn-sm" to="/admin/inventory">Tồn kho</Link>{" "}
          <Link className="btn btn-outline-primary btn-sm" to="/admin/orders">Đơn hàng</Link>{" "}
          <Link className="btn btn-outline-primary btn-sm" to="/admin/promotions">Khuyến mại</Link>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-6 col-lg-3">
          <div className="stat-card">
            <small>Tổng số sách</small>
            <h2>{books.length}</h2>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="stat-card">
            <small>Đơn hàng</small>
            <h2>{orders.length}</h2>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="stat-card">
            <small>Tổng tồn kho</small>
            <h2>{books.reduce((sum, b) => sum + b.quantity, 0)}</h2>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="stat-card">
            <small>Doanh thu</small>
            <h2>{doanhThu.toLocaleString("vi-VN")}đ</h2>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card p-4 h-100">
            <h4>🏆 Sách bán chạy</h4>
            {bestSellers.map((b, i) => (
              <div className="d-flex justify-content-between border-bottom py-2" key={b.id}>
                <span>{i + 1}. {b.name}</span>
                <b>{b.sold || 0} cuốn</b>
              </div>
            ))}
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card p-4 h-100">
            <h4>💰 Doanh thu theo thể loại</h4>
            {doanhThuTheoTheLoai.map((x) => (
              <div className="mb-3" key={x.name}>
                <div className="d-flex justify-content-between">
                  <span>{x.name}</span>
                  <b>{x.revenue.toLocaleString("vi-VN")}đ</b>
                </div>
                <div className="progress mt-1">
                  <div
                    className="progress-bar"
                    style={{ width: (x.revenue / maxRevenue) * 100 + "%" }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}