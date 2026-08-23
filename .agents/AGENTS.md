# 📜 Hiến Pháp Dự Án Quiz App (Project Constitution)

File này đóng vai trò là "kim chỉ nam" cho mọi AI Agent (bao gồm cả tôi) khi làm việc trên dự án này. Mọi thay đổi, thêm mới tính năng hay sửa lỗi đều **phải tuân thủ tuyệt đối** các nguyên tắc, luồng logic và danh sách tính năng được định nghĩa tại đây.

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

## 3. Danh Sách Các Tính Năng Hiện Tại (Feature Specs)

**CẢNH BÁO: BẤT KỲ LÚC NÀO CODE MỚI HOẶC SỬA LỖI, KHÔNG ĐƯỢC LÀM MẤT HOẶC PHÁ VỠ CÁC TÍNH NĂNG DƯỚI ĐÂY.**

### 3.1. Hạch Tâm - Bài Trắc Nghiệm Đơn (Single Quiz)
- **Trang chủ (`/`)**: Giới thiệu các bài trắc nghiệm hiện có.
- **Làm bài trắc nghiệm (`/quiz/:id`)**:
  - **Ẩn danh (Anonymous Play):** Cho phép người dùng làm bài test mà **không cần đăng nhập**. Mục tiêu là giảm rào cản tham gia.
  - **Lưu trữ tạm thời:** Câu trả lời (`answers`) được lưu tạm trong React State và truyền qua Route State khi chuyển trang. Có thanh tiến trình (progress bar).
- **Bức tường Đăng nhập (`/checkout/:id` & `/login`)**:
  - **Chặn xem kết quả:** Để xem được mã QR thanh toán và kết quả, người dùng **bắt buộc phải đăng nhập**.
  - Nút chuyển sang `/login` phải mang theo `location.state` (chứa `answers` và `quiz_id`) để sau khi đăng nhập/đăng ký thành công, user được quay lại thẳng trang Checkout mà không mất bài làm.
- **Thanh toán Bài Test Đơn (`/checkout/:id`)**:
  - Mã QR thanh toán tạo bằng VietQR.
  - Sau khi thanh toán, hệ thống **bắt buộc** phải ghi nhận kết quả xuống bảng `quiz_results` (với `is_paid = true`).
- **Kết quả Trắc Nghiệm (`/result/:id`)**:
  - Yêu cầu thanh toán thành công (hoặc `is_paid = true` trong DB).
  - Phân tích và hiển thị kết quả (Ví dụ: tính toán điểm mạnh yếu, top ngành nghề đối với bài test Holland RIASEC).

### 3.2. Quản Lý Tài Khoản & Lịch Sử (User Management)
- **Xác thực:** Đăng nhập, Đăng ký qua Supabase Auth.
- **Lịch sử bài làm (`/history`)**: 
  - Liệt kê các bài test đã làm (lấy từ `quiz_results`).
  - **Chức năng Xóa Lịch Sử:** Cho phép người dùng xoá các bài làm đã lưu trong lịch sử. Bắt buộc có cảnh báo xác nhận trước khi xoá. Xoá dữ liệu trong Database và tự động cập nhật lại giao diện ngay lập tức.
- **Báo cáo tổng hợp (`/report`)**: Báo cáo tổng kết dựa trên các bài test đơn lẻ người dùng đã hoàn thành.

### 3.3. Hệ Thống Định Hướng Nghề Nghiệp Đa Chiều (Profile-Based Career Assessment)
Đây là module nâng cao cho phép người dùng gom nhóm nhiều bài đánh giá vào một "Hồ sơ" (Profile) để định hướng nghề nghiệp tổng thể một cách chính xác nhất.
- **Quản lý Hồ Sơ (`/profiles`)**: Xem danh sách các hồ sơ đã tạo, tạo mới một hồ sơ định hướng nghề nghiệp.
- **Chi tiết Hồ Sơ (`/profiles/:id`)**:
  - Hiển thị danh sách các bài test cần thực hiện trong hồ sơ.
  - Theo dõi tiến độ hoàn thành các bài test trong hồ sơ đó.
- **Thanh toán Hồ Sơ Định Hướng (`/profiles/:id/payment`)**:
  - Thanh toán một lần (Unlock trọn gói) cho toàn bộ các bài test có trong Profile đó. 
  - Giao diện thanh toán VietQR gắn với dữ liệu `career_profiles`.
- **Báo cáo Định Hướng Nghề Nghiệp Chuyên Sâu (`/profiles/:id/report/generate` & `/profiles/:id/report/:reportId`)**:
  - Sinh ra báo cáo phân tích tổng hợp cực kỳ chi tiết dựa trên TẤT CẢ các bài test đã hoàn thành trong Profile.
  - Cung cấp phân tích sự phù hợp nghề nghiệp và các chỉ số chuyên sâu.

---

## 4. Cấu trúc Cơ sở dữ liệu (Supabase Database)
- **`quiz_results`**: Lưu kết quả bài test đơn (`id`, `user_id`, `quiz_id`, `answers`, `is_paid`, `created_at`).
- **`career_profiles`**: Quản lý hồ sơ định hướng nghề nghiệp (`id`, `user_id`, `name`, `status`, `payment_status`, `created_at`).
- **`profile_assessments`**: Bảng trung gian liên kết giữa `career_profiles` và các bài đánh giá thuộc hồ sơ đó.
- **`career_reports`**: Lưu trữ các báo cáo định hướng nghề nghiệp chuyên sâu.

**Bảo mật:** Row Level Security (RLS) được bật trên tất cả các bảng. Người dùng chỉ có quyền `SELECT`, `INSERT`, `UPDATE`, `DELETE` vào các bản ghi có `user_id` trùng với `auth.uid()` của họ.

---

## 5. Quy Trình Làm Việc Bắt Buộc (Mandatory Workflow)
**⚠ ĐÂY LÀ QUY TRÌNH BẮT BUỘC ĐỐI VỚI MỌI AI AGENT VÀ LẬP TRÌNH VIÊN:**

1. **Bảo toàn Tính Năng Hiện Có:** Trước khi sửa đổi hoặc thêm code mới, PHẢI đối chiếu với "Danh Sách Các Tính Năng Hiện Tại" ở mục 3 để đảm bảo không làm gãy logic cũ.
2. **LUÔN LUÔN Commit & Push Lên GitHub:** 
   - **MỖI KHI CODE XONG** một tính năng, một module hoặc sửa xong một bug và kiểm tra thành công, **BẮT BUỘC** phải thực hiện các lệnh git:
     - `git add .`
     - `git commit -m "[Mô tả thay đổi chi tiết]"`
     - `git push`
   - Tuyệt đối không được quên bước này để mã nguồn luôn được đồng bộ.
3. **LUÔN LUÔN Deploy:** 
   - Nếu dự án kết nối Auto-Deploy với GitHub (Vercel/Netlify), thao tác Push code chính là Deploy. AI Agent phải thông báo rõ điều này cho người dùng.
   - Trường hợp phải deploy thủ công, Agent bắt buộc phải chạy lệnh Build/Deploy ngay sau khi Push.
4. **Biến môi trường:** Các key nhạy cảm (Supabase URL, Anon Key) phải luôn gọi qua `import.meta.env`. KHÔNG hardcode.
5. **Chất lượng Code:** Tuân thủ strict type bằng TypeScript, tái sử dụng component tối đa và tạo custom hooks (như `useAuth`, `useQuiz`) cho các logic phức tạp.
