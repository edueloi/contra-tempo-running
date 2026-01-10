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
  Zap as ZapIcon, Info, ChevronUp, Droplets, Heart, Filter, Facebook, Twitter
} from 'lucide-react';

// --- SISTEMA DE AUTENTICAÇÃO E DADOS ---

interface User {
  id: string;
  username: string;
  password: string;
  name: string;
  role: 'coach' | 'atleta';
  email?: string;
  phone?: string;
}

interface AthleteData {
  id: string;
  userId: string;
  vdot: number;
  plan: string;
  weeklyVolume: number[];
  activities: Activity[];
  stats: {
    sleep: string;
    hrv: string;
    weight: string;
    recovery: string;
  };
  prs: { dist: string; time: string; pace: string; date: string }[];
}

interface Activity {
  id: string;
  date: string;
  type: string;
  distance: string;
  time: string;
  pace: string;
  notes: string;
}

// Sistema de dados local
class DataManager {
  private static USERS_KEY = 'contratempo_users';
  private static ATHLETES_KEY = 'contratempo_athletes';
  private static COACH_KEY = 'contratempo_coach';

  static initializeCoach() {
    const users = this.getUsers();
    const coachExists = users.find(u => u.role === 'coach');
    
    if (!coachExists) {
      const coach: User = {
        id: 'coach_1',
        username: 'coach',
        password: 'coach123',
        name: 'Coach Adriano',
        role: 'coach',
        email: 'coach@contratempo.com'
      };
      users.push(coach);
      this.saveUsers(users);
    }
  }

  static getUsers(): User[] {
    const data = localStorage.getItem(this.USERS_KEY);
    return data ? JSON.parse(data) : [];
  }

  static saveUsers(users: User[]) {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  static authenticate(username: string, password: string): User | null {
    const users = this.getUsers();
    return users.find(u => u.username === username && u.password === password) || null;
  }

  static registerAthlete(username: string, password: string, name: string, email: string, phone: string): User {
    const users = this.getUsers();
    const newUser: User = {
      id: `athlete_${Date.now()}`,
      username,
      password,
      name,
      role: 'atleta',
      email,
      phone
    };
    users.push(newUser);
    this.saveUsers(users);

    // Criar dados iniciais do atleta
    const athleteData: AthleteData = {
      id: newUser.id,
      userId: newUser.id,
      vdot: 0,
      plan: 'Iniciante',
      weeklyVolume: [0, 0, 0, 0, 0, 0, 0],
      activities: [],
      stats: {
        sleep: '0h 0m',
        hrv: '0ms',
        weight: '0kg',
        recovery: '0%'
      },
      prs: []
    };
    this.saveAthleteData(athleteData);

    return newUser;
  }

  static getAthleteData(userId: string): AthleteData | null {
    const data = localStorage.getItem(this.ATHLETES_KEY);
    const athletes: AthleteData[] = data ? JSON.parse(data) : [];
    return athletes.find(a => a.userId === userId) || null;
  }

  static getAllAthletesData(): AthleteData[] {
    const data = localStorage.getItem(this.ATHLETES_KEY);
    return data ? JSON.parse(data) : [];
  }

  static saveAthleteData(athleteData: AthleteData) {
    const data = localStorage.getItem(this.ATHLETES_KEY);
    let athletes: AthleteData[] = data ? JSON.parse(data) : [];
    
    const index = athletes.findIndex(a => a.userId === athleteData.userId);
    if (index >= 0) {
      athletes[index] = athleteData;
    } else {
      athletes.push(athleteData);
    }
    
    localStorage.setItem(this.ATHLETES_KEY, JSON.stringify(athletes));
  }

  static getAthletes(): User[] {
    const users = this.getUsers();
    return users.filter(u => u.role === 'atleta');
  }
}

// Inicializar coach padrão
DataManager.initializeCoach();

// --- MOCK DATA EXPANDIDO ---
const SQUAD_DATA = [
  { id: 1, name: 'Rodrigo Silva', status: 'Risco Lesão', vdot: 48.5, plan: 'Maratona SP', last: '2h atrás', volume: '142km', trend: 'down', risk: 'high', cadence: 178 },
  { id: 2, name: 'Juliana Costa', status: 'Elite', vdot: 56.2, plan: '10km Nike', last: 'Hoje', volume: '88km', trend: 'up', risk: 'none', cadence: 185 },
  { id: 3, name: 'Marcos Tatuí', status: 'Consistente', vdot: 42.0, plan: 'Meia RJ', last: 'Ontem', volume: '110km', trend: 'stable', risk: 'low', cadence: 172 },
  { id: 4, name: 'Fernanda Lima', status: 'Iniciante', vdot: 34.5, plan: '5km Debut', last: '3 dias atrás', volume: '15km', trend: 'up', risk: 'none', cadence: 165 },
  { id: 5, name: 'Paulo Souza', status: 'Risco Off', vdot: 39.0, plan: 'Manutenção', last: '1 semana atrás', volume: '0km', trend: 'down', risk: 'high', cadence: 0 },
  { id: 6, name: 'Carla Dias', status: 'Elite', vdot: 54.0, plan: 'Boston 2025', last: 'Hoje', volume: '160km', trend: 'up', risk: 'none', cadence: 190 },
];

const ATHLETE_STATS = {
  weeklyVolume: [12, 8, 15, 0, 10, 22, 5],
  labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
  prs: [
    { dist: '5KM', time: '19:45', pace: '3:57', date: 'Dez 2024' },
    { dist: '10KM', time: '41:10', pace: '4:07', date: 'Nov 2024' },
    { dist: '21KM', time: '1:32:45', pace: '4:24', date: 'Out 2024' },
  ],
  health: {
    sleep: '7h 20m',
    hrv: '54ms',
    weight: '72.4kg',
    recovery: '85%'
  }
};

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

const AthleteDashboard = ({ user, onLogout }: { user: any, onLogout: () => void }) => {
  const [activeTab, setActiveTab] = useState('performance');

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
            { id: 'saude', name: 'Saúde & Recovery', icon: HeartPulse },
            { id: 'records', name: 'Medalheiro', icon: Award },
          ].map((link) => (
            <button key={link.id} onClick={() => setActiveTab(link.id)} className={`w-full flex items-center gap-4 p-5 rounded-2xl transition-all group ${activeTab === link.id ? 'bg-[#fdf001] text-black shadow-xl shadow-[#fdf001]/20' : 'text-gray-500 hover:bg-white/5 hover:text-white'}`}>
              <link.icon size={22} className="shrink-0" />
              <span className="font-black italic uppercase text-[10px] tracking-widest">{link.name}</span>
            </button>
          ))}
        </nav>
        <button onClick={onLogout} className="mt-auto flex items-center gap-4 p-5 rounded-2xl text-red-500/50 hover:bg-red-500/10 hover:text-red-500 transition-all font-black uppercase text-[10px] tracking-widest">
           <LogOut size={20} /> Encerrar Sessão
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
                 { label: 'Volume Semana', value: '42.5km', icon: Activity, detail: 'Meta: 60km' },
                 { label: 'Pace Médio', value: "5'15\"", icon: Zap, detail: '-10s vs Meta' },
                 { label: 'Cadência Média', value: '178', icon: Activity, detail: 'Consistente' },
                 { label: 'VDOT Atual', value: '52.4', icon: TrendingUp, detail: '+1.2 este mês' },
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
                  <div className="flex justify-between items-start mb-16">
                     <div>
                        <h3 className="text-4xl font-black italic uppercase text-white tracking-tighter">PRÓXIMO TREINO</h3>
                        <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mt-1">Sincronizado via Garmin</p>
                     </div>
                     <div className="bg-[#fdf001] text-black px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em]">Z3 PROGRESSIVO</div>
                  </div>
                  <div className="mb-16 grid md:grid-cols-3 gap-12">
                     <div className="text-center">
                        <div className="text-6xl font-black italic text-white leading-none">12<span className="text-xl text-gray-500">KM</span></div>
                        <div className="text-[10px] font-black uppercase text-gray-500 mt-2">Distância</div>
                     </div>
                     <div className="text-center">
                        <div className="text-6xl font-black italic text-white leading-none">4:55</div>
                        <div className="text-[10px] font-black uppercase text-gray-500 mt-2">Pace Alvo</div>
                     </div>
                     <div className="text-center">
                        <div className="text-6xl font-black italic text-white leading-none">62<span className="text-xl text-gray-500">MIN</span></div>
                        <div className="text-[10px] font-black uppercase text-gray-500 mt-2">Duração Est.</div>
                     </div>
                  </div>
                  <button className="w-full bg-[#fdf001] text-black py-7 rounded-[2rem] font-black uppercase tracking-[0.4em] shadow-2xl hover:bg-white transition-all flex items-center justify-center gap-4">
                     <PlayCircle size={28} /> INICIAR PROTOCOLO
                  </button>
               </div>

               <div className="glass p-10 rounded-[3.5rem] flex flex-col justify-between border border-white/5 bg-gradient-to-br from-[#fdf001]/10 to-transparent">
                  <div>
                    <h4 className="text-[10px] font-black uppercase text-[#fdf001] tracking-[0.3em] mb-10 flex items-center gap-2">
                       <Award size={14} /> RECORDES PESSOAIS (PR)
                    </h4>
                    <div className="space-y-10">
                       {ATHLETE_STATS.prs.map((pr, i) => (
                         <div key={i} className="flex justify-between items-end border-b border-white/5 pb-6">
                            <div>
                               <div className="text-[9px] font-black text-gray-600 uppercase mb-1">{pr.dist}</div>
                               <div className="text-3xl font-black italic text-white leading-none tracking-tighter">{pr.time}</div>
                            </div>
                            <div className="text-right">
                               <div className="text-[9px] font-black text-gray-600 uppercase mb-1">DATA</div>
                               <div className="text-sm font-black italic text-gray-400 uppercase leading-none">{pr.date}</div>
                            </div>
                         </div>
                       ))}
                    </div>
                  </div>
                  <button className="mt-12 w-full py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase text-[10px] tracking-widest hover:bg-white hover:text-black transition-all">Ver Histórico Provas</button>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {[
                 { label: 'Status Sono', value: '7h 20m', icon: Sun, color: 'text-blue-400' },
                 { label: 'HRV Médio', value: '54ms', icon: Heart, color: 'text-red-400' },
                 { label: 'Peso Atual', value: '72.4kg', icon: Weight, color: 'text-gray-400' },
                 { label: 'Recovery %', value: '85%', icon: Battery, color: 'text-green-400' },
               ].map((s, i) => (
                 <div key={i} className="glass p-8 rounded-[2.5rem] border border-white/5 text-center">
                    <s.icon size={24} className={`${s.color} mx-auto mb-4`} />
                    <div className="text-2xl font-black italic text-white mb-1">{s.value}</div>
                    <div className="text-[9px] font-black uppercase text-gray-500 tracking-widest">{s.label}</div>
                 </div>
               ))}
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

const ProfessorDashboard = ({ user, onLogout }: { user: any, onLogout: () => void }) => {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('squad');
  const [showAddAthlete, setShowAddAthlete] = useState(false);
  const [newAthlete, setNewAthlete] = useState({ username: '', password: '', name: '', email: '', phone: '' });
  const [athletesList, setAthletesList] = useState<User[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAthletes();
  }, []);

  const loadAthletes = () => {
    const allAthletes = DataManager.getAthletes();
    setAthletesList(allAthletes);
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
      loadAthletes();
    } catch (err) {
      setError('Erro ao cadastrar atleta');
    }
  };

  const filteredAthletes = athletesList.filter(a => 
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.username.toLowerCase().includes(search.toLowerCase())
  );

  const athletes = SQUAD_DATA.filter(a => a.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex bg-[#050505] min-h-screen">
      <div className="hidden lg:flex w-72 bg-black border-r border-white/5 flex-col p-8 fixed h-full z-[100]">
        <div className="flex items-center gap-4 mb-16 p-2">
           <div className="bg-[#fdf001] p-2 rounded-xl shadow-lg shadow-[#fdf001]/20"><ShieldCheck className="w-8 h-8 text-black" /></div>
           <span className="text-2xl font-black italic text-white uppercase tracking-tighter">COACH<span className="text-[#fdf001]">PRO</span></span>
        </div>
        <nav className="flex-1 space-y-3">
          {[
            { id: 'squad', name: 'Gestão Squad', icon: Users },
            { id: 'metrics', name: 'Performance AI', icon: BarChart3 },
            { id: 'alerts', name: 'Alertas Risco', icon: ShieldAlert },
            { id: 'calendar', name: 'Agenda Grupos', icon: Calendar },
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

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
           {[
             { label: 'Total Squad', value: athletesList.length.toString(), color: 'text-white' },
             { label: 'Ativos 24h', value: '0', color: 'text-[#fdf001]' },
             { label: 'Risco Lesão', value: '0', color: 'text-red-500' },
             { label: 'Meta Volume', value: '0%', color: 'text-green-500' },
           ].map((stat, i) => (
             <div key={i} className="glass p-8 rounded-[2.5rem] border-t border-white/5">
                <div className={`text-4xl font-black italic mb-1 tracking-tighter ${stat.color}`}>{stat.value}</div>
                <div className="text-[10px] font-black uppercase text-gray-600 tracking-widest">{stat.label}</div>
             </div>
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
               {filteredAthletes.map((athlete) => (
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
                     <span className="bg-green-500/20 text-green-500 px-3 py-1 rounded-lg text-[9px] font-black uppercase">Ativo</span>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/10">
                     <div>
                       <div className="text-[9px] font-black uppercase text-gray-600 mb-1">E-mail</div>
                       <div className="text-sm text-gray-400 font-bold truncate">{athlete.email || 'Não informado'}</div>
                     </div>
                     <div>
                       <div className="text-[9px] font-black uppercase text-gray-600 mb-1">Telefone</div>
                       <div className="text-sm text-gray-400 font-bold">{athlete.phone || 'Não informado'}</div>
                     </div>
                   </div>

                   <div className="mt-6 pt-6 border-t border-white/10">
                     <div className="text-[9px] font-black uppercase text-gray-600 mb-2">Credenciais de Acesso</div>
                     <div className="flex items-center gap-2 text-xs">
                       <Lock size={12} className="text-gray-600" />
                       <span className="text-gray-500 font-bold">Usuário: <span className="text-white">{athlete.username}</span></span>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
           )}
        </div>

        <div className="glass p-6 md:p-12 rounded-[4rem] border border-white/5">
           <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
              <h3 className="text-3xl font-black italic uppercase text-white tracking-tighter">LISTA DE MONITORAMENTO</h3>
              <div className="flex gap-2 bg-white/5 p-2 rounded-2xl">
                 {['Todos', 'Elite', 'Risco', 'Inativo'].map(f => <button key={f} className="px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-[#fdf001] transition-all">{f}</button>)}
              </div>
           </div>

           <div className="overflow-x-auto">
              <div className="min-w-[900px] space-y-4 pb-6">
                 {athletes.map((athlete, i) => (
                   <div key={i} className="group bg-white/5 p-6 rounded-[2.5rem] flex items-center justify-between gap-8 border border-transparent hover:border-[#fdf001]/30 hover:bg-[#fdf001]/5 transition-all">
                      <div className="flex items-center gap-6 w-80">
                         <div className="relative">
                           <img src={`https://i.pravatar.cc/100?u=${athlete.id}`} className="w-16 h-16 rounded-2xl grayscale group-hover:grayscale-0 transition-all border border-white/10" />
                           {athlete.risk !== 'none' && <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-black ${athlete.risk === 'high' ? 'bg-red-500' : 'bg-orange-500'}`} />}
                         </div>
                         <div>
                            <h4 className="text-xl font-black italic uppercase text-white leading-none mb-1">{athlete.name}</h4>
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{athlete.plan}</p>
                         </div>
                      </div>

                      <div className="grid grid-cols-4 gap-12 flex-1">
                         <div>
                            <div className="text-[9px] font-black uppercase text-gray-600 mb-1">VDOT / Tend.</div>
                            <div className={`text-sm font-black italic uppercase flex items-center gap-2 ${athlete.trend === 'up' ? 'text-green-500' : athlete.trend === 'down' ? 'text-red-500' : 'text-gray-400'}`}>
                               {athlete.vdot} {athlete.trend === 'up' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </div>
                         </div>
                         <div>
                            <div className="text-[9px] font-black uppercase text-gray-600 mb-1">Volume 7D</div>
                            <div className="text-white font-black italic text-lg">{athlete.volume}</div>
                         </div>
                         <div>
                            <div className="text-[9px] font-black uppercase text-gray-600 mb-1">Última Sinc.</div>
                            <div className="text-gray-400 font-bold italic text-sm uppercase">{athlete.last}</div>
                         </div>
                         <div className="flex justify-end gap-3">
                            <button className="bg-white/5 p-4 rounded-xl hover:bg-[#fdf001] hover:text-black transition-all text-white shadow-lg"><ArrowRight size={20} /></button>
                            <button className="bg-white/5 p-4 rounded-xl hover:bg-orange-600 hover:text-white transition-all text-white"><MessageSquare size={20} /></button>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </main>
    </div>
  );
};

// --- LOGIN MODAL ---

const LoginModal = ({ isOpen, onClose, onLogin }: { isOpen: boolean, onClose: () => void, onLogin: (user: User) => void }) => {
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const user = DataManager.authenticate(username, password);
    
    if (!user) {
      setError('Usuário ou senha incorretos');
      return;
    }
    
    if (user.role !== loginType) {
      setError(`Esta conta não é de ${loginType === 'coach' ? 'coach' : 'atleta'}`);
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
        <button onClick={onClose} className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors z-50"><X size={32} /></button>
        
        {step === 'selection' ? (
          <div className="text-center animate-in zoom-in-95 duration-300">
            <div className="bg-[#fdf001] w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-[#fdf001]/30">
               <Timer size={48} className="text-black" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black italic uppercase text-white mb-12 tracking-tighter">ÁREA DO <span className="text-[#fdf001]">SQUAD</span></h2>
            <div className="grid gap-6">
              <button onClick={() => startLogin('atleta')} className="group w-full bg-white/5 border border-white/5 p-8 rounded-[2.5rem] flex items-center justify-between hover:border-[#fdf001]/40 hover:bg-[#fdf001]/5 transition-all">
                <div className="text-left">
                   <span className="block font-black italic uppercase text-2xl text-white">LOGIN ATLETA</span>
                   <span className="text-[10px] font-bold text-gray-500 tracking-[0.2em] uppercase">Minhas Planilhas</span>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl group-hover:bg-[#fdf001] transition-all"><User className="text-[#fdf001] group-hover:text-black" size={32} /></div>
              </button>
              <button onClick={() => startLogin('coach')} className="group w-full bg-[#fdf001] p-8 rounded-[2.5rem] flex items-center justify-between hover:bg-white text-black transition-all">
                <div className="text-left">
                   <span className="block font-black italic uppercase text-2xl">HEAD COACH</span>
                   <span className="text-[10px] font-bold opacity-60 tracking-[0.2em] uppercase">Gestão Técnica</span>
                </div>
                <ShieldCheck size={40} className="opacity-40" />
              </button>
            </div>
          </div>
        ) : step === 'login' ? (
          <div className="animate-in fade-in zoom-in duration-300">
            <button onClick={goBack} className="mb-6 text-white/60 hover:text-white flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
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
                <p className="text-xs text-gray-500 mt-2 font-bold tracking-wider">Padrão: coach / coach123</p>
              )}
            </div>
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Usuário</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-[#fdf001] transition-all"
                  placeholder="Digite seu usuário"
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
            <h3 className="text-4xl font-black italic uppercase text-white tracking-widest leading-none">AUTENTICANDO <br /> PROTOCOLO...</h3>
          </div>
        )}
      </div>
    </div>
  );
};

// --- APP ---

const App = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (loggedUser: User) => {
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
      
      {!user && (
        <a href="https://wa.me/5515997150805" target="_blank" className="whatsapp-float bg-green-500 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl hover:bg-green-600 transition-all z-[1000] scale-90 md:scale-100">
          <MessageSquare className="w-8 h-8 text-white" />
        </a>
      )}
    </div>
  );
};

createRoot(document.getElementById('root')!).render(<App />);
