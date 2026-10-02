import React, { useEffect, useState } from "react";
import api from "../services/api";

const emptyForm = {
  name: "",
  authorId: "",
  categoryId: "",
  publisher: "",
  price: "",
  quantity: "",
  image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500",
  description: "",
  year: 2025,
  isbn: "",
  pages: 100,
  sold: 0
};

export default function ManageBooks() {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);

  const load = () => {
    api.get("/books").then((res) => setBooks(res.data));
  };

  useEffect(() => {
    load();
    api.get("/authors").then((res) => setAuthors(res.data));
    api.get("/categories").then((res) => setCategories(res.data));
  }, []);

  const save = (e) => {
    e.preventDefault();

    const data = {
      ...form,
      authorId: Number(form.authorId),
      categoryId: Number(form.categoryId),
      price: Number(form.price),
      quantity: Number(form.quantity),
      year: Number(form.year),
      pages: Number(form.pages),
      sold: Number(form.sold || 0)
    };

    if (editing) {
      api.put(`/books/${editing}`, data).then(() => {
        alert("Đã cập nhật sách!");
        setEditing(null);
        setForm(emptyForm);
        load();
      });
    } else {
      api.post("/books", data).then(() => {
        alert("Đã thêm sách mới!");
        setForm(emptyForm);
        load();
      });
    }
  };

  const edit = (b) => {
    setEditing(b.id);
    setForm(b);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = (id) => {
    if (confirm("Bạn có chắc muốn xóa cuốn sách này?")) {
      api.delete(`/books/${id}`).then(() => load());
    }
  };

  const setField = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  return (
    <div className="container-fluid py-5">
      <h1 className="mb-4">Quản lý sách</h1>

      <form className="card p-4 mb-4" onSubmit={save}>
        <h4>{editing ? "Cập nhật sách" : "Thêm sách mới"}</h4>
        <div className="row g-2">
          <div className="col-md-4">
            <input
              className="form-control"
              placeholder="Tên sách"
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              required
            />
          </div>
          <div className="col-md-2">
            <select
              className="form-select"
              value={form.authorId}
              onChange={(e) => setField("authorId", e.target.value)}
              required
            >
              <option value="">Tác giả...</option>
              {authors.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <select
              className="form-select"
              value={form.categoryId}
              onChange={(e) => setField("categoryId", e.target.value)}
              required
            >
              <option value="">Thể loại...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <input
              className="form-control"
              placeholder="Nhà xuất bản"
              value={form.publisher}
              onChange={(e) => setField("publisher", e.target.value)}
              required
            />
          </div>
          <div className="col-md-2">
            <input
              type="number"
              className="form-control"
              placeholder="Giá (đ)"
              value={form.price}
              onChange={(e) => setField("price", e.target.value)}
              required
            />
          </div>
          <div className="col-md-2">
            <input
              type="number"
              className="form-control"
              placeholder="Số lượng"
              value={form.quantity}
              onChange={(e) => setField("quantity", e.target.value)}
              required
            />
          </div>
          <div className="col-md-2">
            <input
              className="form-control"
              placeholder="Năm xuất bản"
              value={form.year}
              onChange={(e) => setField("year", e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <input
              className="form-control"
              placeholder="ISBN"
              value={form.isbn}
              onChange={(e) => setField("isbn", e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <input
              type="number"
              className="form-control"
              placeholder="Số trang"
              value={form.pages}
              onChange={(e) => setField("pages", e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <input
              className="form-control"
              placeholder="Link ảnh bìa"
              value={form.image}
              onChange={(e) => setField("image", e.target.value)}
            />
          </div>
          <div className="col-12">
            <textarea
              className="form-control"
              rows="2"
              placeholder="Mô tả sách"
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
            />
          </div>
          <div className="col-12">
            <button className="btn btn-primary me-2">
              {editing ? "Cập nhật sách" : "Thêm sách"}
            </button>
            {editing && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setEditing(null);
                  setForm(emptyForm);
                }}
              >
                Hủy
              </button>
            )}
          </div>
        </div>
      </form>

      <div className="table-responsive">
        <table className="table table-bordered table-striped align-middle">
          <thead className="table-primary">
            <tr>
              <th>ID</th>
              <th>Ảnh</th>
              <th>Tên sách</th>
              <th>Thể loại</th>
              <th>Tác giả</th>
              <th>Giá</th>
              <th>Tồn kho</th>
              <th>Đã bán</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {books.map((b) => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td><img src={b.image} width="40" height="55" style={{ objectFit: "cover" }} alt="" /></td>
                <td>{b.name}</td>
                <td>{categories.find((c) => c.id === b.categoryId)?.name || "-"}</td>
                <td>{authors.find((a) => a.id === b.authorId)?.name || "-"}</td>
                <td>{b.price.toLocaleString("vi-VN")}đ</td>
                <td>{b.quantity}</td>
                <td>{b.sold || 0}</td>
                <td>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => edit(b)}>Sửa</button>
                  <button className="btn btn-danger btn-sm" onClick={() => remove(b.id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}