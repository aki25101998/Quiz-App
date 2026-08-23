-- ============================================================
-- PROFILE-BASED CAREER ASSESSMENT — Secure RLS & RPCs
-- ============================================================

-- 1. SECURE RLS FOR PROFILES
-- Drop the overly permissive UPDATE policy
DROP POLICY IF EXISTS "Users can update their own profiles" ON public.profiles;

-- Create a strict UPDATE policy (only allows updating name and description)
CREATE POLICY "Users can update their own profiles"
  ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (
    is_paid = OLD.is_paid AND
    revision_used = OLD.revision_used AND
    revision_limit = OLD.revision_limit AND
    paid_at IS NOT DISTINCT FROM OLD.paid_at AND
    active_version_id IS NOT DISTINCT FROM OLD.active_version_id AND
    status = OLD.status
  );

-- 2. SECURE RLS FOR OTHER TABLES (Disable client UPDATE)
DROP POLICY IF EXISTS "Users can update their own career reports" ON public.career_reports;
DROP POLICY IF EXISTS "Users can update their own payments" ON public.payments;
DROP POLICY IF EXISTS "Users can update their own edit transactions" ON public.profile_edit_transactions;
DROP POLICY IF EXISTS "Users can update their own monthly quotas" ON public.user_monthly_quotas;
DROP POLICY IF EXISTS "Users can update their own quiz results" ON public.quiz_results;

-- 3. RPCS FOR PROTECTED OPERATIONS

-- Update Profile Status
CREATE OR REPLACE FUNCTION public.update_profile_status(p_profile_id uuid, p_status text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = p_profile_id AND user_id = auth.uid()) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  IF p_status = 'PAID' THEN
    UPDATE public.profiles SET status = p_status, is_paid = true, paid_at = now() WHERE id = p_profile_id;
  ELSE
    UPDATE public.profiles SET status = p_status WHERE id = p_profile_id;
  END IF;
END;
$$;

-- Set Active Version
CREATE OR REPLACE FUNCTION public.set_active_version(p_profile_id uuid, p_version_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = p_profile_id AND user_id = auth.uid()) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  UPDATE public.profiles SET active_version_id = p_version_id WHERE id = p_profile_id;
END;
$$;

-- Mark Reports Outdated
CREATE OR REPLACE FUNCTION public.mark_reports_outdated(p_profile_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = p_profile_id AND user_id = auth.uid()) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  UPDATE public.career_reports SET status = 'OUTDATED' WHERE profile_id = p_profile_id AND status = 'CURRENT';
END;
$$;

-- Mark Single Report Outdated
CREATE OR REPLACE FUNCTION public.mark_single_report_outdated(p_report_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.career_reports cr
    JOIN public.profiles p ON cr.profile_id = p.id
    WHERE cr.id = p_report_id AND p.user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  UPDATE public.career_reports SET status = 'OUTDATED' WHERE id = p_report_id;
END;
$$;

-- Update Payment Status
CREATE OR REPLACE FUNCTION public.update_payment_status(p_payment_id uuid, p_status text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.payments WHERE id = p_payment_id AND user_id = auth.uid()) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  UPDATE public.payments SET status = p_status WHERE id = p_payment_id;
END;
$$;

-- Update Transaction Status
CREATE OR REPLACE FUNCTION public.update_tx_status(p_tx_id uuid, p_status text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.profile_edit_transactions WHERE id = p_tx_id AND user_id = auth.uid()) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  UPDATE public.profile_edit_transactions 
  SET payment_status = p_status, applied_at = CASE WHEN p_status = 'PAID' THEN now() ELSE applied_at END 
  WHERE id = p_tx_id;
END;
$$;
