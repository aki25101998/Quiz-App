export type RiasecQuestion = {
  id: string;
  text: string;
  dimension: 'R' | 'I' | 'A' | 'S' | 'E' | 'C';
};

export const riasecQuestions: RiasecQuestion[] = [
  // REALISTIC (R) - Thực tế / Kỹ thuật
  { id: 'r1', text: 'Sửa chữa các thiết bị gia dụng hoặc máy móc', dimension: 'R' },
  { id: 'r2', text: 'Làm việc ngoài trời (lâm nghiệp, nông nghiệp, xây dựng)', dimension: 'R' },
  { id: 'r3', text: 'Sử dụng các công cụ cầm tay hoặc máy móc điện', dimension: 'R' },
  { id: 'r4', text: 'Lắp ráp các linh kiện điện tử hoặc đồ nội thất', dimension: 'R' },
  { id: 'r5', text: 'Lái xe tải thương mại hoặc điều khiển máy xúc', dimension: 'R' },
  { id: 'r6', text: 'Kiểm tra và thử nghiệm chất lượng sản phẩm trong nhà máy', dimension: 'R' },
  { id: 'r7', text: 'Bảo trì, sửa chữa ô tô hoặc xe máy', dimension: 'R' },
  { id: 'r8', text: 'Xây dựng hoặc làm nghề mộc', dimension: 'R' },
  { id: 'r9', text: 'Lắp đặt hệ thống điện hoặc ống nước', dimension: 'R' },
  { id: 'r10', text: 'Bắt tay vào làm những công việc yêu cầu sức lực và sự khéo léo của đôi tay', dimension: 'R' },

  // INVESTIGATIVE (I) - Nghiên cứu / Tìm tòi
  { id: 'i1', text: 'Đọc sách báo về khoa học hoặc công nghệ mới', dimension: 'I' },
  { id: 'i2', text: 'Nghiên cứu nguyên nhân của các hiện tượng tự nhiên', dimension: 'I' },
  { id: 'i3', text: 'Làm việc trong phòng thí nghiệm', dimension: 'I' },
  { id: 'i4', text: 'Phân tích dữ liệu phức tạp để tìm ra xu hướng', dimension: 'I' },
  { id: 'i5', text: 'Tìm hiểu cách một hệ thống hoạt động từ bên trong', dimension: 'I' },
  { id: 'i6', text: 'Thực hiện các thí nghiệm hóa học hoặc vật lý', dimension: 'I' },
  { id: 'i7', text: 'Giải các phương trình toán học khó', dimension: 'I' },
  { id: 'i8', text: 'Viết báo cáo nghiên cứu khoa học', dimension: 'I' },
  { id: 'i9', text: 'Thu thập thông tin để giải quyết một bài toán logic', dimension: 'I' },
  { id: 'i10', text: 'Chẩn đoán và tìm ra nguyên nhân của một căn bệnh hoặc lỗi hệ thống', dimension: 'I' },

  // ARTISTIC (A) - Nghệ thuật / Sáng tạo
  { id: 'a1', text: 'Thiết kế đồ họa hoặc vẽ tranh', dimension: 'A' },
  { id: 'a2', text: 'Viết tiểu thuyết, truyện ngắn hoặc kịch bản phim', dimension: 'A' },
  { id: 'a3', text: 'Biểu diễn âm nhạc hoặc diễn xuất trên sân khấu', dimension: 'A' },
  { id: 'a4', text: 'Trang trí nội thất cho một căn phòng hoặc tòa nhà', dimension: 'A' },
  { id: 'a5', text: 'Sáng tác nhạc hoặc viết lời bài hát', dimension: 'A' },
  { id: 'a6', text: 'Chụp ảnh nghệ thuật hoặc quay phim', dimension: 'A' },
  { id: 'a7', text: 'Lên ý tưởng thiết kế thời trang', dimension: 'A' },
  { id: 'a8', text: 'Tìm kiếm những cách thể hiện bản thân độc đáo và không đụng hàng', dimension: 'A' },
  { id: 'a9', text: 'Đọc và phân tích các tác phẩm văn học', dimension: 'A' },
  { id: 'a10', text: 'Tham gia vào các dự án đòi hỏi trí tưởng tượng phong phú', dimension: 'A' },

  // SOCIAL (S) - Xã hội / Hỗ trợ
  { id: 's1', text: 'Dạy học hoặc hướng dẫn người khác', dimension: 'S' },
  { id: 's2', text: 'Tư vấn tâm lý cho những người đang gặp khó khăn', dimension: 'S' },
  { id: 's3', text: 'Tổ chức các hoạt động từ thiện hoặc cộng đồng', dimension: 'S' },
  { id: 's4', text: 'Chăm sóc sức khỏe cho người bệnh hoặc người già', dimension: 'S' },
  { id: 's5', text: 'Hòa giải các cuộc xung đột giữa mọi người', dimension: 'S' },
  { id: 's6', text: 'Lắng nghe và giúp đỡ bạn bè giải quyết vấn đề cá nhân', dimension: 'S' },
  { id: 's7', text: 'Huấn luyện và truyền cảm hứng cho một đội nhóm', dimension: 'S' },
  { id: 's8', text: 'Làm việc trong môi trường cần giao tiếp và hợp tác liên tục', dimension: 'S' },
  { id: 's9', text: 'Giúp người khác nhận ra và phát triển tiềm năng của họ', dimension: 'S' },
  { id: 's10', text: 'Tham gia các phong trào xã hội bảo vệ quyền lợi con người', dimension: 'S' },

  // ENTERPRISING (E) - Quản lý / Khởi nghiệp
  { id: 'e1', text: 'Thuyết phục người khác mua sản phẩm hoặc dịch vụ', dimension: 'E' },
  { id: 'e2', text: 'Lãnh đạo một nhóm để đạt được mục tiêu doanh thu', dimension: 'E' },
  { id: 'e3', text: 'Khởi nghiệp và tự điều hành công việc kinh doanh', dimension: 'E' },
  { id: 'e4', text: 'Tranh luận hoặc đàm phán trong các thương vụ quan trọng', dimension: 'E' },
  { id: 'e5', text: 'Lập kế hoạch chiến lược phát triển cho một tổ chức', dimension: 'E' },
  { id: 'e6', text: 'Giao tiếp và mở rộng mạng lưới quan hệ với những người có tầm ảnh hưởng', dimension: 'E' },
  { id: 'e7', text: 'Thuyết trình trước đám đông để kêu gọi vốn đầu tư', dimension: 'E' },
  { id: 'e8', text: 'Cạnh tranh để đạt được vị trí cao hơn trong công việc', dimension: 'E' },
  { id: 'e9', text: 'Ra quyết định nhanh chóng trong môi trường kinh doanh rủi ro cao', dimension: 'E' },
  { id: 'e10', text: 'Quản lý dự án và phân bổ nguồn lực hiệu quả', dimension: 'E' },

  // CONVENTIONAL (C) - Nghiệp vụ / Tổ chức
  { id: 'c1', text: 'Kiểm tra độ chính xác của các số liệu tài chính', dimension: 'C' },
  { id: 'c2', text: 'Tổ chức và sắp xếp hồ sơ, tài liệu gọn gàng', dimension: 'C' },
  { id: 'c3', text: 'Nhập dữ liệu vào máy tính theo quy trình chuẩn', dimension: 'C' },
  { id: 'c4', text: 'Tính toán thuế hoặc làm công việc kế toán', dimension: 'C' },
  { id: 'c5', text: 'Lên lịch trình chi tiết và đảm bảo mọi người tuân thủ', dimension: 'C' },
  { id: 'c6', text: 'Quản lý kho hàng và theo dõi hàng tồn kho', dimension: 'C' },
  { id: 'c7', text: 'Làm việc với các bảng tính (Excel) phức tạp', dimension: 'C' },
  { id: 'c8', text: 'Tuân thủ nghiêm ngặt các quy định và quy trình của công ty', dimension: 'C' },
  { id: 'c9', text: 'Soạn thảo văn bản hành chính, hợp đồng', dimension: 'C' },
  { id: 'c10', text: 'Phát hiện các lỗi sai nhỏ trong văn bản hoặc mã code', dimension: 'C' },
];
