export interface QuizQuestion {
  id: string;
  text: string;
  options: {
    label: string;
    value: string;
    score?: number; // for ability tests
  }[];
}

export interface QuizConfig {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  type: 'riasec' | 'ability' | 'big-five' | 'work-values';
}

export const QUIZ_DATA: Record<string, QuizConfig> = {
  riasec: {
    id: 'riasec',
    title: 'Sở thích nghề nghiệp (RIASEC)',
    description: 'Đánh giá mức độ hứng thú của bạn với các loại công việc khác nhau.',
    type: 'riasec',
    questions: [
      {
        id: 'r1',
        text: 'Tôi thích sửa chữa các thiết bị điện tử, máy móc.',
        options: [
          { label: 'Rất không thích', value: '1' },
          { label: 'Không thích', value: '2' },
          { label: 'Bình thường', value: '3' },
          { label: 'Thích', value: '4' },
          { label: 'Rất thích', value: '5' }
        ]
      },
      {
        id: 'i1',
        text: 'Tôi thích phân tích số liệu, giải bài toán khó.',
        options: [
          { label: 'Rất không thích', value: '1' },
          { label: 'Không thích', value: '2' },
          { label: 'Bình thường', value: '3' },
          { label: 'Thích', value: '4' },
          { label: 'Rất thích', value: '5' }
        ]
      },
      // Thêm nhiều câu hỏi khác
    ]
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
