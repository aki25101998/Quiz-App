// ============================================================
// PROFILE VERSION SERVICE — Immutable version management
// ============================================================

import { supabase } from '../lib/supabase';
import type { ProfileVersion, AssessmentAttempt } from '../types/profileTypes';
import { ASSESSMENT_TO_VERSION_COLUMN } from '../types/constants';
import {
  getProfile,
  setActiveVersion,
  checkAndUpdateReadyStatus,
  calculateVersionCompleteness,
} from './profileService';

// ---------- GET ----------

export async function getProfileVersions(profileId: string): Promise<ProfileVersion[]> {
  const { data, error } = await supabase
    .from('profile_versions')
    .select('*')
    .eq('profile_id', profileId)
    .order('version_number', { ascending: false });

  if (error) throw new Error(`Failed to fetch versions: ${error.message}`);
  return (data || []) as ProfileVersion[];
}

export async function getProfileVersion(versionId: string): Promise<ProfileVersion | null> {
  const { data, error } = await supabase
    .from('profile_versions')
    .select('*')
    .eq('id', versionId)
    .single();

  if (error) return null;
  return data as ProfileVersion;
}

export async function getActiveVersion(profileId: string): Promise<ProfileVersion | null> {
  const profile = await getProfile(profileId);
  if (!profile?.active_version_id) return null;
  return getProfileVersion(profile.active_version_id);
}

// ---------- CREATE / ATTACH ----------

/**
 * Attach an assessment attempt to a profile.
 * If no version exists, creates version 1.
 * If a version exists and is draft (profile not paid), updates the latest version.
 * If profile is paid, this should go through revision flow instead.
 */
export async function attachAssessment(
  profileId: string,
  quizId: string,
  attemptId: string
): Promise<ProfileVersion> {
  const profile = await getProfile(profileId);
  if (!profile) throw new Error('Profile not found');

  // For PAID profiles, use createRevision instead
  if (profile.is_paid) {
    throw new Error('Profile is paid. Use revision flow to update assessments.');
  }

  const column = ASSESSMENT_TO_VERSION_COLUMN[quizId];
  if (!column) throw new Error(`Unknown quiz type: ${quizId}`);

  let retries = 3;
  while (retries > 0) {
    const currentVersion = profile.active_version_id
      ? await getProfileVersion(profile.active_version_id)
      : null;

    let newVersion: ProfileVersion;

    try {
      if (!currentVersion) {
        // Create first version
        newVersion = await createVersion(profileId, 1, {
          [column]: attemptId,
        }, 'Initial assessment');
      } else {
        // Update existing draft version by creating a new one with merged data
        const nextNumber = currentVersion.version_number + 1;
        newVersion = await createVersion(profileId, nextNumber, {
          riasec_attempt_id: currentVersion.riasec_attempt_id,
          ability_attempt_id: currentVersion.ability_attempt_id,
          big_five_attempt_id: currentVersion.big_five_attempt_id,
          work_values_attempt_id: currentVersion.work_values_attempt_id,
          [column]: attemptId, // Override with new attempt
        }, `Added ${quizId} assessment`);
      }

      // Set as active version
      await setActiveVersion(profileId, newVersion.id);

      // Check if profile is now complete
      await checkAndUpdateReadyStatus(profileId);

      return newVersion;
    } catch (e: any) {
      if (e.message === 'VERSION_CONFLICT') {
        retries--;
        if (retries === 0) throw new Error('Failed to create version after multiple retries due to conflict.');
        const updatedProfile = await getProfile(profileId);
        if (updatedProfile) {
          profile.active_version_id = updatedProfile.active_version_id;
        }
        continue;
      }
      throw e;
    }
  }
  throw new Error('Unexpected error in attachAssessment');
}

/**
 * Create a revision of a paid profile.
 * This creates a NEW version — does NOT mutate old versions.
 * Caller must check quota before calling this.
 */
export async function createRevision(
  profileId: string,
  assessmentType: string,
  newAttemptId: string,
  reason?: string
): Promise<ProfileVersion> {
  const profile = await getProfile(profileId);
  if (!profile) throw new Error('Profile not found');
  if (!profile.is_paid) throw new Error('Profile must be paid to create revisions');

  const column = ASSESSMENT_TO_VERSION_COLUMN[assessmentType];
  if (!column) throw new Error(`Unknown assessment type: ${assessmentType}`);

  let retries = 3;
  while (retries > 0) {
    const currentVersion = profile.active_version_id
      ? await getProfileVersion(profile.active_version_id)
      : null;

    if (!currentVersion) throw new Error('No active version found for revision');

    try {
      const nextNumber = currentVersion.version_number + 1;
      const newVersion = await createVersion(profileId, nextNumber, {
        riasec_attempt_id: currentVersion.riasec_attempt_id,
        ability_attempt_id: currentVersion.ability_attempt_id,
        big_five_attempt_id: currentVersion.big_five_attempt_id,
        work_values_attempt_id: currentVersion.work_values_attempt_id,
        [column]: newAttemptId, // Override with new attempt
      }, reason || `Revised ${assessmentType}`);

      // Set as active version
      await setActiveVersion(profileId, newVersion.id);

      return newVersion;
    } catch (e: any) {
      if (e.message === 'VERSION_CONFLICT') {
        retries--;
        if (retries === 0) throw new Error('Failed to create version after multiple retries due to conflict.');
        const updatedProfile = await getProfile(profileId);
        if (updatedProfile) {
          profile.active_version_id = updatedProfile.active_version_id;
        }
        continue;
      }
      throw e;
    }
  }
  throw new Error('Unexpected error in createRevision');
}

// ---------- INTERNAL ----------

async function createVersion(
  profileId: string,
  versionNumber: number,
  assessmentIds: Partial<Record<string, string | null>>,
  reason: string
): Promise<ProfileVersion> {
  const { data, error } = await supabase
    .from('profile_versions')
    .insert({
      profile_id: profileId,
      version_number: versionNumber,
      riasec_attempt_id: assessmentIds.riasec_attempt_id || null,
      ability_attempt_id: assessmentIds.ability_attempt_id || null,
      big_five_attempt_id: assessmentIds.big_five_attempt_id || null,
      work_values_attempt_id: assessmentIds.work_values_attempt_id || null,
      created_reason: reason,
    })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      throw new Error('VERSION_CONFLICT');
    }
    throw new Error(`Failed to create version: ${error.message}`);
  }
  return data as ProfileVersion;
}

// ---------- FETCH ATTEMPTS FOR VERSION ----------

/**
 * Fetch all assessment attempts referenced by a profile version.
 * Returns a map of quiz_id → AssessmentAttempt.
 */
export async function getVersionAttempts(
  version: ProfileVersion
): Promise<Record<string, AssessmentAttempt>> {
  const attemptIds = [
    version.riasec_attempt_id,
    version.ability_attempt_id,
    version.big_five_attempt_id,
    version.work_values_attempt_id,
  ].filter(Boolean) as string[];

  if (attemptIds.length === 0) return {};

  const { data, error } = await supabase
    .from('quiz_results')
    .select('*')
    .in('id', attemptIds);

  if (error || !data) return {};

  const result: Record<string, AssessmentAttempt> = {};
  for (const attempt of data) {
    result[attempt.quiz_id] = attempt as AssessmentAttempt;
  }
  return result;
}

/**
 * Get completeness info for a version.
 */
export { calculateVersionCompleteness };
