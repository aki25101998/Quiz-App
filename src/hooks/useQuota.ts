// ============================================================
// useQuota — Hook for tracking edit quotas
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import type { RevisionCheckResult } from '../types/profileTypes';
import { checkRevisionAllowed, checkMonthlyFreeQuota } from '../services/quotaService';

export function useQuota(userId: string | undefined, profileId: string | undefined) {
  const [revisionCheck, setRevisionCheck] = useState<RevisionCheckResult | null>(null);
  const [monthlyQuota, setMonthlyQuota] = useState<{
    hasFreeEdits: boolean;
    used: number;
    limit: number;
    monthKey: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchQuota = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const monthly = await checkMonthlyFreeQuota(userId);
      setMonthlyQuota(monthly);

      if (profileId) {
        const revision = await checkRevisionAllowed(profileId, userId);
        setRevisionCheck(revision);
      }
    } catch (err) {
      console.error('Failed to check quota:', err);
    } finally {
      setLoading(false);
    }
  }, [userId, profileId]);

  useEffect(() => {
    fetchQuota();
  }, [fetchQuota]);

  return {
    revisionCheck,
    monthlyQuota,
    loading,
    refresh: fetchQuota,
  };
}
