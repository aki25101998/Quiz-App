import { mbtiResults } from '../data/mbtiResults';
import { mbtiQuestions } from '../data/mbtiQuestions';

export interface CareerMatchResult {
  topCareers: {
    name: string;
    score: number;
    description: string;
  }[];
  strengths: string[];
  weaknesses: string[];
  personalityTraits: string[];
}

export function calculateCareerMatch(
  quizId: string, 
  answers: Record<string, string>
): CareerMatchResult {
  // Logic tính toán dựa trên loại bài test. 
  // Trong thực tế, hàm này sẽ phức tạp hơn và có thể xử lý tổng hợp nhiều bài test.
  
  if (quizId === 'riasec' && Object.keys(answers).length >= 0) {
    return {
      topCareers: [
        { name: 'Kỹ sư phần mềm', score: 92, description: 'Phù hợp với người có điểm I (Investigative) và R (Realistic) cao.' },
        { name: 'Thiết kế đồ hoạ (UX/UI)', score: 85, description: 'Phù hợp với nhóm A (Artistic).' },
        { name: 'Phân tích dữ liệu', score: 80, description: 'Phù hợp với nhóm I (Investigative) và C (Conventional).' }
      ],
      strengths: ['Tư duy phân tích', 'Làm việc độc lập'],
      weaknesses: ['Giao tiếp trước đám đông'],
      personalityTraits: ['Thích tìm tòi', 'Thực tế']
    };
  }

  if (quizId === 'mbti') {
    let axes: Record<string, number> = { EI: 0, SN: 0, TF: 0, JP: 0 };
    Object.entries(answers).forEach(([qId, valStr]) => {
      const val = parseInt(valStr);
      if (isNaN(val)) return;
      const question = mbtiQuestions.find(q => q.id.toString() === qId);
      if (question) {
        // 5: +2, 4: +1, 3: 0, 2: -1, 1: -2
        const score = (val - 3) * question.direction;
        axes[question.dimension] += score;
      }
    });

    let finalMBTI = '';
    finalMBTI += (axes.EI >= 0) ? 'E' : 'I';
    finalMBTI += (axes.SN >= 0) ? 'S' : 'N';
    finalMBTI += (axes.TF >= 0) ? 'T' : 'F';
    finalMBTI += (axes.JP >= 0) ? 'J' : 'P';

    const mbtiData = mbtiResults[finalMBTI] || mbtiResults['INTJ'];
    
    return {
      topCareers: [
        { name: `${finalMBTI} - ${mbtiData.name}`, score: 100, description: mbtiData.description }
      ],
      strengths: mbtiData.strengths,
      weaknesses: mbtiData.weaknesses,
      personalityTraits: []
    };
  }

  // Default mock result
  return {
    topCareers: [
      { name: 'Nghề nghiệp A', score: 85, description: 'Mô tả phù hợp...' },
      { name: 'Nghề nghiệp B', score: 75, description: 'Mô tả phù hợp...' }
    ],
    strengths: ['Điểm mạnh 1', 'Điểm mạnh 2'],
    weaknesses: ['Điểm yếu 1'],
    personalityTraits: ['Đặc điểm 1']
  };
}
