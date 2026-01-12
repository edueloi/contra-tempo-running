import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Timer, MapPin, Users, ChevronRight, Instagram, Zap, 
  CheckCircle2, MessageSquare, Activity, Award, ArrowRight, Menu, X,
  Trophy, Flame, Target, Share2, PlayCircle, Clock, Phone, Mail, 
  HeartPulse, Weight, Dumbbell, ShieldCheck, Scale, Map, Navigation,
  Lock, User, LogOut, Calendar, TrendingUp, BarChart3, Bell,
  Home, Sun, Plus, Search, ClipboardList, Settings, ChevronDown,
  Star, Quote, ZapOff, Sparkles, Rocket, Fingerprint, Eye, 
  LayoutDashboard, ListChecks, History, PieChart, ShieldAlert,
  Zap as ZapIcon, Info, ChevronUp, Droplets, Heart, Filter, Facebook, Twitter,
  Send, Bot, XCircle
} from 'lucide-react';
import DataManager from './auth/DataManager';
import LoginModal from './components/LoginModal';
import type {
  AlertItem,
  AthleteData,
  TrainingPlan,
  ActivityEntry,
  MetricsEntry,
  User as UserType,
} from './types/auth';

// Inicializar coach padrão
DataManager.initializeCoach();

// --- COMPONENTS ---

const Navbar = ({ onLoginClick, user, onLogout }: { onLoginClick: () => void, user: any, onLogout: () => void }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Início', href: '#home' },
    { name: 'Sobre', href: '#sobre' },
    { name: 'Serviços', href: '#servicos' },
    { name: 'Horários', href: '#horarios' },
    { name: 'Contato', href: '#contato' },
  ];

  if (user) return null;

  return (
    <nav className={`fixed w-full z-[100] transition-all duration-500 ${scrolled || mobileMenu ? 'bg-black/95 backdrop-blur-3xl py-4 border-b border-white/5' : 'bg-transparent py-8'}`}>
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
        <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
          <img src="./img/logo-contra-tempo.png" alt="Contra Tempo Logo" className="h-10 md:h-12 w-auto transition-transform group-hover:scale-110" />
        </div>
        
        <div className="hidden lg:flex space-x-10 items-center text-[10px] font-black uppercase tracking-[0.3em] text-white">
          {navLinks.map(link => (
            <a key={link.name} href={link.href} className="hover:text-[#fdf001] transition-colors relative group">
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#fdf001] transition-all group-hover:w-full"></span>
            </a>
          ))}
          <button 
            onClick={onLoginClick}
            className="bg-[#fdf001] hover:bg-white text-black px-8 py-3 rounded-full transition-all flex items-center gap-2 font-black shadow-lg shadow-[#fdf001]/20 group"
          >
            AGENDAR / LOGIN
          </button>
        </div>

        <button className="lg:hidden text-white" onClick={() => setMobileMenu(!mobileMenu)}>
          {mobileMenu ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {mobileMenu && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-black border-b border-white/10 p-10 flex flex-col space-y-8 animate-in slide-in-from-top duration-300">
          {navLinks.map(link => (
            <a key={link.name} href={link.href} onClick={() => setMobileMenu(false)} className="text-3xl font-black italic uppercase tracking-tighter text-white">{link.name}</a>
          ))}
          <button onClick={onLoginClick} className="bg-[#fdf001] p-5 rounded-2xl font-black uppercase tracking-widest text-center text-black">ÁREA DO ATLETA</button>
        </div>
      )}
    </nav>
  );
};

// --- CHATBOT COMPONENT ---

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ text: string; isBot: boolean; options?: string[]; id: number }>>([
    { 
      text: '👋 Olá! Sou o assistente da Contra Tempo. Como posso te ajudar hoje?', 
      isBot: true,
      options: ['📍 Endereço e localização', '⏰ Horários de treino', '🏃 Sobre a assessoria', '💰 Valores e planos', '📱 Falar no WhatsApp'],
      id: Date.now()
    }
  ]);
  const [showWhatsAppPrompt, setShowWhatsAppPrompt] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleOption = (option: string, messageId: number) => {
    // Previne múltiplos cliques
    if (isTyping) return;
    
    // Remove as opções da mensagem anterior para prevenir cliques duplicados
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, options: undefined } : msg
    ));

    // Adiciona a mensagem do usuário
    setMessages(prev => [...prev, { text: option, isBot: false, id: Date.now() }]);
    setIsTyping(true);

    setTimeout(() => {
      let response = '';
      let options: string[] | undefined;

      if (option.includes('Endereço')) {
        response = '📍 Nossa localização:\n\nR. Prof. Adauto Pereira, 307\nTatuí, SP\n\nEstamos em uma localização privilegiada com fácil acesso!';
        options = ['⏰ Ver horários', '🏃 Sobre a assessoria', '📱 Falar no WhatsApp'];
      } else if (option.includes('Horários')) {
        response = '⏰ Horários de Treino:\n\n🌅 Segunda a Sexta:\n• 5h30 - Treino matinal\n• 18h30 - Treino noturno\n\n☀️ Sábados:\n• 6h00 - Longão\n\nTreinos adaptados ao seu nível!';
        options = ['📍 Ver localização', '💰 Ver valores', '📱 Falar no WhatsApp'];
      } else if (option.includes('Sobre')) {
        response = '🏃 Sobre a Contra Tempo:\n\nDesde 2014 transformando corredores em atletas de elite!\n\n✅ Planilhas individualizadas\n✅ CT próprio equipado\n✅ Fisioterapia e nutrição\n✅ Acompanhamento em provas\n✅ Metodologia comprovada';
        options = ['💰 Ver valores', '⏰ Ver horários', '📱 Falar no WhatsApp'];
      } else if (option.includes('Valores')) {
        response = '💰 Nossos Planos:\n\n🥇 Plano Completo\n• Treinos presenciais ilimitados\n• Planilha individualizada\n• Suporte no WhatsApp\n\n🥈 Plano Online\n• Planilha personalizada\n• Ajustes semanais\n• Grupo exclusivo\n\nPara valores específicos, vamos conversar no WhatsApp?';
        setShowWhatsAppPrompt(true);
      } else if (option.includes('WhatsApp')) {
        response = '📱 Perfeito! Vou te direcionar para o WhatsApp agora.\n\nVou incluir suas dúvidas na mensagem! 😊';
        setShowWhatsAppPrompt(true);
      }

      setMessages(prev => [...prev, { text: response, isBot: true, options, id: Date.now() }]);
      setIsTyping(false);
    }, 600);
  };

  const openWhatsApp = () => {
    const interests = messages
      .filter(m => !m.isBot)
      .map(m => m.text)
      .join(', ');
    
    const message = encodeURIComponent(
      `Olá! Vim pelo site e tenho interesse em: ${interests || 'conhecer a assessoria'}`
    );
    window.open(`https://wa.me/5515997150805?text=${message}`, '_blank');
    setIsOpen(false);
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="whatsapp-float bg-[#fdf001] w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-2xl hover:bg-white transition-all z-[1000] group"
        >
          <Bot className="w-7 h-7 md:w-8 md:h-8 text-black group-hover:scale-110 transition-transform" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-4 right-4 left-4 md:left-auto md:bottom-6 md:right-6 md:w-[420px] max-h-[85vh] md:h-[600px] bg-black border-2 border-[#fdf001]/20 rounded-3xl shadow-2xl z-[1000] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#fdf001] to-[#ffa500] p-4 md:p-6 flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="bg-black p-2 rounded-xl">
                <Bot className="w-5 h-5 md:w-6 md:h-6 text-[#fdf001]" />
              </div>
              <div>
                <h3 className="font-black italic uppercase text-black text-base md:text-lg tracking-tight">Contra Tempo Bot</h3>
                <p className="text-[10px] md:text-xs text-black/70 font-bold">Online agora</p>
              </div>
            </div>
            <button
              onClick={() => {
                setIsOpen(false);
                setShowWhatsAppPrompt(false);
              }}
              className="bg-black/20 hover:bg-black/40 p-2 rounded-lg transition-all"
            >
              <X className="w-5 h-5 text-black" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 md:space-y-4 bg-[#050505]">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                <div
                  className={`max-w-[90%] md:max-w-[85%] rounded-2xl p-3 md:p-4 ${
                    msg.isBot
                      ? 'bg-white/5 border border-white/10 text-white'
                      : 'bg-[#fdf001] text-black'
                  }`}
                >
                  <p className="text-xs md:text-sm font-medium whitespace-pre-line leading-relaxed">{msg.text}</p>
                  
                  {msg.options && !isTyping && (
                    <div className="mt-3 md:mt-4 space-y-2">
                      {msg.options.map((option, i) => (
                        <button
                          key={i}
                          onClick={() => handleOption(option, msg.id)}
                          disabled={isTyping}
                          className="w-full bg-white/10 hover:bg-[#fdf001] hover:text-black border border-white/20 hover:border-[#fdf001] rounded-xl p-2.5 md:p-3 text-left text-[10px] md:text-xs font-black uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-1.5">
                  <span className="w-2 h-2 bg-[#fdf001] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-[#fdf001] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-[#fdf001] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Footer */}
          {showWhatsAppPrompt && (
            <div className="p-3 md:p-4 bg-black border-t border-white/10">
              <button
                onClick={openWhatsApp}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 md:py-4 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 md:gap-3 shadow-lg text-xs md:text-sm active:scale-95"
              >
                <MessageSquare className="w-4 h-4 md:w-5 md:h-5" />
                Abrir WhatsApp
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

// --- LANDING SECTIONS ---

const Hero = () => (
  <section id="home" className="relative min-h-screen flex items-center overflow-hidden bg-black pt-20 hero-grid">
    <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 grid-lines opacity-40" />
      <div className="hero-orb w-72 h-72 -top-24 -left-10" />
      <div className="hero-orb orange w-[420px] h-[420px] -bottom-40 right-0" />
      <img src="https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=90&w=2400" className="w-full h-full object-cover opacity-30 grayscale scale-110" alt="Running" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
    </div>
    
    <div className="container mx-auto px-4 md:px-8 relative z-20">
      <div className="max-w-4xl">
        <div className="inline-flex items-center gap-3 bg-[#fdf001]/10 border border-[#fdf001]/20 px-4 py-2 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] mb-8 text-[#fdf001] backdrop-blur-md">
          <Zap className="w-4 h-4 animate-pulse" />
          <span>Assessoria de Elite desde 2014 • Tatuí SP</span>
        </div>
        <h1 className="text-[15vw] md:text-[10rem] font-black mb-6 leading-[0.75] italic tracking-tighter uppercase text-white">
          CONTRA O <br /> <span className="gradient-text italic">TEMPO.</span>
        </h1>
        <p className="text-gray-300 text-lg md:text-3xl mb-8 max-w-2xl font-light italic leading-tight">
          Sua performance não é sorte, é <span className="text-[#fdf001] font-black uppercase italic">metodologia aplicada.</span> Junte-se ao squad que domina o asfalto.
        </p>
        <div className="flex flex-wrap gap-3 text-[10px] md:text-xs font-black uppercase tracking-[0.35em] text-gray-500 mb-10">
          <span className="chip">Planilhas Individuais</span>
          <span className="chip">CT PrÇüprio</span>
          <span className="chip">Fisio + NutriÇõÇœo</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-6">
          <a href="#sobre" className="bg-[#fdf001] hover:bg-white text-black px-12 py-6 rounded-2xl font-black uppercase tracking-widest transition-all shadow-2xl shadow-[#fdf001]/40 flex items-center justify-center gap-4 group btn-sheen">
            CONHECER A ASSESSORIA <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </a>
          <a href="#contato" className="bg-white/5 border border-white/10 hover:bg-white/10 text-white px-10 py-6 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-4">
            FALAR COM UM COACH
          </a>
        </div>
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-2xl">
          {[
            { label: 'Atletas Ativos', value: '450+' },
            { label: 'CT de Treino', value: '1 Unid.' },
            { label: 'Treinos Semanais', value: '6x' },
          ].map((stat) => (
            <div key={stat.label} className="glow-card bg-white/5 border border-white/10 rounded-2xl p-4">
              <div className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500">{stat.label}</div>
              <div className="text-2xl font-black italic text-white mt-2">{stat.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const About = () => (
  <section id="sobre" className="py-32 bg-[#050505]">
    <div className="container mx-auto px-4 md:px-8 relative z-10">
      <div className="grid lg:grid-cols-2 gap-24 items-center">
        <div className="relative">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#fdf001]/20 rounded-full blur-[80px]" />
          <h2 className="text-6xl md:text-9xl font-black italic uppercase tracking-tighter text-white mb-10 leading-none">NOSSA <br /><span className="text-[#fdf001]">HISTÓRIA.</span></h2>
          <div className="space-y-6 text-gray-400 text-lg md:text-xl font-light italic leading-relaxed">
            <p>A <span className="text-white font-bold italic">Contra Tempo Running</span> nasceu em Junho de 2014 com o objetivo de orientar pessoas interessadas em praticar corrida de rua, mas que buscavam uma prática com orientação e acompanhamento profissional.</p>
            <p>Com o aumento do interesse pela modalidade, passamos a atender o corredor em todas as suas necessidades: treinamento de corrida, fortalecimento, nutrição e fisioterapia.</p>
            <p>Hoje, contamos com o nosso próprio <span className="text-[#fdf001] font-bold">CT de Treinamento</span>, onde oferecemos um atendimento personalizado visando a evolução técnica e física de cada atleta do squad.</p>
          </div>
        <div className="grid sm:grid-cols-2 gap-6 mt-10">
          {[
            { title: 'PeriodizaÇõÇœo Inteligente', desc: 'Planejamento de ciclos com ajustes semanais.', icon: Target },
            { title: 'PrevenÇõÇœo de LesÇæes', desc: 'Foco em mecÇ½nica e fortalecimento tÇ¸cnico.', icon: ShieldCheck },
            { title: 'ForÇõa e PotÇ¦ncia', desc: 'Treinos combinados dentro do CT.', icon: Dumbbell },
            { title: 'RecuperaÇõÇœo Guiada', desc: 'Sono, carga e indicadores de recovery.', icon: HeartPulse },
          ].map((item) => (
            <div key={item.title} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#fdf001]/40 hover:bg-[#fdf001]/5 transition-all">
              <div className="bg-[#fdf001]/10 w-10 h-10 rounded-xl flex items-center justify-center mb-4">
                <item.icon className="w-5 h-5 text-[#fdf001]" />
              </div>
              <div className="text-white font-black italic uppercase tracking-tight">{item.title}</div>
              <div className="text-gray-500 text-sm mt-2 font-light italic">{item.desc}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-8 mt-16">
            <div className="border-l-4 border-[#fdf001] pl-6">
              <div className="text-4xl font-black italic text-white uppercase">10+ Anos</div>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">De Experiência</div>
            </div>
            <div className="border-l-4 border-[#fdf001] pl-6">
              <div className="text-4xl font-black italic text-white uppercase">450+</div>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Atletas Ativos</div>
            </div>
          </div>
        </div>
        <div className="relative h-[600px] rounded-[4rem] overflow-hidden border border-white/10 shadow-2xl">
          <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=90&w=1200" className="w-full h-full object-cover grayscale" alt="Training Center" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-12">
            <div>
              <div className="text-[#fdf001] text-xs font-black uppercase tracking-widest mb-2">Unidade Tatuí SP</div>
              <div className="text-3xl font-black italic uppercase text-white tracking-tighter">CT CONTRA TEMPO</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const ServicesGrid = () => {
  const services = [
    { title: 'Reabilitação', desc: 'Recuperação funcional com foco no retorno seguro ao esporte.', icon: HeartPulse },
    { title: 'Emagrecimento', desc: 'Protocolos de treino otimizados para queima calórica e saúde.', icon: Flame },
    { title: 'Fortalecimento', desc: 'CT próprio com foco em força específica para corredores.', icon: Dumbbell },
    { title: 'Perda de Peso', desc: 'Acompanhamento focado em composição corporal eficiente.', icon: Scale },
    { title: 'Correção Postural', desc: 'Melhoria da biomecânica para eficiência e prevenção de lesões.', icon: AccessibilityIcon },
    { title: 'Personal Training', desc: 'Acompanhamento 1-on-1 para metas ultra específicas.', icon: User },
    { title: 'Corrida de Rua', desc: 'Nossa especialidade. Da primeira caminhada à maratona.', icon: Timer },
  ];

  return (
    <section id="servicos" className="py-32 bg-black">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-24">
          <h2 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter text-white">NOSSOS <span className="text-[#fdf001]">SERVIÇOS.</span></h2>
          <p className="text-gray-500 text-xl md:text-2xl italic font-light mt-4">Atendimento personalizado para todas as necessidades do atleta.</p>
        </div>
      <div className="grid lg:grid-cols-3 gap-6 mb-16">
        {[
          { title: 'AvaliaÇõÇœo TÇ¸cnica', desc: 'AnÇ­lise de mecÇ½nica e ajustes de performance.', icon: Activity },
          { title: 'Meta de Provas', desc: 'Planejamento para 5K, 10K e maratonas.', icon: Trophy },
          { title: 'Cultura de Squad', desc: 'Ambiente competitivo e acolhedor.', icon: Users },
        ].map((item) => (
          <div key={item.title} className="glow-card bg-white/5 border border-white/10 rounded-[2.5rem] p-8 flex items-start gap-5">
            <div className="bg-[#fdf001] text-black p-3 rounded-2xl">
              <item.icon size={20} />
            </div>
            <div>
              <div className="text-white font-black italic uppercase tracking-tight">{item.title}</div>
              <div className="text-gray-500 text-sm italic mt-2">{item.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((s, i) => (
          <div key={i} className="glass group p-10 rounded-[3rem] border border-white/5 hover:border-[#fdf001]/30 hover:bg-[#fdf001]/5 transition-all duration-500 relative overflow-hidden">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-[#fdf001]/10 via-transparent to-transparent" />
            <div className="bg-white/5 p-4 rounded-2xl w-fit mb-8 group-hover:bg-[#fdf001] transition-colors">
                <s.icon className="w-8 h-8 text-[#fdf001] group-hover:text-black" />
              </div>
              <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-4 leading-none">{s.title}</h3>
              <p className="text-gray-500 italic font-light group-hover:text-gray-300 transition-colors leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const AccessibilityIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"/><path d="m18 19 1-7-6 1"/><path d="m5 8 3-3 5.5 3-2.36 3.5"/><path d="M4.24 14.5a5 5 0 0 0 6.88 6"/><path d="M13.76 17.5a5 5 0 0 0-6.88-6"/>
  </svg>
);

const ScheduleSection = () => (
  <section id="horarios" className="py-32 bg-[#050505] border-y border-white/5 relative overflow-hidden">
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute inset-0 grid-lines opacity-20" />
      <div className="hero-orb orange w-80 h-80 -top-20 right-20" />
    </div>
    <div className="container mx-auto px-4 md:px-8 relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
        <div className="max-w-3xl">
          <h2 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter text-white leading-none">ONDE <br /><span className="text-[#fdf001]">TREINAR.</span></h2>
          <p className="text-gray-400 text-xl italic font-light mt-8">Suporte presencial nos melhores pontos de Tatuí para garantir sua evolução.</p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-10">
        <div className="glass p-12 rounded-[4rem] border border-white/5 relative group hover:-translate-y-2 transition-all">
          <div className="flex justify-between items-start mb-12">
            <div>
              <div className="bg-[#fdf001] text-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block">PERÍODO NOTURNO</div>
              <h3 className="text-4xl font-black italic uppercase text-white tracking-tighter">PREFEITURA DE TATUÍ</h3>
              <p className="text-gray-500 font-medium italic mt-2">Segunda e Quarta • 19:00h</p>
            </div>
            <MapPin className="text-[#fdf001] w-10 h-10" />
          </div>
          <div className="space-y-4 mb-10 text-gray-400 font-light italic">
            <p className="flex items-center gap-3"><CheckCircle2 size={16} className="text-[#fdf001]" /> Suporte completo de hidratação</p>
            <p className="flex items-center gap-3"><CheckCircle2 size={16} className="text-[#fdf001]" /> Treino em grupo (Squad)</p>
            <p className="flex items-center gap-3"><CheckCircle2 size={16} className="text-[#fdf001]" /> Orientação técnica presencial</p>
          </div>
          <button className="w-full py-5 rounded-2xl bg-[#fdf001] text-black font-black uppercase tracking-widest hover:bg-white transition-all">VER NO MAPA</button>
        </div>

        <div className="glass p-12 rounded-[4rem] border border-white/5 relative group hover:-translate-y-2 transition-all">
          <div className="flex justify-between items-start mb-12">
            <div>
              <div className="bg-[#fdf001] text-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block">PERÍODO MANHÃ</div>
              <h3 className="text-4xl font-black italic uppercase text-white tracking-tighter">ZILAH DE AQUINO</h3>
              <p className="text-gray-500 font-medium italic mt-2">Terça e Quinta • 06:00h às 07:30h</p>
            </div>
            <MapPin className="text-[#fdf001] w-10 h-10" />
          </div>
          <div className="space-y-4 mb-10 text-gray-400 font-light italic">
            <p className="flex items-center gap-3"><CheckCircle2 size={16} className="text-[#fdf001]" /> Foco em técnica de corrida</p>
            <p className="flex items-center gap-3"><CheckCircle2 size={16} className="text-[#fdf001]" /> Rodagens monitoradas</p>
            <p className="flex items-center gap-3"><CheckCircle2 size={16} className="text-[#fdf001]" /> Preparação para provas</p>
          </div>
          <button className="w-full py-5 rounded-2xl bg-[#fdf001] text-black font-black uppercase tracking-widest hover:bg-white transition-all">VER NO MAPA</button>
        </div>
      </div>
    </div>
  </section>
);

const Contact = () => (
  <section id="contato" className="py-32 bg-black relative overflow-hidden">
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute inset-0 grid-lines opacity-20" />
      <div className="hero-orb w-72 h-72 -bottom-24 -left-16" />
    </div>
    <div className="container mx-auto px-4 md:px-8">
      <div className="grid lg:grid-cols-2 gap-24">
        <div>
          <h2 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter text-white mb-10 leading-none">CONTATO.</h2>
          <div className="space-y-10">
            <div className="flex gap-8 p-10 glass rounded-[3rem] border border-white/5">
              <div className="bg-[#fdf001] p-4 rounded-2xl h-fit"><MapPin className="text-black" /></div>
              <div>
                <h4 className="text-xl font-black italic uppercase text-[#fdf001] mb-2 tracking-widest">LOCALIZAÇÃO</h4>
                <p className="text-white text-lg font-light italic">R. Prof. Adauto Pereira, 307. Tatuí, SP</p>
              </div>
            </div>
            <div className="flex gap-8 p-10 glass rounded-[3rem] border border-white/5">
              <div className="bg-[#fdf001] p-4 rounded-2xl h-fit"><Phone className="text-black" /></div>
              <div>
                <h4 className="text-xl font-black italic uppercase text-[#fdf001] mb-2 tracking-widest">WHATSAPP</h4>
                <p className="text-white text-lg font-light italic">015-99715-0805</p>
              </div>
            </div>
            <div className="flex gap-8 p-10 glass rounded-[3rem] border border-white/5">
              <div className="bg-[#fdf001] p-4 rounded-2xl h-fit"><Mail className="text-black" /></div>
              <div>
                <h4 className="text-xl font-black italic uppercase text-[#fdf001] mb-2 tracking-widest">E-MAIL</h4>
                <p className="text-white text-lg font-light italic">contratemporunning@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
        <div className="glass p-12 md:p-16 rounded-[4rem] border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-[#fdf001]" />
          <h3 className="text-4xl font-black italic uppercase text-white mb-10 tracking-tighter">ENVIE UMA MENSAGEM</h3>
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <input type="text" placeholder="Nome *" className="w-full bg-white/5 border border-white/10 p-6 rounded-2xl outline-none focus:border-[#fdf001] text-white font-bold" />
              <input type="email" placeholder="Email *" className="w-full bg-white/5 border border-white/10 p-6 rounded-2xl outline-none focus:border-[#fdf001] text-white font-bold" />
            </div>
            <textarea placeholder="Mensagem *" rows={5} className="w-full bg-white/5 border border-white/10 p-6 rounded-2xl outline-none focus:border-[#fdf001] text-white font-bold resize-none" />
            <button className="w-full bg-[#fdf001] text-black py-6 rounded-2xl font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-[#fdf001]/20">ENVIAR AGORA</button>
          </form>
          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            <a href="https://wa.me/5515997150805" target="_blank" rel="noreferrer" className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 font-black uppercase tracking-widest text-xs text-white hover:border-[#fdf001]/50 hover:text-[#fdf001] transition-all text-center">
              WhatsApp Direto
            </a>
            <a href="mailto:contratemporunning@gmail.com" className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 font-black uppercase tracking-widest text-xs text-white hover:border-[#fdf001]/50 hover:text-[#fdf001] transition-all text-center">
              Enviar E-mail
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="py-20 bg-black border-t border-white/5">
    <div className="container mx-auto px-4 md:px-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="flex items-center space-x-3">
          <img src="./img/logo-contra-tempo.png" alt="Contra Tempo Logo" className="h-12 w-auto" />
        </div>
        <div className="flex gap-4">
          {[
            { icon: Facebook, label: 'Facebook', href: '#' },
            { icon: Twitter, label: 'Twitter', href: '#' },
            { icon: Instagram, label: 'Instagram', href: '#' },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="bg-white/5 border border-white/10 p-3 rounded-xl text-gray-400 hover:text-black hover:bg-[#fdf001] transition-all"
              aria-label={item.label}
            >
              <item.icon size={18} />
            </a>
          ))}
        </div>
        <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="bg-white/5 p-4 rounded-xl text-white hover:bg-[#fdf001] hover:text-black transition-all">
          <ChevronUp />
        </button>
      </div>
      <div className="mt-20 pt-10 border-t border-white/5 text-center text-[9px] font-bold text-gray-700 uppercase tracking-widest">
        © 2025 CONTRA TEMPO RUNNING. ORGULHOSAMENTE CRIADO PELA EQUIPE DE PERFORMANCE.
      </div>
    </div>
  </footer>
);

// --- DASHBOARDS ---

const buildWeeklySeries = (activities: ActivityEntry[]) => {
  const labels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
  const series: { label: string; value: number }[] = [];

  for (let i = 6; i >= 0; i -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const key = date.toISOString().slice(0, 10);
    const value = activities
      .filter((a) => a.date === key)
      .reduce((sum, a) => sum + (Number(a.distanceKm) || 0), 0);
    series.push({ label: labels[date.getDay()], value });
  }

  return series;
};

const formatPace = (minutesPerKm: number) => {
  if (!Number.isFinite(minutesPerKm) || minutesPerKm <= 0) return '0:00';
  const minutes = Math.floor(minutesPerKm);
  const seconds = Math.round((minutesPerKm - minutes) * 60);
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
};

const getAveragePace = (activities: ActivityEntry[], days: number) => {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  const recent = activities.filter((a) => new Date(a.date).getTime() >= cutoff);
  const totals = recent.reduce(
    (acc, a) => {
      const distance = Number(a.distanceKm) || 0;
      const time = Number(a.timeMin) || 0;
      return { distance: acc.distance + distance, time: acc.time + time };
    },
    { distance: 0, time: 0 }
  );

  if (totals.distance === 0) return '0:00';
  return formatPace(totals.time / totals.distance);
};

const getRecentActivitiesCount = (activities: ActivityEntry[], days: number) => {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return activities.filter((a) => new Date(a.date).getTime() >= cutoff).length;
};

const AthleteDashboard = ({ user, onLogout }: { user: UserType; onLogout: () => void }) => {
  const [activeTab, setActiveTab] = useState('performance');
  const [athleteData, setAthleteData] = useState<AthleteData | null>(null);
  const [plans, setPlans] = useState<TrainingPlan[]>([]);
  const [activityForm, setActivityForm] = useState({
    date: '',
    type: 'Corrida',
    distanceKm: '',
    timeMin: '',
    pace: '',
    notes: '',
  });
  const [metricsForm, setMetricsForm] = useState({
    date: '',
    sleepHours: '',
    hrv: '',
    weightKg: '',
    recoveryPct: '',
  });
  const [prForm, setPrForm] = useState({ dist: '', time: '', pace: '', date: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    refreshAthlete();
  }, [user.id]);

  const refreshAthlete = () => {
    setAthleteData(DataManager.ensureAthleteData(user.id));
    setPlans(DataManager.getPlans());
  };

  const plan = athleteData?.planId ? plans.find((p) => p.id === athleteData.planId) : null;
  const weeklyVolume = athleteData ? DataManager.getWeeklyVolume(athleteData.activities, 7) : 0;
  const latestMetrics = athleteData ? DataManager.getLatestMetrics(athleteData.metrics) : null;
  const weeklySeries = athleteData ? buildWeeklySeries(athleteData.activities) : [];
  const avgPace = athleteData ? getAveragePace(athleteData.activities, 7) : '0:00';

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!activityForm.date || !activityForm.distanceKm || !activityForm.timeMin) {
      setError('Preencha data, distancia e tempo.');
      return;
    }
    DataManager.addActivity(user.id, {
      date: activityForm.date,
      type: activityForm.type,
      distanceKm: Number(activityForm.distanceKm) || 0,
      timeMin: Number(activityForm.timeMin) || 0,
      pace: activityForm.pace,
      notes: activityForm.notes,
    });
    setActivityForm({ date: '', type: 'Corrida', distanceKm: '', timeMin: '', pace: '', notes: '' });
    refreshAthlete();
  };

  const handleAddMetrics = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!metricsForm.date) {
      setError('Informe a data das metricas.');
      return;
    }
    DataManager.addMetrics(user.id, {
      date: metricsForm.date,
      sleepHours: Number(metricsForm.sleepHours) || 0,
      hrv: Number(metricsForm.hrv) || 0,
      weightKg: Number(metricsForm.weightKg) || 0,
      recoveryPct: Number(metricsForm.recoveryPct) || 0,
    });
    setMetricsForm({ date: '', sleepHours: '', hrv: '', weightKg: '', recoveryPct: '' });
    refreshAthlete();
  };

  const handleAddPr = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prForm.dist || !prForm.time) {
      setError('Informe distancia e tempo do PR.');
      return;
    }
    const next = athleteData ? [...athleteData.prs, prForm] : [prForm];
    if (athleteData) {
      DataManager.updateAthleteData(user.id, { prs: next });
      setPrForm({ dist: '', time: '', pace: '', date: '' });
      refreshAthlete();
    }
  };

  const prefillWorkout = (workout: TrainingPlan['workouts'][0]) => {
    setActivityForm({
      date: new Date().toISOString().slice(0, 10),
      type: workout.type || 'Corrida',
      distanceKm: workout.distanceKm ? String(workout.distanceKm) : '',
      timeMin: workout.durationMin ? String(workout.durationMin) : '',
      pace: workout.pace || '',
      notes: workout.notes || '',
    });
    setActiveTab('planilha');
  };

  return (
    <div className="flex flex-col lg:flex-row bg-[#020202] min-h-screen">
      <div className="hidden lg:flex w-72 bg-black border-r border-white/5 flex-col p-8 fixed h-full z-[100]">
        <div className="flex items-center gap-4 mb-16 p-2">
          <div className="bg-[#fdf001] p-2 rounded-xl"><Timer className="w-8 h-8 text-black" /></div>
          <span className="text-2xl font-black italic text-white uppercase tracking-tighter">CT<span className="text-[#fdf001]">DASH</span></span>
        </div>
        <nav className="flex-1 space-y-4">
          {[
            { id: 'performance', name: 'Painel Geral', icon: LayoutDashboard },
            { id: 'planilha', name: 'Meus Treinos', icon: ClipboardList },
            { id: 'saude', name: 'Saude & Recovery', icon: HeartPulse },
            { id: 'records', name: 'Records', icon: Award },
          ].map((link) => (
            <button key={link.id} onClick={() => setActiveTab(link.id)} className={`w-full flex items-center gap-4 p-5 rounded-2xl transition-all group ${activeTab === link.id ? 'bg-[#fdf001] text-black shadow-xl shadow-[#fdf001]/20' : 'text-gray-500 hover:bg-white/5 hover:text-white'}`}>
              <link.icon size={22} className="shrink-0" />
              <span className="font-black italic uppercase text-[10px] tracking-widest">{link.name}</span>
            </button>
          ))}
        </nav>
        <button onClick={onLogout} className="mt-auto flex items-center gap-4 p-5 rounded-2xl text-red-500/50 hover:bg-red-500/10 hover:text-red-500 transition-all font-black uppercase text-[10px] tracking-widest">
          <LogOut size={20} /> Encerrar Sessao
        </button>
      </div>

      <main className="flex-1 lg:ml-72 p-4 md:p-12 pb-32 pt-16">
        <header className="mb-16">
          <div className="text-[#fdf001] text-[10px] font-black uppercase tracking-[0.5em] mb-4 flex items-center gap-2">
            <Rocket size={14} /> Atleta Squad Ativo
          </div>
          <h2 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter text-white leading-[0.8]">
            DOMINE O <br /><span className="text-[#fdf001]">{user.name}</span>
          </h2>
        </header>

        {activeTab === 'performance' && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Volume Semana', value: `${weeklyVolume.toFixed(1)}km`, icon: Activity, detail: plan ? `Meta: ${plan.weeklyTargetKm}km` : 'Sem meta' },
                { label: 'Pace Medio', value: avgPace, icon: Zap, detail: 'Media 7 dias' },
                { label: 'Treinos 7D', value: athleteData ? getRecentActivitiesCount(athleteData.activities, 7).toString() : '0', icon: Calendar, detail: 'Total 7 dias' },
                { label: 'VDOT Atual', value: athleteData ? athleteData.vdot.toFixed(1) : '0.0', icon: TrendingUp, detail: plan ? plan.name : 'Sem planilha' },
              ].map((s, i) => (
                <div key={i} className="glass p-8 rounded-[2.5rem] border-t border-white/5 relative overflow-hidden group">
                  <s.icon size={20} className="text-[#fdf001] mb-6" />
                  <div className="text-4xl font-black italic text-white uppercase tracking-tighter mb-1">{s.value}</div>
                  <div className="text-[10px] font-black uppercase text-gray-500 tracking-widest">{s.label}</div>
                  <div className="text-[9px] font-bold text-[#fdf001]/50 mt-4 uppercase tracking-widest">{s.detail}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 glass rounded-[4rem] p-10 md:p-16 border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-[#fdf001] shadow-[0_0_15px_#fdf001]" />
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <h3 className="text-4xl font-black italic uppercase text-white tracking-tighter">Proximo Treino</h3>
                    <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mt-1">Planilha atribuida</p>
                  </div>
                  <div className="bg-[#fdf001] text-black px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em]">{plan ? plan.level : 'Sem planilha'}</div>
                </div>

                {plan && plan.workouts.length > 0 ? (
                  <div className="space-y-6">
                    {plan.workouts.slice(0, 3).map((workout) => (
                      <div key={workout.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <div className="text-[9px] font-black uppercase text-gray-600 mb-1">{workout.day}</div>
                          <div className="text-2xl font-black italic text-white">{workout.title}</div>
                          <div className="text-sm text-gray-500 mt-2">{workout.type} ? {workout.distanceKm}km ? {workout.durationMin}min ? {workout.pace}</div>
                        </div>
                        <button onClick={() => prefillWorkout(workout)} className="bg-[#fdf001] text-black px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all">Registrar</button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 font-bold">Sem treinos cadastrados.</div>
                )}
              </div>

              <div className="glass p-10 rounded-[3.5rem] flex flex-col justify-between border border-white/5 bg-gradient-to-br from-[#fdf001]/10 to-transparent">
                <div>
                  <h4 className="text-[10px] font-black uppercase text-[#fdf001] tracking-[0.3em] mb-10 flex items-center gap-2">
                    <Award size={14} /> PRs Cadastrados
                  </h4>
                  <div className="space-y-8">
                    {(athleteData?.prs.length ? athleteData.prs : []).map((pr, i) => (
                      <div key={i} className="flex justify-between items-end border-b border-white/5 pb-6">
                        <div>
                          <div className="text-[9px] font-black text-gray-600 uppercase mb-1">{pr.dist}</div>
                          <div className="text-2xl font-black italic text-white leading-none tracking-tighter">{pr.time}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[9px] font-black text-gray-600 uppercase mb-1">Data</div>
                          <div className="text-sm font-black italic text-gray-400 uppercase leading-none">{pr.date || '-'}</div>
                        </div>
                      </div>
                    ))}
                    {!athleteData?.prs.length && <div className="text-gray-500 text-sm">Sem PRs cadastrados.</div>}
                  </div>
                </div>
                <div className="mt-10">
                  <button onClick={() => setActiveTab('records')} className="w-full py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase text-[10px] tracking-widest hover:bg-white hover:text-black transition-all">Cadastrar PR</button>
                </div>
              </div>
            </div>

            <div className="glass p-10 rounded-[3rem] border border-white/5">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-2xl font-black italic uppercase text-white">Volume Semanal</h4>
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">Ultimos 7 dias</div>
              </div>
              <div className="grid grid-cols-7 gap-3">
                {weeklySeries.map((day) => (
                  <div key={day.label} className="text-center">
                    <div className="h-32 bg-white/5 rounded-xl flex items-end">
                      <div className="w-full bg-[#fdf001] rounded-xl" style={{ height: `${Math.min(100, day.value * 6)}%` }} />
                    </div>
                    <div className="text-[9px] font-black uppercase text-gray-500 mt-2">{day.label}</div>
                    <div className="text-[9px] font-black uppercase text-gray-700">{day.value.toFixed(1)}km</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'planilha' && (
          <div className="space-y-10">
            <div className="glass p-10 rounded-[3rem] border border-white/5">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
                <div>
                  <h3 className="text-3xl font-black italic uppercase text-white">Minha Planilha</h3>
                  <p className="text-gray-500 text-sm">{plan ? plan.name : 'Nenhuma planilha atribuida.'}</p>
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-[#fdf001]">{plan ? plan.level : 'Sem nivel'}</div>
              </div>

              {plan ? (
                <div className="space-y-4">
                  {plan.workouts.map((workout) => (
                    <div key={workout.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <div className="text-[9px] font-black uppercase text-gray-600">{workout.day}</div>
                        <div className="text-2xl font-black italic text-white">{workout.title}</div>
                        <div className="text-sm text-gray-500 mt-2">{workout.type} ? {workout.distanceKm}km ? {workout.durationMin}min ? {workout.pace}</div>
                      </div>
                      <button onClick={() => prefillWorkout(workout)} className="bg-[#fdf001] text-black px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all">Registrar</button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 font-bold">Nenhuma planilha definida pelo coach.</div>
              )}
            </div>

            <div className="glass p-10 rounded-[3rem] border border-white/5">
              <h4 className="text-2xl font-black italic uppercase text-white mb-6">Registrar Atividade</h4>
              <form onSubmit={handleAddActivity} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <input type="date" value={activityForm.date} onChange={(e) => setActivityForm({ ...activityForm, date: e.target.value })} className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white font-bold" />
                  <input type="text" value={activityForm.type} onChange={(e) => setActivityForm({ ...activityForm, type: e.target.value })} placeholder="Tipo" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white font-bold" />
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  <input type="number" value={activityForm.distanceKm} onChange={(e) => setActivityForm({ ...activityForm, distanceKm: e.target.value })} placeholder="Distancia (km)" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white font-bold" />
                  <input type="number" value={activityForm.timeMin} onChange={(e) => setActivityForm({ ...activityForm, timeMin: e.target.value })} placeholder="Tempo (min)" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white font-bold" />
                  <input type="text" value={activityForm.pace} onChange={(e) => setActivityForm({ ...activityForm, pace: e.target.value })} placeholder="Pace" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white font-bold" />
                </div>
                <textarea value={activityForm.notes} onChange={(e) => setActivityForm({ ...activityForm, notes: e.target.value })} placeholder="Observacoes" rows={3} className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white font-bold" />
                {error && <div className="text-red-400 text-sm font-bold">{error}</div>}
                <button className="w-full bg-[#fdf001] text-black py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-white transition-all">Salvar Atividade</button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'saude' && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Sono (h)', value: latestMetrics ? String(latestMetrics.sleepHours) : '-', icon: Sun, color: 'text-blue-400' },
                { label: 'HRV', value: latestMetrics ? String(latestMetrics.hrv) : '-', icon: Heart, color: 'text-red-400' },
                { label: 'Peso (kg)', value: latestMetrics ? String(latestMetrics.weightKg) : '-', icon: Weight, color: 'text-gray-400' },
                { label: 'Recovery', value: latestMetrics ? `${latestMetrics.recoveryPct}%` : '-', icon: Battery, color: 'text-green-400' },
              ].map((s, i) => (
                <div key={i} className="glass p-8 rounded-[2.5rem] border border-white/5 text-center">
                  <s.icon size={24} className={`${s.color} mx-auto mb-4`} />
                  <div className="text-2xl font-black italic text-white mb-1">{s.value}</div>
                  <div className="text-[9px] font-black uppercase text-gray-500 tracking-widest">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="glass p-10 rounded-[3rem] border border-white/5">
              <h4 className="text-2xl font-black italic uppercase text-white mb-6">Registrar Metricas</h4>
              <form onSubmit={handleAddMetrics} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <input type="date" value={metricsForm.date} onChange={(e) => setMetricsForm({ ...metricsForm, date: e.target.value })} className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white font-bold" />
                  <input type="number" value={metricsForm.sleepHours} onChange={(e) => setMetricsForm({ ...metricsForm, sleepHours: e.target.value })} placeholder="Sono (h)" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white font-bold" />
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  <input type="number" value={metricsForm.hrv} onChange={(e) => setMetricsForm({ ...metricsForm, hrv: e.target.value })} placeholder="HRV" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white font-bold" />
                  <input type="number" value={metricsForm.weightKg} onChange={(e) => setMetricsForm({ ...metricsForm, weightKg: e.target.value })} placeholder="Peso (kg)" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white font-bold" />
                  <input type="number" value={metricsForm.recoveryPct} onChange={(e) => setMetricsForm({ ...metricsForm, recoveryPct: e.target.value })} placeholder="Recovery (%)" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white font-bold" />
                </div>
                {error && <div className="text-red-400 text-sm font-bold">{error}</div>}
                <button className="w-full bg-[#fdf001] text-black py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-white transition-all">Salvar Metricas</button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'records' && (
          <div className="space-y-10">
            <div className="glass p-10 rounded-[3rem] border border-white/5">
              <h4 className="text-2xl font-black italic uppercase text-white mb-6">Cadastrar PR</h4>
              <form onSubmit={handleAddPr} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <input type="text" value={prForm.dist} onChange={(e) => setPrForm({ ...prForm, dist: e.target.value })} placeholder="Distancia" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white font-bold" />
                  <input type="text" value={prForm.time} onChange={(e) => setPrForm({ ...prForm, time: e.target.value })} placeholder="Tempo" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white font-bold" />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <input type="text" value={prForm.pace} onChange={(e) => setPrForm({ ...prForm, pace: e.target.value })} placeholder="Pace" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white font-bold" />
                  <input type="text" value={prForm.date} onChange={(e) => setPrForm({ ...prForm, date: e.target.value })} placeholder="Data" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white font-bold" />
                </div>
                {error && <div className="text-red-400 text-sm font-bold">{error}</div>}
                <button className="w-full bg-[#fdf001] text-black py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-white transition-all">Salvar PR</button>
              </form>
            </div>

            <div className="glass p-10 rounded-[3rem] border border-white/5">
              <h4 className="text-2xl font-black italic uppercase text-white mb-6">Historico de PRs</h4>
              <div className="space-y-4">
                {(athleteData?.prs || []).map((pr, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex justify-between items-center">
                    <div>
                      <div className="text-[9px] font-black uppercase text-gray-600">{pr.dist}</div>
                      <div className="text-2xl font-black italic text-white">{pr.time}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-black uppercase text-gray-600">{pr.pace || '-'}</div>
                      <div className="text-[10px] font-black uppercase text-gray-500">{pr.date || '-'}</div>
                    </div>
                  </div>
                ))}
                {!athleteData?.prs.length && <div className="text-gray-500">Nenhum PR cadastrado.</div>}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const Battery = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="16" height="10" x="2" y="7" rx="2" ry="2"/><line x1="22" x2="22" y1="11" y2="13"/>
  </svg>
);

const ProfessorDashboard = ({ user, onLogout }: { user: UserType; onLogout: () => void }) => {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('squad');
  const [filter, setFilter] = useState('Todos');
  const [showAddAthlete, setShowAddAthlete] = useState(false);
  const [showEditAthlete, setShowEditAthlete] = useState(false);
  const [showDeleteAthlete, setShowDeleteAthlete] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [selectedAthlete, setSelectedAthlete] = useState<UserType | null>(null);
  const [newAthlete, setNewAthlete] = useState({ username: '', password: '', name: '', email: '', phone: '' });
  const [editAthlete, setEditAthlete] = useState({ name: '', username: '', password: '', email: '', phone: '', vdot: '0', planId: '' });
  const [athletesList, setAthletesList] = useState<UserType[]>([]);
  const [athletesData, setAthletesData] = useState<AthleteData[]>([]);
  const [plans, setPlans] = useState<TrainingPlan[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [planForm, setPlanForm] = useState({ name: '', level: '', goal: '', weeklyTargetKm: '', notes: '' });
  const [workoutForm, setWorkoutForm] = useState({ title: '', day: '', type: '', distanceKm: '', durationMin: '', pace: '', notes: '' });
  const [planWorkouts, setPlanWorkouts] = useState<TrainingPlan['workouts']>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = () => {
    const allAthletes = DataManager.getAthletes();
    const allData = allAthletes.map((athlete) => DataManager.ensureAthleteData(athlete.id));
    setAthletesList(allAthletes);
    setAthletesData(allData);
    setPlans(DataManager.getPlans());
    setAlerts(DataManager.getAlerts());
  };

  const handleAddAthlete = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!newAthlete.username || !newAthlete.password || !newAthlete.name) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }

    const existing = DataManager.getUsers().find(u => u.username === newAthlete.username);
    if (existing) {
      setError('Nome de usuário já existe');
      return;
    }

    try {
      DataManager.registerAthlete(
        newAthlete.username,
        newAthlete.password,
        newAthlete.name,
        newAthlete.email,
        newAthlete.phone
      );
      
      setNewAthlete({ username: '', password: '', name: '', email: '', phone: '' });
      setShowAddAthlete(false);
      loadAll();
    } catch (err) {
      setError('Erro ao cadastrar atleta');
    }
  };

  const openEditAthlete = (athlete: UserType) => {
    const data = DataManager.ensureAthleteData(athlete.id);
    setSelectedAthlete(athlete);
    setEditAthlete({
      name: athlete.name,
      username: athlete.username,
      password: athlete.password,
      email: athlete.email || '',
      phone: athlete.phone || '',
      vdot: String(data.vdot || 0),
      planId: data.planId || '',
    });
    setShowEditAthlete(true);
  };

  const handleUpdateAthlete = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAthlete) return;

    DataManager.updateUser(selectedAthlete.id, {
      name: editAthlete.name,
      username: editAthlete.username,
      password: editAthlete.password,
      email: editAthlete.email,
      phone: editAthlete.phone,
    });

    DataManager.updateAthleteData(selectedAthlete.id, {
      vdot: Number(editAthlete.vdot) || 0,
      planId: editAthlete.planId || null,
    });

    setShowEditAthlete(false);
    setSelectedAthlete(null);
    loadAll();
  };

  const handleDeleteAthlete = () => {
    if (!selectedAthlete) return;
    DataManager.deleteUser(selectedAthlete.id);
    setShowDeleteAthlete(false);
    setSelectedAthlete(null);
    loadAll();
  };

  const openNewPlan = () => {
    setEditingPlanId(null);
    setPlanForm({ name: '', level: '', goal: '', weeklyTargetKm: '', notes: '' });
    setWorkoutForm({ title: '', day: '', type: '', distanceKm: '', durationMin: '', pace: '', notes: '' });
    setPlanWorkouts([]);
    setShowPlanModal(true);
  };

  const openEditPlan = (plan: TrainingPlan) => {
    setEditingPlanId(plan.id);
    setPlanForm({
      name: plan.name,
      level: plan.level,
      goal: plan.goal,
      weeklyTargetKm: String(plan.weeklyTargetKm),
      notes: plan.notes,
    });
    setPlanWorkouts(plan.workouts || []);
    setShowPlanModal(true);
  };

  const addWorkout = () => {
    if (!workoutForm.title) return;
    const workout = {
      id: `workout_${Date.now()}`,
      title: workoutForm.title,
      day: workoutForm.day,
      type: workoutForm.type,
      distanceKm: Number(workoutForm.distanceKm) || 0,
      durationMin: Number(workoutForm.durationMin) || 0,
      pace: workoutForm.pace,
      notes: workoutForm.notes,
    };
    setPlanWorkouts([...planWorkouts, workout]);
    setWorkoutForm({ title: '', day: '', type: '', distanceKm: '', durationMin: '', pace: '', notes: '' });
  };

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!planForm.name) {
      setError('Informe o nome da planilha');
      return;
    }

    const payload = {
      name: planForm.name,
      level: planForm.level,
      goal: planForm.goal,
      weeklyTargetKm: Number(planForm.weeklyTargetKm) || 0,
      notes: planForm.notes,
      workouts: planWorkouts,
    };

    if (editingPlanId) {
      DataManager.updatePlan(editingPlanId, payload);
    } else {
      DataManager.createPlan(payload);
    }

    setShowPlanModal(false);
    setEditingPlanId(null);
    loadAll();
  };

  const filteredAthletes = athletesList.filter((athlete) => {
    const data = athletesData.find((d) => d.userId === athlete.id) || DataManager.ensureAthleteData(athlete.id);
    const matchesSearch =
      athlete.name.toLowerCase().includes(search.toLowerCase()) ||
      athlete.username.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === 'Elite') return data.vdot >= 50;
    if (filter === 'Risco') return alerts.some((a) => a.athleteId === athlete.id && !a.resolvedAt);
    if (filter === 'Inativo') return DataManager.getWeeklyVolume(data.activities, 7) === 0;
    return true;
  });

  const active24h = athletesData.filter((data) => DataManager.getWeeklyVolume(data.activities, 1) > 0).length;
  const riskCount = alerts.filter((a) => !a.resolvedAt).length;
  const avgWeekly = athletesData.length
    ? athletesData.reduce((sum, data) => sum + DataManager.getWeeklyVolume(data.activities, 7), 0) / athletesData.length
    : 0;
  const planById = Object.fromEntries(plans.map((plan) => [plan.id, plan]));

  return (
    <div className="flex bg-[#050505] min-h-screen">
      <div className="hidden lg:flex w-72 bg-black border-r border-white/5 flex-col p-8 fixed h-full z-[100]">
        <div className="flex items-center gap-4 mb-16 p-2">
           <div className="bg-[#fdf001] p-2 rounded-xl shadow-lg shadow-[#fdf001]/20"><ShieldCheck className="w-8 h-8 text-black" /></div>
           <span className="text-2xl font-black italic text-white uppercase tracking-tighter">COACH<span className="text-[#fdf001]">PRO</span></span>
        </div>
        <nav className="flex-1 space-y-3">
          {[
            { id: 'squad', name: 'Gestao Squad', icon: Users },
            { id: 'plans', name: 'Planilhas', icon: ClipboardList },
            { id: 'reports', name: 'Relatorios', icon: PieChart },
            { id: 'alerts', name: 'Alertas', icon: ShieldAlert },
          ].map((link) => (
            <button key={link.id} onClick={() => setActiveTab(link.id)} className={`w-full flex items-center gap-4 p-5 rounded-2xl transition-all ${activeTab === link.id ? 'bg-[#fdf001] text-black shadow-lg shadow-[#fdf001]/20' : 'text-gray-500 hover:bg-white/5 hover:text-white'}`}>
              <link.icon size={22} className="shrink-0" />
              <span className="font-black italic uppercase text-[10px] tracking-widest">{link.name}</span>
            </button>
          ))}
        </nav>
        <button onClick={onLogout} className="mt-auto flex items-center gap-4 p-5 rounded-2xl text-red-500/50 hover:bg-red-500/10 hover:text-red-500 transition-all font-black uppercase text-[10px] tracking-widest">
           <LogOut size={20} /> Logout
        </button>
      </div>

      <main className="flex-1 lg:ml-72 p-4 md:p-12 pt-20">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
           <div>
              <div className="text-[#fdf001] text-[10px] font-black uppercase tracking-[0.4em] mb-2">Comando Geral Contra Tempo</div>
              <h2 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter text-white leading-none">HEAD <span className="text-[#fdf001]">COACH</span></h2>
           </div>
           {activeTab === 'squad' && (
             <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
               <div className="relative">
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                 <input 
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
                   placeholder="Buscar atleta no squad..." 
                   className="bg-white/5 border border-white/10 rounded-2xl px-14 py-4 text-white font-bold outline-none focus:border-[#fdf001] transition-all w-full md:w-80"
                 />
               </div>
               <button 
                 onClick={() => setShowAddAthlete(true)}
                 className="bg-[#fdf001] text-black px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#fdf001]/30 flex items-center justify-center gap-3 hover:bg-white transition-all"
               >
                 <Plus size={16} /> ADICIONAR ATLETA
               </button>
             </div>
           )}
           {activeTab === 'plans' && (
             <button
               onClick={openNewPlan}
               className="bg-[#fdf001] text-black px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#fdf001]/30 flex items-center justify-center gap-3 hover:bg-white transition-all"
             >
               <Plus size={16} /> NOVA PLANILHA
             </button>
           )}
        </header>

        {/* Modal de Adicionar Atleta */}
        {showAddAthlete && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 backdrop-blur-3xl bg-black/95">
            <div className="glass w-full max-w-2xl p-8 md:p-12 rounded-[4rem] relative border border-[#fdf001]/10 shadow-[0_0_100px_rgba(253,240,1,0.1)]">
              <button onClick={() => {setShowAddAthlete(false); setError('');}} className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors">
                <X size={32} />
              </button>
              
              <div className="text-center mb-8">
                <div className="bg-[#fdf001] w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Plus size={40} className="text-black" />
                </div>
                <h3 className="text-3xl font-black italic uppercase text-white tracking-tighter">
                  CADASTRAR NOVO <span className="text-[#fdf001]">ATLETA</span>
                </h3>
              </div>

              <form onSubmit={handleAddAthlete} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Nome Completo *</label>
                    <input
                      type="text"
                      value={newAthlete.name}
                      onChange={(e) => setNewAthlete({...newAthlete, name: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-[#fdf001] transition-all"
                      placeholder="Ex: João Silva"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Usuário *</label>
                    <input
                      type="text"
                      value={newAthlete.username}
                      onChange={(e) => setNewAthlete({...newAthlete, username: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-[#fdf001] transition-all"
                      placeholder="Ex: joao.silva"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Senha *</label>
                  <input
                    type="text"
                    value={newAthlete.password}
                    onChange={(e) => setNewAthlete({...newAthlete, password: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-[#fdf001] transition-all"
                    placeholder="Senha para o atleta"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">E-mail</label>
                    <input
                      type="email"
                      value={newAthlete.email}
                      onChange={(e) => setNewAthlete({...newAthlete, email: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-[#fdf001] transition-all"
                      placeholder="email@exemplo.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Telefone</label>
                    <input
                      type="tel"
                      value={newAthlete.phone}
                      onChange={(e) => setNewAthlete({...newAthlete, phone: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-[#fdf001] transition-all"
                      placeholder="(15) 99999-9999"
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-red-400 text-sm font-bold text-center">
                    {error}
                  </div>
                )}

                <div className="flex gap-4">
                  <button 
                    type="button"
                    onClick={() => {setShowAddAthlete(false); setError('');}}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-wider py-5 rounded-2xl transition-all"
                  >
                    CANCELAR
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-[#fdf001] hover:bg-white text-black font-black uppercase tracking-wider py-5 rounded-2xl transition-all"
                  >
                    CADASTRAR
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showEditAthlete && selectedAthlete && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 backdrop-blur-3xl bg-black/95">
            <div className="glass w-full max-w-2xl p-8 md:p-12 rounded-[4rem] relative border border-[#fdf001]/10 shadow-[0_0_100px_rgba(253,240,1,0.1)]">
              <button onClick={() => { setShowEditAthlete(false); setSelectedAthlete(null); }} className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors">
                <X size={32} />
              </button>
              <div className="text-center mb-8">
                <div className="bg-[#fdf001] w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <User size={36} className="text-black" />
                </div>
                <h3 className="text-3xl font-black italic uppercase text-white tracking-tighter">
                  EDITAR <span className="text-[#fdf001]">ATLETA</span>
                </h3>
              </div>
              <form onSubmit={handleUpdateAthlete} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <input type="text" value={editAthlete.name} onChange={(e) => setEditAthlete({ ...editAthlete, name: e.target.value })} placeholder="Nome" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold" />
                  <input type="text" value={editAthlete.username} onChange={(e) => setEditAthlete({ ...editAthlete, username: e.target.value })} placeholder="Usuario" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold" />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <input type="text" value={editAthlete.password} onChange={(e) => setEditAthlete({ ...editAthlete, password: e.target.value })} placeholder="Senha" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold" />
                  <input type="number" value={editAthlete.vdot} onChange={(e) => setEditAthlete({ ...editAthlete, vdot: e.target.value })} placeholder="VDOT" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold" />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <input type="email" value={editAthlete.email} onChange={(e) => setEditAthlete({ ...editAthlete, email: e.target.value })} placeholder="Email" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold" />
                  <input type="tel" value={editAthlete.phone} onChange={(e) => setEditAthlete({ ...editAthlete, phone: e.target.value })} placeholder="Telefone" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Planilha</label>
                  <select value={editAthlete.planId} onChange={(e) => setEditAthlete({ ...editAthlete, planId: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold">
                    <option value="">Sem planilha</option>
                    {plans.map((plan) => (
                      <option key={plan.id} value={plan.id}>{plan.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-4">
                  <button type="button" onClick={() => { setShowEditAthlete(false); setSelectedAthlete(null); }} className="flex-1 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-wider py-5 rounded-2xl transition-all">Cancelar</button>
                  <button type="submit" className="flex-1 bg-[#fdf001] hover:bg-white text-black font-black uppercase tracking-wider py-5 rounded-2xl transition-all">Salvar</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showDeleteAthlete && selectedAthlete && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 backdrop-blur-3xl bg-black/95">
            <div className="glass w-full max-w-lg p-8 md:p-10 rounded-[3rem] relative border border-red-500/20">
              <button onClick={() => { setShowDeleteAthlete(false); setSelectedAthlete(null); }} className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors">
                <X size={28} />
              </button>
              <div className="text-center space-y-6">
                <div className="text-2xl font-black italic text-white">Excluir atleta?</div>
                <div className="text-sm text-gray-500">Isso remove usuario, dados e alertas.</div>
                <div className="flex gap-4">
                  <button onClick={() => { setShowDeleteAthlete(false); setSelectedAthlete(null); }} className="flex-1 bg-white/5 text-white py-4 rounded-2xl font-black uppercase">Cancelar</button>
                  <button onClick={handleDeleteAthlete} className="flex-1 bg-red-500 text-white py-4 rounded-2xl font-black uppercase">Excluir</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showPlanModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 backdrop-blur-3xl bg-black/95">
            <div className="glass w-full max-w-3xl p-8 md:p-12 rounded-[4rem] relative border border-[#fdf001]/10 shadow-[0_0_100px_rgba(253,240,1,0.1)]">
              <button onClick={() => setShowPlanModal(false)} className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors">
                <X size={32} />
              </button>
              <div className="text-center mb-8">
                <div className="bg-[#fdf001] w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <ClipboardList size={36} className="text-black" />
                </div>
                <h3 className="text-3xl font-black italic uppercase text-white tracking-tighter">
                  {editingPlanId ? 'EDITAR' : 'NOVA'} <span className="text-[#fdf001]">PLANILHA</span>
                </h3>
              </div>

              <form onSubmit={handleSavePlan} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <input type="text" value={planForm.name} onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })} placeholder="Nome da planilha" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold" />
                  <input type="text" value={planForm.level} onChange={(e) => setPlanForm({ ...planForm, level: e.target.value })} placeholder="Nivel" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold" />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <input type="text" value={planForm.goal} onChange={(e) => setPlanForm({ ...planForm, goal: e.target.value })} placeholder="Objetivo" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold" />
                  <input type="number" value={planForm.weeklyTargetKm} onChange={(e) => setPlanForm({ ...planForm, weeklyTargetKm: e.target.value })} placeholder="Meta semanal (km)" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold" />
                </div>
                <textarea value={planForm.notes} onChange={(e) => setPlanForm({ ...planForm, notes: e.target.value })} placeholder="Observacoes" rows={2} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold" />

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                  <div className="text-xs font-black uppercase tracking-widest text-gray-500">Treinos</div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input type="text" value={workoutForm.title} onChange={(e) => setWorkoutForm({ ...workoutForm, title: e.target.value })} placeholder="Titulo" className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-white font-bold" />
                    <input type="text" value={workoutForm.day} onChange={(e) => setWorkoutForm({ ...workoutForm, day: e.target.value })} placeholder="Dia" className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-white font-bold" />
                    <input type="text" value={workoutForm.type} onChange={(e) => setWorkoutForm({ ...workoutForm, type: e.target.value })} placeholder="Tipo" className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-white font-bold" />
                    <input type="number" value={workoutForm.distanceKm} onChange={(e) => setWorkoutForm({ ...workoutForm, distanceKm: e.target.value })} placeholder="Distancia (km)" className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-white font-bold" />
                    <input type="number" value={workoutForm.durationMin} onChange={(e) => setWorkoutForm({ ...workoutForm, durationMin: e.target.value })} placeholder="Duracao (min)" className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-white font-bold" />
                    <input type="text" value={workoutForm.pace} onChange={(e) => setWorkoutForm({ ...workoutForm, pace: e.target.value })} placeholder="Pace" className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-white font-bold" />
                  </div>
                  <textarea value={workoutForm.notes} onChange={(e) => setWorkoutForm({ ...workoutForm, notes: e.target.value })} placeholder="Notas" rows={2} className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-white font-bold" />
                  <button type="button" onClick={addWorkout} className="bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:border-[#fdf001]/50">Adicionar treino</button>

                  <div className="space-y-2">
                    {planWorkouts.map((workout) => (
                      <div key={workout.id} className="flex items-center justify-between bg-black/40 border border-white/10 rounded-xl px-4 py-3">
                        <div className="text-sm text-white">{workout.title} · {workout.day}</div>
                        <button type="button" onClick={() => setPlanWorkouts(planWorkouts.filter((w) => w.id !== workout.id))} className="text-xs text-red-400 font-bold">Remover</button>
                      </div>
                    ))}
                    {!planWorkouts.length && <div className="text-xs text-gray-500">Sem treinos adicionados.</div>}
                  </div>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-red-400 text-sm font-bold text-center">
                    {error}
                  </div>
                )}

                <div className="flex gap-4">
                  <button type="button" onClick={() => setShowPlanModal(false)} className="flex-1 bg-white/5 text-white py-5 rounded-2xl font-black uppercase">Cancelar</button>
                  <button type="submit" className="flex-1 bg-[#fdf001] hover:bg-white text-black py-5 rounded-2xl font-black uppercase">Salvar</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'squad' && (
          <>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
           {[
             { label: 'Total Squad', value: athletesList.length.toString(), color: 'text-white' },
             { label: 'Ativos 24h', value: active24h.toString(), color: 'text-[#fdf001]' },
             { label: 'Risco', value: riskCount.toString(), color: 'text-red-500' },
             { label: 'Media Volume', value: `${avgWeekly.toFixed(1)}km`, color: 'text-green-500' },
           ].map((stat, i) => (
             <div key={i} className="glass p-8 rounded-[2.5rem] border-t border-white/5">
                <div className={`text-4xl font-black italic mb-1 tracking-tighter ${stat.color}`}>{stat.value}</div>
                <div className="text-[10px] font-black uppercase text-gray-600 tracking-widest">{stat.label}</div>
             </div>
           ))}
        </div>

        <div className="flex gap-2 bg-white/5 p-2 rounded-2xl w-fit mb-10">
          {['Todos', 'Elite', 'Risco', 'Inativo'].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${filter === item ? 'bg-[#fdf001] text-black' : 'text-gray-500 hover:text-[#fdf001]'}`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Seção de Atletas Cadastrados */}
        <div className="glass p-6 md:p-12 rounded-[4rem] border border-white/5 mb-12">
           <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
              <h3 className="text-3xl font-black italic uppercase text-white tracking-tighter">ATLETAS CADASTRADOS</h3>
              <div className="text-xs text-gray-500 font-bold">{filteredAthletes.length} atletas encontrados</div>
           </div>

           {filteredAthletes.length === 0 ? (
             <div className="text-center py-16">
               <Users size={64} className="text-gray-700 mx-auto mb-6" />
               <h4 className="text-xl font-black italic uppercase text-gray-600 tracking-tighter mb-2">NENHUM ATLETA CADASTRADO</h4>
               <p className="text-gray-700 text-sm font-bold">Clique em "ADICIONAR ATLETA" para começar</p>
             </div>
           ) : (
             <div className="grid md:grid-cols-2 gap-6">
               {filteredAthletes.map((athlete) => {
                 const data = athletesData.find((d) => d.userId === athlete.id) || DataManager.ensureAthleteData(athlete.id);
                 const planName = data.planId && planById[data.planId] ? planById[data.planId].name : 'Sem planilha';
                 const weeklyVolume = DataManager.getWeeklyVolume(data.activities, 7);
                 const hasAlert = alerts.some((alert) => alert.athleteId === athlete.id && !alert.resolvedAt);

                 return (
                   <div key={athlete.id} className="bg-white/5 p-6 rounded-[2.5rem] border border-white/10 hover:border-[#fdf001]/30 hover:bg-[#fdf001]/5 transition-all">
                     <div className="flex items-start justify-between mb-4">
                       <div className="flex items-center gap-4">
                         <div className="bg-[#fdf001] w-14 h-14 rounded-2xl flex items-center justify-center">
                           <User size={28} className="text-black" />
                         </div>
                         <div>
                           <h4 className="text-xl font-black italic uppercase text-white leading-none mb-1">{athlete.name}</h4>
                           <p className="text-gray-500 text-xs font-bold">@{athlete.username}</p>
                         </div>
                       </div>
                       <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${hasAlert ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-500'}`}>
                         {hasAlert ? 'Risco' : 'Ativo'}
                       </span>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/10">
                       <div>
                         <div className="text-[9px] font-black uppercase text-gray-600 mb-1">Planilha</div>
                         <div className="text-sm text-gray-400 font-bold truncate">{planName}</div>
                       </div>
                       <div>
                         <div className="text-[9px] font-black uppercase text-gray-600 mb-1">Volume 7D</div>
                         <div className="text-sm text-gray-400 font-bold">{weeklyVolume.toFixed(1)}km</div>
                       </div>
                     </div>

                     <div className="mt-6 pt-6 border-t border-white/10 flex gap-3">
                       <button onClick={() => openEditAthlete(athlete)} className="flex-1 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-wider py-3 rounded-2xl transition-all text-[10px]">Editar</button>
                       <button onClick={() => { setSelectedAthlete(athlete); setShowDeleteAthlete(true); }} className="flex-1 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white font-black uppercase tracking-wider py-3 rounded-2xl transition-all text-[10px]">Excluir</button>
                     </div>
                   </div>
                 );
               })}
             </div>
           )}
        </div>

                </>
        )}

        {activeTab === 'plans' && (
          <div className="grid md:grid-cols-2 gap-6">
            {plans.map((plan) => (
              <div key={plan.id} className="glass p-8 rounded-[2.5rem] border border-white/5">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="text-[9px] font-black uppercase text-gray-500">{plan.level}</div>
                    <div className="text-2xl font-black italic text-white">{plan.name}</div>
                    <div className="text-sm text-gray-500 mt-2">{plan.goal}</div>
                  </div>
                  <div className="text-[10px] font-black uppercase text-[#fdf001]">{plan.weeklyTargetKm}km/sem</div>
                </div>
                <div className="text-xs text-gray-500">Treinos: {plan.workouts.length}</div>
                <div className="mt-6 flex gap-3">
                  <button onClick={() => openEditPlan(plan)} className="flex-1 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-wider py-3 rounded-2xl transition-all text-[10px]">Editar</button>
                  <button onClick={() => { DataManager.deletePlan(plan.id); loadAll(); }} className="flex-1 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white font-black uppercase tracking-wider py-3 rounded-2xl transition-all text-[10px]">Excluir</button>
                </div>
              </div>
            ))}
            {!plans.length && <div className="text-gray-500">Nenhuma planilha criada.</div>}
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Squad', value: athletesList.length.toString(), color: 'text-white' },
                { label: 'Ativos 24h', value: active24h.toString(), color: 'text-[#fdf001]' },
                { label: 'Risco', value: riskCount.toString(), color: 'text-red-500' },
                { label: 'Media Volume', value: `${avgWeekly.toFixed(1)}km`, color: 'text-green-500' },
              ].map((stat, i) => (
                <div key={i} className="glass p-8 rounded-[2.5rem] border-t border-white/5">
                  <div className={`text-4xl font-black italic mb-1 tracking-tighter ${stat.color}`}>{stat.value}</div>
                  <div className="text-[10px] font-black uppercase text-gray-600 tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="glass p-10 rounded-[3rem] border border-white/5">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-2xl font-black italic uppercase text-white">Volume 7D por Atleta</h4>
                <div className="text-[10px] font-black uppercase text-gray-500">Top 8</div>
              </div>
              <div className="space-y-4">
                {athletesList.slice(0, 8).map((athlete) => {
                  const data = athletesData.find((d) => d.userId === athlete.id) || DataManager.ensureAthleteData(athlete.id);
                  const volume = DataManager.getWeeklyVolume(data.activities, 7);
                  return (
                    <div key={athlete.id} className="flex items-center gap-4">
                      <div className="w-32 text-xs font-bold text-gray-400 truncate">{athlete.name}</div>
                      <div className="flex-1 h-3 bg-white/5 rounded-full">
                        <div className="h-3 bg-[#fdf001] rounded-full" style={{ width: `${Math.min(100, volume * 3)}%` }} />
                      </div>
                      <div className="text-xs text-gray-500 w-16 text-right">{volume.toFixed(1)}km</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="space-y-6">
            {alerts.filter((a) => !a.resolvedAt).map((alert) => {
              const athlete = athletesList.find((u) => u.id === alert.athleteId);
              return (
                <div key={alert.id} className="glass p-6 rounded-[2rem] border border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="text-[9px] font-black uppercase text-gray-600">{alert.type}</div>
                    <div className="text-xl font-black italic text-white">{alert.message}</div>
                    <div className="text-xs text-gray-500">Atleta: {athlete ? athlete.name : 'N/A'}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${alert.severity === 'high' ? 'bg-red-500/20 text-red-400' : alert.severity === 'medium' ? 'bg-orange-500/20 text-orange-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {alert.severity}
                    </span>
                    <button onClick={() => { DataManager.resolveAlert(alert.id); loadAll(); }} className="bg-[#fdf001] text-black px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all">Resolver</button>
                  </div>
                </div>
              );
            })}
            {!alerts.filter((a) => !a.resolvedAt).length && <div className="text-gray-500">Nenhum alerta ativo.</div>}
          </div>
        )}
</main>
    </div>
  );
};

// --- LOGIN MODAL ---

// --- APP ---

const App = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);

  const handleLogin = (loggedUser: UserType) => {
    setUser(loggedUser);
    setIsLoginOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setUser(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen selection:bg-[#fdf001] selection:text-black bg-black text-white antialiased">
      <Navbar onLoginClick={() => setIsLoginOpen(true)} user={user} onLogout={handleLogout} />
      
      {!user ? (
        <div className="animate-in fade-in duration-1000">
          <Hero />
          <About />
          <ServicesGrid />
          <ScheduleSection />
          <Contact />
          <Footer />
        </div>
      ) : user.role === 'coach' ? (
        <ProfessorDashboard user={user} onLogout={handleLogout} />
      ) : (
        <AthleteDashboard user={user} onLogout={handleLogout} />
      )}

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} onLogin={handleLogin} />
      
      {!user && <ChatBot />}
    </div>
  );
};

createRoot(document.getElementById('root')!).render(<App />);
