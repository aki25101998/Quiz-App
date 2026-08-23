// ============================================================
// PROFILE AGGREGATOR
// Builds a CareerProfile from multiple quiz results
// ============================================================

import type { CareerProfile } from '../types/types';
import { COMPLETENESS_BY_TESTS, CORE_QUIZ_IDS } from '../types/constants';
import { calculateRiasecScores } from './scoring/riasecScoring';
import { calculateAbilityScores } from './scoring/abilityScoring';
import { calculateBigFiveScores } from './scoring/bigFiveScoring';
import { calculateWorkValueScores } from './scoring/workValuesScoring';
import { abilityQuestions } from '../data/abilityQuestions';
import { bigFiveQuestions } from '../data/bigFiveQuestions';
import { workValuesQuestions } from '../data/workValuesQuestions';

export type QuizResultInput = {
  quiz_id: string;
  answers: Record<string, string>;
  created_at?: string;
};

/**
 * [NOT FOR OFFICIAL PROFILE/REPORT FLOW]
 * Build a CareerProfile from all quiz results a user has completed.
 * Takes the LATEST result for each quiz type (if duplicates exist).
 * Only used for Preview, Dashboard, and legacy flows.
 */
export function buildPreviewCareerProfileFromLatestResults(results: QuizResultInput[]): CareerProfile {
  const profile: CareerProfile = {
    completedTests: [],
    completeness: 0,
  };

  // De-duplicate: take the latest result per quiz_id based on created_at
  const latestByQuiz = new Map<string, QuizResultInput>();
  
  for (const r of results) {
    const existing = latestByQuiz.get(r.quiz_id);
    if (!existing) {
      latestByQuiz.set(r.quiz_id, r);
    } else {
      // Compare dates safely
      const existingTime = existing.created_at ? new Date(existing.created_at).getTime() : 0;
      const currentTime = r.created_at ? new Date(r.created_at).getTime() : 0;
      
      // If current is newer, or if existing time is invalid (NaN) but current is valid
      if (currentTime > existingTime || (isNaN(existingTime) && !isNaN(currentTime))) {
        latestByQuiz.set(r.quiz_id, r);
      }
    }
  }

  // Process RIASEC
  const riasecResult = latestByQuiz.get('riasec');
  if (riasecResult && Object.keys(riasecResult.answers).length > 0) {
    profile.riasec = calculateRiasecScores(riasecResult.answers);
    profile.completedTests.push('riasec');
  }

  // Process Ability
  const abilityResult = latestByQuiz.get('ability');
  if (abilityResult && Object.keys(abilityResult.answers).length > 0) {
    profile.abilities = calculateAbilityScores(abilityResult.answers, abilityQuestions);
    profile.completedTests.push('ability');
  }

  // Process Big Five
  const bigFiveResult = latestByQuiz.get('big-five');
  if (bigFiveResult && Object.keys(bigFiveResult.answers).length > 0) {
    profile.bigFive = calculateBigFiveScores(bigFiveResult.answers, bigFiveQuestions);
    profile.completedTests.push('big-five');
  }

  // Process Work Values
  const workValuesResult = latestByQuiz.get('work-values');
  if (workValuesResult && Object.keys(workValuesResult.answers).length > 0) {
    profile.workValues = calculateWorkValueScores(workValuesResult.answers, workValuesQuestions);
    profile.completedTests.push('work-values');
  }

  // Process MBTI (optional, fun quiz)
  const mbtiResult = latestByQuiz.get('mbti');
  if (mbtiResult) {
    // We don't calculate MBTI here as it's handled separately in careerMatchingEngine
    // Just track completion
  }

  // Calculate completeness based on number of core tests completed
  const coreCompleted = profile.completedTests.filter(t =>
    (CORE_QUIZ_IDS as readonly string[]).includes(t)
  ).length;
  profile.completeness = (COMPLETENESS_BY_TESTS as Record<number, number>)[coreCompleted] ?? 0;

  return profile;
}

/**
 * Calculate the list of core quizzes not yet completed.
 */
export function getMissingCoreQuizzes(profile: CareerProfile): string[] {
  return CORE_QUIZ_IDS.filter(id => !profile.completedTests.includes(id));
}

// ============================================================
// VERSION-BASED PROFILE BUILDER
// Builds a CareerProfile from a specific ProfileVersion
// Does NOT use "latest result" logic — uses pinned attempt IDs
// ============================================================

import type { ProfileVersion, AssessmentAttempt } from '../types/profileTypes';

/**
 * Build a CareerProfile from a specific ProfileVersion and its pinned attempts.
 * This is the IMMUTABLE path — used for paid profiles and career reports.
 *
 * @param version - The profile version with specific attempt IDs
 * @param attempts - Map of quiz_id → AssessmentAttempt (fetched by caller)
 */
export function buildCareerProfileFromVersion(
  version: ProfileVersion,
  attempts: Record<string, AssessmentAttempt>
): CareerProfile {
  const profile: CareerProfile = {
    completedTests: [],
    completeness: 0,
  };

  // Process RIASEC from pinned attempt
  if (version.riasec_attempt_id && attempts['riasec']) {
    const answers = attempts['riasec'].answers;
    if (Object.keys(answers).length > 0) {
      profile.riasec = calculateRiasecScores(answers);
      profile.completedTests.push('riasec');
    }
  }

  // Process Ability from pinned attempt
  if (version.ability_attempt_id && attempts['ability']) {
    const answers = attempts['ability'].answers;
    if (Object.keys(answers).length > 0) {
      profile.abilities = calculateAbilityScores(answers, abilityQuestions);
      profile.completedTests.push('ability');
    }
  }

  // Process Big Five from pinned attempt
  if (version.big_five_attempt_id && attempts['big-five']) {
    const answers = attempts['big-five'].answers;
    if (Object.keys(answers).length > 0) {
      profile.bigFive = calculateBigFiveScores(answers, bigFiveQuestions);
      profile.completedTests.push('big-five');
    }
  }

  // Process Work Values from pinned attempt
  if (version.work_values_attempt_id && attempts['work-values']) {
    const answers = attempts['work-values'].answers;
    if (Object.keys(answers).length > 0) {
      profile.workValues = calculateWorkValueScores(answers, workValuesQuestions);
      profile.completedTests.push('work-values');
    }
  }

  // Calculate completeness
  const coreCompleted = profile.completedTests.filter(t =>
    (CORE_QUIZ_IDS as readonly string[]).includes(t)
  ).length;
  profile.completeness = (COMPLETENESS_BY_TESTS as Record<number, number>)[coreCompleted] ?? 0;

  return profile;
}
