
import React, { useState, useEffect } from 'react';
import { ViewMode, MemberData } from './types';
import RegistrationForm from './components/RegistrationForm';
import SearchForm from './components/SearchForm';
import SuccessView from './components/SuccessView';
import ProfileView from './components/ProfileView';
import LoginView from './components/LoginView';
import Dashboard from './components/Dashboard';

// ID du logo Moriyah sur Drive
export const LOGO_URL = "https://lh3.googleusercontent.com/d/14H2VWPlb_0PHg35z1c_aN24CLYRYCD-i";

export const LogoBox: React.FC<{ size?: string, className?: string }> = ({ size = "w-32 h-32", className = "" }) => {
  return (
    <div className={`${size} ${className} bg-white rounded-[2rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col animate-in zoom-in duration-1000 ease-out relative group shrink-0`}>
      <div className="flex-1 flex items-center justify-center p-2 bg-white relative">
        <img 
          src={LOGO_URL} 
          alt="Logo Moriyah" 
          className="w-full h-full object-contain transition-all duration-700 group-hover:scale-105" 
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none"></div>
      </div>
    </div>
  );
};

export const LogoImage: React.FC<{ className?: string, containerClass?: string }> = ({ className, containerClass }) => {
  return (
    <div className={`bg-white flex items-center justify-center ${containerClass}`}>
      <img 
        src={LOGO_URL} 
        alt="Logo" 
        className={`${className} object-contain`} 
      />
    </div>
  );
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'MEMBRES' | 'DASHBOARD'>('DASHBOARD');
  const [view, setView] = useState<ViewMode>('dashboard');
  const [currentMember, setCurrentMember] = useState<MemberData | null>(null);

  useEffect(() => {
    const savedAuth = localStorage.getItem('hub_authenticated');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
      setActiveTab('DASHBOARD');
      setView('dashboard');
    }
  }, []);

  const handleLoginSuccess = (email: string) => {
    setIsAuthenticated(true);
    localStorage.setItem('hub_authenticated', 'true');
    setActiveTab('DASHBOARD');
    setView('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('hub_authenticated');
    setView('login');
  };

  const handleRegistrationComplete = (data: MemberData) => {
    setCurrentMember(data);
    setView('success');
  };

  const handleMemberFound = (data: MemberData) => {
    setCurrentMember(data);
    setView('profile');
  };

  const handleEditRequested = (data: MemberData) => {
    setCurrentMember(data);
    setView('edit');
  };

  if (!isAuthenticated) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen flex flex-col selection:bg-slate-200 selection:text-slate-900 bg-[#F8FAFC]">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50 print:hidden">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <LogoImage 
              containerClass="w-10 h-10 rounded-xl overflow-hidden border border-slate-50 shadow-sm" 
              className="w-full h-full p-1"
            />
            <span className="font-extrabold text-slate-900 text-base tracking-tight uppercase hidden sm:inline">MORIYAH</span>
          </div>
          
          <nav className="flex items-center gap-1">
            <button 
              onClick={() => { setActiveTab('DASHBOARD'); setView('dashboard'); }}
              aria-label="Accueil"
              className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all ${activeTab === 'DASHBOARD' ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
            >
              <svg className="w-5 h-5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="hidden sm:inline">Accueil</span>
            </button>
            <button 
              onClick={() => { setActiveTab('MEMBRES'); setView('register'); }}
              aria-label="Membres"
              className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all ${activeTab === 'MEMBRES' ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
            >
              <svg className="w-5 h-5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className="hidden sm:inline">Membres</span>
            </button>
            <div className="w-px h-4 bg-slate-100 mx-2"></div>
            <button 
              onClick={handleLogout}
              aria-label="Déconnexion"
              className="p-2 text-slate-300 hover:text-red-500 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7" />
              </svg>
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-12">
        {activeTab === 'MEMBRES' && !['success', 'edit', 'profile'].includes(view) && (
          <div className="flex justify-center mb-12">
            <div className="inline-flex p-1.5 bg-slate-100/50 backdrop-blur-sm rounded-2xl border border-slate-200/50">
              <button 
                onClick={() => setView('register')}
                className={`px-6 sm:px-8 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] transition-all ${view === 'register' ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Inscription
              </button>
              <button 
                onClick={() => setView('search')}
                className={`px-6 sm:px-8 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] transition-all ${view === 'search' ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Recherche
              </button>
            </div>
          </div>
        )}

        <div className="animate-in fade-in duration-700">
          {activeTab === 'DASHBOARD' ? (
            <Dashboard />
          ) : (
            <>
              {view === 'register' && <RegistrationForm onComplete={handleRegistrationComplete} />}
              {view === 'edit' && currentMember && <RegistrationForm initialData={currentMember} isUpdate={true} onComplete={handleRegistrationComplete} />}
              {view === 'search' && <SearchForm onMemberFound={handleMemberFound} />}
              {view === 'profile' && currentMember && <ProfileView member={currentMember} onEdit={handleEditRequested} onBack={() => setView('search')} />}
              {view === 'success' && currentMember && (
                <SuccessView 
                  member={currentMember} 
                  onGoToDashboard={() => { setView('dashboard'); setActiveTab('DASHBOARD'); }} 
                  onGoToSearch={() => { setView('search'); setActiveTab('MEMBRES'); }}
                />
              )}
            </>
          )}
        </div>
      </main>

      <footer className="py-12 border-t border-slate-100 mt-auto bg-white print:hidden">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
             <LogoImage containerClass="w-6 h-6 grayscale opacity-20" className="w-full h-full" />
             <p className="text-slate-300 font-bold text-[9px] uppercase tracking-[0.3em]">MORIYAH Cloud Platform</p>
          </div>
          <div className="text-slate-950 font-black text-xs tracking-[0.3em] uppercase">
             T & M
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
