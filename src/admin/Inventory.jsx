import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function ManageInventory() {
  const [books, setBooks] = useState([]);

  const load = () => {
    api.get("/books").then((res) => setBooks(res.data));
  };

  useEffect(() => {
    load();
  }, []);

  const updateQuantity = (book, value) => {
    const quantity = Math.max(0, Number(value));
    if (Number.isNaN(quantity)) return;

    api.patch(`/books/${book.id}`, { quantity }).then(() => {
      alert(`Đã cập nhật tồn kho "${book.name}" thành ${quantity}!`);
      load();
    });
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4">Quản lý tồn kho</h1>

      <table className="table table-bordered align-middle">
        <thead className="table-primary">
          <tr>
            <th>Sách</th>
            <th>Tồn kho hiện tại</th>
            <th>Điều chỉnh</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {books.map((b) => (
            <tr key={b.id}>
              <td>{b.name}</td>
              <td className="fw-bold">{b.quantity}</td>
              <td style={{ maxWidth: 150 }}>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  defaultValue={b.quantity}
                  onBlur={(e) => updateQuantity(b, e.target.value)}
                />
              </td>
              <td>
                {b.quantity <= 5 ? (
                  <span className="badge bg-danger">Sắp hết hàng</span>
                ) : (
                  <span className="badge bg-success">Còn hàng</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}