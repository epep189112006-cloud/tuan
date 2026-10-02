import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function ManageCategories() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);

  const load = () => {
    api.get("/categories").then((res) => setItems(res.data));
  };

  useEffect(() => {
    load();
  }, []);

  const save = () => {
    if (name.trim() === "") {
      alert("Vui lòng nhập tên thể loại!");
      return;
    }

    if (editId) {
      api.put(`/categories/${editId}`, { name }).then(() => {
        alert("Đã cập nhật thể loại!");
        setName("");
        setEditId(null);
        load();
      });
    } else {
      api.post("/categories", { name }).then(() => {
        alert("Đã thêm thể loại!");
        setName("");
        load();
      });
    }
  };

  const del = (id) => {
    if (confirm("Xóa thể loại này?")) {
      api.delete(`/categories/${id}`).then(() => load());
    }
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4">Quản lý thể loại</h1>

      <div className="input-group mb-4" style={{ maxWidth: 500 }}>
        <input
          className="form-control"
          placeholder="Nhập tên thể loại..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="btn btn-primary" onClick={save}>
          {editId ? "Cập nhật" : "Thêm"}
        </button>
      </div>

      <table className="table table-bordered" style={{ maxWidth: 600 }}>
        <thead className="table-primary">
          <tr>
            <th>ID</th>
            <th>Tên thể loại</th>
            <th style={{ width: 150 }}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {items.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.name}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => {
                    setEditId(c.id);
                    setName(c.name);
                  }}
                >
                  Sửa
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => del(c.id)}>
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