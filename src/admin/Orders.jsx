import React, { useEffect, useState } from "react";
import api from "../services/api";

const danhSachTrangThai = ["Chờ xác nhận", "Đã xác nhận", "Đang giao", "Đã giao", "Đã hủy"];

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);

  const load = () => {
    api.get("/orders").then((res) => setOrders(res.data));
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = (order, status) => {
    api.patch(`/orders/${order.id}`, { status }).then(() => {
      alert(`Đã cập nhật trạng thái đơn #${order.id}: ${status}`);
      load();
    });
  };

  return (
    <div className="container-fluid py-5">
      <h1 className="mb-4">Quản lý đơn hàng</h1>

      <div className="table-responsive">
        <table className="table table-bordered align-middle">
          <thead className="table-primary">
            <tr>
              <th>ID</th>
              <th>Khách hàng</th>
              <th>Sản phẩm</th>
              <th>Tổng tiền</th>
              <th>Ngày đặt</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>#{o.id}</td>
                <td>
                  <b>{o.customer?.name}</b>
                  <br />
                  <small className="text-muted">
                    {o.customer?.phone} - {o.customer?.address}
                  </small>
                  <br />
                  <small>{o.customer?.payment}</small>
                </td>
                <td>
                  {o.items?.map((item) => (
                    <div key={item.id} className="small">
                      {item.name} x{item.quantity}
                    </div>
                  ))}
                </td>
                <td className="fw-bold">{(o.total || 0).toLocaleString("vi-VN")}đ</td>
                <td>{o.date}</td>
                <td>
                  <select
                    className="form-select"
                    value={o.status}
                    onChange={(e) => updateStatus(o, e.target.value)}
                  >
                    {danhSachTrangThai.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}