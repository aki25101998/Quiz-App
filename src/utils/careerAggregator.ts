// ============================================================
// CAREER AGGREGATOR — Dashboard summary for History page
// Uses the new profile aggregator + career matching engine
// ============================================================

import type { DashboardSummary, CareerMatch } from '../types/types';
import { CORE_QUIZ_IDS } from '../types/constants';
import { buildCareerProfile, getMissingCoreQuizzes } from './profileAggregator';
import { matchCareers } from './careerMatchingEngine';
import { RIASEC_LABELS } from '../types/constants';

export type QuizResultData = {
  quiz_id: string;
  answers: Record<string, string>;
};

export function aggregateCareerResults(results: QuizResultData[]): DashboardSummary {
  const profile = buildCareerProfile(results);
  const missingCore = getMissingCoreQuizzes(profile);

  const completedCore = profile.completedTests.filter(t =>
    (CORE_QUIZ_IDS as readonly string[]).includes(t)
  );
  const completionRate = completedCore.length;

  let statusMessage = '';
  let advice = '';
  let recommendedCareers: CareerMatch[] = [];

  if (completionRate === 0) {
    statusMessage = 'Bạn chưa bắt đầu Hành trình Core Engine';
    advice = 'Hãy làm bài test RIASEC đầu tiên để khám phá sở thích nghề nghiệp của bạn. Đây là viên gạch nền móng quan trọng nhất.';
  } else if (completionRate < 4) {
    statusMessage = `Đang thu thập dữ liệu... (${completionRate}/4 bài test lõi)`;

    if (profile.riasec) {
      const topCode = profile.riasec.hollandCode;
      const topDimLabel = RIASEC_LABELS[profile.riasec.ranking[0]]?.name || '';
      advice = `Dữ liệu sơ bộ cho thấy Mã Holland của bạn là ${topCode}, xu hướng mạnh nhất là ${topDimLabel}. Tuy nhiên, chúng tôi cần biết thêm về ${missingCore[0] === 'ability' ? 'năng lực' : missingCore[0] === 'big-five' ? 'tính cách' : 'giá trị công việc'} để thu hẹp phạm vi nghề nghiệp chính xác hơn.`;
    } else {
      advice = 'Bạn đang đi đúng hướng. Hãy hoàn thành bài test RIASEC — xương sống của hệ thống để chúng tôi đưa ra các gợi ý đầu tiên.';
    }

    // Still run matching with available data
    if (completionRate >= 1) {
      recommendedCareers = matchCareers(profile).slice(0, 5);
    }
  } else {
    statusMessage = 'Phân tích toàn diện đã sẵn sàng (4/4)';
    advice = 'Tuyệt vời! Dựa trên hệ thống phân tích tích hợp (Sở thích, Năng lực, Tính cách, Giá trị), dưới đây là các định hướng nghề nghiệp phù hợp nhất với bản chất cốt lõi của bạn.';
    recommendedCareers = matchCareers(profile).slice(0, 8);
  }

  return {
    completionRate,
    completedCore,
    missingCore,
    statusMessage,
    advice,
    recommendedCareers,
    profile,
  };
}
