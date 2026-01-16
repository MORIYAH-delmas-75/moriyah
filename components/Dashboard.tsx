
import React, { useState, useEffect, useRef } from 'react';
import { LogoBox } from '../App';
import { fetchDashboardStats, DashboardStats } from '../services/api';

const Dashboard: React.FC = () => {
  const [statsData, setStatsData] = useState<DashboardStats>({ total: 0, men: 0, women: 0, youth: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const isFetchingRef = useRef(false);

  // Fonction de mise à jour des données
  const updateStats = async () => {
    if (isFetchingRef.current) return;
    
    isFetchingRef.current = true;
    try {
      const stats = await fetchDashboardStats();
      if (stats) {
        setStatsData(stats);
        setIsLoaded(true);
        setIsOnline(true);
      } else {
        setIsOnline(false);
      }
    } catch (err) {
      console.error("Erreur de synchronisation Dashboard:", err);
      setIsOnline(false);
    } finally {
      isFetchingRef.current = false;
    }
  };

  useEffect(() => {
    // Premier chargement
    updateStats();

    // Rafraîchissement automatique pour un effet "Live Sync"
    const interval = setInterval(updateStats, 2000);

    return () => clearInterval(interval);
  }, []);

  const statsCards = [
    { 
      id: 'total-membres',
      label: 'TOTAL MEMBRES', 
      value: isLoaded ? statsData.total : '...', 
      icon: (
        <svg className="w-10 h-10 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ), 
      color: 'text-slate-900',
      borderColor: 'border-b-slate-900',
      isLive: true 
    },
    { 
      id: 'nombre-hommes',
      label: "NOMBRE D'HOMMES", 
      value: isLoaded ? statsData.men : '...', 
      icon: (
        <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ), 
      color: 'text-blue-600',
      borderColor: 'border-b-blue-600'
    },
    { 
      id: 'nombre-femmes',
      label: "NOMBRE DE FEMMES", 
      value: isLoaded ? statsData.women : '...', 
      icon: (
        <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ), 
      color: 'text-emerald-600',
      borderColor: 'border-b-emerald-600'
    },
    { 
      id: 'moins-18',
      label: "MOINS DE 18 ANS", 
      value: isLoaded ? statsData.youth : '...', 
      icon: (
        <svg className="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ), 
      color: 'text-amber-600',
      borderColor: 'border-b-amber-600'
    },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Tableau de bord</h1>
          <p className="text-slate-500 font-medium text-base">Affichage en temps réel des données de Moriyah.</p>
        </div>
        <div className="flex items-center gap-4 self-start md:self-auto">
           <button 
             onClick={updateStats}
             className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-900 transition-all shadow-sm active:scale-95"
             title="Forcer la mise à jour"
           >
             <svg className={`w-5 h-5 ${isFetchingRef.current ? 'animate-spin text-blue-600' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
             </svg>
           </button>
           <LogoBox size="w-24 h-24" className="shadow-lg hidden md:flex" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, i) => (
          <div 
            key={i} 
            className={`bg-white p-10 rounded-[2.5rem] border border-slate-200 border-b-4 ${stat.borderColor} shadow-sm hover:shadow-xl transition-all group relative overflow-hidden ${stat.isLive && !isOnline ? 'opacity-60' : ''}`}
          >
            {stat.isLive && (
              <div className="absolute top-5 right-7 flex items-center gap-1.5">
                <span className={`text-[8px] font-black uppercase tracking-widest ${isOnline ? 'text-emerald-500' : 'text-red-400'}`}>
                  {isOnline ? 'LIVE SYNC' : 'DISCONNECTED'}
                </span>
                <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-red-400'}`}></span>
              </div>
            )}
            <div className="mb-6 group-hover:scale-110 transition-transform origin-left">{stat.icon}</div>
            <span className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest mb-2 block ml-0.5">{stat.label}</span>
            <strong id={stat.id} className={`text-5xl font-black ${stat.color} tabular-nums tracking-tighter block`}>
              {stat.value}
            </strong>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="font-bold text-slate-900 text-[11px] uppercase tracking-widest">Activité Récente</h3>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Synchronisé il y a quelques secondes</span>
          </div>
          <div className="p-8">
             <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-blue-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                   </div>
                   <div>
                      <p className="text-sm font-bold text-slate-900">Base de données en ligne</p>
                      <p className="text-[10px] text-slate-400 font-medium">Liaison active avec Google Cloud Platform</p>
                   </div>
                </div>
                <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-widest">Opérationnel</div>
             </div>
          </div>
        </div>

        <div className="bg-slate-950 rounded-[2.5rem] p-10 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="font-black text-2xl tracking-tight mb-4">Gestion Totale</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-10">
              Chaque inscription via le formulaire est traitée instantanément. Les statistiques ci-dessus reflètent l'état actuel de votre communauté.
            </p>
          </div>
          <a 
            href="https://docs.google.com/spreadsheets/d/1oCOWw33lZiRk0mo2l3aKqd9qKYwHI7v_qFw5bWNWhSk/edit" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full py-5 bg-white text-slate-950 text-center rounded-2xl text-[11px] font-black uppercase tracking-[0.25em] hover:bg-slate-100 transition-all shadow-xl shadow-black/40"
          >
            Accéder aux lignes
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
