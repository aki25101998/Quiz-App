// ============================================================
// PROFILE-BASED CAREER ASSESSMENT — Domain Types
// ============================================================

// ---------- PROFILE STATUS ----------
export type ProfileStatus = 'DRAFT' | 'READY' | 'PAID' | 'ARCHIVED';

// ---------- PAYMENT ----------
export type PaymentProductType = 'PROFILE_UNLOCK' | 'PROFILE_EDIT';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED';

// ---------- EDIT TYPES ----------
export type EditType = 'MAJOR_REVISION' | 'MINOR_EDIT';
export type EditPaymentStatus = 'FREE' | 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED';

// ---------- REPORT STATUS ----------
export type ReportStatus = 'CURRENT' | 'OUTDATED';

// ---------- ASSESSMENT TYPE ----------
export type AssessmentType = 'riasec' | 'ability' | 'big-five' | 'work-values';

// ---------- PROFILE ----------
export interface Profile {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  status: ProfileStatus;
  is_paid: boolean;
  revision_limit: number;
  revision_used: number;
  paid_at: string | null;
  active_version_id: string | null;
  created_at: string;
  updated_at: string;
}

// ---------- PROFILE VERSION ----------
export interface ProfileVersion {
  id: string;
  profile_id: string;
  version_number: number;
  riasec_attempt_id: string | null;
  ability_attempt_id: string | null;
  big_five_attempt_id: string | null;
  work_values_attempt_id: string | null;
  created_reason: string | null;
  created_at: string;
}

// ---------- CAREER REPORT ----------
export interface CareerReport {
  id: string;
  profile_id: string;
  profile_version_id: string;
  report_snapshot: ReportSnapshot;
  status: ReportStatus;
  generated_at: string;
}

export interface ReportSnapshot {
  profile_version_id: string;
  version_number: number;
  riasec_attempt_id: string | null;
  ability_attempt_id: string | null;
  big_five_attempt_id: string | null;
  work_values_attempt_id: string | null;
  career_matches: ReportCareerMatch[];
  profile_overview: ReportProfileOverview;
  generated_at: string;
}

export interface ReportCareerMatch {
  careerId: string;
  careerName: string;
  field: string;
  score: number;
  matchLevel: string;
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

export interface ReportProfileOverview {
  hollandCode: string | null;
  topAbilities: string[];
  topPersonality: string[];
  topWorkValues: string[];
  completeness: number;
}

// ---------- PAYMENT RECORD ----------
export interface Payment {
  id: string;
  user_id: string;
  product_type: PaymentProductType;
  reference_id: string;
  amount: number;
  status: PaymentStatus;
  transfer_code: string;
  created_at: string;
}

// ---------- PROFILE EDIT TRANSACTION ----------
export interface ProfileEditTransaction {
  id: string;
  user_id: string;
  profile_id: string;
  edit_type: EditType;
  assessment_type: AssessmentType;
  source_attempt_id: string | null;
  target_attempt_id: string;
  price: number;
  payment_status: EditPaymentStatus;
  created_at: string;
  applied_at: string | null;
}

// ---------- USER MONTHLY QUOTA ----------
export interface UserMonthlyQuota {
  id: string;
  user_id: string;
  month_key: string; // e.g. "2026-08"
  free_edits_allowed: number;
  free_edits_used: number;
  updated_at: string;
}

// ---------- HELPER TYPES ----------

/** Result of checking whether a revision is allowed */
export interface RevisionCheckResult {
  allowed: boolean;
  reason: string;
  remainingRevisions: number;
  isFree: boolean;
  price: number;
  monthlyFreeUsed: number;
  monthlyFreeLimit: number;
}

/** Assessment attempt (maps to quiz_results table) */
export interface AssessmentAttempt {
  id: string;
  user_id: string;
  quiz_id: string;
  answers: Record<string, string>;
  is_paid: boolean;
  created_at: string;
}

/** Profile with computed fields for UI */
export interface ProfileWithMeta extends Profile {
  completeness: number;
  active_version?: ProfileVersion | null;
  total_versions: number;
}
