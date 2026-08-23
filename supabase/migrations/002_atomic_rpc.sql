-- ============================================================
-- PROFILE-BASED CAREER ASSESSMENT — Atomic Operations
-- Run this on Supabase SQL Editor
-- ============================================================

-- 1. Atomic consume free edit
CREATE OR REPLACE FUNCTION public.consume_free_edit(p_user_id uuid, p_month_key text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_updated integer;
BEGIN
  UPDATE public.user_monthly_quotas
  SET free_edits_used = free_edits_used + 1, updated_at = now()
  WHERE user_id = p_user_id
    AND month_key = p_month_key
    AND free_edits_used < free_edits_allowed;
    
  GET DIAGNOSTICS v_updated = ROW_COUNT;
  
  RETURN v_updated > 0;
END;
$$;

-- 2. Atomic increment revision used
CREATE OR REPLACE FUNCTION public.increment_revision_used(p_profile_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_updated integer;
BEGIN
  UPDATE public.profiles
  SET revision_used = revision_used + 1
  WHERE id = p_profile_id
    AND revision_used < revision_limit;
    
  GET DIAGNOSTICS v_updated = ROW_COUNT;
  
  RETURN v_updated > 0;
END;
$$;
