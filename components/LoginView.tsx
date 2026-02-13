
import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Chrome,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  Loader2,
  AlertCircle,
  User,
  CheckCircle2
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface LoginViewProps {
  onLogin: () => void;
}

const LoginView: React.FC<LoginViewProps> = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({ 
    name: '',
    email: '', 
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isRegistering) {
        // Validações de Cadastro
        if (formData.password !== formData.confirmPassword) {
          throw new Error('As senhas não coincidem.');
        }
        if (formData.password.length < 6) {
          throw new Error('A senha deve ter pelo menos 6 caracteres.');
        }

        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.name,
            }
          }
        });

        if (error) throw error;
        
        setSuccess('Conta criada! Verifique seu e-mail para confirmar o acesso.');
        // Opcional: resetar form ou mudar para login
        setFormData({ name: '', email: '', password: '', confirmPassword: '' });
      } else {
        // Lógica de Login
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao processar solicitação.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white font-['Inter']">
      {/* Lado Esquerdo: Formulário */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-24 xl:px-40 py-12">
        <div className="max-w-[440px] w-full mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* Logo Oficial */}
          <div className="group cursor-default">
            <img 
              src="https://drive.google.com/uc?export=view&id=1TIYyVwcuCt7uOdJocoOY6B8GyYXmSPyh" 
              alt="Fluxa Logo" 
              className="h-12 w-auto object-contain group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              {isRegistering ? 'Criar nova conta' : 'Acesso à Plataforma'}
            </h1>
            <p className="text-slate-400 font-medium leading-relaxed">
              {isRegistering 
                ? 'Comece sua jornada na gestão financeira inteligente.' 
                : 'Utilize suas credenciais profissionais para acessar o engine financeiro.'}
            </p>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center gap-3 text-rose-600 text-xs font-bold animate-in shake-in-1 duration-300">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {success && (
            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-3 text-emerald-600 text-xs font-bold animate-in zoom-in-95 duration-300">
              <CheckCircle2 size={18} />
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Campo Nome (Apenas Cadastro) */}
              {isRegistering && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest ml-1">Nome Completo</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input 
                      type="text" 
                      required
                      placeholder="Como deseja ser chamado?"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all outline-none"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest ml-1">E-mail Profissional</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input 
                    type="email" 
                    required
                    placeholder="nome@empresa.com"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all outline-none"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              {/* Senha */}
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Senha</label>
                  {!isRegistering && (
                    <button type="button" className="text-[10px] font-black uppercase text-blue-600 hover:underline tracking-widest">Redefinir</button>
                  )}
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required
                    placeholder="••••••••••••"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-12 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all outline-none"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirmar Senha (Apenas Cadastro) */}
              {isRegistering && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest ml-1">Confirmar Senha</label>
                  <div className="relative group">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      required
                      placeholder="Repita sua senha"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all outline-none"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    />
                  </div>
                </div>
              )}
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-900 text-white rounded-2xl py-4 font-black uppercase tracking-[0.15em] text-xs hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  {isRegistering ? 'Finalizar Cadastro' : 'Entrar no Fluxa'}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <button 
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError(null);
                setSuccess(null);
              }}
              className="text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors"
            >
              {isRegistering ? (
                <>Já possui uma conta? <span className="text-blue-600 font-black uppercase ml-1">Entre agora</span></>
              ) : (
                <>Não tem uma conta? <span className="text-blue-600 font-black uppercase ml-1">Cadastre-se</span></>
              )}
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-black tracking-[0.2em]">
              <span className="bg-white px-4 text-slate-300">Autenticação Segura</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <button className="flex items-center justify-center gap-3 w-full py-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all active:scale-[0.98]">
               <Chrome size={18} className="text-blue-500" />
               Continuar com Google
            </button>
          </div>
        </div>
      </div>

      {/* Lado Direito: Visual Premium */}
      <div className="hidden lg:flex flex-1 bg-[#002147] relative overflow-hidden items-center justify-center">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px]"></div>
        
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

        <div className="relative z-10 p-20 max-w-[640px] space-y-12">
          <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-400/20 rounded-full text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">
              <Sparkles size={14} />
              Fluxa Intelligence Cloud
            </div>
            <h2 className="text-5xl xl:text-6xl font-black text-white leading-tight tracking-tight">
              {isRegistering ? 'Transforme dados em ' : 'A inteligência que sua '}
              <span className="text-blue-400 italic">{isRegistering ? 'estratégia' : 'gestão'}</span>
              {isRegistering ? '.' : ' merece.'}
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-blue-400">
                <TrendingUp size={24} />
              </div>
              <h4 className="text-white font-bold">SQL Realtime</h4>
              <p className="text-sm text-white/40 leading-relaxed">Conexão direta com banco PostgreSQL de alta performance.</p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-blue-400">
                <ShieldCheck size={24} />
              </div>
              <h4 className="text-white font-bold">OAuth 2.0</h4>
              <p className="text-sm text-white/40 leading-relaxed">Padrões globais de segurança e criptografia de dados.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
