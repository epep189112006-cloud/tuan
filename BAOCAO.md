# BÁO CÁO ĐỒ ÁN
## Website "Tri Thức Book" - Nhà sách trực tuyến

**Môn: Lập trình Web với ReactJS**

**Đề tài 13: Website Nhà sách trực tuyến**

---

## 1. Tổng quan đề tài

Xây dựng website bán sách online với đầy đủ các chức năng của một nhà sách:
duyệt sách theo thể loại, tác giả, nhà xuất bản; xem chi tiết và đánh giá sách;
thêm vào giỏ hàng và đặt mua; quản trị viên quản lý kho sách, khuyến mại và đơn
hàng.

**Tác nhân chính:**
- **Khách:** xem sách, tìm kiếm, lọc theo giá.
- **Khách hàng:** đăng ký, đăng nhập, mua hàng, đánh giá sau khi mua, wishlist.
- **Quản trị viên:** CRUD sách - thể loại - tác giả, quản lý tồn kho, đơn hàng, khuyến mại, thống kê.

**Công nghệ sử dụng:** React + Vite, React Router, Context API, Axios, JSON Server, Bootstrap 5.

---

## 2. Kiến thức đã học áp dụng vào đồ án

### 2.1. SPA và MPA

**Lý thuyết:**
- MPA (Multi-Page Application): mỗi lần bấm link là 1 request mới, trình duyệt tải lại cả trang. SEO tốt, tải lần đầu nhanh nhưng trải nghiệm rời rạc.
- SPA (Single-Page Application): tải một lần, sau đó trao đổi dữ liệu dạng JSON. Chuyển trang tức thì, mượt như ứng dụng cài đặt. Tải lần đầu nặng hơn, cần lưu ý SEO.

**Áp dụng vào đồ án:** Website chọn mô hình **SPA**.
- Toàn bộ ứng dụng chạy trong 1 trang (`index.html` chỉ có `<div id="root">`), React render nội dung vào đây.
- Dữ liệu trao đổi dạng JSON giữa React và JSON Server qua Axios (`src/services/api.js`) với base URL `http://localhost:3000`.
- Vì là SPA nên giao diện chuyển trang mượt, không bị tải lại toàn bộ như website thông thường.

### 2.2. Virtual DOM và cơ chế Diffing

**Lý thuyết:** Virtual DOM là bản sao nhẹ của cây DOM thật, lưu trong bộ nhớ dưới dạng đối tượng JavaScript. Khi state thay đổi, React dựng cây ảo mới rồi so sánh (diffing) với cây cũ để tìm ra đúng phần khác biệt, chỉ ghi vào DOM thật những nút thực sự thay đổi.

**Áp dụng vào đồ án:** Mọi tương tác đều theo cơ chế này.
- Khi khách thêm sách vào giỏ, `setCartItems(...)` trong `src/contexts/CartContext.jsx` thay đổi state → React chỉ render lại phần hiển thị số lượng trong giỏ (`Header.jsx`) và trang Giỏ hàng, không vẽ lại toàn bộ website.
- Tương tự với wishlist (`WishlistContext.jsx`): chỉ nút yêu thích và badge được cập nhật.
- Nhờ vậy website vẫn mượt dù có nhiều thao tác tương tác.

### 2.3. Môi trường phát triển và cấu trúc dự án

**Lý thuyết:**
- Cần Node.js bản LTS kèm npm/npx, VS Code.
- Khởi tạo dự án bằng Vite: `npm create vite@latest`, chọn template react, `npm install`, `npm run dev`.
- `src` chứa mã nguồn, `public` chứa tài nguyên tĩnh, `package.json` khai báo các gói.
- Không nộp kèm `node_modules`; chỉ cần `package.json` là cài lại được.

**Áp dụng vào đồ án:**
- Dự án khởi tạo bằng Vite có đầy đủ `vite.config.js`, `index.html` ở root, `src/` chứa mã nguồn.
- Phân chia thư mục rõ ràng:

```
src/
|-- admin/       (trang quản trị)
|-- components/  (component dùng lại: BookCard, Rating, Pagination, Header, Footer)
|-- contexts/    (Context API: CartContext, WishlistContext)
|-- pages/       (trang người dùng: Home, Books, BookDetail, Cart...)
|-- services/    (api.js gọi API bằng axios)
|-- App.jsx      (định nghĩa các route)
|-- main.jsx     (khởi tạo ứng dụng, bọc Provider + BrowserRouter)
```

- Thư mục `node_modules` nằm trong `.gitignore` nên khi nộp bài chỉ cần kèm `package.json` và `package-lock.json`.

### 2.4. JSX - Năm quy tắc vàng

**Lý thuyết:**
1. Một phần tử gốc: nhiều thẻ phải bọc trong `div` hoặc Fragment.
2. Thẻ phải đóng: thẻ tự đóng cần có gạch chéo như `<img />`, `<br />`, `<input />`.
3. Nhúng bằng ngoặc nhọn `{}`: chỉ nhận biểu thức, không nhận `if` hay `for`.
4. Thuộc tính viết camelCase: `className`, `htmlFor`, `onClick`.
5. `style` là object: `style={{ color: 'red', fontSize: 20 }}`.

**Áp dụng vào đồ án:**
- `App.jsx` bọc toàn bộ giao diện trong Fragment `<> ... </>`; mỗi trang trả về một cây `div` duy nhất.
- `BookCard.jsx` dùng thẻ tự đóng `<img src={book.image} ... />`.
- `Books.jsx` nhúng biểu thức `{visible.map(book => ...)}`, `{result.length} kết quả` bên trong `{}`.
- Các thuộc tính đều viết camelCase: `className`, `onClick`, `onSubmit`, `value`.
- Ví dụ `style` là object trong `Home.jsx`: `style={{ background: b.bg }}`.

### 2.5. Props - truyền dữ liệu từ cha xuống con

**Lý thuyết:**
- Component cha truyền dữ liệu xuống con qua props.
- Component con nhận bằng destructuring, có thể có giá trị mặc định.
- Props truyền được chuỗi, số, mảng, đối tượng và cả hàm xử lý sự kiện.
- Props là read-only, luồng dữ liệu một chiều từ cha xuống con.

**Áp dụng vào đồ án:**
- `Books.jsx` truyền:
  ```jsx
  <BookCard book={book} />
  <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
  ```
- Component con nhận bằng destructuring:
  ```jsx
  export default function Pagination({ page, totalPages, onPageChange }) { ... }
  export default function Rating({ rating = 0, onChange, readOnly = false }) { ... }
  ```
- Có truyền cả object (`book`) và hàm (`onPageChange` = hàm `setPage`).
- Các component con không bao giờ gán lại giá trị props - luôn đi qua hàm `onClick`/`onChange` do cha cung cấp.

### 2.6. Render danh sách với map() và thuộc tính key

**Lý thuyết:**
- Dùng `map()` để render danh sách, mỗi phần tử cần thuộc tính `key`.
- Key giúp React nhận diện từng phần tử khi danh sách thay đổi.
- Nên dùng id duy nhất, hạn chế dùng chỉ số mảng. Thiếu key sẽ có cảnh báo trên Console và hiển thị sai khi sửa danh sách.
- `children` cho phép component cha lồng nội dung vào component con.

**Áp dụng vào đồ án:**
- Render danh sách sách:
  ```jsx
  {visible.map(book => (
    <div className="col-6 col-md-3" key={book.id}>
      <BookCard book={book} />
    </div>
  ))}
  ```
- Render danh sách thể loại, tác giả trong dropdown đều dùng `key={c.id}`, `key={a.id}`.
- `children` trong `CartContext.jsx`:
  ```jsx
  export function CartProvider({ children }) {
    ...
    return <CartContext.Provider value={...}>{children}</CartContext.Provider>;
  }
  ```
  và `main.jsx` lồng `<App />` vào giữa `<CartProvider>` và `<WishlistProvider>`.

### 2.7. React Router

**Lý thuyết:**
- Cài package: `npm install react-router-dom`.
- Dùng `<BrowserRouter>` bọc ứng dụng, `<Routes>` chứa các `<Route path="..." element={...} />`.
- Router bọc ứng dụng; mỗi Route ánh xạ một đường dẫn với một component.

**Áp dụng vào đồ án:**
- `src/main.jsx`:
  ```jsx
  <BrowserRouter>
    <CartProvider>
      <WishlistProvider>
        <App />
      </WishlistProvider>
    </CartProvider>
  </BrowserRouter>
  ```
- `src/App.jsx` định nghĩa các route:
  ```jsx
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/books" element={<Books />} />
    <Route path="/books/:id" element={<BookDetail />} />
    <Route path="/cart" element={<Cart />} />
    <Route path="/checkout" element={<Checkout />} />
    ...
    <Route path="/admin" element={<Dashboard />} />
  </Routes>
  ```
- Dùng `useParams()` để lấy id trong `BookDetail.jsx`, `useNavigate()` để chuyển trang sau khi đặt hàng trong `Checkout.jsx`.

---

## 3. Điểm nhấn kỹ thuật React

- **Context API** cho giỏ hàng (`CartContext`) và danh sách yêu thích (`WishlistContext`), dữ liệu lưu thêm vào localStorage để giữ khi tải lại trang.
- **Component đánh giá sao tái sử dụng** (`src/components/Rating.jsx`) dùng lại ở thẻ sách, trang chi tiết, phần nhận xét.
- **Phân trang** (`src/components/Pagination.jsx`) ở trang danh mục sách.
- **Giao diện responsive** bằng Bootstrap 5.
- Component dùng lại `BookCard` được dùng ở trang chủ, danh mục, wishlist và "sách cùng tác giả".

## 4. Cách chạy chương trình

```
npm install
```

Terminal 1 - chạy backend JSON Server:

```
npm run server
```

Terminal 2 - chạy ứng dụng React:

```
npm run dev
```

Mở trình duyệt truy cập: http://localhost:5173

## 5. Tài khoản demo

| Vai trò | Email | Mật khẩu |
| --- | --- | --- |
| Quản trị viên | admin@gmail.com | 123456 |

Khách hàng tự đăng ký mới tại trang /register.