import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../contexts/CartContext";

export default function Checkout() {
  const { cartItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    area: "hanoi",
    payment: "COD"
  });

  let shipping = 40000;
  if (form.area === "hanoi") shipping = 25000;
  if (form.area === "hcm") shipping = 30000;

  const total = totalPrice + shipping;

  const submit = (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert("Giỏ hàng đang trống!");
      return;
    }

    const order = {
      customer: {
        name: form.name,
        phone: form.phone,
        address: form.address,
        area: form.area,
        payment: form.payment
      },
      items: cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        categoryId: item.categoryId,
        authorId: item.authorId
      })),
      subtotal: totalPrice,
      shipping: shipping,
      total: total,
      status: "Chờ xác nhận",
      date: new Date().toLocaleString("vi-VN")
    };

    api.post("/orders", order).then(() => {
      clearCart();
      alert("Đặt hàng thành công!");
      navigate("/orders");
    });
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4">Thanh toán & đặt hàng</h1>

      <form onSubmit={submit} className="row g-4">
        <div className="col-md-7">
          <div className="card p-4">
            <h4>📦 Thông tin nhận hàng</h4>

            <label className="form-label mt-3">Họ và tên</label>
            <input
              className="form-control"
              placeholder="Nguyễn Văn A"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <label className="form-label mt-3">Số điện thoại</label>
            <input
              className="form-control"
              placeholder="0901234567"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />

            <label className="form-label mt-3">Địa chỉ giao hàng</label>
            <input
              className="form-control"
              placeholder="Số nhà, đường, quận..."
              required
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />

            <label className="form-label mt-3">Khu vực giao hàng</label>
            <select
              className="form-select"
              value={form.area}
              onChange={(e) => setForm({ ...form, area: e.target.value })}
            >
              <option value="hanoi">Hà Nội - 25.000đ</option>
              <option value="hcm">TP.HCM - 30.000đ</option>
              <option value="other">Tỉnh khác - 40.000đ</option>
            </select>

            <label className="form-label mt-3">Phương thức thanh toán</label>
            <select
              className="form-select"
              value={form.payment}
              onChange={(e) => setForm({ ...form, payment: e.target.value })}
            >
              <option value="COD">Thanh toán khi nhận hàng (COD)</option>
              <option value="Chuyển khoản">Chuyển khoản ngân hàng</option>
            </select>
          </div>
        </div>

        <div className="col-md-5">
          <div className="card p-4">
            <h4>🧾 Đơn hàng của bạn</h4>

            {cartItems.map((item) => (
              <div className="d-flex justify-content-between mb-2" key={item.id}>
                <span>
                  {item.name} <b>x{item.quantity}</b>
                </span>
                <b>{(item.price * item.quantity).toLocaleString("vi-VN")}đ</b>
              </div>
            ))}

            <hr />
            <p className="mb-1">Tạm tính: {totalPrice.toLocaleString("vi-VN")}đ</p>
            <p className="mb-1">Phí vận chuyển: {shipping.toLocaleString("vi-VN")}đ</p>
            <h4 className="text-danger text-end">
              Tổng cộng: {total.toLocaleString("vi-VN")}đ
            </h4>

            <button className="btn btn-primary w-100 mt-3 btn-lg">
              XÁC NHẬN ĐẶT HÀNG
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}