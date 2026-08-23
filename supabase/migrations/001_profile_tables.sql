-- ============================================================
-- PROFILE-BASED CAREER ASSESSMENT — Database Migration
-- Run this on Supabase SQL Editor
-- ============================================================

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'READY', 'PAID', 'ARCHIVED')),
  is_paid boolean NOT NULL DEFAULT false,
  revision_limit integer NOT NULL DEFAULT 3,
  revision_used integer NOT NULL DEFAULT 0,
  paid_at timestamptz,
  active_version_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profiles"
  ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profiles"
  ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profiles"
  ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own draft profiles"
  ON public.profiles FOR DELETE TO authenticated
  USING (auth.uid() = user_id AND status = 'DRAFT' AND is_paid = false);


-- 2. PROFILE VERSIONS TABLE
CREATE TABLE IF NOT EXISTS public.profile_versions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  version_number integer NOT NULL DEFAULT 1,
  riasec_attempt_id uuid REFERENCES public.quiz_results(id) ON DELETE SET NULL,
  ability_attempt_id uuid REFERENCES public.quiz_results(id) ON DELETE SET NULL,
  big_five_attempt_id uuid REFERENCES public.quiz_results(id) ON DELETE SET NULL,
  work_values_attempt_id uuid REFERENCES public.quiz_results(id) ON DELETE SET NULL,
  created_reason text,
  created_at timestamptz DEFAULT now(),
  UNIQUE (profile_id, version_number)
);

ALTER TABLE public.profile_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile versions"
  ON public.profile_versions FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = profile_versions.profile_id
      AND profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own profile versions"
  ON public.profile_versions FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = profile_versions.profile_id
      AND profiles.user_id = auth.uid()
    )
  );

-- Add FK from profiles.active_version_id -> profile_versions
ALTER TABLE public.profiles
  ADD CONSTRAINT fk_profiles_active_version
  FOREIGN KEY (active_version_id)
  REFERENCES public.profile_versions(id)
  ON DELETE SET NULL;


-- 3. CAREER REPORTS TABLE
CREATE TABLE IF NOT EXISTS public.career_reports (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  profile_version_id uuid NOT NULL REFERENCES public.profile_versions(id) ON DELETE CASCADE,
  report_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'CURRENT' CHECK (status IN ('CURRENT', 'OUTDATED')),
  generated_at timestamptz DEFAULT now()
);

ALTER TABLE public.career_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own career reports"
  ON public.career_reports FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = career_reports.profile_id
      AND profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own career reports"
  ON public.career_reports FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = career_reports.profile_id
      AND profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own career reports"
  ON public.career_reports FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = career_reports.profile_id
      AND profiles.user_id = auth.uid()
    )
  );


-- 4. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS public.payments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_type text NOT NULL CHECK (product_type IN ('PROFILE_UNLOCK', 'PROFILE_EDIT')),
  reference_id uuid NOT NULL,
  amount integer NOT NULL,
  status text NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PAID', 'FAILED', 'CANCELLED')),
  transfer_code text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payments"
  ON public.payments FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own payments"
  ON public.payments FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payments"
  ON public.payments FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);


-- 5. PROFILE EDIT TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.profile_edit_transactions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  edit_type text NOT NULL CHECK (edit_type IN ('MAJOR_REVISION', 'MINOR_EDIT')),
  assessment_type text NOT NULL,
  source_attempt_id uuid REFERENCES public.quiz_results(id) ON DELETE SET NULL,
  target_attempt_id uuid NOT NULL REFERENCES public.quiz_results(id) ON DELETE CASCADE,
  price integer NOT NULL DEFAULT 0,
  payment_status text NOT NULL DEFAULT 'FREE' CHECK (payment_status IN ('FREE', 'PENDING', 'PAID', 'FAILED', 'CANCELLED')),
  created_at timestamptz DEFAULT now(),
  applied_at timestamptz
);

ALTER TABLE public.profile_edit_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own edit transactions"
  ON public.profile_edit_transactions FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own edit transactions"
  ON public.profile_edit_transactions FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own edit transactions"
  ON public.profile_edit_transactions FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);


-- 6. USER MONTHLY QUOTAS TABLE
CREATE TABLE IF NOT EXISTS public.user_monthly_quotas (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  month_key text NOT NULL, -- format: "2026-08"
  free_edits_allowed integer NOT NULL DEFAULT 3,
  free_edits_used integer NOT NULL DEFAULT 0,
  updated_at timestamptz DEFAULT now(),
  UNIQUE (user_id, month_key)
);

ALTER TABLE public.user_monthly_quotas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own monthly quotas"
  ON public.user_monthly_quotas FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own monthly quotas"
  ON public.user_monthly_quotas FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own monthly quotas"
  ON public.user_monthly_quotas FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);


-- 7. HELPER: auto-update updated_at on profiles
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 8. INDEXES for performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profile_versions_profile_id ON public.profile_versions(profile_id);
CREATE INDEX IF NOT EXISTS idx_career_reports_profile_id ON public.career_reports(profile_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_reference_id ON public.payments(reference_id);
CREATE INDEX IF NOT EXISTS idx_edit_transactions_profile_id ON public.profile_edit_transactions(profile_id);
CREATE INDEX IF NOT EXISTS idx_monthly_quotas_user_month ON public.user_monthly_quotas(user_id, month_key);
