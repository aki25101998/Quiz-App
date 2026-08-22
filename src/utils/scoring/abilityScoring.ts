// ============================================================
// ABILITY SCORING ENGINE
// ============================================================

import type {
  AbilityDimension,
  AbilityLevel,
  AbilityResult,
  AbilityScores,
  AbilityQuestionDef,
} from '../../types/types';
import { getAbilityLevel } from '../../types/constants';

/**
 * Calculate Ability scores from quiz answers.
 * 
 * @param answers Record<questionId, selectedValue (string)>
 * @param questions The ability question definitions with score metadata
 */
export function calculateAbilityScores(
  answers: Record<string, string>,
  questions: AbilityQuestionDef[]
): AbilityResult {
  // Group questions by dimension
  const dimensionQuestions = new Map<AbilityDimension, AbilityQuestionDef[]>();
  for (const q of questions) {
    const existing = dimensionQuestions.get(q.dimension) || [];
    existing.push(q);
    dimensionQuestions.set(q.dimension, existing);
  }

  const rawScores: AbilityScores = {};
  const normalizedScores: AbilityScores = {};
  const levels: Partial<Record<AbilityDimension, AbilityLevel>> = {};

  for (const [dimension, dimQuestions] of dimensionQuestions) {
    let totalScore = 0;
    let answeredCount = 0;
    const maxPerQuestion = 1; // Correct answer = 1 point

    for (const q of dimQuestions) {
      const answer = answers[q.id];
      if (answer === undefined) continue;

      // Find the option that matches the answer
      const selectedOption = q.options.find(opt => opt.value === answer);
      if (selectedOption) {
        totalScore += selectedOption.score;
        answeredCount++;
      }
    }

    if (answeredCount === 0) continue;

    rawScores[dimension] = totalScore;
    
    // Normalize: (correct / total) * 100
    const maxPossible = dimQuestions.length * maxPerQuestion;
    const normalized = Math.round((totalScore / maxPossible) * 100);
    normalizedScores[dimension] = normalized;
    levels[dimension] = getAbilityLevel(normalized);
  }

  return {
    scores: rawScores,
    normalizedScores,
    levels,
  };
}
