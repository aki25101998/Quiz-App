// ============================================================
// ABILITY TEST QUESTION BANK
// 28 câu hỏi: 4 câu/dimension × 7 dimensions
// Aptitude-style questions, phù hợp học sinh THPT
// Mỗi câu có 1 đáp án đúng (score=1) và các đáp án sai (score=0)
// ============================================================

import type { AbilityQuestionDef } from '../types/types';

export const abilityQuestions: AbilityQuestionDef[] = [
  // === NUMERICAL REASONING — Tư duy số học ===
  {
    id: 'num1',
    text: 'Nếu 3 con mèo bắt 3 con chuột trong 3 phút, hỏi 100 con mèo bắt 100 con chuột trong bao nhiêu phút?',
    dimension: 'numerical',
    options: [
      { label: '1 phút', value: 'a', score: 0 },
      { label: '3 phút', value: 'b', score: 1 },
      { label: '100 phút', value: 'c', score: 0 },
      { label: '300 phút', value: 'd', score: 0 },
    ],
  },
  {
    id: 'num2',
    text: 'Một cửa hàng giảm giá 20%, sau đó giảm thêm 10% trên giá đã giảm. Hỏi tổng mức giảm so với giá gốc là bao nhiêu?',
    dimension: 'numerical',
    options: [
      { label: '30%', value: 'a', score: 0 },
      { label: '28%', value: 'b', score: 1 },
      { label: '25%', value: 'c', score: 0 },
      { label: '32%', value: 'd', score: 0 },
    ],
  },
  {
    id: 'num3',
    text: 'Nếu A làm xong một công việc trong 6 giờ, B làm xong trong 3 giờ, cả hai làm chung thì mất bao lâu?',
    dimension: 'numerical',
    options: [
      { label: '4.5 giờ', value: 'a', score: 0 },
      { label: '3 giờ', value: 'b', score: 0 },
      { label: '2 giờ', value: 'c', score: 1 },
      { label: '1.5 giờ', value: 'd', score: 0 },
    ],
  },
  {
    id: 'num4',
    text: 'Một lớp có 40 học sinh, 60% là nữ. Nếu thêm 10 nam vào lớp, tỷ lệ nữ giờ là bao nhiêu?',
    dimension: 'numerical',
    options: [
      { label: '50%', value: 'a', score: 0 },
      { label: '48%', value: 'b', score: 1 },
      { label: '45%', value: 'c', score: 0 },
      { label: '52%', value: 'd', score: 0 },
    ],
  },

  // === LOGICAL REASONING — Tư duy logic ===
  {
    id: 'log1',
    text: 'Số tiếp theo trong dãy số: 2, 6, 12, 20, 30, ... là bao nhiêu?',
    dimension: 'logical',
    options: [
      { label: '40', value: 'a', score: 0 },
      { label: '42', value: 'b', score: 1 },
      { label: '44', value: 'c', score: 0 },
      { label: '36', value: 'd', score: 0 },
    ],
  },
  {
    id: 'log2',
    text: 'Nếu tất cả A đều là B, và một số B là C, thì có thể kết luận gì?',
    dimension: 'logical',
    options: [
      { label: 'Tất cả A là C', value: 'a', score: 0 },
      { label: 'Một số A có thể là C', value: 'b', score: 1 },
      { label: 'Không A nào là C', value: 'c', score: 0 },
      { label: 'Tất cả C là A', value: 'd', score: 0 },
    ],
  },
  {
    id: 'log3',
    text: 'Dãy số: 1, 1, 2, 3, 5, 8, ... Số tiếp theo là gì?',
    dimension: 'logical',
    options: [
      { label: '11', value: 'a', score: 0 },
      { label: '13', value: 'b', score: 1 },
      { label: '10', value: 'c', score: 0 },
      { label: '12', value: 'd', score: 0 },
    ],
  },
  {
    id: 'log4',
    text: 'Hoa hơn Lan 5 tuổi. Cách đây 3 năm, Hoa gấp đôi tuổi Lan. Hỏi Hoa bao nhiêu tuổi hiện tại?',
    dimension: 'logical',
    options: [
      { label: '10', value: 'a', score: 0 },
      { label: '13', value: 'b', score: 1 },
      { label: '15', value: 'c', score: 0 },
      { label: '11', value: 'd', score: 0 },
    ],
  },

  // === VERBAL REASONING — Tư duy ngôn ngữ ===
  {
    id: 'ver1',
    text: '"Nước chảy đá mòn" có ý nghĩa gần nhất với câu nào?',
    dimension: 'verbal',
    options: [
      { label: 'Kiên trì sẽ dẫn đến thành công', value: 'a', score: 1 },
      { label: 'Nước có sức mạnh lớn', value: 'b', score: 0 },
      { label: 'Thiên nhiên luôn thay đổi', value: 'c', score: 0 },
      { label: 'Đá không bền vững', value: 'd', score: 0 },
    ],
  },
  {
    id: 'ver2',
    text: 'Từ nào KHÔNG cùng nhóm với các từ còn lại: Vui, Buồn, Giận, Nhanh, Sợ?',
    dimension: 'verbal',
    options: [
      { label: 'Vui', value: 'a', score: 0 },
      { label: 'Buồn', value: 'b', score: 0 },
      { label: 'Nhanh', value: 'c', score: 1 },
      { label: 'Sợ', value: 'd', score: 0 },
    ],
  },
  {
    id: 'ver3',
    text: '"Sách là để đọc" giống như "Bài hát là để..."',
    dimension: 'verbal',
    options: [
      { label: 'viết', value: 'a', score: 0 },
      { label: 'nghe', value: 'b', score: 1 },
      { label: 'mua', value: 'c', score: 0 },
      { label: 'nhớ', value: 'd', score: 0 },
    ],
  },
  {
    id: 'ver4',
    text: 'Chọn từ phù hợp nhất để hoàn thành câu: "Một nhà lãnh đạo giỏi cần có tầm ... xa."',
    dimension: 'verbal',
    options: [
      { label: 'mắt', value: 'a', score: 0 },
      { label: 'nhìn', value: 'b', score: 1 },
      { label: 'tay', value: 'c', score: 0 },
      { label: 'bước', value: 'd', score: 0 },
    ],
  },

  // === ABSTRACT REASONING — Tư duy trừu tượng ===
  {
    id: 'abs1',
    text: 'Nếu ○ = 1, □ = 2, △ = 3 thì ○ + □ × △ = ?',
    dimension: 'abstract',
    options: [
      { label: '9', value: 'a', score: 0 },
      { label: '7', value: 'b', score: 1 },
      { label: '6', value: 'c', score: 0 },
      { label: '8', value: 'd', score: 0 },
    ],
  },
  {
    id: 'abs2',
    text: 'Quy luật: A→D, B→E, C→F. Theo quy luật này, G→?',
    dimension: 'abstract',
    options: [
      { label: 'H', value: 'a', score: 0 },
      { label: 'I', value: 'b', score: 0 },
      { label: 'J', value: 'c', score: 1 },
      { label: 'K', value: 'd', score: 0 },
    ],
  },
  {
    id: 'abs3',
    text: 'Trong dãy: ▲▼▲▲▼▲▲▲▼... Ký hiệu thứ 13 là gì?',
    dimension: 'abstract',
    options: [
      { label: '▲', value: 'a', score: 1 },
      { label: '▼', value: 'b', score: 0 },
    ],
  },
  {
    id: 'abs4',
    text: 'Nếu XÁM = TRẮNG + ĐEN, và XANH LÁ = XANH DƯƠNG + VÀNG, thì CAM = ?',
    dimension: 'abstract',
    options: [
      { label: 'TRẮNG + VÀNG', value: 'a', score: 0 },
      { label: 'ĐỎ + VÀNG', value: 'b', score: 1 },
      { label: 'ĐỎ + XANH', value: 'c', score: 0 },
      { label: 'VÀNG + TRẮNG', value: 'd', score: 0 },
    ],
  },

  // === SPATIAL REASONING — Tư duy không gian ===
  {
    id: 'spa1',
    text: 'Một hình lập phương được sơn đỏ rồi cắt thành 27 khối nhỏ bằng nhau. Có bao nhiêu khối KHÔNG có mặt nào sơn đỏ?',
    dimension: 'spatial',
    options: [
      { label: '0', value: 'a', score: 0 },
      { label: '1', value: 'b', score: 1 },
      { label: '6', value: 'c', score: 0 },
      { label: '8', value: 'd', score: 0 },
    ],
  },
  {
    id: 'spa2',
    text: 'Gấp một tờ giấy vuông làm đôi 2 lần rồi cắt bỏ một góc. Khi mở ra sẽ có bao nhiêu lỗ?',
    dimension: 'spatial',
    options: [
      { label: '1', value: 'a', score: 0 },
      { label: '2', value: 'b', score: 0 },
      { label: '4', value: 'c', score: 1 },
      { label: '8', value: 'd', score: 0 },
    ],
  },
  {
    id: 'spa3',
    text: 'Nhìn từ trên xuống, một hình chóp tứ giác đều trông giống hình gì?',
    dimension: 'spatial',
    options: [
      { label: 'Hình tròn', value: 'a', score: 0 },
      { label: 'Hình vuông có đường chéo', value: 'b', score: 1 },
      { label: 'Hình tam giác', value: 'c', score: 0 },
      { label: 'Hình chữ nhật', value: 'd', score: 0 },
    ],
  },
  {
    id: 'spa4',
    text: 'Bạn đứng quay mặt về hướng Bắc, quay phải 90°, quay phải thêm 180°. Bạn đang quay mặt về hướng nào?',
    dimension: 'spatial',
    options: [
      { label: 'Bắc', value: 'a', score: 0 },
      { label: 'Nam', value: 'b', score: 0 },
      { label: 'Đông', value: 'c', score: 0 },
      { label: 'Tây', value: 'd', score: 1 },
    ],
  },

  // === ATTENTION TO DETAIL — Chú ý chi tiết ===
  {
    id: 'att1',
    text: 'Trong dãy sau, có bao nhiêu số 7 đứng ngay sau số 3? 1 3 7 2 3 7 5 3 4 7 3 7 6 3 7',
    dimension: 'attention',
    options: [
      { label: '3', value: 'a', score: 0 },
      { label: '4', value: 'b', score: 1 },
      { label: '5', value: 'c', score: 0 },
      { label: '2', value: 'd', score: 0 },
    ],
  },
  {
    id: 'att2',
    text: 'Từ nào viết SAI chính tả? (A) Sáng tạo (B) Nổ lực (C) Kiên trì (D) Chuyên nghiệp',
    dimension: 'attention',
    options: [
      { label: 'A', value: 'a', score: 0 },
      { label: 'B', value: 'b', score: 1 },
      { label: 'C', value: 'c', score: 0 },
      { label: 'D', value: 'd', score: 0 },
    ],
  },
  {
    id: 'att3',
    text: 'So sánh hai dãy sau và tìm điểm khác biệt: ABCDEFGH và ABCDEFHG',
    dimension: 'attention',
    options: [
      { label: 'Chữ thứ 5 và 6', value: 'a', score: 0 },
      { label: 'Chữ thứ 7 và 8', value: 'b', score: 1 },
      { label: 'Không có khác biệt', value: 'c', score: 0 },
      { label: 'Chữ thứ 3 và 4', value: 'd', score: 0 },
    ],
  },
  {
    id: 'att4',
    text: 'Trong câu "Hôm nay tôi đi học ở trường Đại Học Bách Khoa Hà Nôi", lỗi sai ở đâu?',
    dimension: 'attention',
    options: [
      { label: '"Đại Học" phải viết thường', value: 'a', score: 0 },
      { label: '"Hà Nôi" thiếu dấu — phải là "Hà Nội"', value: 'b', score: 1 },
      { label: 'Không có lỗi', value: 'c', score: 0 },
      { label: '"Bách Khoa" phải viết thường', value: 'd', score: 0 },
    ],
  },

  // === PROBLEM SOLVING — Giải quyết vấn đề ===
  {
    id: 'ps1',
    text: 'Bạn có 8 quả bóng giống hệt nhau nhưng 1 quả nhẹ hơn. Dùng cân thăng bằng, cần ít nhất bao nhiêu lần cân để tìm ra quả nhẹ?',
    dimension: 'problemSolving',
    options: [
      { label: '1 lần', value: 'a', score: 0 },
      { label: '2 lần', value: 'b', score: 1 },
      { label: '3 lần', value: 'c', score: 0 },
      { label: '4 lần', value: 'd', score: 0 },
    ],
  },
  {
    id: 'ps2',
    text: 'Một thuyền đang chở đá trên hồ. Nếu ném hết đá xuống hồ, mực nước hồ sẽ thay đổi thế nào?',
    dimension: 'problemSolving',
    options: [
      { label: 'Tăng lên', value: 'a', score: 0 },
      { label: 'Giảm xuống', value: 'b', score: 1 },
      { label: 'Không đổi', value: 'c', score: 0 },
      { label: 'Tùy kích thước đá', value: 'd', score: 0 },
    ],
  },
  {
    id: 'ps3',
    text: 'Bạn cần đo chính xác 4 lít nước nhưng chỉ có bình 5 lít và bình 3 lít. Cách nhanh nhất cần ít nhất bao nhiêu bước đổ nước?',
    dimension: 'problemSolving',
    options: [
      { label: '3 bước', value: 'a', score: 0 },
      { label: '4 bước', value: 'b', score: 0 },
      { label: '5 bước', value: 'c', score: 0 },
      { label: '6 bước', value: 'd', score: 1 },
    ],
  },
  {
    id: 'ps4',
    text: 'Trong một cuộc thi có 64 đội, mỗi trận đấu loại trực tiếp 1 đội. Hỏi cần bao nhiêu trận để tìm ra nhà vô địch?',
    dimension: 'problemSolving',
    options: [
      { label: '32', value: 'a', score: 0 },
      { label: '63', value: 'b', score: 1 },
      { label: '64', value: 'c', score: 0 },
      { label: '128', value: 'd', score: 0 },
    ],
  },
];
