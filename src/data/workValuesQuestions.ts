// ============================================================
// WORK VALUES QUESTION BANK
// 36 câu hỏi: 3 câu/dimension × 12 dimensions
// Dựa trên O*NET Work Importance Profiler
// Ngôn ngữ phù hợp học sinh THPT Việt Nam
// ============================================================

import type { WorkValueQuestionDef } from '../types/types';

export const workValuesQuestions: WorkValueQuestionDef[] = [
  // === INCOME — Thu nhập cao ===
  { id: 'wv-inc1', text: 'Tôi mong muốn có một công việc cho tôi mức lương cao.', dimension: 'income' },
  { id: 'wv-inc2', text: 'Tôi sẵn sàng làm việc vất vả hơn nếu điều đó giúp tôi kiếm được nhiều tiền.', dimension: 'income' },
  { id: 'wv-inc3', text: 'Sự giàu có về tài chính là một trong những mục tiêu quan trọng nhất của tôi.', dimension: 'income' },

  // === STABILITY — Sự ổn định ===
  { id: 'wv-stb1', text: 'Tôi muốn có một công việc mà tôi không phải lo lắng về việc bị sa thải.', dimension: 'stability' },
  { id: 'wv-stb2', text: 'Tôi thích biết trước chính xác thu nhập hàng tháng của mình.', dimension: 'stability' },
  { id: 'wv-stb3', text: 'Một công việc ổn định, lâu dài quan trọng hơn một công việc thú vị nhưng bấp bênh.', dimension: 'stability' },

  // === FREEDOM — Tự do & Linh hoạt ===
  { id: 'wv-fre1', text: 'Tôi muốn có quyền tự quyết định cách thức làm việc của mình.', dimension: 'freedom' },
  { id: 'wv-fre2', text: 'Tôi thích công việc cho phép tôi linh hoạt về thời gian và địa điểm.', dimension: 'freedom' },
  { id: 'wv-fre3', text: 'Tôi không thích bị ai đó kiểm soát từng bước trong công việc.', dimension: 'freedom' },

  // === CREATIVITY — Sáng tạo ===
  { id: 'wv-cre1', text: 'Tôi muốn một công việc cho phép tôi nghĩ ra những ý tưởng mới.', dimension: 'creativity' },
  { id: 'wv-cre2', text: 'Tôi thích giải quyết vấn đề theo cách riêng của mình, không theo khuôn mẫu.', dimension: 'creativity' },
  { id: 'wv-cre3', text: 'Một ngày làm việc lý tưởng là ngày tôi được tạo ra thứ gì đó mới mẻ.', dimension: 'creativity' },

  // === RECOGNITION — Được công nhận ===
  { id: 'wv-rec1', text: 'Tôi muốn những thành tích của mình được mọi người biết đến.', dimension: 'recognition' },
  { id: 'wv-rec2', text: 'Tôi cảm thấy có động lực hơn khi nhận được lời khen từ cấp trên hoặc đồng nghiệp.', dimension: 'recognition' },
  { id: 'wv-rec3', text: 'Danh tiếng và uy tín trong nghề nghiệp quan trọng với tôi.', dimension: 'recognition' },

  // === IMPACT — Tác động xã hội ===
  { id: 'wv-imp1', text: 'Tôi muốn công việc của mình giúp cải thiện cuộc sống của người khác.', dimension: 'impact' },
  { id: 'wv-imp2', text: 'Tôi sẵn sàng nhận lương thấp hơn nếu công việc có ý nghĩa xã hội.', dimension: 'impact' },
  { id: 'wv-imp3', text: 'Tôi tin rằng mục đích cao nhất của nghề nghiệp là đóng góp cho cộng đồng.', dimension: 'impact' },

  // === BALANCE — Cân bằng cuộc sống ===
  { id: 'wv-bal1', text: 'Tôi muốn có đủ thời gian cho gia đình, bạn bè và sở thích cá nhân.', dimension: 'balance' },
  { id: 'wv-bal2', text: 'Tôi không muốn công việc chiếm hết quỹ thời gian trong ngày.', dimension: 'balance' },
  { id: 'wv-bal3', text: 'Sức khỏe tinh thần và thể chất quan trọng hơn thăng tiến nhanh.', dimension: 'balance' },

  // === LEARNING — Học hỏi liên tục ===
  { id: 'wv-lea1', text: 'Tôi muốn công việc luôn dạy tôi những điều mới.', dimension: 'learning' },
  { id: 'wv-lea2', text: 'Tôi thích được đào tạo và phát triển kỹ năng chuyên môn.', dimension: 'learning' },
  { id: 'wv-lea3', text: 'Tôi sẽ chán nản nếu công việc không có gì mới để học.', dimension: 'learning' },

  // === GROWTH — Thăng tiến ===
  { id: 'wv-gro1', text: 'Tôi muốn có cơ hội thăng chức và phát triển sự nghiệp rõ ràng.', dimension: 'growth' },
  { id: 'wv-gro2', text: 'Tôi đặt mục tiêu trở thành chuyên gia hoặc lãnh đạo trong lĩnh vực của mình.', dimension: 'growth' },
  { id: 'wv-gro3', text: 'Tôi thích làm việc ở nơi có lộ trình thăng tiến minh bạch.', dimension: 'growth' },

  // === SOCIAL — Giao tiếp xã hội ===
  { id: 'wv-soc1', text: 'Tôi thích công việc cho phép tôi giao tiếp với nhiều người mỗi ngày.', dimension: 'social' },
  { id: 'wv-soc2', text: 'Tôi làm việc hiệu quả hơn khi được ở trong một đội nhóm.', dimension: 'social' },
  { id: 'wv-soc3', text: 'Một môi trường làm việc sôi động, nhiều tương tác là lý tưởng với tôi.', dimension: 'social' },

  // === INDEPENDENCE — Độc lập ===
  { id: 'wv-ind1', text: 'Tôi thích tự quản lý công việc mà không cần sự giám sát.', dimension: 'independence' },
  { id: 'wv-ind2', text: 'Tôi làm việc tốt nhất khi được giao quyền tự chủ.', dimension: 'independence' },
  { id: 'wv-ind3', text: 'Tôi không thích phải xin phép ai trước khi ra quyết định công việc.', dimension: 'independence' },

  // === SECURITY — An toàn ===
  { id: 'wv-sec1', text: 'Tôi muốn làm việc ở một môi trường an toàn, ít rủi ro.', dimension: 'security' },
  { id: 'wv-sec2', text: 'Phúc lợi xã hội (bảo hiểm, nghỉ phép) là yếu tố quan trọng khi chọn việc.', dimension: 'security' },
  { id: 'wv-sec3', text: 'Tôi ưu tiên những ngành nghề ít bị ảnh hưởng bởi biến động kinh tế.', dimension: 'security' },
];
