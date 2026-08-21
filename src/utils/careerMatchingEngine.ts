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
