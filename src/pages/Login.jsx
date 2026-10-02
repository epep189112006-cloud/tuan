import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    setError("");

    // Tài khoản admin demo
    if (email === "admin@gmail.com" && password === "123456") {
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: "Quản trị viên",
          email: "admin@gmail.com",
          role: "admin"
        })
      );
      alert("Đăng nhập với tư cách Quản trị viên!");
      navigate("/admin");
      return;
    }

    // Tìm tài khoản đã đăng ký trong localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      setError("Email hoặc mật khẩu không đúng!");
      return;
    }

    localStorage.setItem(
      "user",
      JSON.stringify({
        name: user.name,
        email: user.email,
        role: "customer"
      })
    );

    alert("Đăng nhập thành công!");
    navigate("/");
  };

  return (
    <div className="container py-5">
      <div className="auth-box mx-auto">
        <h2 className="text-center mb-4">Đăng nhập</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={submit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Mật khẩu</label>
            <input
              type="password"
              className="form-control"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="btn btn-primary w-100">Đăng nhập</button>
        </form>

        <p className="text-center mt-3">
          Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </p>

        <hr />

        <div className="small text-muted">
          <b>Admin demo:</b> admin@gmail.com / 123456
          <br />
          (Khách hàng đăng ký ở trang Đăng ký)
        </div>
      </div>
    </div>
  );
}