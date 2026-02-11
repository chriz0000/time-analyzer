-- ==========================================
-- Budget Optimizer — Supabase Migration
-- Run this in Supabase SQL Editor
-- ==========================================

-- 1. Profiles table (extends Supabase Auth)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT,
  age_range TEXT CHECK (age_range IN ('18-29', '30-39', '40-49', '50-59', '60+')),
  primary_goal TEXT CHECK (primary_goal IN ('lifespan', 'performance', 'disease_prevention', 'aesthetics')),
  monthly_budget INTEGER DEFAULT 0,
  current_spending JSONB DEFAULT '[]',
  revenuecat_customer_id TEXT,
  subscription_status TEXT DEFAULT 'free' CHECK (subscription_status IN ('free', 'premium', 'cancelled')),
  subscription_expires_at TIMESTAMPTZ,
  free_analysis_used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 2. Analyses table (saved AI results)
CREATE TABLE public.analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  monthly_budget INTEGER NOT NULL,
  current_spending JSONB DEFAULT '[]',
  primary_goal TEXT NOT NULL,
  age_range TEXT,
  result JSONB NOT NULL,
  is_premium BOOLEAN DEFAULT FALSE,
  claude_model TEXT,
  claude_tokens_used INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own analyses"
  ON public.analyses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analyses"
  ON public.analyses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own analyses"
  ON public.analyses FOR DELETE
  USING (auth.uid() = user_id);

-- 3. Affiliate clicks tracking
CREATE TABLE public.affiliate_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  investment_id TEXT NOT NULL,
  analysis_id UUID REFERENCES public.analyses(id),
  clicked_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.affiliate_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own clicks"
  ON public.affiliate_clicks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 4. Indexes
CREATE INDEX idx_analyses_user_id ON public.analyses(user_id);
CREATE INDEX idx_analyses_created_at ON public.analyses(created_at DESC);
CREATE INDEX idx_affiliate_clicks_user_id ON public.affiliate_clicks(user_id);

-- 5. Updated_at trigger for profiles
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
