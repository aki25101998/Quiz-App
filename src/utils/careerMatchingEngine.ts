// ============================================================
// CAREER MATCHING ENGINE
// Computes career matches from a CareerProfile
// ============================================================

import type {
  CareerProfile,
  CareerMatch,
  CareerMatchResult,
  Career,
  RiasecDimension,
  BigFiveDimension,
  AbilityDimension,
  WorkValueDimension,
} from '../types/types';
import { CAREER_MATCH_WEIGHTS, RIASEC_LABELS } from '../types/constants';
import { careerDatabase } from '../data/careerDatabase';
import { mbtiResults } from '../data/mbtiResults';
import { mbtiQuestions } from '../data/mbtiQuestions';


// ============================================================
// MAIN MATCHING FUNCTION
// ============================================================

/**
 * Match careers against a CareerProfile.
 * Returns sorted CareerMatch[] (highest score first).
 */
export function matchCareers(profile: CareerProfile): CareerMatch[] {
  const matches: CareerMatch[] = [];

  for (const career of careerDatabase) {
    const match = scoreCareer(profile, career);
    if (match) {
      matches.push(match);
    }
  }

  // Sort by score descending
  matches.sort((a, b) => b.score - a.score);
  return matches;
}

// ============================================================
// SCORING LOGIC
// ============================================================

function scoreCareer(profile: CareerProfile, career: Career): CareerMatch | null {
  const dimensionScores: CareerMatch['dimensionScores'] = {};
  let totalWeight = 0;
  let weightedSum = 0;

  // --- RIASEC similarity ---
  if (profile.riasec && Object.keys(career.riasec).length > 0) {
    const riasecSim = calculateRiasecSimilarity(
      profile.riasec.normalizedScores,
      career.riasec
    );
    dimensionScores.riasec = riasecSim;
    weightedSum += riasecSim * CAREER_MATCH_WEIGHTS.riasec;
    totalWeight += CAREER_MATCH_WEIGHTS.riasec;
  }

  // --- Ability similarity ---
  if (profile.abilities && Object.keys(career.abilities).length > 0) {
    const abilitySim = calculateAbilitySimilarity(
      profile.abilities.normalizedScores,
      career.abilities
    );
    dimensionScores.ability = abilitySim;
    weightedSum += abilitySim * CAREER_MATCH_WEIGHTS.ability;
    totalWeight += CAREER_MATCH_WEIGHTS.ability;
  }

  // --- Personality similarity ---
  if (profile.bigFive && Object.keys(career.personality).length > 0) {
    const personalitySim = calculatePersonalitySimilarity(
      profile.bigFive.normalizedScores,
      career.personality
    );
    dimensionScores.personality = personalitySim;
    weightedSum += personalitySim * CAREER_MATCH_WEIGHTS.personality;
    totalWeight += CAREER_MATCH_WEIGHTS.personality;
  }

  // --- Work Values similarity ---
  if (profile.workValues && Object.keys(career.workValues).length > 0) {
    const valueSim = calculateWorkValuesSimilarity(
      profile.workValues.normalizedScores,
      career.workValues
    );
    dimensionScores.workValues = valueSim;
    weightedSum += valueSim * CAREER_MATCH_WEIGHTS.workValues;
    totalWeight += CAREER_MATCH_WEIGHTS.workValues;
  }

  // Need at least one dimension to score
  if (totalWeight === 0) return null;

  // Normalize the weighted sum to account for missing dimensions
  // For example, if only RIASEC is available (weight 30%), totalWeight is 30.
  // The score will be (riasecSim * 30) / 30 = riasecSim.
  // This effectively normalizes the available dimensions to 100%.
  const score = Math.round(weightedSum / totalWeight);

  let matchLevel: CareerMatch['matchLevel'] = 'LOW';
  if (score >= 90) matchLevel = 'VERY_HIGH';
  else if (score >= 80) matchLevel = 'HIGH';
  else if (score >= 70) matchLevel = 'MODERATE';

  // Determine available and missing dimensions
  const availableDimensions = Object.keys(dimensionScores);
  const missingDimensions = ['riasec', 'ability', 'personality', 'workValues'].filter(
    (dim) => !availableDimensions.includes(dim)
  );

  // Generate explanations
  const { reasons, strengths, concerns } = generateExplanation(
    profile,
    career,
    dimensionScores
  );

  return {
    careerId: career.id,
    careerName: career.name,
    field: career.field,
    score,
    matchLevel,
    completeness: profile.completeness,
    availableDimensions,
    missingDimensions,
    reasons,
    strengths,
    concerns,
    dimensionScores,
  };
}

// ============================================================
// SIMILARITY FUNCTIONS
// ============================================================

/**
 * Calculate similarity between user RIASEC scores and career RIASEC profile.
 * Uses cosine-like similarity normalized to 0-100.
 */
function calculateRiasecSimilarity(
  userScores: Record<RiasecDimension, number>,
  careerScores: Partial<Record<RiasecDimension, number>>
): number {
  const dims: RiasecDimension[] = ['R', 'I', 'A', 'S', 'E', 'C'];
  let sumProduct = 0;
  let sumUserSq = 0;
  let sumCareerSq = 0;

  for (const dim of dims) {
    const u = userScores[dim] || 0;
    const c = careerScores[dim] || 0;
    sumProduct += u * c;
    sumUserSq += u * u;
    sumCareerSq += c * c;
  }

  const magnitude = Math.sqrt(sumUserSq) * Math.sqrt(sumCareerSq);
  if (magnitude === 0) return 0;

  // Cosine similarity → 0-100
  return Math.round((sumProduct / magnitude) * 100);
}

/**
 * Calculate similarity for ability scores.
 * Only considers dimensions that the career requires.
 */
function calculateAbilitySimilarity(
  userScores: Partial<Record<AbilityDimension, number>>,
  careerRequirements: Partial<Record<AbilityDimension, number>>
): number {
  const dims = Object.keys(careerRequirements) as AbilityDimension[];
  if (dims.length === 0) return 50; // neutral if no requirements

  let totalSim = 0;
  let count = 0;

  for (const dim of dims) {
    const userScore = userScores[dim];
    const careerReq = careerRequirements[dim]!;

    if (userScore === undefined) continue;

    // How well does user meet the requirement?
    // If user >= requirement: 100 (meets/exceeds)
    // If user < requirement: proportional
    const ratio = Math.min(userScore / Math.max(careerReq, 1), 1.5);
    totalSim += Math.min(ratio * 100, 100);
    count++;
  }

  if (count === 0) return 50;
  return Math.round(totalSim / count);
}

/**
 * Calculate personality similarity.
 * Lower distance = higher similarity.
 */
function calculatePersonalitySimilarity(
  userScores: Record<BigFiveDimension, number>,
  careerProfile: Partial<Record<BigFiveDimension, number>>
): number {
  const dims = Object.keys(careerProfile) as BigFiveDimension[];
  if (dims.length === 0) return 50;

  let totalDistance = 0;
  let count = 0;

  for (const dim of dims) {
    const u = userScores[dim] || 50;
    const c = careerProfile[dim]!;
    totalDistance += Math.abs(u - c);
    count++;
  }

  if (count === 0) return 50;

  // Max possible distance per dimension = 100
  const avgDistance = totalDistance / count;
  return Math.round(Math.max(0, 100 - avgDistance));
}

/**
 * Calculate work values similarity.
 * Focuses on alignment between what user values and what career offers.
 */
function calculateWorkValuesSimilarity(
  userScores: Record<WorkValueDimension, number>,
  careerValues: Partial<Record<WorkValueDimension, number>>
): number {
  const dims = Object.keys(careerValues) as WorkValueDimension[];
  if (dims.length === 0) return 50;

  let totalSim = 0;
  let count = 0;

  for (const dim of dims) {
    const u = userScores[dim] || 50;
    const c = careerValues[dim]!;
    // Both high = great match; user high + career low = mismatch
    const alignment = 100 - Math.abs(u - c);
    totalSim += alignment;
    count++;
  }

  if (count === 0) return 50;
  return Math.round(totalSim / count);
}

// ============================================================
// EXPLANATION GENERATOR
// ============================================================

function generateExplanation(
  profile: CareerProfile,
  career: Career,
  dimScores: CareerMatch['dimensionScores']
): { reasons: string[]; strengths: string[]; concerns: string[] } {
  const reasons: string[] = [];
  const strengths: string[] = [];
  const concerns: string[] = [];

  // RIASEC explanation
  if (profile.riasec && dimScores.riasec !== undefined) {
    const topDims = profile.riasec.ranking.slice(0, 2);
    const topLabels = topDims.map(d => RIASEC_LABELS[d].name);

    if (dimScores.riasec >= 70) {
      reasons.push(`Sở thích nghề nghiệp của bạn (${topLabels.join(', ')}) phù hợp tốt với đặc thù công việc này.`);
    } else if (dimScores.riasec >= 50) {
      reasons.push(`Sở thích nghề nghiệp của bạn có mức tương thích trung bình với công việc này.`);
    }

    // Check top dimensions
    for (const dim of topDims) {
      const careerReq = career.riasec[dim] || 0;
      if (careerReq >= 70) {
        strengths.push(`${RIASEC_LABELS[dim].shortDesc} — đây cũng là yêu cầu quan trọng của nghề ${career.name}.`);
      }
    }

    // Check weak dimensions that career requires
    const bottomDims = profile.riasec.ranking.slice(-2);
    for (const dim of bottomDims) {
      const careerReq = career.riasec[dim] || 0;
      if (careerReq >= 60) {
        concerns.push(`Nghề này đòi hỏi xu hướng ${RIASEC_LABELS[dim].name} ở mức khá, trong khi đây không phải thế mạnh nổi trội của bạn.`);
      }
    }
  }

  // Ability explanation
  if (profile.abilities && dimScores.ability !== undefined) {
    if (dimScores.ability >= 75) {
      strengths.push('Năng lực tư duy của bạn phù hợp tốt với yêu cầu kỹ năng của nghề này.');
    } else if (dimScores.ability < 50) {
      concerns.push('Một số kỹ năng tư duy mà nghề này yêu cầu có thể cần thời gian phát triển thêm.');
    }
  }

  // Personality explanation
  if (profile.bigFive && dimScores.personality !== undefined) {
    if (dimScores.personality >= 70) {
      reasons.push('Tính cách làm việc của bạn tương thích với môi trường nghề nghiệp này.');
    } else if (dimScores.personality < 50) {
      concerns.push('Môi trường làm việc của nghề này có thể đòi hỏi bạn thích nghi với phong cách khác so với tự nhiên.');
    }
  }

  // Work Values explanation
  if (profile.workValues && dimScores.workValues !== undefined) {
    if (dimScores.workValues >= 70) {
      reasons.push('Giá trị mà bạn coi trọng trong công việc phù hợp với những gì nghề này mang lại.');
    } else if (dimScores.workValues < 50) {
      concerns.push('Nghề này có thể không đáp ứng đầy đủ một số giá trị mà bạn coi trọng.');
    }
  }

  // Ensure at least one reason
  if (reasons.length === 0 && strengths.length > 0) {
    reasons.push(`Nghề ${career.name} có mức độ tương thích dựa trên hồ sơ hiện tại của bạn.`);
  }

  return { reasons, strengths, concerns };
}

// ============================================================
// MBTI RESULT (kept separately — fun quiz)
// ============================================================

export function calculateMbtiResult(answers: Record<string, string>): CareerMatchResult {
  const axes: Record<string, number> = { EI: 0, SN: 0, TF: 0, JP: 0 };

  Object.entries(answers).forEach(([qId, valStr]) => {
    const val = parseInt(valStr, 10);
    if (isNaN(val)) return;
    const question = mbtiQuestions.find(q => q.id.toString() === qId);
    if (question) {
      const score = (val - 3) * question.direction;
      axes[question.dimension] += score;
    }
  });

  let finalMBTI = '';
  finalMBTI += (axes.EI >= 0) ? 'E' : 'I';
  finalMBTI += (axes.SN >= 0) ? 'S' : 'N';
  finalMBTI += (axes.TF >= 0) ? 'T' : 'F';
  finalMBTI += (axes.JP >= 0) ? 'J' : 'P';

  const mbtiData = mbtiResults[finalMBTI] || mbtiResults['INTJ'];

  return {
    topCareers: [
      { name: `${finalMBTI} - ${mbtiData.name}`, score: 100, description: mbtiData.description }
    ],
    strengths: mbtiData.strengths,
    weaknesses: mbtiData.weaknesses,
    personalityTraits: [],
  };
}
