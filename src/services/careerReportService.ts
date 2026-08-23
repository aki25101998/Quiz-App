// ============================================================
// CAREER REPORT SERVICE — Immutable report snapshots
// ============================================================

import { supabase } from '../lib/supabase';
import type { CareerReport, ReportSnapshot } from '../types/profileTypes';
import type { CareerProfile } from '../types/types';
import { getProfileVersion, getVersionAttempts } from './profileVersionService';
import { buildCareerProfileFromVersion } from '../utils/profileAggregator';
import { matchCareers } from '../utils/careerMatchingEngine';
import { CAREER_ENGINE_VERSION, CAREER_DATABASE_VERSION, BIG_FIVE_LABELS, ABILITY_LABELS, WORK_VALUE_LABELS } from '../types/constants';

// ---------- GENERATE REPORT ----------

/**
 * Generate a Career Report from a specific Profile Version.
 * The report is IMMUTABLE — it captures a snapshot of all data at generation time.
 */
export async function generateReport(
  profileId: string,
  versionId: string
): Promise<CareerReport> {
  // Get the version
  const version = await getProfileVersion(versionId);
  if (!version) throw new Error('Profile version not found');

  // Get all referenced attempts
  const attempts = await getVersionAttempts(version);

  // Build CareerProfile from this specific version (NOT latest)
  const careerProfile = buildCareerProfileFromVersion(version, attempts);

  // Run career matching
  const matches = matchCareers(careerProfile);

  // Build immutable snapshot
  const snapshot: ReportSnapshot = {
    profile_version_id: versionId,
    version_number: version.version_number,
    engine_version: CAREER_ENGINE_VERSION,
    career_database_version: CAREER_DATABASE_VERSION,
    riasec_attempt_id: version.riasec_attempt_id,
    ability_attempt_id: version.ability_attempt_id,
    big_five_attempt_id: version.big_five_attempt_id,
    work_values_attempt_id: version.work_values_attempt_id,
    career_matches: matches.slice(0, 8).map(m => ({
      careerId: m.careerId,
      careerName: m.careerName,
      field: m.field,
      score: m.score,
      matchLevel: m.matchLevel,
      reasons: m.reasons,
      strengths: m.strengths,
      concerns: m.concerns,
      dimensionScores: m.dimensionScores,
    })),
    profile_overview: buildProfileOverview(careerProfile),
    generated_at: new Date().toISOString(),
  };

  // Mark any existing CURRENT reports as OUTDATED
  await markAllReportsOutdated(profileId);

  // Insert the new report
  const { data, error } = await supabase
    .from('career_reports')
    .insert({
      profile_id: profileId,
      profile_version_id: versionId,
      report_snapshot: snapshot,
      status: 'CURRENT',
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create report: ${error.message}`);
  return data as CareerReport;
}

// ---------- READ ----------

export async function getReport(reportId: string): Promise<CareerReport | null> {
  const { data, error } = await supabase
    .from('career_reports')
    .select('*')
    .eq('id', reportId)
    .single();

  if (error) return null;
  return data as CareerReport;
}

export async function getReportsByProfile(profileId: string): Promise<CareerReport[]> {
  const { data, error } = await supabase
    .from('career_reports')
    .select('*')
    .eq('profile_id', profileId)
    .order('generated_at', { ascending: false });

  if (error) return [];
  return (data || []) as CareerReport[];
}

export async function getCurrentReport(profileId: string): Promise<CareerReport | null> {
  const { data, error } = await supabase
    .from('career_reports')
    .select('*')
    .eq('profile_id', profileId)
    .eq('status', 'CURRENT')
    .order('generated_at', { ascending: false })
    .limit(1)
    .single();

  if (error) return null;
  return data as CareerReport;
}

// ---------- STATUS ----------

export async function markAllReportsOutdated(profileId: string): Promise<void> {
  const { error } = await supabase.rpc('mark_reports_outdated', {
    p_profile_id: profileId,
  });

  if (error) {
    console.error('Failed to mark reports as outdated:', error);
  }
}

export async function markReportOutdated(reportId: string): Promise<void> {
  const { error } = await supabase.rpc('mark_single_report_outdated', {
    p_report_id: reportId,
  });

  if (error) throw new Error(`Failed to mark report: ${error.message}`);
}

// ---------- HELPERS ----------

function buildProfileOverview(profile: CareerProfile): ReportSnapshot['profile_overview'] {
  const overview: ReportSnapshot['profile_overview'] = {
    hollandCode: null,
    topAbilities: [],
    topPersonality: [],
    topWorkValues: [],
    completeness: profile.completeness,
  };

  if (profile.riasec) {
    overview.hollandCode = profile.riasec.hollandCode;
  }

  if (profile.abilities) {
    overview.topAbilities = Object.entries(profile.abilities.normalizedScores)
      .filter(([, v]) => v !== undefined)
      .sort(([, a], [, b]) => (b ?? 0) - (a ?? 0))
      .slice(0, 3)
      .map(([k]) => ABILITY_LABELS[k as keyof typeof ABILITY_LABELS]?.name || k);
  }

  if (profile.bigFive) {
    overview.topPersonality = Object.entries(profile.bigFive.normalizedScores)
      .filter(([, score]) => score >= 60)
      .map(([dim]) => BIG_FIVE_LABELS[dim as keyof typeof BIG_FIVE_LABELS]?.name || dim);
  }

  if (profile.workValues) {
    overview.topWorkValues = profile.workValues.ranking
      .slice(0, 3)
      .map(v => WORK_VALUE_LABELS[v.dimension]?.name || v.dimension);
  }

  return overview;
}
