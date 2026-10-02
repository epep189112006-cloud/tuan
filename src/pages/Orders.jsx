import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api
      .get("/orders")
      .then((res) => setOrders(res.data))
      .catch(() => setOrders([]));
  }, []);

  const mauTrangThai = (status) => {
    if (status === "Đã giao") return "bg-success";
    if (status === "Đã hủy") return "bg-danger";
    if (status === "Đang giao" || status === "Đã xác nhận") return "bg-info";
    return "bg-warning";
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4">Đơn hàng của tôi</h1>

      {orders.length === 0 && (
        <div className="alert alert-info text-center">Chưa có đơn hàng nào.</div>
      )}

      {orders.map((o, index) => (
        <div className="card p-4 mb-3" key={o.id || index}>
          <div className="d-flex justify-content-between align-items-center">
            <b>Đơn hàng #{o.id}</b>
            <span className={`badge ${mauTrangThai(o.status)}`}>{o.status}</span>
          </div>
          <hr />
          <div className="row">
            <div className="col-md-7">
              <p className="mb-1"><b>Khách hàng:</b> {o.customer?.name}</p>
              <p className="mb-1"><b>SĐT:</b> {o.customer?.phone}</p>
              <p className="mb-1"><b>Địa chỉ:</b> {o.customer?.address}</p>
              <p className="mb-1"><b>Thanh toán:</b> {o.customer?.payment}</p>
              <p className="mb-0"><b>Ngày đặt:</b> {o.date}</p>
            </div>
            <div className="col-md-5 text-end">
              <h5 className="text-danger">Tổng: {(o.total || 0).toLocaleString("vi-VN")}đ</h5>
              <div className="mt-1 text-start">
                {o.items?.map((item) => (
                  <div key={item.id} className="small">
                    • {item.name} x{item.quantity}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}