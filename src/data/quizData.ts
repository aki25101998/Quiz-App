// ============================================================
// QUIZ DATA — Central quiz registry
// ============================================================

import type { QuizConfig, QuizQuestion } from '../types/types';
import { mbtiQuestions } from './mbtiQuestions';
import { riasecQuestions } from './riasecQuestions';
import { bigFiveQuestions } from './bigFiveQuestions';
import { workValuesQuestions } from './workValuesQuestions';
import { abilityQuestions } from './abilityQuestions';

// ---------- Map MBTI questions to unified QuizQuestion format ----------
const mappedMbtiQuestions: QuizQuestion[] = mbtiQuestions.map((q) => ({
  id: q.id.toString(),
  text: q.text,
  options: [
    { label: 'Hoàn toàn đồng ý', value: '5' },
    { label: 'Hơi đồng ý', value: '4' },
    { label: 'Bình thường', value: '3' },
    { label: 'Hơi không đồng ý', value: '2' },
    { label: 'Hoàn toàn không đồng ý', value: '1' }
  ]
}));

// ---------- Map RIASEC questions ----------
const mappedRiasecQuestions: QuizQuestion[] = riasecQuestions.map((q) => ({
  id: q.id,
  text: `Mức độ hứng thú của bạn với công việc: "${q.text}"`,
  options: [
    { label: '😖 Rất không thích', value: '1' },
    { label: '☹️ Không thích', value: '2' },
    { label: '😐 Bình thường', value: '3' },
    { label: '🙂 Thích', value: '4' },
    { label: '😍 Rất thích', value: '5' }
  ]
}));

// ---------- Map Big Five questions ----------
const mappedBigFiveQuestions: QuizQuestion[] = bigFiveQuestions.map((q) => ({
  id: q.id,
  text: q.text,
  options: [
    { label: 'Hoàn toàn sai', value: '1' },
    { label: 'Hơi sai', value: '2' },
    { label: 'Bình thường', value: '3' },
    { label: 'Khá đúng', value: '4' },
    { label: 'Hoàn toàn đúng', value: '5' }
  ]
}));

// ---------- Map Work Values questions ----------
const mappedWorkValuesQuestions: QuizQuestion[] = workValuesQuestions.map((q) => ({
  id: q.id,
  text: q.text,
  options: [
    { label: 'Không quan trọng', value: '1' },
    { label: 'Ít quan trọng', value: '2' },
    { label: 'Bình thường', value: '3' },
    { label: 'Quan trọng', value: '4' },
    { label: 'Rất quan trọng', value: '5' }
  ]
}));

// ---------- Map Ability questions (already have options with scores) ----------
const mappedAbilityQuestions: QuizQuestion[] = abilityQuestions.map((q) => ({
  id: q.id,
  text: q.text,
  options: q.options.map(opt => ({
    label: opt.label,
    value: opt.value,
    score: opt.score,
  })),
}));

// ============================================================
// QUIZ REGISTRY
// ============================================================

export const QUIZ_DATA: Record<string, QuizConfig> = {
  mbti: {
    id: 'mbti',
    title: 'Trắc nghiệm MBTI (16 nhóm tính cách)',
    description: 'Bài test vui khám phá bạn thuộc nhóm tính cách nào trong 16 nhóm MBTI.',
    type: 'fun',
    originalType: 'likert',
    questions: mappedMbtiQuestions
  },
  riasec: {
    id: 'riasec',
    title: 'Sở thích nghề nghiệp (RIASEC)',
    description: 'Đánh giá mức độ hứng thú của bạn với các loại công việc khác nhau.',
    type: 'riasec',
    originalType: 'likert',
    introContent: {
      title: '🔍 Giải mã ADN Nghề Nghiệp (Holland Code)',
      body: [
        'Theo Lý thuyết John Holland, con người và môi trường làm việc được chia thành 6 nhóm: R (Thực tế), I (Nghiên cứu), A (Nghệ thuật), S (Xã hội), E (Quản lý) và C (Nghiệp vụ). Trải nghiệm cho thấy bạn sẽ phát triển rực rỡ nhất khi được đặt vào đúng môi trường thuộc về mình.',
        'Bài test này áp dụng tiêu chuẩn O*NET của Bộ Lao động Mỹ. Hệ thống sẽ không bắt bạn chọn Đúng/Sai, mà sử dụng thang đo 5 mức độ để đo lường chính xác cường độ đam mê của bạn qua 60 hoạt động thực tế.',
        'Thuật toán sẽ tính điểm và trích xuất ra "Mã Holland" của bạn (gồm 3 chữ cái có điểm cao nhất). Tại sao phải là 3 chữ cái? Vì tâm lý con người rất phức tạp. Tổ hợp 3 đặc điểm mạnh nhất sẽ phác họa nên DNA nghề nghiệp độc bản của bạn, giúp AI định vị chính xác công việc nào sinh ra là để dành cho bạn!'
      ],
      upsellText: '🔥 BẬT MÍ: Tìm ra sở thích chỉ là bước khởi động! Để biết bạn có thực sự trụ lại được với nghề đó hay không, hệ thống sẽ mở khóa bài test NĂNG LỰC (Ability) ngay sau khi bạn hoàn thành bài này. Hoàn thành ngay để thu thập đủ 4 mảnh ghép Core Engine nhé!'
    },
    questions: mappedRiasecQuestions
  },
  ability: {
    id: 'ability',
    title: 'Đánh giá năng lực (Ability)',
    description: 'Kiểm tra khả năng tư duy logic, xử lý số liệu, ngôn ngữ và giải quyết vấn đề.',
    type: 'ability',
    originalType: 'choice',
    introContent: {
      title: '🧠 Khám phá Bản đồ Năng lực của bạn',
      body: [
        'Sở thích và năng lực là hai thứ khác nhau. Bạn có thể thích vẽ (RIASEC cho thấy xu hướng Nghệ thuật) nhưng thực tế lại giỏi tính toán hơn. Bài test này giúp bạn biết mình THỰC SỰ mạnh ở đâu.',
        'Bài test đánh giá 7 nhóm năng lực: Tư duy Số học, Tư duy Logic, Tư duy Ngôn ngữ, Tư duy Trừu tượng, Tư duy Không gian, Chú ý Chi tiết và Giải quyết Vấn đề.',
        'Đây không phải bài thi điểm số. Không có đúng/sai tuyệt đối. Mục tiêu là phát hiện THẾ MẠNH BẨM SINH của bạn để kết hợp với sở thích, tạo nên định hướng nghề nghiệp chính xác nhất.'
      ],
      upsellText: '💡 SAU KHI BIẾT MÌNH MẠNH Ở ĐÂU: Hệ thống sẽ mở khóa bài test TÍNH CÁCH (Big Five) để hiểu cách bạn làm việc, xử lý áp lực và hợp tác nhóm. Đây là mảnh ghép thứ 3!'
    },
    questions: mappedAbilityQuestions
  },
  'big-five': {
    id: 'big-five',
    title: 'Tính cách làm việc (Big Five)',
    description: 'Phân tích 5 đặc điểm tính cách ảnh hưởng đến cách bạn làm việc và phát triển sự nghiệp.',
    type: 'big-five',
    originalType: 'likert',
    introContent: {
      title: '🎭 Giải mã Tính cách Làm việc',
      body: [
        'Big Five là mô hình tâm lý học được nghiên cứu nhiều nhất thế giới về tính cách con người. Không giống MBTI chỉ chia thành 16 nhóm, Big Five đo lường 5 phổ tính cách liên tục, cho kết quả chính xác và cá nhân hóa hơn.',
        '5 chiều tính cách: Cởi mở (Openness), Kỷ luật (Conscientiousness), Hướng ngoại (Extraversion), Hợp tác (Agreeableness) và Nhạy cảm cảm xúc (Neuroticism).',
        'Kết quả sẽ cho bạn biết bạn phù hợp với vai trò nào trong nhóm, môi trường làm việc nào giúp bạn phát huy tối đa, và những thách thức nào cần lưu ý.'
      ],
      upsellText: '🎯 MẢNH GHÉP CUỐI CÙNG: Sau bài này, hãy hoàn thành bài test GIÁ TRỊ CÔNG VIỆC (Work Values) để hệ thống biết bạn coi trọng điều gì nhất — từ đó đưa ra Báo cáo Định hướng Nghề nghiệp hoàn chỉnh!'
    },
    questions: mappedBigFiveQuestions
  },
  'work-values': {
    id: 'work-values',
    title: 'Giá trị công việc (Work Values)',
    description: 'Tìm ra những giá trị cốt lõi quyết định sự hài lòng của bạn trong công việc.',
    type: 'work-values',
    originalType: 'likert',
    introContent: {
      title: '💎 Giá trị Cốt lõi trong Công việc',
      body: [
        'Bạn có thể giỏi và thích một công việc, nhưng nếu nó không đáp ứng được GIÁ TRỊ CỐT LÕI của bạn, bạn sẽ sớm chán nản và nghỉ việc. Đây là lý do nhiều người giỏi nhưng vẫn không hạnh phúc.',
        'Bài test này đánh giá 12 giá trị công việc: Thu nhập, Ổn định, Tự do, Sáng tạo, Công nhận, Tác động xã hội, Cân bằng, Học hỏi, Thăng tiến, Giao tiếp, Độc lập và An toàn.',
        'Kết quả giúp bạn hiểu mình thực sự CẦN GÌ ở một công việc — không phải điều xã hội nói bạn nên muốn, mà là điều BẠN thực sự coi trọng.'
      ],
      upsellText: '🏆 ĐÂY LÀ MẢNH GHÉP CUỐI CÙNG! Sau khi hoàn thành, hệ thống sẽ tổng hợp TẤT CẢ dữ liệu từ 4 bài test để đưa ra Báo cáo Định hướng Nghề nghiệp cá nhân hóa — chỉ dành riêng cho bạn.'
    },
    questions: mappedWorkValuesQuestions
  }
};
