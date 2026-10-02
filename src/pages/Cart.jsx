import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { useCart } from "../contexts/CartContext";

export default function Cart() {
  const {
    cartItems,
    tangSoLuong,
    giamSoLuong,
    removeItem,
    totalPrice,
    totalItems
  } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h2>🛒 Giỏ hàng đang trống</h2>
        <p className="text-muted">Hãy chọn những cuốn sách yêu thích nhé!</p>
        <Link to="/books" className="btn btn-primary mt-2">
          Mua sách ngay
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="mb-4">Giỏ hàng của tôi</h1>

      <div className="row g-4">
        <div className="col-lg-8">
          {cartItems.map((item) => (
            <div className="card p-3 mb-3" key={item.id}>
              <div className="d-flex align-items-center gap-3">
                <img src={item.image} alt={item.name} className="cart-img" />
                <div className="flex-grow-1">
                  <Link to={`/books/${item.id}`} className="text-decoration-none text-dark fw-bold">
                    {item.name}
                  </Link>
                  <div className="text-danger fw-bold">
                    {item.price.toLocaleString("vi-VN")}đ / cuốn
                  </div>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <button className="btn btn-outline-secondary btn-sm" onClick={() => giamSoLuong(item.id)}>
                    -
                  </button>
                  <span className="fs-5 w-25 text-center">{item.quantity}</span>
                  <button className="btn btn-outline-secondary btn-sm" onClick={() => tangSoLuong(item.id)}>
                    +
                  </button>
                </div>
                <div className="col-2 text-end">
                  <b>{(item.price * item.quantity).toLocaleString("vi-VN")}đ</b>
                </div>
                <button className="btn btn-outline-danger" onClick={() => removeItem(item.id)}>
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="col-lg-4">
          <div className="cart-summary">
            <h5 className="border-bottom pb-2">Tóm tắt đơn hàng</h5>
            <div className="d-flex justify-content-between mb-2">
              <span>Sản phẩm ({totalItems})</span>
              <b>{totalPrice.toLocaleString("vi-VN")}đ</b>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>Phí vận chuyển</span>
              <span className="text-muted">Tính khi đặt hàng</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between mb-3">
              <span className="fw-bold">Tổng cộng</span>
              <b className="text-danger fs-5">{totalPrice.toLocaleString("vi-VN")}đ</b>
            </div>
            <button
              className="btn btn-danger w-100 btn-lg"
              onClick={() => navigate("/checkout")}
            >
              Tiến hành đặt hàng →
            </button>
            <Link to="/books" className="btn btn-outline-secondary w-100 mt-2">
              Tiếp tục mua sách
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}