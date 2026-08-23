// ============================================================
// PROFILE SERVICE — CRUD operations for Career Profiles
// ============================================================

import { supabase } from '../lib/supabase';
import type { Profile, ProfileWithMeta, ProfileVersion } from '../types/profileTypes';
import { PROFILE_REVISION_LIMIT, REQUIRED_ASSESSMENTS } from '../types/constants';

// ---------- CREATE ----------

export async function createProfile(
  userId: string,
  name: string,
  description?: string
): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      user_id: userId,
      name,
      description: description || null,
      status: 'DRAFT',
      is_paid: false,
      revision_limit: PROFILE_REVISION_LIMIT,
      revision_used: 0,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create profile: ${error.message}`);
  return data as Profile;
}

// ---------- READ ----------

export async function getProfiles(userId: string): Promise<ProfileWithMeta[]> {
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Failed to fetch profiles: ${error.message}`);
  if (!profiles) return [];

  // Enrich with computed fields
  const enriched: ProfileWithMeta[] = [];
  for (const profile of profiles) {
    const meta = await getProfileMeta(profile as Profile);
    enriched.push(meta);
  }
  return enriched;
}

export async function getProfile(profileId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', profileId)
    .single();

  if (error) return null;
  return data as Profile;
}

export async function getProfileWithMeta(profileId: string): Promise<ProfileWithMeta | null> {
  const profile = await getProfile(profileId);
  if (!profile) return null;
  return getProfileMeta(profile);
}

// ---------- UPDATE ----------

export async function updateProfileName(
  profileId: string,
  name: string,
  description?: string
): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update({
      name,
      ...(description !== undefined ? { description } : {}),
    })
    .eq('id', profileId);

  if (error) throw new Error(`Failed to update profile: ${error.message}`);
}

export async function updateProfileStatus(
  profileId: string,
  status: Profile['status']
): Promise<void> {
  const updates: Partial<Profile> = { status };
  if (status === 'PAID') {
    updates.is_paid = true;
    updates.paid_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', profileId);

  if (error) throw new Error(`Failed to update profile status: ${error.message}`);
}

export async function setActiveVersion(
  profileId: string,
  versionId: string
): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update({ active_version_id: versionId })
    .eq('id', profileId);

  if (error) throw new Error(`Failed to set active version: ${error.message}`);
}

export async function incrementRevisionUsed(profileId: string): Promise<void> {
  // Use RPC or manual increment
  const profile = await getProfile(profileId);
  if (!profile) throw new Error('Profile not found');

  const { error } = await supabase
    .from('profiles')
    .update({ revision_used: profile.revision_used + 1 })
    .eq('id', profileId);

  if (error) throw new Error(`Failed to increment revision: ${error.message}`);
}

// ---------- DELETE ----------

export async function deleteProfile(profileId: string): Promise<void> {
  // Only allow deleting unpaid/draft profiles (enforced by RLS too)
  const profile = await getProfile(profileId);
  if (!profile) throw new Error('Profile not found');
  if (profile.is_paid) throw new Error('Cannot delete a paid profile');

  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', profileId);

  if (error) throw new Error(`Failed to delete profile: ${error.message}`);
}

// ---------- HELPERS ----------

async function getProfileMeta(profile: Profile): Promise<ProfileWithMeta> {
  // Get active version to compute completeness
  let completeness = 0;
  let activeVersion: ProfileVersion | null = null;
  let totalVersions = 0;

  if (profile.active_version_id) {
    const { data: version } = await supabase
      .from('profile_versions')
      .select('*')
      .eq('id', profile.active_version_id)
      .single();

    if (version) {
      activeVersion = version as ProfileVersion;
      completeness = calculateVersionCompleteness(activeVersion);
    }
  }

  const { count } = await supabase
    .from('profile_versions')
    .select('*', { count: 'exact', head: true })
    .eq('profile_id', profile.id);

  totalVersions = count || 0;

  return {
    ...profile,
    completeness,
    active_version: activeVersion,
    total_versions: totalVersions,
  };
}

export function calculateVersionCompleteness(version: ProfileVersion): number {
  let filled = 0;
  if (version.riasec_attempt_id) filled++;
  if (version.ability_attempt_id) filled++;
  if (version.big_five_attempt_id) filled++;
  if (version.work_values_attempt_id) filled++;

  return Math.round((filled / REQUIRED_ASSESSMENTS.length) * 100);
}

/**
 * Check if a profile has all required assessments and update status to READY if so.
 */
export async function checkAndUpdateReadyStatus(profileId: string): Promise<void> {
  const profile = await getProfile(profileId);
  if (!profile || profile.status === 'PAID' || profile.status === 'ARCHIVED') return;

  if (profile.active_version_id) {
    const { data: version } = await supabase
      .from('profile_versions')
      .select('*')
      .eq('id', profile.active_version_id)
      .single();

    if (version) {
      const pv = version as ProfileVersion;
      const isComplete = pv.riasec_attempt_id &&
        pv.ability_attempt_id &&
        pv.big_five_attempt_id &&
        pv.work_values_attempt_id;

      if (isComplete && profile.status !== 'READY') {
        await updateProfileStatus(profileId, 'READY');
      }
    }
  }
}
