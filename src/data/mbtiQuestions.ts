export type LikertQuestion = {
  id: number;
  text: string;
  dimension: 'EI' | 'SN' | 'TF' | 'JP';
  direction: 1 | -1; // 1 means Agree aligns with the first letter (E/S/T/J), -1 means Agree aligns with the second letter (I/N/F/P)
};

export const mbtiQuestions: LikertQuestion[] = [
  // --- E vs I (Extraversion vs Introversion) ---
  { id: 1, text: "Bạn thường xuyên kết bạn mới.", dimension: 'EI', direction: 1 },
  { id: 2, text: "Bạn cảm thấy kiệt sức sau khi dành quá nhiều thời gian giao tiếp với người khác.", dimension: 'EI', direction: -1 },
  { id: 3, text: "Bạn thường là người chủ động bắt chuyện trong các buổi tụ tập.", dimension: 'EI', direction: 1 },
  { id: 4, text: "Bạn thích các hoạt động diễn ra trong không gian yên tĩnh và ít người.", dimension: 'EI', direction: -1 },
  { id: 5, text: "Bạn không ngại việc trở thành trung tâm của sự chú ý.", dimension: 'EI', direction: 1 },
  { id: 6, text: "Bạn cần rất nhiều thời gian ở một mình để nạp lại năng lượng.", dimension: 'EI', direction: -1 },
  { id: 7, text: "Khi có một ý tưởng mới, bạn muốn thảo luận ngay với người khác.", dimension: 'EI', direction: 1 },
  { id: 8, text: "Bạn thích giao tiếp qua tin nhắn văn bản hơn là gọi điện thoại.", dimension: 'EI', direction: -1 },
  { id: 9, text: "Bạn cảm thấy hứng khởi và tràn đầy sinh lực ở những nơi đông đúc, náo nhiệt.", dimension: 'EI', direction: 1 },
  { id: 10, text: "Vòng tròn bạn bè của bạn khá nhỏ và cực kỳ thân thiết.", dimension: 'EI', direction: -1 },

  // --- S vs N (Sensing vs Intuition) ---
  { id: 11, text: "Bạn hiếm khi để tâm trí bay bổng và suy nghĩ về những ý tưởng viển vông.", dimension: 'SN', direction: 1 },
  { id: 12, text: "Bạn thường bị cuốn hút bởi những khái niệm trừu tượng, mang tính triết lý.", dimension: 'SN', direction: -1 },
  { id: 13, text: "Khi học một điều mới, bạn thích đi từ những chi tiết thực tế trước khi nhìn bao quát.", dimension: 'SN', direction: 1 },
  { id: 14, text: "Bạn thường tò mò về ý nghĩa tiềm ẩn đằng sau mọi sự việc.", dimension: 'SN', direction: -1 },
  { id: 15, text: "Bạn tin vào những trải nghiệm thực tế hơn là linh cảm hay trực giác.", dimension: 'SN', direction: 1 },
  { id: 16, text: "Bạn luôn tự hỏi thế giới sẽ phát triển như thế nào trong tương lai.", dimension: 'SN', direction: -1 },
  { id: 17, text: "Bạn đánh giá cao những người làm việc thực tế, giữ đôi chân trên mặt đất.", dimension: 'SN', direction: 1 },
  { id: 18, text: "Bạn có thể dành hàng giờ đồng hồ để tưởng tượng về các viễn cảnh chưa từng xảy ra.", dimension: 'SN', direction: -1 },
  { id: 19, text: "Bạn thích những chỉ dẫn cụ thể, rõ ràng thay vì các định hướng chung chung.", dimension: 'SN', direction: 1 },
  { id: 20, text: "Bạn là người thường xuyên đưa ra những ý tưởng mang tính đột phá và khác biệt.", dimension: 'SN', direction: -1 },

  // --- T vs F (Thinking vs Feeling) ---
  { id: 21, text: "Tính logic thường quan trọng hơn cảm xúc khi bạn phải đưa ra quyết định.", dimension: 'TF', direction: 1 },
  { id: 22, text: "Bạn thấy mình dễ đồng cảm với những khó khăn của người khác.", dimension: 'TF', direction: -1 },
  { id: 23, text: "Bạn ưu tiên sự thật và lẽ phải, ngay cả khi điều đó có thể làm mất lòng ai đó.", dimension: 'TF', direction: 1 },
  { id: 24, text: "Bảo vệ mối quan hệ và sự hòa hợp quan trọng hơn việc giành phần thắng trong một cuộc tranh luận.", dimension: 'TF', direction: -1 },
  { id: 25, text: "Bạn tin rằng mọi quyết định nên dựa trên số liệu và các dữ kiện khách quan.", dimension: 'TF', direction: 1 },
  { id: 26, text: "Bạn dễ dàng bị lay động bởi một câu chuyện truyền cảm hứng mang tính nhân văn.", dimension: 'TF', direction: -1 },
  { id: 27, text: "Bạn cố gắng không để tình cảm cá nhân ảnh hưởng đến cách bạn xử lý công việc.", dimension: 'TF', direction: 1 },
  { id: 28, text: "Bạn thường tự hỏi hành động của mình sẽ khiến người khác cảm thấy thế nào.", dimension: 'TF', direction: -1 },
  { id: 29, text: "Nếu ai đó làm sai, bạn thường chỉ ra lỗi sai của họ một cách thẳng thắn.", dimension: 'TF', direction: 1 },
  { id: 30, text: "Theo bạn, không có gì tồi tệ hơn là sự nhẫn tâm và thiếu lòng trắc ẩn.", dimension: 'TF', direction: -1 },

  // --- J vs P (Judging vs Perceiving) ---
  { id: 31, text: "Bạn luôn muốn mọi thứ được lên kế hoạch một cách chi tiết và rõ ràng.", dimension: 'JP', direction: 1 },
  { id: 32, text: "Bạn thích để ngỏ các lựa chọn của mình và linh hoạt quyết định vào phút chót.", dimension: 'JP', direction: -1 },
  { id: 33, text: "Không gian làm việc và không gian sống của bạn thường xuyên ngăn nắp, gọn gàng.", dimension: 'JP', direction: 1 },
  { id: 34, text: "Bạn làm việc hiệu quả nhất và có nhiều năng lượng nhất khi sát giờ hạn chót (deadline).", dimension: 'JP', direction: -1 },
  { id: 35, text: "Bạn cảm thấy khó chịu nếu ai đó bất ngờ thay đổi kế hoạch vào phút chót.", dimension: 'JP', direction: 1 },
  { id: 36, text: "Bạn có xu hướng bắt tay vào làm việc ngay và tự điều chỉnh trong quá trình làm.", dimension: 'JP', direction: -1 },
  { id: 37, text: "Bạn có thói quen sử dụng sổ tay, ứng dụng ghi chú hoặc lập to-do list hằng ngày.", dimension: 'JP', direction: 1 },
  { id: 38, text: "Kỷ luật cứng nhắc và những luật lệ quá khắt khe thường khiến bạn cảm thấy ngột ngạt.", dimension: 'JP', direction: -1 },
  { id: 39, text: "Bạn thích hoàn thành xong một việc hoàn toàn trước khi chuyển sang việc khác.", dimension: 'JP', direction: 1 },
  { id: 40, text: "Bạn thường đưa ra các quyết định dựa trên cảm hứng tự phát ngay tại thời điểm đó.", dimension: 'JP', direction: -1 }
];
