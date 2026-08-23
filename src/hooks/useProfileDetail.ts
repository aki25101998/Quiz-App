// ============================================================
// useProfileDetail — Hook for single profile management
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import type { ProfileWithMeta, ProfileVersion, CareerReport } from '../types/profileTypes';
import { getProfileWithMeta } from '../services/profileService';
import { getProfileVersions } from '../services/profileVersionService';
import { getReportsByProfile } from '../services/careerReportService';

export function useProfileDetail(profileId: string | undefined) {
  const [profile, setProfile] = useState<ProfileWithMeta | null>(null);
  const [versions, setVersions] = useState<ProfileVersion[]>([]);
  const [reports, setReports] = useState<CareerReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!profileId) {
      setProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [profileData, versionsData, reportsData] = await Promise.all([
        getProfileWithMeta(profileId),
        getProfileVersions(profileId),
        getReportsByProfile(profileId),
      ]);

      setProfile(profileData);
      setVersions(versionsData);
      setReports(reportsData);
    } catch (err: any) {
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, [profileId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const currentReport = reports.find(r => r.status === 'CURRENT') || null;
  const hasOutdatedReport = reports.some(r => r.status === 'OUTDATED') && !currentReport;

  return {
    profile,
    versions,
    reports,
    currentReport,
    hasOutdatedReport,
    loading,
    error,
    refresh: fetchProfile,
  };
}
