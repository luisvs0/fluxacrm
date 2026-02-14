
-- ==========================================================
-- FLUXA IMOB ENGINE v2.6 - FULL DATABASE SETUP
-- ==========================================================

-- 1. EXTENSÕES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABELAS DE USUÁRIO E PERFIL
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  role TEXT DEFAULT 'Visualizador',
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. MÓDULO IMOBILIÁRIO (Inventory & Showings)
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  type TEXT DEFAULT 'Apartamento', 
  status TEXT DEFAULT 'Disponível', 
  sale_price NUMERIC(15,2) DEFAULT 0,
  rent_price NUMERIC(15,2) DEFAULT 0,
  condo_fee NUMERIC(15,2) DEFAULT 0,
  iptu_value NUMERIC(15,2) DEFAULT 0,
  area NUMERIC(10,2) DEFAULT 0,
  bedrooms INTEGER DEFAULT 0,
  bathrooms INTEGER DEFAULT 0,
  is_exclusive BOOLEAN DEFAULT false,
  is_opportunity BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  client_phone TEXT,
  visitor_name TEXT, 
  date DATE NOT NULL,
  time TIME NOT NULL,
  status TEXT DEFAULT 'Agendada', 
  feedback TEXT,
  feedback_rating INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. MÓDULO FINANCEIRO (Ledger & Banking)
CREATE TABLE IF NOT EXISTS public.bank_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  bank_name TEXT,
  balance NUMERIC(15,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.cost_centers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  code TEXT,
  budget NUMERIC(15,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  segment TEXT DEFAULT 'SaaS',
  document_type TEXT DEFAULT 'CNPJ',
  document_number TEXT,
  status TEXT DEFAULT 'Ativo',
  status_nf TEXT DEFAULT 'OK',
  mrr_value NUMERIC(15,2) DEFAULT 0,
  health_score INTEGER DEFAULT 100,
  observations TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  description TEXT NOT NULL,
  amount NUMERIC(15,2) NOT NULL,
  type TEXT CHECK (type IN ('IN', 'OUT')),
  status TEXT DEFAULT 'PENDING',
  competence_date DATE DEFAULT CURRENT_DATE,
  payment_method TEXT DEFAULT 'Pix',
  accounting_account TEXT,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  cost_center_id UUID REFERENCES public.cost_centers(id) ON DELETE SET NULL,
  bank_account_id UUID REFERENCES public.bank_accounts(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  last_digits TEXT,
  limit_amount NUMERIC(15,2) DEFAULT 0,
  type TEXT DEFAULT 'Cartão Empresa',
  color TEXT DEFAULT 'bg-slate-900',
  status TEXT DEFAULT 'Ativo',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. CRM E COMERCIAL (Leads & Funnel)
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  company TEXT,
  email TEXT,
  phone TEXT,
  value NUMERIC(15,2) DEFAULT 0,
  origin TEXT,
  assigned_to TEXT,
  segment TEXT DEFAULT 'Comercial',
  priority TEXT DEFAULT 'Média',
  stage TEXT DEFAULT 'lead',
  status TEXT DEFAULT 'OPEN',
  observations TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 6. ESTRATÉGICO (OKRs & Goals)
CREATE TABLE IF NOT EXISTS public.goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  scope TEXT DEFAULT 'Empresa', -- Empresa, Individual, Squad
  period TEXT DEFAULT 'Mensal',
  metric TEXT,
  target_value NUMERIC(15,2) NOT NULL,
  current_value NUMERIC(15,2) DEFAULT 0,
  alert_threshold INTEGER DEFAULT 80,
  start_date DATE,
  end_date DATE,
  description TEXT,
  status TEXT DEFAULT 'Active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.okrs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  target NUMERIC(15,2) NOT NULL,
  current NUMERIC(15,2) DEFAULT 0,
  period TEXT DEFAULT 'Ciclo 2026',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 7. OPERACIONAL (Contratos, Membros, Squads)
CREATE TABLE IF NOT EXISTS public.contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  amount NUMERIC(15,2) DEFAULT 0,
  setup_fee NUMERIC(15,2) DEFAULT 0,
  start_date DATE DEFAULT CURRENT_DATE,
  duration_months INTEGER DEFAULT 12,
  status TEXT DEFAULT 'ACTIVE',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  type TEXT DEFAULT 'Funcionário',
  email TEXT,
  phone TEXT,
  document_type TEXT DEFAULT 'CPF',
  document_number TEXT,
  cost_center_id UUID REFERENCES public.cost_centers(id) ON DELETE SET NULL,
  salary_value NUMERIC(15,2) DEFAULT 0,
  status TEXT DEFAULT 'Ativo',
  has_contract BOOLEAN DEFAULT false,
  observations TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.squads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  leader TEXT,
  mantra TEXT,
  members TEXT[],
  status TEXT DEFAULT 'Ativo',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 8. MARKETING E CONTEÚDO
CREATE TABLE IF NOT EXISTS public.marketing_boards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#2563eb',
  status TEXT DEFAULT 'Ativo',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.marketing_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  board_id UUID REFERENCES public.marketing_boards(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  stage TEXT DEFAULT 'idea',
  category TEXT DEFAULT 'Geral',
  type TEXT DEFAULT 'copy',
  priority TEXT DEFAULT 'Média',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 9. CONFIGURAÇÕES E SISTEMA
CREATE TABLE IF NOT EXISTS public.company_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE,
  name TEXT,
  document TEXT,
  email TEXT,
  currency TEXT DEFAULT 'BRL - Real Brasileiro',
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT DEFAULT 'SISTEMA',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.nps_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  comment TEXT,
  context TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.onboardings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  contract_id UUID REFERENCES public.contracts(id) ON DELETE CASCADE,
  stage TEXT DEFAULT 'kickoff',
  progress INTEGER DEFAULT 0,
  responsible TEXT,
  status TEXT DEFAULT 'No Prazo',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.taxes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  sphere TEXT DEFAULT 'Federal',
  calculation_base TEXT DEFAULT 'Faturamento',
  rate NUMERIC(5,2) NOT NULL,
  due_day INTEGER DEFAULT 15,
  recurrence TEXT DEFAULT 'Mensal',
  status TEXT DEFAULT 'Active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ==========================================================
-- SEGURANÇA: ROW LEVEL SECURITY (RLS)
-- ==========================================================

-- Habilitar RLS em todas as tabelas
DO $$ 
DECLARE 
    t text;
BEGIN
    FOR t IN (SELECT table_name FROM information_schema.tables WHERE table_schema = 'public') 
    LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    END LOOP;
END $$;

-- Criar políticas genéricas de isolamento por user_id
-- (Garante que um usuário só veja o que ele criou)
DO $$ 
DECLARE 
    t text;
BEGIN
    FOR t IN (
        SELECT table_name 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND column_name = 'user_id'
        AND table_name NOT IN ('nps_responses') -- NPS pode ter lógica diferente se for público
    ) 
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS "User isolation" ON public.%I', t);
        EXECUTE format('CREATE POLICY "User isolation" ON public.%I FOR ALL USING (auth.uid() = user_id)', t);
    END LOOP;
END $$;

-- Políticas especiais para tabelas sem user_id direto (relacionadas)
DROP POLICY IF EXISTS "NPS isolation" ON public.nps_responses;
CREATE POLICY "NPS isolation" ON public.nps_responses FOR ALL USING (true); -- Permitir leitura/escrita conforme fluxo

-- Grant permissions (Opcional se usar Supabase dashboard direto)
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, service_role, authenticated;
