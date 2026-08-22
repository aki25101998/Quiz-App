// ============================================================
// RIASEC SCORING ENGINE
// ============================================================

import type { RiasecDimension, RiasecResult, RiasecScores } from '../../types/types';
import { riasecQuestions } from '../../data/riasecQuestions';

const RIASEC_DIMENSIONS: RiasecDimension[] = ['R', 'I', 'A', 'S', 'E', 'C'];

// Max possible score per dimension: 10 questions × 5 (max Likert) = 50
const MAX_RAW_PER_DIMENSION = 50;
// Min possible: 10 questions × 1 = 10
const MIN_RAW_PER_DIMENSION = 10;

/**
 * Calculate RIASEC scores from quiz answers.
 * answers: Record<questionId, likertValue (string "1"-"5")>
 */
export function calculateRiasecScores(answers: Record<string, string>): RiasecResult {
  // Step 1: Calculate raw scores
  const rawScores: RiasecScores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

  Object.entries(answers).forEach(([qId, valStr]) => {
    const val = parseInt(valStr, 10);
    if (isNaN(val)) return;
    const question = riasecQuestions.find(q => q.id === qId);
    if (question) {
      rawScores[question.dimension] += val;
    }
  });

  // Step 2: Normalize to 0-100
  const normalizedScores = {} as RiasecScores;
  for (const dim of RIASEC_DIMENSIONS) {
    normalizedScores[dim] = normalizeScore(
      rawScores[dim],
      MIN_RAW_PER_DIMENSION,
      MAX_RAW_PER_DIMENSION
    );
  }

  // Step 3: Rank dimensions
  const ranking = [...RIASEC_DIMENSIONS].sort(
    (a, b) => normalizedScores[b] - normalizedScores[a]
  );

  // Step 4: Holland code (top 3)
  const hollandCode = ranking.slice(0, 3).join('');

  return {
    scores: rawScores,
    normalizedScores,
    ranking,
    hollandCode,
  };
}

/**
 * Normalize a raw score to 0-100 range.
 */
function normalizeScore(raw: number, min: number, max: number): number {
  if (max === min) return 0;
  const normalized = ((raw - min) / (max - min)) * 100;
  return Math.round(Math.max(0, Math.min(100, normalized)));
}
