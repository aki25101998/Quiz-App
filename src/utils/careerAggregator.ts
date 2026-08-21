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

  if (completionRate === 0) {
    statusMessage = 'Bạn chưa bắt đầu Hành trình Core Engine';
    advice = 'Hãy làm bài test RIASEC đầu tiên để khám phá sở thích nghề nghiệp của bạn. Đây là viên gạch nền móng quan trọng nhất.';
  } else if (completionRate > 0 && completionRate < 4) {
    statusMessage = `Đang thu thập dữ liệu... (${completionRate}/4 bài test lõi)`;
    
    // Đưa ra định hướng tạm thời dựa trên những gì đã có (Mock logic)
    if (uniqueCompleted.includes('riasec') && !uniqueCompleted.includes('big-five')) {
      advice = 'Hệ thống đã nhận diện được sở thích của bạn. Tuy nhiên, chúng tôi cần biết thêm về tính cách làm việc (Big Five) để xem bạn phù hợp với môi trường nào.';
      recommendedCareers = ['Đang chờ thêm dữ liệu để phân tích chính xác...'];
    } else {
      advice = `Bạn đang đi đúng hướng. Hãy hoàn thành bài test ${missingCore[0].toUpperCase()} để hệ thống có bức tranh toàn cảnh hơn về bạn.`;
      recommendedCareers = ['Đang chờ thêm dữ liệu...'];
    }
  } else {
    statusMessage = 'Phân tích toàn diện đã sẵn sàng (4/4)';
    advice = 'Sự kết hợp giữa sở thích (RIASEC), năng lực, tính cách và giá trị của bạn chỉ ra rằng bạn sinh ra để làm những công việc đòi hỏi sự sáng tạo và linh hoạt cao.';
    recommendedCareers = [
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
