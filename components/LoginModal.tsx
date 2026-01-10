import React, { useState } from 'react';
import { ChevronDown, Rocket, ShieldCheck, Timer, User, X } from 'lucide-react';
import DataManager from '../auth/DataManager';
import { User as UserType } from '../types/auth';

const LoginModal = ({
  isOpen,
  onClose,
  onLogin,
}: {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserType) => void;
}) => {
  const [step, setStep] = useState<'selection' | 'login' | 'loading'>('selection');
  const [loginType, setLoginType] = useState<'coach' | 'atleta'>('atleta');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const startLogin = (type: 'coach' | 'atleta') => {
    setLoginType(type);
    setStep('login');
    setError('');
    setUsername('');
    setPassword('');
  };

  const quickCoachAccess = () => {
    const coach = DataManager.getUsers().find((u) => u.role === 'coach') || null;
    if (!coach) {
      setError('Coach nÇœo encontrado. Atualize a pÇ­gina e tente novamente.');
      return;
    }
    onLogin(coach);
    setStep('selection');
    setUsername('');
    setPassword('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = DataManager.authenticate(username, password);

    if (!user) {
      setError('UsuÇ­rio ou senha incorretos');
      return;
    }

    if (user.role !== loginType) {
      setError(`Esta conta nÇœo Ç¸ de ${loginType === 'coach' ? 'coach' : 'atleta'}`);
      return;
    }

    setStep('loading');
    setTimeout(() => {
      onLogin(user);
      setStep('selection');
      setUsername('');
      setPassword('');
    }, 1500);
  };

  const goBack = () => {
    setStep('selection');
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 backdrop-blur-3xl bg-black/95">
      <div className="glass w-full max-w-xl p-8 md:p-12 rounded-[4rem] relative border border-[#fdf001]/10 overflow-hidden shadow-[0_0_100px_rgba(253,240,1,0.1)]">
        <button onClick={onClose} className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors z-50">
          <X size={32} />
        </button>

        {step === 'selection' ? (
          <div className="text-center animate-in zoom-in-95 duration-300">
            <div className="bg-[#fdf001] w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-[#fdf001]/30">
              <Timer size={48} className="text-black" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black italic uppercase text-white mb-12 tracking-tighter">
              Ç?REA DO <span className="text-[#fdf001]">SQUAD</span>
            </h2>
            <div className="grid gap-6">
              <button
                onClick={() => startLogin('atleta')}
                className="group w-full bg-white/5 border border-white/5 p-8 rounded-[2.5rem] flex items-center justify-between hover:border-[#fdf001]/40 hover:bg-[#fdf001]/5 transition-all"
              >
                <div className="text-left">
                  <span className="block font-black italic uppercase text-2xl text-white">LOGIN ATLETA</span>
                  <span className="text-[10px] font-bold text-gray-500 tracking-[0.2em] uppercase">Minhas Planilhas</span>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl group-hover:bg-[#fdf001] transition-all">
                  <User className="text-[#fdf001] group-hover:text-black" size={32} />
                </div>
              </button>
              <button
                onClick={() => startLogin('coach')}
                className="group w-full bg-[#fdf001] p-8 rounded-[2.5rem] flex items-center justify-between hover:bg-white text-black transition-all"
              >
                <div className="text-left">
                  <span className="block font-black italic uppercase text-2xl">HEAD COACH</span>
                  <span className="text-[10px] font-bold opacity-60 tracking-[0.2em] uppercase">GestÇœo TÇ¸cnica</span>
                </div>
                <ShieldCheck size={40} className="opacity-40" />
              </button>
            </div>
            <button
              onClick={quickCoachAccess}
              className="mt-8 w-full bg-white/5 border border-white/10 rounded-2xl py-4 text-xs font-black uppercase tracking-widest text-white hover:border-[#fdf001]/50 hover:text-[#fdf001] transition-all"
            >
              Acesso RÇ­pido Coach (sem senha)
            </button>
            {error && (
              <div className="mt-6 bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-red-400 text-sm font-bold text-center">
                {error}
              </div>
            )}
          </div>
        ) : step === 'login' ? (
          <div className="animate-in fade-in zoom-in duration-300">
            <button
              onClick={goBack}
              className="mb-6 text-white/60 hover:text-white flex items-center gap-2 text-sm font-bold uppercase tracking-wider"
            >
              <ChevronDown className="rotate-90" size={16} /> Voltar
            </button>
            <div className="text-center mb-8">
              <div className={`${loginType === 'coach' ? 'bg-[#fdf001]' : 'bg-white/10'} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                {loginType === 'coach' ? <ShieldCheck size={40} className="text-black" /> : <User size={40} className="text-[#fdf001]" />}
              </div>
              <h3 className="text-3xl font-black italic uppercase text-white tracking-tighter">
                {loginType === 'coach' ? 'HEAD COACH' : 'ATLETA'} <span className="text-[#fdf001]">LOGIN</span>
              </h3>
              {loginType === 'coach' && (
                <p className="text-xs text-gray-500 mt-2 font-bold tracking-wider">PadrÇœo: coach / coach123</p>
              )}
            </div>
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">UsuÇ­rio</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-[#fdf001] transition-all"
                  placeholder="Digite seu usuÇ­rio"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Senha</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-[#fdf001] transition-all"
                  placeholder="Digite sua senha"
                  required
                />
              </div>
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-red-400 text-sm font-bold text-center">
                  {error}
                </div>
              )}
              <button
                type="submit"
                className="w-full bg-[#fdf001] hover:bg-white text-black font-black uppercase tracking-wider py-5 rounded-2xl transition-all text-lg"
              >
                ENTRAR
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-24 animate-in fade-in zoom-in">
            <Rocket size={80} className="text-[#fdf001] mx-auto mb-10 animate-bounce" />
            <h3 className="text-4xl font-black italic uppercase text-white tracking-widest leading-none">
              AUTENTICANDO <br /> PROTOCOLO...
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
