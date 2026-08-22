export interface QuizQuestion {
  id: string;
  text: string;
  options: {
    label: string;
    value: string;
    score?: number; // for ability tests
  }[];
}

export interface LikertQuestionDef {
  id: number;
  text: string;
  dimension: 'EI' | 'SN' | 'TF' | 'JP';
  direction: 1 | -1;
}

export interface QuizConfig {
  id: string;
  title: string;
  description: string;
  emoji?: string;
  questions: QuizQuestion[] | any[]; // any for Likert until we unify
  type: 'riasec' | 'ability' | 'big-five' | 'work-values' | 'fun';
  originalType?: 'likert' | 'choice';
  introContent?: {
    title: string;
    body: string[];
    upsellText: string;
  };
}

import { mbtiQuestions } from './mbtiQuestions';
import { riasecQuestions } from './riasecQuestions';

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
        'Bài test này không có đáp án Đúng hay Sai. Nó sử dụng thang đo 5 mức độ để quét toàn diện Cường độ Hứng thú của bạn qua 60 hoạt động thực tế.',
        'Hệ thống sẽ dùng thuật toán chuẩn O*NET của Mỹ để chấm điểm và trích xuất ra "Mã Holland" (Gồm 3 chữ cái mạnh nhất trong 6 nhóm R-I-A-S-E-C).',
        'Mã 3 chữ cái này vô cùng quan trọng, nó tạo ra 120 tổ hợp tính cách khác nhau, giúp AI chỉ điểm chính xác công việc nào sinh ra là để dành cho bạn.'
      ],
      upsellText: '🔥 BẬT MÍ: Tìm ra sở thích chỉ là bước khởi động! Để biết bạn có thực sự trụ lại được với nghề đó hay không, hệ thống sẽ mở khóa bài test NĂNG LỰC (Ability) ngay sau khi bạn hoàn thành bài này. Hoàn thành ngay để thu thập đủ 4 mảnh ghép Core Engine nhé!'
    },
    questions: mappedRiasecQuestions
  },
  ability: {
    id: 'ability',
    title: 'Đánh giá năng lực (Ability)',
    description: 'Kiểm tra khả năng tư duy logic, xử lý số liệu.',
    type: 'ability',
    questions: [
      {
        id: 'a1',
        text: 'Nếu 3 con mèo bắt 3 con chuột trong 3 phút, hỏi 100 con mèo bắt 100 con chuột trong bao nhiêu phút?',
        options: [
          { label: '1 phút', value: '1', score: 0 },
          { label: '3 phút', value: '3', score: 1 },
          { label: '100 phút', value: '100', score: 0 }
        ]
      },
      {
        id: 'a2',
        text: 'Số tiếp theo trong dãy số: 2, 6, 12, 20, 30, ... là bao nhiêu?',
        options: [
          { label: '40', value: '40', score: 0 },
          { label: '42', value: '42', score: 1 },
          { label: '44', value: '44', score: 0 }
        ]
      }
    ]
  },
  'big-five': {
    id: 'big-five',
    title: 'Tính cách làm việc (Big Five)',
    description: 'Bạn là kiểu người như thế nào khi làm việc?',
    type: 'big-five',
    questions: [
      {
        id: 'bf1',
        text: 'Tôi thường là người bắt chuyện trước trong các buổi gặp gỡ.',
        options: [
          { label: 'Hoàn toàn sai', value: '1' },
          { label: 'Hơi sai', value: '2' },
          { label: 'Bình thường', value: '3' },
          { label: 'Khá đúng', value: '4' },
          { label: 'Hoàn toàn đúng', value: '5' }
        ]
      }
    ]
  },
  'work-values': {
    id: 'work-values',
    title: 'Giá trị công việc (Work Values)',
    description: 'Bạn coi trọng điều gì nhất khi đi làm?',
    type: 'work-values',
    questions: [
      {
        id: 'wv1',
        text: 'Mức độ quan trọng của: Thu nhập cao',
        options: [
          { label: 'Không quan trọng', value: '1' },
          { label: 'Ít quan trọng', value: '2' },
          { label: 'Bình thường', value: '3' },
          { label: 'Quan trọng', value: '4' },
          { label: 'Rất quan trọng', value: '5' }
        ]
      }
    ]
  }
};
