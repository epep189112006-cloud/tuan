import React, { useEffect, useState } from "react";
import api from "../services/api";

const emptyPromo = { name: "", percent: 10, start: "", end: "" };

export default function ManagePromotions() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyPromo);
  const [edit, setEdit] = useState(null);

  const load = () => {
    api.get("/promotions").then((res) => setItems(res.data)).catch(() => setItems([]));
  };

  useEffect(() => {
    load();
  }, []);

  const save = (e) => {
    e.preventDefault();

    const data = { ...form, percent: Number(form.percent) };

    if (edit) {
      api.put(`/promotions/${edit}`, data).then(() => {
        alert("Đã cập nhật khuyến mại!");
        setEdit(null);
        setForm(emptyPromo);
        load();
      });
    } else {
      api.post("/promotions", data).then(() => {
        alert("Đã thêm khuyến mại!");
        setForm(emptyPromo);
        load();
      });
    }
  };

  const del = (id) => {
    if (confirm("Xóa chương trình khuyến mại này?")) {
      api.delete(`/promotions/${id}`).then(() => load());
    }
  };

  const editItem = (x) => {
    setEdit(x.id);
    setForm(x);
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4">Quản lý khuyến mại</h1>

      <form className="card p-4 mb-4" onSubmit={save}>
        <h4>{edit ? "Cập nhật khuyến mại" : "Thêm khuyến mại"}</h4>
        <div className="row g-2">
          <div className="col-md-4">
            <input
              className="form-control"
              placeholder="Tên chương trình"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="col-md-2">
            <input
              type="number"
              className="form-control"
              placeholder="Phần trăm giảm"
              value={form.percent}
              onChange={(e) => setForm({ ...form, percent: e.target.value })}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              className="form-control"
              placeholder="Ngày bắt đầu (dd/mm/yyyy)"
              value={form.start}
              onChange={(e) => setForm({ ...form, start: e.target.value })}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              className="form-control"
              placeholder="Ngày kết thúc (dd/mm/yyyy)"
              value={form.end}
              onChange={(e) => setForm({ ...form, end: e.target.value })}
              required
            />
          </div>
          <div className="col-12">
            <button className="btn btn-primary me-2">
              {edit ? "Cập nhật" : "Thêm khuyến mại"}
            </button>
            {edit && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setEdit(null);
                  setForm(emptyPromo);
                }}
              >
                Hủy
              </button>
            )}
          </div>
        </div>
      </form>

      <table className="table table-bordered align-middle">
        <thead className="table-primary">
          <tr>
            <th>Tên chương trình</th>
            <th>Giảm</th>
            <th>Thời gian</th>
            <th style={{ width: 160 }}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {items.map((x) => (
            <tr key={x.id}>
              <td>{x.name}</td>
              <td className="text-danger fw-bold">-{x.percent}%</td>
              <td>
                {x.start} → {x.end}
              </td>
              <td>
                <button className="btn btn-warning btn-sm me-2" onClick={() => editItem(x)}>
                  Sửa
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => del(x.id)}>
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}