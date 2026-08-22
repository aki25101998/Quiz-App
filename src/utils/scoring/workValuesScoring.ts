// ============================================================
// WORK VALUES SCORING ENGINE
// ============================================================

import type {
  WorkValueDimension,
  WorkValueResult,
  WorkValueScores,
  WorkValueQuestionDef,
} from '../../types/types';

const ALL_WORK_VALUE_DIMENSIONS: WorkValueDimension[] = [
  'income', 'stability', 'freedom', 'creativity', 'recognition',
  'impact', 'balance', 'learning', 'growth', 'social',
  'independence', 'security',
];

/**
 * Calculate Work Value scores from quiz answers.
 *
 * Likert scale: 1 (Không quan trọng) to 5 (Rất quan trọng)
 */
export function calculateWorkValueScores(
  answers: Record<string, string>,
  questions: WorkValueQuestionDef[]
): WorkValueResult {
  // Group questions by dimension
  const dimensionQuestions = new Map<WorkValueDimension, WorkValueQuestionDef[]>();
  for (const q of questions) {
    const existing = dimensionQuestions.get(q.dimension) || [];
    existing.push(q);
    dimensionQuestions.set(q.dimension, existing);
  }

  const rawScores = {} as WorkValueScores;
  const normalizedScores = {} as WorkValueScores;

  for (const dim of ALL_WORK_VALUE_DIMENSIONS) {
    rawScores[dim] = 0;
    normalizedScores[dim] = 0;
  }

  for (const [dimension, dimQuestions] of dimensionQuestions) {
    let totalScore = 0;
    let answeredCount = 0;

    for (const q of dimQuestions) {
      const answer = answers[q.id];
      if (answer === undefined) continue;

      const val = parseInt(answer, 10);
      if (isNaN(val)) continue;

      totalScore += val;
      answeredCount++;
    }

    if (answeredCount === 0) continue;

    rawScores[dimension] = totalScore;

    // Normalize to 0-100
    const minPossible = answeredCount * 1;
    const maxPossible = answeredCount * 5;
    normalizedScores[dimension] = Math.round(
      ((totalScore - minPossible) / (maxPossible - minPossible)) * 100
    );
  }

  // Generate ranking sorted by normalized score
  const ranking = ALL_WORK_VALUE_DIMENSIONS
    .filter(dim => normalizedScores[dim] > 0 || rawScores[dim] > 0)
    .map(dim => ({ dimension: dim, score: normalizedScores[dim] }))
    .sort((a, b) => b.score - a.score);

  return {
    scores: rawScores,
    normalizedScores,
    ranking,
  };
}
