export type ChoiceQuestion = {
  id: number;
  text: string;
  options: {
    text: string;
    value: string;
  }[];
};

export type Question = ChoiceQuestion; // MBTI now uses LikertQuestion, but we'll import it from mbtiQuestions.

import type { LikertQuestion } from './mbtiQuestions';

export type AnyQuestion = ChoiceQuestion | LikertQuestion;

export type QuizData = {
  id: string;
  type?: 'choice' | 'likert';
  title: string;
  description: string;
  emoji: string;
  stats: string;
  upsellQuizId?: string;
  upsellMessage?: string;
  questions: AnyQuestion[];
};

import { mbtiQuestions } from './mbtiQuestions';

export const quizzes: QuizData[] = [
  {
    id: "mbti",
    type: "likert",
    title: "Trắc nghiệm MBTI",
    description: "Bạn thuộc nhóm tính cách nào trong 16 nhóm? Hiểu rõ bản năng và cách bạn tương tác với thế giới.",
    emoji: "🧭",
    stats: "40 câu · 8 phút",
    upsellQuizId: "riasec",
    upsellMessage: "MBTI chỉ cho biết bạn là ai, nhưng để biết chính xác Ngành nghề nào sẽ giúp bạn tỏa sáng và kiếm nhiều tiền nhất, bạn cần bản đồ nghề nghiệp RIASEC.",
    questions: mbtiQuestions
  },
  {
    id: "riasec",
    title: "Định hướng Nghề nghiệp RIASEC",
    description: "Mô hình Holland Code chuẩn quốc tế giúp bạn tìm ra môi trường làm việc mà bạn dễ thành công nhất.",
    emoji: "🎯",
    stats: "18 câu · 4 phút",
    upsellQuizId: "disc",
    upsellMessage: "Nghề nghiệp đã rõ, nhưng bạn sẽ là Sếp hay Nhân viên? Làm sao để giao tiếp mượt mà với đồng nghiệp? Khám phá ngay phong cách làm việc DISC.",
    questions: [
      {
        id: 1,
        text: "Bạn thích làm việc với đối tượng nào nhất?",
        options: [
          { text: "Máy móc, công cụ và đồ vật thực tế", value: "R" },
          { text: "Con người, tư vấn và giúp đỡ người khác", value: "S" }
        ]
      },
      {
        id: 2,
        text: "Bạn tự nhận thấy mình giỏi nhất trong việc:",
        options: [
          { text: "Phân tích số liệu, giải quyết vấn đề logic", value: "I" },
          { text: "Thuyết phục, đàm phán và lãnh đạo nhóm", value: "E" }
        ]
      },
      {
        id: 3,
        text: "Môi trường làm việc yêu thích của bạn:",
        options: [
          { text: "Tự do, sáng tạo, không gò bó khuôn mẫu", value: "A" },
          { text: "Rõ ràng, có quy trình và tổ chức bài bản", value: "C" }
        ]
      }
    ]
  },
  {
    id: "disc",
    title: "Hành vi Công sở DISC",
    description: "Bạn là người thống trị (D), Ảnh hưởng (I), Kiên định (S) hay Tuân thủ (C)? Nắm bắt tâm lý nơi công sở.",
    emoji: "📊",
    stats: "12 câu · 2 phút",
    upsellQuizId: "enneagram",
    upsellMessage: "DISC chỉ là biểu hiện bên ngoài. Điều gì thực sự là Nỗi sợ sâu thẳm và Động lực cốt lõi thao túng mọi quyết định của bạn? Enneagram sẽ giải mã.",
    questions: [
      {
        id: 1,
        text: "Khi có một dự án mới, ưu tiên hàng đầu của bạn là:",
        options: [
          { text: "Đạt được kết quả nhanh chóng, vươn lên dẫn đầu", value: "D" },
          { text: "Tạo không khí làm việc vui vẻ, truyền cảm hứng cho team", value: "I" }
        ]
      },
      {
        id: 2,
        text: "Khi đối mặt với rủi ro, bạn thường:",
        options: [
          { text: "Cẩn trọng, tìm kiếm sự ổn định và an toàn", value: "S" },
          { text: "Phân tích kỹ lưỡng các rủi ro bằng dữ liệu chính xác", value: "C" }
        ]
      }
    ]
  },
  {
    id: "enneagram",
    title: "Góc khuất Tâm lý Enneagram",
    description: "Khám phá 9 loại động lực nội tâm. Bạn đang bị thao túng bởi nỗi sợ nào và làm sao để vượt qua nó?",
    emoji: "🎭",
    stats: "15 câu · 3 phút",
    upsellQuizId: "mi",
    upsellMessage: "Bạn đã thấu hiểu tâm lý của mình, giờ là lúc tìm ra Thiên Tài bẩm sinh ẩn giấu trong bạn với bài test Đa Trí Tuệ (Multiple Intelligences).",
    questions: [
      {
        id: 1,
        text: "Điều khiến bạn sợ hãi nhất là:",
        options: [
          { text: "Trở nên vô dụng, không đạt được thành tựu gì", value: "Type3" },
          { text: "Bị thiếu thốn, không đủ khả năng tự lo cho bản thân", value: "Type5" }
        ]
      },
      {
        id: 2,
        text: "Khi tức giận, xu hướng của bạn là:",
        options: [
          { text: "Kìm nén vào trong để giữ hòa khí", value: "Type9" },
          { text: "Bùng nổ hoặc trực tiếp đối đầu để đòi công bằng", value: "Type8" }
        ]
      }
    ]
  },
  {
    id: "mi",
    title: "Thuyết Đa Trí Tuệ",
    description: "Mỗi người là một thiên tài theo cách riêng. Bạn sở hữu trí thông minh Không gian, Ngôn ngữ hay Vận động?",
    emoji: "💡",
    stats: "16 câu · 3 phút",
    upsellQuizId: "mbti",
    upsellMessage: "Hệ sinh thái đã khép lại. Tuy nhiên, nếu bạn làm bài test MBTI cách đây quá lâu, hãy thử làm lại để xem tính cách của bạn có thay đổi không nhé!",
    questions: [
      {
        id: 1,
        text: "Bạn tiếp thu kiến thức tốt nhất qua hình thức nào?",
        options: [
          { text: "Nghe giảng và đọc tài liệu", value: "Linguistic" },
          { text: "Vẽ sơ đồ tư duy và xem hình ảnh minh họa", value: "Spatial" }
        ]
      },
      {
        id: 2,
        text: "Bạn cảm thấy mình tự tin nhất khi:",
        options: [
          { text: "Tính toán chi tiêu, giải quyết bài toán phức tạp", value: "Logical" },
          { text: "Chơi thể thao, nhảy múa hoặc tự tay chế tạo đồ vật", value: "Kinesthetic" }
        ]
      }
    ]
  }
];
