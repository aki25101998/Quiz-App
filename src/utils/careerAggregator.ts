import { calculateCareerMatch } from './careerMatchingEngine';

export type QuizResultData = {
  quiz_id: string;
  answers: Record<string, any>;
};

export type DashboardSummary = {
  completionRate: number; // Tỷ lệ hoàn thành (0 - 4)
  completedCore: string[];
  missingCore: string[];
  statusMessage: string;
  advice: string;
  recommendedCareers: string[];
};

export function aggregateCareerResults(results: QuizResultData[]): DashboardSummary {
  const coreQuizzes = ['riasec', 'ability', 'big-five', 'work-values'];
  
  const completedCore = results
    .map(r => r.quiz_id)
    .filter(id => coreQuizzes.includes(id));
    
  // Lọc trùng lặp nếu user làm nhiều lần (lấy unique)
  const uniqueCompleted = [...new Set(completedCore)];
  const missingCore = coreQuizzes.filter(id => !uniqueCompleted.includes(id));
  
  const completionRate = uniqueCompleted.length;

  let statusMessage = '';
  let advice = '';
  let recommendedCareers: string[] = [];

  // Lấy dữ liệu bài test RIASEC nếu có
  const riasecResult = results.find(r => r.quiz_id === 'riasec');
  let topCareersFromRiasec: string[] = [];
  let hollandCodeStr = '';

  if (riasecResult) {
    const match = calculateCareerMatch('riasec', riasecResult.answers);
    topCareersFromRiasec = match.topCareers.map(c => c.name);
    hollandCodeStr = match.personalityTraits[0] || '';
  }

  if (completionRate === 0) {
    statusMessage = 'Bạn chưa bắt đầu Hành trình Core Engine';
    advice = 'Hãy làm bài test RIASEC đầu tiên để khám phá sở thích nghề nghiệp của bạn. Đây là viên gạch nền móng quan trọng nhất.';
  } else if (completionRate > 0 && completionRate < 4) {
    statusMessage = `Đang thu thập dữ liệu... (${completionRate}/4 bài test lõi)`;
    
    if (riasecResult) {
      advice = `Dữ liệu sơ bộ cho thấy ${hollandCodeStr}. Tuy nhiên, chúng tôi cần biết thêm về năng lực và tính cách để thu hẹp phạm vi nghề nghiệp. Hãy tiếp tục làm bài ${missingCore[0].toUpperCase()}.`;
      recommendedCareers = topCareersFromRiasec;
    } else {
      advice = `Bạn đang đi đúng hướng. Hãy hoàn thành bài test RIASEC - xương sống của hệ thống để chúng tôi đưa ra các gợi ý đầu tiên.`;
      recommendedCareers = ['Đang chờ dữ liệu Sở thích...'];
    }
  } else {
    statusMessage = 'Phân tích toàn diện đã sẵn sàng (4/4)';
    advice = `Tuyệt vời! Dựa trên hệ thống phân tích tích hợp (Sở thích, Năng lực, Tính cách, Giá trị), ${hollandCodeStr}. Dưới đây là các định hướng phù hợp nhất với bản chất cốt lõi của bạn.`;
    recommendedCareers = topCareersFromRiasec.length > 0 ? topCareersFromRiasec : [
      'Giám đốc Sáng tạo (Creative Director)',
      'Chuyên gia UX/UI',
      'Kỹ sư Giải pháp (Solution Architect)'
    ];
  }

  return {
    completionRate,
    completedCore: uniqueCompleted,
    missingCore,
    statusMessage,
    advice,
    recommendedCareers
  };
}
