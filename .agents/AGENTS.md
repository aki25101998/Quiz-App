# 📜 Hiến Pháp Dự Án Quiz App (Project Constitution)

File này đóng vai trò là "kim chỉ nam" cho mọi AI Agent (bao gồm cả tôi) khi làm việc trên dự án này. Mọi thay đổi, thêm mới tính năng hay sửa lỗi đều **phải tuân thủ tuyệt đối** các nguyên tắc và luồng logic được định nghĩa tại đây.

---

## 1. Stack Công Nghệ (Tech Stack)
- **Frontend Framework:** React 18 + TypeScript + Vite.
- **Styling:** Tailwind CSS (Bắt buộc dùng Tailwind cho mọi styling, hạn chế viết CSS thuần trừ khi cần custom phức tạp).
- **Animation:** Framer Motion (Cho hiệu ứng chuyển trang, micro-animations) & CSS Transitions.
- **Icons:** `lucide-react`.
- **Routing:** React Router v6.
- **Backend & Database:** Supabase (Quản lý Auth và Database).

---

## 2. Tiêu chuẩn Thiết kế (UI/UX Guidelines)
Dự án này yêu cầu tính thẩm mỹ cực kỳ cao (Premium & WOW effect):
- **Glassmorphism:** Tích cực sử dụng nền kính mờ (`bg-white/90 backdrop-blur-xl`), viền sáng mờ (`border-white/50`) trên nền ứng dụng có các khối màu pastel gradient.
- **Đổ bóng (Shadows):** Dùng đổ bóng mềm, sâu (VD: `shadow-[0_8px_30px_rgb(0,0,0,0.06)]`). Không dùng shadow mặc định thô cứng.
- **Màu sắc:** Dùng bảng màu pastel, gradient nhẹ nhàng (Teal, Orange, Slate). KHÔNG dùng các màu cơ bản chói mắt (pure red, pure blue).
- **Micro-animations:** Các nút bấm, thẻ lựa chọn câu trả lời đều phải có hiệu ứng hover mượt mà (đổi màu viền, scale nhẹ, text color). Khi đổi câu hỏi phải có transition (Framer Motion).
- **Trải nghiệm:** Phải mang lại cảm giác ứng dụng cao cấp, mượt mà và sống động.

---

## 3. Luồng Nghiệp Vụ Cốt Lõi (Core Business Logic)

**TUYỆT ĐỐI KHÔNG ĐƯỢC PHÁ VỠ LUỒNG SAU ĐÂY KHI CẬP NHẬT CODE:**

### Bước 1: Làm bài trắc nghiệm (`/quiz/:id`)
- **Ẩn danh (Anonymous Play):** Cho phép người dùng làm bài test mà **không cần đăng nhập**. Mục tiêu là giảm rào cản tham gia.
- **Lưu trữ tạm thời:** Câu trả lời (`answers`) được lưu tạm trong React State và truyền qua Route State khi chuyển trang.

### Bước 2: Bức tường Đăng nhập (`/checkout/:id` & `/login`)
- **Chặn xem kết quả:** Để xem được mã QR thanh toán và kết quả, người dùng **bắt buộc phải đăng nhập**.
- **Nếu chưa đăng nhập:** Trang Checkout ẩn mã QR thanh toán, hiển thị cảnh báo "Đăng nhập để tiếp tục".
  - Nút chuyển sang `/login` phải mang theo `location.state` (chứa `answers` và `quiz_id`) để sau khi đăng nhập/đăng ký thành công, user được quay lại thẳng trang Checkout mà không mất bài làm.
- **Nếu đã đăng nhập:** Hiển thị mã QR thanh toán.

### Bước 3: Thanh toán và Lưu dữ liệu (`/checkout/:id`)
- Mã QR thanh toán tạo bằng VietQR.
- Khi người dùng bấm "Tôi đã chuyển khoản", hệ thống **bắt buộc** phải ghi nhận kết quả xuống bảng `quiz_results` trong Supabase.
  - Thông tin lưu gồm: `user_id`, `quiz_id`, `answers`, và `is_paid = true`.
- Không được chuyển hướng sang trang Kết quả nếu chưa lưu thành công hoặc chưa báo lỗi hợp lý.

### Bước 4: Xem kết quả (`/result/:id`)
- Chỉ cho phép truy cập nếu trạng thái thanh toán đã được xác nhận.
- Đọc dữ liệu `answers` để tính toán và hiển thị phân tích sâu (Điểm mạnh, Điểm yếu).
- Luôn có mục **Upsell** (Gợi ý bài test tiếp theo để hoàn thiện hồ sơ tính cách).

---

## 4. Cấu trúc Cơ sở dữ liệu (Supabase Database)
Bảng `quiz_results`:
- `id` (uuid, Primary Key)
- `user_id` (uuid, Foreign Key -> `auth.users`)
- `quiz_id` (text)
- `answers` (jsonb)
- `is_paid` (boolean, default false)
- `created_at` (timestampz)

**Bảo mật:** Row Level Security (RLS) được bật. Người dùng chỉ có quyền Select và Insert vào các bản ghi có `user_id` trùng với `auth.uid()` của họ.

---

## 5. Tiêu chuẩn Mã nguồn (Code Conventions)
- **Typescript:** Khai báo kiểu dữ liệu rõ ràng. Tránh lạm dụng `any`.
- **Reusable Components:** Nếu một khối UI (như nút bấm, hộp thông báo) lặp lại nhiều lần, hãy tách thành component riêng.
- **Custom Hooks:** Các logic phức tạp như Auth, Fetch Data nên được tách vào thư mục `src/hooks/` (VD: `useAuth.ts`).
- **Biến môi trường:** Các key nhạy cảm (Supabase URL, Anon Key) phải luôn gọi qua `import.meta.env`. KHÔNG hardcode.
