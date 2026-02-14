
-- 1. Garante que a coluna notified existe na tabela de compromissos
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS notified BOOLEAN DEFAULT false;

-- 2. Garante que a tabela de notificações existe com a estrutura esperada
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT DEFAULT 'alerta',
    is_read BOOLEAN DEFAULT false
);

-- 3. Habilita RLS e cria políticas de inserção
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own notifications' AND tablename = 'notifications') THEN
        CREATE POLICY "Users can insert their own notifications" ON public.notifications
        FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own notifications' AND tablename = 'notifications') THEN
        CREATE POLICY "Users can view their own notifications" ON public.notifications
        FOR SELECT USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own notifications' AND tablename = 'notifications') THEN
        CREATE POLICY "Users can update their own notifications" ON public.notifications
        FOR UPDATE USING (auth.uid() = user_id);
    END IF;
END $$;
