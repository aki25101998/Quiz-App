// ============================================================
// BIG FIVE SCORING ENGINE
// ============================================================

import type {
  BigFiveDimension,
  BigFiveResult,
  BigFiveScores,
  BigFiveQuestionDef,
} from '../../types/types';

const BIG_FIVE_DIMENSIONS: BigFiveDimension[] = [
  'openness',
  'conscientiousness',
  'extraversion',
  'agreeableness',
  'neuroticism',
];

/**
 * Calculate Big Five scores from quiz answers.
 *
 * Supports reverse-scored questions via direction: -1.
 * Likert scale: 1 (Hoàn toàn sai) to 5 (Hoàn toàn đúng)
 *
 * For direction = 1:  score = answer value (1-5)
 * For direction = -1: score = 6 - answer value (reverse)
 */
export function calculateBigFiveScores(
  answers: Record<string, string>,
  questions: BigFiveQuestionDef[]
): BigFiveResult {
  // Group questions by dimension
  const dimensionQuestions = new Map<BigFiveDimension, BigFiveQuestionDef[]>();
  for (const q of questions) {
    const existing = dimensionQuestions.get(q.dimension) || [];
    existing.push(q);
    dimensionQuestions.set(q.dimension, existing);
  }

  const rawScores = {} as BigFiveScores;
  const normalizedScores = {} as BigFiveScores;

  for (const dim of BIG_FIVE_DIMENSIONS) {
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

      // Apply direction (reverse scoring)
      const score = q.direction === -1 ? 6 - val : val;
      totalScore += score;
      answeredCount++;
    }

    if (answeredCount === 0) continue;

    rawScores[dimension] = totalScore;

    // Normalize to 0-100
    // Min possible per question = 1, Max = 5
    const minPossible = answeredCount * 1;
    const maxPossible = answeredCount * 5;
    normalizedScores[dimension] = Math.round(
      ((totalScore - minPossible) / (maxPossible - minPossible)) * 100
    );
  }

  return {
    scores: rawScores,
    normalizedScores,
  };
}
