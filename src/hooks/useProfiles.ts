// ============================================================
// useProfiles — Hook for managing user's Career Profiles
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import type { ProfileWithMeta } from '../types/profileTypes';
import { getProfiles, createProfile, deleteProfile } from '../services/profileService';

export function useProfiles(userId: string | undefined) {
  const [profiles, setProfiles] = useState<ProfileWithMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfiles = useCallback(async () => {
    if (!userId) {
      setProfiles([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getProfiles(userId);
      setProfiles(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load profiles');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const handleCreate = async (name: string, description?: string) => {
    if (!userId) throw new Error('Not authenticated');
    const profile = await createProfile(userId, name, description);
    await fetchProfiles();
    return profile;
  };

  const handleDelete = async (profileId: string) => {
    await deleteProfile(profileId);
    await fetchProfiles();
  };

  return {
    profiles,
    loading,
    error,
    createProfile: handleCreate,
    deleteProfile: handleDelete,
    refresh: fetchProfiles,
  };
}
