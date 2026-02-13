
-- Habilitar extensão para geração de UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-------------------------------------------------------------------------------
-- 1. TABELAS DE USUÁRIO E PERFIL
-------------------------------------------------------------------------------

-- Tabela de Usuários (Centralizadora)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  role TEXT DEFAULT 'Visualizador',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Tabela de Perfis (Metadados Adicionais)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  role TEXT DEFAULT 'Visualizador',
  user_id UUID REFERENCES auth.users(id), -- Referência ao dono organizacional
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-------------------------------------------------------------------------------
-- 2. AUTOMAÇÃO DE CADASTRO (TRIGGER)
-------------------------------------------------------------------------------

-- Função que cria registros em 'users' e 'profiles' automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Insere na tabela 'users'
  INSERT INTO public.users (id, full_name, email, role)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.email,
    'Visualizador'
  );

  -- Insere na tabela 'profiles'
  INSERT INTO public.profiles (id, full_name, email, role, user_id)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.email,
    'Visualizador',
    new.id
  );

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Gatilho para disparar a função após o cadastro no Auth
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-------------------------------------------------------------------------------
-- 3. RESTANTE DA ESTRUTURA (FINANCEIRO / CRM)
-------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS cost_centers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  code TEXT,
  budget NUMERIC(15,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS bank_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  bank_name TEXT,
  balance NUMERIC(15,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS cards (
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

CREATE TABLE IF NOT EXISTS customers (
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

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'Recorrente',
  status TEXT DEFAULT 'Ativo',
  description TEXT,
  sla_days INTEGER DEFAULT 5,
  responsible_unit TEXT DEFAULT 'Sucesso do Cliente',
  involved_teams TEXT[],
  onboarding_scope TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  amount NUMERIC(15,2) DEFAULT 0,
  setup_fee NUMERIC(15,2) DEFAULT 0,
  start_date DATE DEFAULT CURRENT_DATE,
  duration_months INTEGER DEFAULT 12,
  status TEXT DEFAULT 'ACTIVE',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS leads (
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

CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  description TEXT NOT NULL,
  amount NUMERIC(15,2) NOT NULL,
  type TEXT CHECK (type IN ('IN', 'OUT')),
  status TEXT DEFAULT 'PENDING',
  competence_date DATE DEFAULT CURRENT_DATE,
  payment_method TEXT DEFAULT 'Pix',
  accounting_account TEXT,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  cost_center_id UUID REFERENCES cost_centers(id) ON DELETE SET NULL,
  bank_account_id UUID REFERENCES bank_accounts(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  type TEXT DEFAULT 'Funcionário',
  email TEXT,
  phone TEXT,
  document_type TEXT DEFAULT 'CPF',
  document_number TEXT,
  cost_center_id UUID REFERENCES cost_centers(id) ON DELETE SET NULL,
  salary_value NUMERIC(15,2) DEFAULT 0,
  status TEXT DEFAULT 'Ativo',
  has_contract BOOLEAN DEFAULT false,
  observations TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS squads (
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

CREATE TABLE IF NOT EXISTS tools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  provider TEXT,
  price NUMERIC(15,2) DEFAULT 0,
  billing_day INTEGER DEFAULT 1,
  category TEXT DEFAULT 'SaaS',
  recurrence TEXT DEFAULT 'Mensal',
  cost_center_id UUID REFERENCES cost_centers(id) ON DELETE SET NULL,
  payment_method TEXT DEFAULT 'Nenhum',
  status TEXT DEFAULT 'Ativo',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS onboardings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
  stage TEXT DEFAULT 'kickoff',
  progress INTEGER DEFAULT 0,
  responsible TEXT,
  status TEXT DEFAULT 'No Prazo',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS okrs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  target NUMERIC(15,2) NOT NULL,
  current NUMERIC(15,2) DEFAULT 0,
  period TEXT DEFAULT 'Ciclo 2026',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS nps_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 10),
  comment TEXT,
  context TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  category TEXT DEFAULT 'Geral',
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  description TEXT,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS taxes (
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

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT DEFAULT 'SISTEMA',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS marketing_boards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#2563eb',
  status TEXT DEFAULT 'Ativo',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS marketing_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  board_id UUID REFERENCES marketing_boards(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  stage TEXT DEFAULT 'idea',
  category TEXT DEFAULT 'Geral',
  type TEXT DEFAULT 'copy',
  priority TEXT DEFAULT 'Média',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-------------------------------------------------------------------------------
-- 4. CONFIGURAÇÕES DE SEGURANÇA (RLS)
-------------------------------------------------------------------------------

-- Habilitar RLS em todas as tabelas públicas
DO $$ 
DECLARE 
    t text;
BEGIN
    FOR t IN (SELECT table_name FROM information_schema.tables WHERE table_schema = 'public') 
    LOOP
        EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    END LOOP;
END $$;

-- Criar políticas genéricas de "Dono do Dado" baseadas na coluna user_id
DO $$ 
DECLARE 
    t text;
BEGIN
    FOR t IN (
        SELECT table_name 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND column_name = 'user_id'
        AND table_name NOT IN ('nps_responses')
    ) 
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS "Manage own data" ON %I', t);
        EXECUTE format('CREATE POLICY "Manage own data" ON %I FOR ALL USING (auth.uid() = user_id)', t);
    END LOOP;
END $$;

-- Política para a tabela 'users' (usa o campo id como chave de posse)
DROP POLICY IF EXISTS "Users can manage own user record" ON users;
CREATE POLICY "Users can manage own user record" ON users
  FOR ALL USING (auth.uid() = id);

-- Política para Perfis (Profiles)
DROP POLICY IF EXISTS "Users can manage own profile" ON profiles;
CREATE POLICY "Users can manage own profile" ON profiles
  FOR ALL USING (auth.uid() = id);

-- Política para NPS (baseada no dono do cliente vinculado)
DROP POLICY IF EXISTS "Manage NPS via Customer owner" ON nps_responses;
CREATE POLICY "Manage NPS via Customer owner" ON nps_responses
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM customers 
    WHERE customers.id = nps_responses.customer_id 
    AND customers.user_id = auth.uid()
  )
);
