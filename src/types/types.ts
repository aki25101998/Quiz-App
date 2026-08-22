// ============================================================
// DOMAIN TYPES — Career Discovery Platform
// ============================================================

// ---------- RIASEC ----------
export type RiasecDimension = 'R' | 'I' | 'A' | 'S' | 'E' | 'C';

export type RiasecScores = Record<RiasecDimension, number>;

export interface RiasecResult {
  scores: RiasecScores;
  normalizedScores: RiasecScores;
  ranking: RiasecDimension[];
  hollandCode: string; // top 3 e.g. "IRC"
}

// ---------- ABILITY ----------
export type AbilityDimension =
  | 'numerical'
  | 'logical'
  | 'verbal'
  | 'abstract'
  | 'spatial'
  | 'attention'
  | 'problemSolving';

export type AbilityScores = Partial<Record<AbilityDimension, number>>;

export type AbilityLevel = 'low' | 'developing' | 'moderate' | 'strong' | 'veryStrong';

export interface AbilityResult {
  scores: AbilityScores;
  normalizedScores: AbilityScores;
  levels: Partial<Record<AbilityDimension, AbilityLevel>>;
}

// ---------- BIG FIVE ----------
export type BigFiveDimension = 'openness' | 'conscientiousness' | 'extraversion' | 'agreeableness' | 'neuroticism';

export type BigFiveScores = Record<BigFiveDimension, number>;

export interface BigFiveResult {
  scores: BigFiveScores;
  normalizedScores: BigFiveScores;
}

// ---------- WORK VALUES ----------
export type WorkValueDimension =
  | 'income'
  | 'stability'
  | 'freedom'
  | 'creativity'
  | 'recognition'
  | 'impact'
  | 'balance'
  | 'learning'
  | 'growth'
  | 'social'
  | 'independence'
  | 'security';

export type WorkValueScores = Record<WorkValueDimension, number>;

export interface WorkValueResult {
  scores: WorkValueScores;
  normalizedScores: WorkValueScores;
  ranking: { dimension: WorkValueDimension; score: number }[];
}

// ---------- CAREER PROFILE ----------
export interface CareerProfile {
  riasec?: RiasecResult;
  abilities?: AbilityResult;
  bigFive?: BigFiveResult;
  workValues?: WorkValueResult;
  mbti?: string;
  completedTests: string[];
  confidence: number; // 0-100
}

// ---------- CAREER DATABASE ----------
export interface Career {
  id: string;
  name: string;
  description: string;
  field: string;
  riasec: Partial<RiasecScores>;
  abilities: Partial<Record<AbilityDimension, number>>;
  personality: Partial<Record<BigFiveDimension, number>>;
  workValues: Partial<Record<WorkValueDimension, number>>;
  education: string[];
  skills: string[];
  tags: string[];
}

// ---------- CAREER MATCH ----------
export interface CareerMatch {
  careerId: string;
  careerName: string;
  field: string;
  score: number;       // 0-100, computed from profile
  confidence: number;  // 0-100, based on data completeness
  reasons: string[];
  strengths: string[];
  concerns: string[];
  dimensionScores: {
    riasec?: number;
    ability?: number;
    personality?: number;
    workValues?: number;
  };
}

// ---------- CAREER MATCH RESULT (backward compat) ----------
export interface CareerMatchResult {
  topCareers: {
    name: string;
    score: number;
    description: string;
  }[];
  strengths: string[];
  weaknesses: string[];
  personalityTraits: string[];
  // New fields (optional for backward compat)
  careerMatches?: CareerMatch[];
  profile?: CareerProfile;
}

// ---------- QUESTION TYPES ----------
export interface LikertQuestionDef {
  id: string;
  text: string;
  dimension: string;
  direction: 1 | -1;
}

export interface AbilityQuestionDef {
  id: string;
  text: string;
  dimension: AbilityDimension;
  options: {
    label: string;
    value: string;
    score: number;
  }[];
}

export interface WorkValueQuestionDef {
  id: string;
  text: string;
  dimension: WorkValueDimension;
}

export interface BigFiveQuestionDef {
  id: string;
  text: string;
  dimension: BigFiveDimension;
  direction: 1 | -1;
}

// ---------- QUIZ CONFIG ----------
export type QuizType = 'riasec' | 'ability' | 'big-five' | 'work-values' | 'fun';
export type QuizInputType = 'likert' | 'choice';

export interface QuizQuestion {
  id: string;
  text: string;
  options: {
    label: string;
    value: string;
    score?: number;
  }[];
}

export interface QuizConfig {
  id: string;
  title: string;
  description: string;
  emoji?: string;
  questions: QuizQuestion[];
  type: QuizType;
  originalType?: QuizInputType;
  introContent?: {
    title: string;
    body: string[];
    upsellText: string;
  };
}

// ---------- DASHBOARD ----------
export interface DashboardSummary {
  completionRate: number;
  completedCore: string[];
  missingCore: string[];
  statusMessage: string;
  advice: string;
  recommendedCareers: CareerMatch[];
  profile: CareerProfile | null;
}
