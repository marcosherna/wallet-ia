-- ==============================================================================
-- ESQUEMA COMPLETO PARA SUPABASE (WALLET IA)
-- Copia y pega este script en el SQL Editor de tu consola de Supabase y dale a RUN.
-- ==============================================================================

-- 1. TABLA DE PERFILES DE USUARIO (extensión de auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  job_status TEXT DEFAULT '',
  monthly_income NUMERIC DEFAULT 0,
  primary_goal TEXT DEFAULT '',
  currency TEXT DEFAULT 'USD',
  biometrics BOOLEAN DEFAULT false,
  pin_enabled BOOLEAN DEFAULT false,
  notifications BOOLEAN DEFAULT true,
  theme_mode TEXT DEFAULT 'system',
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. TABLA DE CUENTAS BANCARIAS Y TARJETAS
CREATE TABLE IF NOT EXISTS public.accounts (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('checking', 'savings', 'cash', 'credit_card')),
  balance NUMERIC NOT NULL DEFAULT 0,
  institution TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. TABLA DE TRANSACCIONES (Ingresos, Gastos, Transferencias)
CREATE TABLE IF NOT EXISTS public.transactions (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense', 'transfer')),
  amount NUMERIC NOT NULL,
  category_id TEXT NOT NULL,
  account_id TEXT NOT NULL,
  to_account_id TEXT,
  note TEXT DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  date TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. TABLA DE METAS DE AHORRO
CREATE TABLE IF NOT EXISTS public.goals (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  target NUMERIC NOT NULL,
  saved NUMERIC NOT NULL DEFAULT 0,
  deadline TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'target',
  monthly_contribution NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. TABLA DE PRESUPUESTOS POR CATEGORÍA
CREATE TABLE IF NOT EXISTS public.budgets (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id TEXT NOT NULL,
  limit_amount NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  CONSTRAINT unique_user_category_budget UNIQUE (user_id, category_id)
);

-- 6. TABLA DE PRÉSTAMOS Y CRÉDITOS
CREATE TABLE IF NOT EXISTS public.loans (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  kind TEXT NOT NULL DEFAULT 'auto',
  principal NUMERIC NOT NULL,
  apr NUMERIC NOT NULL,
  term_months INTEGER NOT NULL,
  monthly_payment NUMERIC NOT NULL,
  payment_day INTEGER NOT NULL,
  paid_installments INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. TABLA DE MENSAJES DEL ASESOR IA
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==============================================================================
-- SEGURIDAD ROW LEVEL SECURITY (RLS)
-- Cada usuario solo puede ver y modificar sus propios datos
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
CREATE POLICY "profiles_select_policy" ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
CREATE POLICY "profiles_insert_policy" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
CREATE POLICY "profiles_update_policy" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Políticas para accounts
DROP POLICY IF EXISTS "accounts_policy" ON public.accounts;
CREATE POLICY "accounts_policy" ON public.accounts FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Políticas para transactions
DROP POLICY IF EXISTS "transactions_policy" ON public.transactions;
CREATE POLICY "transactions_policy" ON public.transactions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Políticas para goals
DROP POLICY IF EXISTS "goals_policy" ON public.goals;
CREATE POLICY "goals_policy" ON public.goals FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Políticas para budgets
DROP POLICY IF EXISTS "budgets_policy" ON public.budgets;
CREATE POLICY "budgets_policy" ON public.budgets FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Políticas para loans
DROP POLICY IF EXISTS "loans_policy" ON public.loans;
CREATE POLICY "loans_policy" ON public.loans FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Políticas para chat_messages
DROP POLICY IF EXISTS "chat_messages_policy" ON public.chat_messages;
CREATE POLICY "chat_messages_policy" ON public.chat_messages FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ==============================================================================
-- TRIGGER PARA CREAR PERFIL AUTOMÁTICAMENTE AL REGISTRARSE EN AUTH
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, onboarding_completed)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    false
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Índices para optimizar rendimiento de consultas
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON public.accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_date ON public.transactions(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON public.goals(user_id);
CREATE INDEX IF NOT EXISTS idx_budgets_user_id ON public.budgets(user_id);
CREATE INDEX IF NOT EXISTS idx_loans_user_id ON public.loans(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_date ON public.chat_messages(user_id, created_at ASC);
