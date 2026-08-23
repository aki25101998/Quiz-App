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
