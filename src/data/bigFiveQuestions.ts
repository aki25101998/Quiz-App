// ============================================================
// BIG FIVE QUESTION BANK
// 50 câu hỏi: 10 câu/dimension, hỗ trợ reverse scoring
// Dựa trên framework IPIP (International Personality Item Pool)
// Ngôn ngữ phù hợp học sinh THPT Việt Nam
// ============================================================

import type { BigFiveQuestionDef } from '../types/types';

export const bigFiveQuestions: BigFiveQuestionDef[] = [
  // === OPENNESS (O) — Khả năng khám phá & cởi mở ===
  { id: 'o1', text: 'Tôi thường tò mò về những chủ đề mà tôi chưa biết gì.', dimension: 'openness', direction: 1 },
  { id: 'o2', text: 'Tôi thích thử những hoạt động mà tôi chưa bao giờ làm.', dimension: 'openness', direction: 1 },
  { id: 'o3', text: 'Tôi dễ bị cuốn hút bởi nghệ thuật, âm nhạc hoặc văn chương.', dimension: 'openness', direction: 1 },
  { id: 'o4', text: 'Tôi thường suy nghĩ về những ý tưởng lớn lao và trừu tượng.', dimension: 'openness', direction: 1 },
  { id: 'o5', text: 'Tôi thích tìm hiểu về những nền văn hóa khác nhau trên thế giới.', dimension: 'openness', direction: 1 },
  { id: 'o6', text: 'Tôi không thích những thay đổi bất ngờ trong cuộc sống.', dimension: 'openness', direction: -1 },
  { id: 'o7', text: 'Tôi thường chọn những cách làm quen thuộc thay vì thử cách mới.', dimension: 'openness', direction: -1 },
  { id: 'o8', text: 'Tôi thấy những cuộc thảo luận về triết học hoặc tâm lý rất hấp dẫn.', dimension: 'openness', direction: 1 },
  { id: 'o9', text: 'Tôi thường có những ý tưởng khác biệt so với đa số bạn bè.', dimension: 'openness', direction: 1 },
  { id: 'o10', text: 'Tôi thích đọc sách hoặc xem phim về những thế giới tưởng tượng.', dimension: 'openness', direction: 1 },

  // === CONSCIENTIOUSNESS (C) — Tính kỷ luật & trách nhiệm ===
  { id: 'c1', text: 'Tôi luôn hoàn thành bài tập và công việc đúng hạn.', dimension: 'conscientiousness', direction: 1 },
  { id: 'c2', text: 'Tôi thường lên kế hoạch trước khi bắt tay vào làm bất cứ việc gì.', dimension: 'conscientiousness', direction: 1 },
  { id: 'c3', text: 'Góc học tập và đồ dùng cá nhân của tôi luôn ngăn nắp.', dimension: 'conscientiousness', direction: 1 },
  { id: 'c4', text: 'Tôi đặt mục tiêu rõ ràng cho bản thân và cố gắng đạt được.', dimension: 'conscientiousness', direction: 1 },
  { id: 'c5', text: 'Khi đã hứa điều gì, tôi luôn cố gắng giữ lời.', dimension: 'conscientiousness', direction: 1 },
  { id: 'c6', text: 'Tôi thường quên mang đồ dùng học tập hoặc bỏ lỡ deadline.', dimension: 'conscientiousness', direction: -1 },
  { id: 'c7', text: 'Tôi dễ bị sao nhãng khi đang học hoặc làm việc.', dimension: 'conscientiousness', direction: -1 },
  { id: 'c8', text: 'Tôi kiểm tra kỹ bài làm trước khi nộp.', dimension: 'conscientiousness', direction: 1 },
  { id: 'c9', text: 'Tôi là người kiên trì và không bỏ cuộc dễ dàng.', dimension: 'conscientiousness', direction: 1 },
  { id: 'c10', text: 'Tôi thường làm việc theo cảm hứng, không theo kế hoạch nào cả.', dimension: 'conscientiousness', direction: -1 },

  // === EXTRAVERSION (E) — Mức độ hướng ngoại ===
  { id: 'e1', text: 'Tôi thường là người bắt chuyện trước trong nhóm.', dimension: 'extraversion', direction: 1 },
  { id: 'e2', text: 'Tôi cảm thấy tràn đầy năng lượng khi ở cùng nhiều người.', dimension: 'extraversion', direction: 1 },
  { id: 'e3', text: 'Tôi thích tham gia các hoạt động ngoại khóa và sự kiện.', dimension: 'extraversion', direction: 1 },
  { id: 'e4', text: 'Tôi không ngại phát biểu trước đám đông.', dimension: 'extraversion', direction: 1 },
  { id: 'e5', text: 'Tôi có nhiều nhóm bạn khác nhau.', dimension: 'extraversion', direction: 1 },
  { id: 'e6', text: 'Tôi thích ở nhà một mình hơn là đi chơi với đám đông.', dimension: 'extraversion', direction: -1 },
  { id: 'e7', text: 'Tôi cảm thấy mệt mỏi sau khi giao tiếp nhiều trong ngày.', dimension: 'extraversion', direction: -1 },
  { id: 'e8', text: 'Tôi thường là người tạo không khí vui vẻ trong nhóm.', dimension: 'extraversion', direction: 1 },
  { id: 'e9', text: 'Tôi thích làm quen với người mới.', dimension: 'extraversion', direction: 1 },
  { id: 'e10', text: 'Tôi ít khi chia sẻ suy nghĩ nếu không được hỏi.', dimension: 'extraversion', direction: -1 },

  // === AGREEABLENESS (A) — Tính hợp tác & đồng cảm ===
  { id: 'a1', text: 'Tôi thường quan tâm đến cảm xúc của người khác trước khi hành động.', dimension: 'agreeableness', direction: 1 },
  { id: 'a2', text: 'Tôi sẵn sàng giúp đỡ bạn bè ngay cả khi bản thân đang bận.', dimension: 'agreeableness', direction: 1 },
  { id: 'a3', text: 'Tôi dễ dàng tha thứ khi ai đó làm tôi buồn.', dimension: 'agreeableness', direction: 1 },
  { id: 'a4', text: 'Tôi thích hợp tác hơn là cạnh tranh.', dimension: 'agreeableness', direction: 1 },
  { id: 'a5', text: 'Tôi thường nghĩ tốt về mọi người trước khi có bằng chứng ngược lại.', dimension: 'agreeableness', direction: 1 },
  { id: 'a6', text: 'Tôi không ngại nói thẳng dù có thể làm mất lòng ai đó.', dimension: 'agreeableness', direction: -1 },
  { id: 'a7', text: 'Khi tranh luận, tôi thường muốn giành phần thắng hơn là tìm điểm chung.', dimension: 'agreeableness', direction: -1 },
  { id: 'a8', text: 'Tôi luôn cố gắng tìm cách giải quyết xung đột mà ai cũng hài lòng.', dimension: 'agreeableness', direction: 1 },
  { id: 'a9', text: 'Tôi dễ đồng cảm khi thấy ai đó đang gặp khó khăn.', dimension: 'agreeableness', direction: 1 },
  { id: 'a10', text: 'Tôi cho rằng lợi ích cá nhân quan trọng hơn lợi ích nhóm.', dimension: 'agreeableness', direction: -1 },

  // === NEUROTICISM (N) — Độ nhạy cảm cảm xúc ===
  { id: 'n1', text: 'Tôi thường lo lắng về những chuyện chưa xảy ra.', dimension: 'neuroticism', direction: 1 },
  { id: 'n2', text: 'Tôi dễ cảm thấy căng thẳng khi gặp áp lực.', dimension: 'neuroticism', direction: 1 },
  { id: 'n3', text: 'Tâm trạng của tôi thay đổi thất thường trong ngày.', dimension: 'neuroticism', direction: 1 },
  { id: 'n4', text: 'Tôi hay tự trách mình khi mọi việc không như ý muốn.', dimension: 'neuroticism', direction: 1 },
  { id: 'n5', text: 'Tôi dễ bị ảnh hưởng bởi những lời nhận xét tiêu cực.', dimension: 'neuroticism', direction: 1 },
  { id: 'n6', text: 'Tôi hiếm khi cảm thấy buồn bã hay lo lắng.', dimension: 'neuroticism', direction: -1 },
  { id: 'n7', text: 'Tôi giữ được bình tĩnh ngay cả trong các tình huống khó khăn.', dimension: 'neuroticism', direction: -1 },
  { id: 'n8', text: 'Tôi hay mất ngủ vì suy nghĩ quá nhiều.', dimension: 'neuroticism', direction: 1 },
  { id: 'n9', text: 'Tôi thường so sánh bản thân với người khác và cảm thấy thua kém.', dimension: 'neuroticism', direction: 1 },
  { id: 'n10', text: 'Tôi thấy rất khó để bình tĩnh lại khi đã tức giận.', dimension: 'neuroticism', direction: 1 },
];
