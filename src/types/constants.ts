// ============================================================
// CONSTANTS — Career Discovery Platform
// ============================================================

import type {
  AbilityLevel,
  RiasecDimension,
  BigFiveDimension,
  AbilityDimension,
  WorkValueDimension,
} from './types';

// ---------- SCORE THRESHOLDS ----------
export const SCORE_THRESHOLDS: Record<AbilityLevel, number> = {
  veryStrong: 80,
  strong: 65,
  moderate: 50,
  developing: 35,
  low: 0,
};

export function getAbilityLevel(normalizedScore: number): AbilityLevel {
  if (normalizedScore >= SCORE_THRESHOLDS.veryStrong) return 'veryStrong';
  if (normalizedScore >= SCORE_THRESHOLDS.strong) return 'strong';
  if (normalizedScore >= SCORE_THRESHOLDS.moderate) return 'moderate';
  if (normalizedScore >= SCORE_THRESHOLDS.developing) return 'developing';
  return 'low';
}

// ---------- CAREER MATCH WEIGHTS ----------
export const CAREER_MATCH_WEIGHTS = {
  riasec: 0.30,
  ability: 0.30,
  personality: 0.20,
  workValues: 0.20,
} as const;

// ---------- CONFIDENCE BY NUMBER OF COMPLETED TESTS ----------
export const CONFIDENCE_BY_TESTS: Record<number, number> = {
  0: 0,
  1: 25,
  2: 50,
  3: 75,
  4: 100,
};

// ---------- CORE QUIZ IDS ----------
export const CORE_QUIZ_IDS = ['riasec', 'ability', 'big-five', 'work-values'] as const;

// ---------- RIASEC LABELS ----------
export const RIASEC_LABELS: Record<RiasecDimension, { name: string; shortDesc: string }> = {
  R: { name: 'Thực tế (Realistic)', shortDesc: 'Thích hành động, làm việc với công cụ, máy móc' },
  I: { name: 'Nghiên cứu (Investigative)', shortDesc: 'Thích suy nghĩ, phân tích, tìm tòi logic' },
  A: { name: 'Nghệ thuật (Artistic)', shortDesc: 'Thích sáng tạo, tự do, biểu đạt cá nhân' },
  S: { name: 'Xã hội (Social)', shortDesc: 'Thích giúp đỡ, giao tiếp, truyền cảm hứng' },
  E: { name: 'Quản lý (Enterprising)', shortDesc: 'Thích lãnh đạo, thuyết phục, cạnh tranh' },
  C: { name: 'Nghiệp vụ (Conventional)', shortDesc: 'Thích nguyên tắc, tổ chức, dữ liệu chi tiết' },
};

// ---------- BIG FIVE LABELS ----------
export const BIG_FIVE_LABELS: Record<BigFiveDimension, { name: string; highDesc: string; lowDesc: string }> = {
  openness: {
    name: 'Khả năng khám phá & cởi mở',
    highDesc: 'Sáng tạo, tò mò, thích trải nghiệm mới',
    lowDesc: 'Thực tế, ưa truyền thống, thích sự quen thuộc',
  },
  conscientiousness: {
    name: 'Tính kỷ luật & trách nhiệm',
    highDesc: 'Có tổ chức, cẩn thận, đáng tin cậy',
    lowDesc: 'Linh hoạt, tự phát, không bị gò bó',
  },
  extraversion: {
    name: 'Mức độ hướng ngoại',
    highDesc: 'Năng động, hòa đồng, thích giao tiếp',
    lowDesc: 'Trầm tính, độc lập, thích không gian riêng',
  },
  agreeableness: {
    name: 'Tính hợp tác & đồng cảm',
    highDesc: 'Thân thiện, hợp tác, quan tâm người khác',
    lowDesc: 'Cạnh tranh, thẳng thắn, ưu tiên hiệu quả',
  },
  neuroticism: {
    name: 'Độ nhạy cảm cảm xúc',
    highDesc: 'Dễ lo lắng, nhạy cảm với áp lực',
    lowDesc: 'Bình tĩnh, ổn định, xử lý stress tốt',
  },
};

// ---------- ABILITY LABELS ----------
export const ABILITY_LABELS: Record<AbilityDimension, { name: string; description: string }> = {
  numerical: { name: 'Tư duy số học', description: 'Khả năng xử lý con số, tính toán và phân tích dữ liệu định lượng' },
  logical: { name: 'Tư duy logic', description: 'Khả năng nhận diện quy luật, suy luận và giải quyết vấn đề có hệ thống' },
  verbal: { name: 'Tư duy ngôn ngữ', description: 'Khả năng hiểu, phân tích và sử dụng ngôn ngữ hiệu quả' },
  abstract: { name: 'Tư duy trừu tượng', description: 'Khả năng nhận diện pattern và quan hệ trong thông tin phi ngôn ngữ' },
  spatial: { name: 'Tư duy không gian', description: 'Khả năng hình dung, xoay và thao tác vật thể trong không gian' },
  attention: { name: 'Chú ý chi tiết', description: 'Khả năng phát hiện sai sót và duy trì sự tập trung' },
  problemSolving: { name: 'Giải quyết vấn đề', description: 'Khả năng phân tích tình huống và đưa ra giải pháp sáng tạo' },
};

// ---------- WORK VALUE LABELS ----------
export const WORK_VALUE_LABELS: Record<WorkValueDimension, { name: string; description: string }> = {
  income: { name: 'Thu nhập cao', description: 'Mức lương và thu nhập tài chính' },
  stability: { name: 'Sự ổn định', description: 'Công việc ổn định, ít biến động' },
  freedom: { name: 'Tự do & Linh hoạt', description: 'Tự chủ trong cách thức và thời gian làm việc' },
  creativity: { name: 'Sáng tạo', description: 'Cơ hội thể hiện ý tưởng và sáng tạo' },
  recognition: { name: 'Được công nhận', description: 'Được ghi nhận thành tích và đóng góp' },
  impact: { name: 'Tác động xã hội', description: 'Đóng góp có ý nghĩa cho cộng đồng' },
  balance: { name: 'Cân bằng cuộc sống', description: 'Hài hòa giữa công việc và đời sống cá nhân' },
  learning: { name: 'Học hỏi liên tục', description: 'Luôn có cơ hội phát triển kiến thức mới' },
  growth: { name: 'Thăng tiến', description: 'Cơ hội phát triển sự nghiệp lâu dài' },
  social: { name: 'Giao tiếp xã hội', description: 'Làm việc và tương tác với nhiều người' },
  independence: { name: 'Độc lập', description: 'Tự quản lý công việc mà không bị giám sát' },
  security: { name: 'An toàn', description: 'Môi trường làm việc an toàn, ít rủi ro' },
};

// ---------- ABILITY LEVEL LABELS ----------
export const ABILITY_LEVEL_LABELS: Record<AbilityLevel, string> = {
  low: 'Cần phát triển',
  developing: 'Đang phát triển',
  moderate: 'Trung bình khá',
  strong: 'Mạnh',
  veryStrong: 'Rất mạnh',
};

// ---------- SCORE LEVEL LABEL (generic) ----------
export function getScoreLabel(normalizedScore: number): string {
  if (normalizedScore >= 80) return 'Rất cao';
  if (normalizedScore >= 65) return 'Cao';
  if (normalizedScore >= 50) return 'Trung bình khá';
  if (normalizedScore >= 35) return 'Trung bình';
  return 'Thấp';
}
