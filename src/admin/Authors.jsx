import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function ManageAuthors() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);

  const load = () => {
    api.get("/authors").then((res) => setItems(res.data));
  };

  useEffect(() => {
    load();
  }, []);

  const save = () => {
    if (name.trim() === "") {
      alert("Vui lòng nhập tên tác giả!");
      return;
    }

    if (editId) {
      api.put(`/authors/${editId}`, { name }).then(() => {
        alert("Đã cập nhật tác giả!");
        setName("");
        setEditId(null);
        load();
      });
    } else {
      api.post("/authors", { name }).then(() => {
        alert("Đã thêm tác giả!");
        setName("");
        load();
      });
    }
  };

  const del = (id) => {
    if (confirm("Xóa tác giả này?")) {
      api.delete(`/authors/${id}`).then(() => load());
    }
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4">Quản lý tác giả</h1>

      <div className="input-group mb-4" style={{ maxWidth: 500 }}>
        <input
          className="form-control"
          placeholder="Nhập tên tác giả..."
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
            <th>Tên tác giả</th>
            <th style={{ width: 150 }}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {items.map((a) => (
            <tr key={a.id}>
              <td>{a.id}</td>
              <td>{a.name}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => {
                    setEditId(a.id);
                    setName(a.name);
                  }}
                >
                  Sửa
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => del(a.id)}>
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