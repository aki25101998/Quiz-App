// ============================================================
// QUOTA SERVICE — Monthly free edits + lifetime revision tracking
// ============================================================

import { supabase } from '../lib/supabase';
import type { RevisionCheckResult, UserMonthlyQuota } from '../types/profileTypes';
import {
  MONTHLY_FREE_EDIT_LIMIT,
  PROFILE_EDIT_PRICE,
  PROFILE_REVISION_LIMIT,
} from '../types/constants';
import { getProfile } from './profileService';

// ---------- MONTHLY QUOTA ----------

/**
 * Get the current month key (e.g. "2026-08")
 */
export function getCurrentMonthKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * Get or create the monthly quota record for a user.
 */
export async function getMonthlyQuota(userId: string): Promise<UserMonthlyQuota> {
  const monthKey = getCurrentMonthKey();

  // Try to get existing
  const { data: existing } = await supabase
    .from('user_monthly_quotas')
    .select('*')
    .eq('user_id', userId)
    .eq('month_key', monthKey)
    .single();

  if (existing) return existing as UserMonthlyQuota;

  // Create new for this month (auto-reset)
  const { data: created, error } = await supabase
    .from('user_monthly_quotas')
    .insert({
      user_id: userId,
      month_key: monthKey,
      free_edits_allowed: MONTHLY_FREE_EDIT_LIMIT,
      free_edits_used: 0,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create monthly quota: ${error.message}`);
  return created as UserMonthlyQuota;
}

/**
 * Check if the user has free monthly edits remaining.
 */
export async function checkMonthlyFreeQuota(userId: string): Promise<{
  hasFreeEdits: boolean;
  used: number;
  limit: number;
  monthKey: string;
}> {
  const quota = await getMonthlyQuota(userId);
  return {
    hasFreeEdits: quota.free_edits_used < quota.free_edits_allowed,
    used: quota.free_edits_used,
    limit: quota.free_edits_allowed,
    monthKey: quota.month_key,
  };
}

/**
 * Consume one free edit from the user's monthly quota.
 */
export async function consumeFreeEdit(userId: string): Promise<void> {
  const quota = await getMonthlyQuota(userId);

  if (quota.free_edits_used >= quota.free_edits_allowed) {
    throw new Error('Monthly free edit quota exhausted');
  }

  const { error } = await supabase
    .from('user_monthly_quotas')
    .update({
      free_edits_used: quota.free_edits_used + 1,
      updated_at: new Date().toISOString(),
    })
    .eq('id', quota.id);

  if (error) throw new Error(`Failed to consume free edit: ${error.message}`);
}

// ---------- FULL REVISION CHECK ----------

/**
 * Comprehensive check: can this profile be revised?
 * Checks both lifetime revision limit AND monthly free quota.
 *
 * Business Rule Priority:
 * 1. Profile exists and is paid
 * 2. Lifetime revision limit (3/profile)
 * 3. Monthly free quota (3/month/user)
 * 4. If no free quota → 20K payment required
 */
export async function checkRevisionAllowed(
  profileId: string,
  userId: string
): Promise<RevisionCheckResult> {
  const profile = await getProfile(profileId);

  if (!profile) {
    return {
      allowed: false,
      reason: 'Hồ sơ không tồn tại.',
      remainingRevisions: 0,
      isFree: false,
      price: 0,
      monthlyFreeUsed: 0,
      monthlyFreeLimit: MONTHLY_FREE_EDIT_LIMIT,
    };
  }

  if (!profile.is_paid) {
    return {
      allowed: false,
      reason: 'Hồ sơ chưa được thanh toán.',
      remainingRevisions: 0,
      isFree: false,
      price: 0,
      monthlyFreeUsed: 0,
      monthlyFreeLimit: MONTHLY_FREE_EDIT_LIMIT,
    };
  }

  // Check lifetime revision limit
  const remainingRevisions = profile.revision_limit - profile.revision_used;
  if (remainingRevisions <= 0) {
    const monthlyQuota = await checkMonthlyFreeQuota(userId);
    return {
      allowed: false,
      reason: `Bạn đã sử dụng hết ${PROFILE_REVISION_LIMIT} lượt cập nhật được phép cho hồ sơ này.`,
      remainingRevisions: 0,
      isFree: false,
      price: 0,
      monthlyFreeUsed: monthlyQuota.used,
      monthlyFreeLimit: monthlyQuota.limit,
    };
  }

  // Check monthly free quota
  const monthlyQuota = await checkMonthlyFreeQuota(userId);

  if (monthlyQuota.hasFreeEdits) {
    return {
      allowed: true,
      reason: 'Cập nhật miễn phí.',
      remainingRevisions,
      isFree: true,
      price: 0,
      monthlyFreeUsed: monthlyQuota.used,
      monthlyFreeLimit: monthlyQuota.limit,
    };
  }

  // Monthly free quota exhausted → paid edit required
  return {
    allowed: true,
    reason: `Bạn đã sử dụng ${monthlyQuota.limit}/${monthlyQuota.limit} lượt miễn phí tháng này. Chi phí cập nhật: ${PROFILE_EDIT_PRICE.toLocaleString('vi-VN')}đ.`,
    remainingRevisions,
    isFree: false,
    price: PROFILE_EDIT_PRICE,
    monthlyFreeUsed: monthlyQuota.used,
    monthlyFreeLimit: monthlyQuota.limit,
  };
}

/**
 * Get a summary of pricing for an edit.
 */
export async function getEditPrice(
  profileId: string,
  userId: string
): Promise<{ isFree: boolean; price: number }> {
  const check = await checkRevisionAllowed(profileId, userId);
  return { isFree: check.isFree, price: check.price };
}
