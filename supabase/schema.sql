-- ==========================================
-- Prova (Budget Optimizer) — Complete Supabase Schema
-- Generated from codebase audit 2026-03-05
--
-- This script is idempotent — safe to run on an existing database.
-- Run in Supabase SQL Editor (Dashboard > SQL Editor > New query).
-- ==========================================

-- =========================================
-- 1. PROFILES TABLE
-- =========================================
-- Referenced by: signup, verify-subscription, analyze, revenuecat webhook
-- Columns used in code:
--   id              (UUID, PK, FK to auth.users)
--   email           (TEXT, written on signup)
--   first_name      (TEXT, written on signup)
--   age_range       (TEXT, read in verify-subscription)
--   primary_goal    (TEXT, read in verify-subscription)
--   monthly_budget  (INTEGER, read in verify-subscription)
--   subscription_status       (TEXT, read/written in verify-subscription, analyze, webhook)
--   subscription_expires_at   (TIMESTAMPTZ, read/written in verify-subscription, webhook)
--   free_analysis_used        (BOOLEAN, read in verify-subscription/analyze, written in analyze)
--   revenuecat_customer_id    (TEXT, read in verify-subscription, written in webhook)

CREATE TABLE IF NOT EXISTS public.profiles (
  id                      UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email                   TEXT NOT NULL,
  first_name              TEXT DEFAULT '',
  age_range               TEXT CHECK (age_range IS NULL OR age_range IN ('18-29', '30-39', '40-49', '50-59', '60+')),
  primary_goal            TEXT CHECK (primary_goal IS NULL OR primary_goal IN ('lifespan', 'performance', 'disease_prevention', 'aesthetics')),
  monthly_budget          INTEGER DEFAULT 0,
  current_spending        JSONB DEFAULT '[]'::jsonb,
  revenuecat_customer_id  TEXT,
  subscription_status     TEXT DEFAULT 'free' CHECK (subscription_status IN ('free', 'premium', 'cancelled')),
  subscription_expires_at TIMESTAMPTZ,
  free_analysis_used      BOOLEAN DEFAULT FALSE,
  created_at              TIMESTAMPTZ DEFAULT now(),
  updated_at              TIMESTAMPTZ DEFAULT now()
);

-- =========================================
-- 2. ANALYSES TABLE
-- =========================================
-- Referenced by: analyze (insert), history (select list), history/[id] (select single), verify-subscription (count)
-- Columns used in code:
--   id              (UUID, PK, auto-generated)
--   user_id         (UUID, FK, written on insert, filtered on select)
--   monthly_budget  (INTEGER, written on insert, read in history)
--   current_spending (JSONB, written on insert)
--   primary_goal    (TEXT, written on insert, read in history)
--   age_range       (TEXT, written on insert)
--   result          (JSONB, written on insert, read in history + detail)
--   is_premium      (BOOLEAN, written on insert)
--   claude_model    (TEXT, written on insert)
--   created_at      (TIMESTAMPTZ, auto, read in history, filtered in verify-subscription/analyze)

CREATE TABLE IF NOT EXISTS public.analyses (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  monthly_budget    INTEGER NOT NULL,
  current_spending  JSONB DEFAULT '[]'::jsonb,
  primary_goal      TEXT NOT NULL,
  age_range         TEXT,
  result            JSONB NOT NULL,
  is_premium        BOOLEAN DEFAULT FALSE,
  claude_model      TEXT,
  claude_tokens_used INTEGER,
  created_at        TIMESTAMPTZ DEFAULT now()
);

-- =========================================
-- 3. AFFILIATE CLICKS TABLE
-- =========================================
-- Referenced by: track-click (insert)
-- Columns used in code:
--   user_id        (UUID, FK)
--   investment_id  (TEXT)
--   analysis_id    (UUID, FK, nullable)

CREATE TABLE IF NOT EXISTS public.affiliate_clicks (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  investment_id   TEXT NOT NULL,
  analysis_id     UUID REFERENCES public.analyses(id) ON DELETE SET NULL,
  clicked_at      TIMESTAMPTZ DEFAULT now()
);

-- =========================================
-- 4. ROW LEVEL SECURITY
-- =========================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_clicks ENABLE ROW LEVEL SECURITY;

-- profiles policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own profile' AND tablename = 'profiles') THEN
    CREATE POLICY "Users can view own profile"
      ON public.profiles FOR SELECT
      USING (auth.uid() = id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own profile' AND tablename = 'profiles') THEN
    CREATE POLICY "Users can update own profile"
      ON public.profiles FOR UPDATE
      USING (auth.uid() = id)
      WITH CHECK (auth.uid() = id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert own profile' AND tablename = 'profiles') THEN
    CREATE POLICY "Users can insert own profile"
      ON public.profiles FOR INSERT
      WITH CHECK (auth.uid() = id);
  END IF;
END $$;

-- analyses policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own analyses' AND tablename = 'analyses') THEN
    CREATE POLICY "Users can view own analyses"
      ON public.analyses FOR SELECT
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert own analyses' AND tablename = 'analyses') THEN
    CREATE POLICY "Users can insert own analyses"
      ON public.analyses FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete own analyses' AND tablename = 'analyses') THEN
    CREATE POLICY "Users can delete own analyses"
      ON public.analyses FOR DELETE
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- affiliate_clicks policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert own clicks' AND tablename = 'affiliate_clicks') THEN
    CREATE POLICY "Users can insert own clicks"
      ON public.affiliate_clicks FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- =========================================
-- 5. INDEXES
-- =========================================

CREATE INDEX IF NOT EXISTS idx_analyses_user_id ON public.analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_analyses_created_at ON public.analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analyses_user_created ON public.analyses(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_user_id ON public.affiliate_clicks(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_revenuecat_id ON public.profiles(revenuecat_customer_id) WHERE revenuecat_customer_id IS NOT NULL;

-- =========================================
-- 6. TRIGGERS
-- =========================================

-- Auto-update updated_at on profiles
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- =========================================
-- 7. AUTO-CREATE PROFILE ON AUTH SIGNUP
-- =========================================
-- This trigger automatically creates a profiles row when a user signs up
-- through Supabase Auth directly (e.g., OAuth, magic link).
-- Note: The signup API route also inserts a profile explicitly,
-- so this is a safety net / fallback for other auth methods.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
