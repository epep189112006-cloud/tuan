# Tri Thức Book - Website Nhà sách trực tuyến (ReactJS)

Đồ án môn Lập trình Web với ReactJS - Đề tài 13: Website Nhà sách trực tuyến.

## 1. Cách chạy

```bash
npm install
```

Mở Terminal 1 (chạy backend JSON Server):

```bash
npm run server
```

Mở Terminal 2 (chạy React):

```bash
npm run dev
```

Truy cập http://localhost:5173 (hoặc đường dẫn Vite hiển thị).

## 2. Công nghệ sử dụng

- React 19 + Vite
- React Router (điều hướng SPA, route động và trang 404)
- Context API (giỏ hàng, wishlist, lịch sử xem sách)
- Hooks: useState, useEffect, useRef, useContext
- Axios (gọi API)
- JSON Server (dữ liệu giả, db.json)
- Bootstrap 5 (giao diện responsive)

## 3. Tài khoản demo

| Vai trò | Email | Mật khẩu |
| --- | --- | --- |
| Quản trị viên | admin@gmail.com | 123456 |

Khách hàng tự đăng ký ở trang /register.

## 4. Chức năng

Khách / Khách hàng:

- Danh mục sách theo thể loại, tác giả, nhà xuất bản; tìm kiếm; lọc theo giá.
- Chi tiết sách: ảnh bìa, mô tả, thông tin xuất bản, sách cùng tác giả.
- Đánh giá sao + nhận xét cho sách đã mua.
- Giỏ hàng và đặt hàng, phí vận chuyển theo khu vực (Hà Nội / TP.HCM / tỉnh khác).
- Danh sách yêu thích (wishlist).
- Flash Sale: đồng hồ đếm ngược, giảm giá 30%.
- Gợi ý cho bạn: tự động đề xuất sách dựa trên lịch sử xem (lưu ở trình duyệt).
- Trang 404 khi truy cập sai đường dẫn.
- Tìm kiếm nhanh bằng phím tắt `/`.

Quản trị viên:

- Dashboard: sách bán chạy, doanh thu theo thể loại.
- CRUD sách - thể loại - tác giả.
- Quản lý tồn kho.
- Quản lý đơn hàng (cập nhật trạng thái).
- Quản lý khuyến mại.

## 5. Cấu trúc thư mục

```
src/
|-- admin/       (trang quản trị)
|-- components/  (component dùng lại: BookCard, Rating, Pagination, Header, Footer, FlashSale, Recommend)
|-- contexts/    (Context API: giỏ hàng, wishlist, lịch sử xem sách)
|-- pages/       (trang người dùng: Home, Books, BookDetail, Cart, Checkout, NotFound)
|-- services/    (gọi API bằng axios)
|-- App.jsx      (định nghĩa route)
|-- main.jsx     (khởi tạo ứng dụng)
```