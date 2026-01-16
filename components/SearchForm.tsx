
import React, { useState } from 'react';
import { fetchMemberByQuery } from '../services/api';
import { MemberData } from '../types';
import { getDirectDriveImageUrl } from '../services/utils';

interface Props {
  onMemberFound: (data: MemberData) => void;
}

const SearchForm: React.FC<Props> = ({ onMemberFound }) => {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    regDateStart: '',
    regDateEnd: '',
    baptismDate: '',
    joinDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<MemberData[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const searchParams: Record<string, string> = { query };
    if (showFilters) {
      if (filters.regDateStart) searchParams.regDateStart = filters.regDateStart;
      if (filters.regDateEnd) searchParams.regDateEnd = filters.regDateEnd;
      if (filters.baptismDate) searchParams.baptismDate = filters.baptismDate;
      if (filters.joinDate) searchParams.joinDate = filters.joinDate;
    }

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const result = await fetchMemberByQuery(searchParams);
      
      if (result.status === 'success' && result.data) {
        if (Array.isArray(result.data)) {
          if (result.data.length === 1 && !showFilters) {
            onMemberFound(result.data[0]);
          } else if (result.data.length === 0) {
            setError('Aucune fiche correspondante trouvée.');
          } else {
            setResults(result.data);
          }
        } else {
          onMemberFound(result.data as MemberData);
        }
      } else {
        setError(result.message || 'Aucune fiche correspondante trouvée.');
      }
    } catch (err) {
      setError("Défaut de liaison avec le serveur distant.");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-100 outline-none transition-all text-xs font-medium";
  const labelClasses = "block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1";

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Moteur de recherche</h2>
        <p className="text-slate-500 text-sm font-medium">Localisez instantanément une fiche ou appliquez des filtres de date.</p>
      </div>

      <div className="space-y-4">
        <form onSubmit={handleSearch} className="relative group">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-slate-300 group-focus-within:text-slate-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Nom, Email ou Téléphone..."
            className="w-full pl-14 pr-32 md:pr-44 py-5 rounded-2xl border border-slate-200 bg-white text-slate-900 focus:ring-4 focus:ring-slate-100 focus:border-slate-900 outline-none transition-all text-lg font-medium shadow-sm placeholder:text-slate-300"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 right-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2.5 rounded-xl transition-all border ${showFilters ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'}`}
              title="Filtres avancés"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </button>
            <button
              type="submit"
              disabled={loading}
              className="min-w-[44px] px-3 md:px-6 py-2.5 bg-slate-900 hover:bg-black text-white text-[10px] font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-30 uppercase tracking-widest shadow-lg active:scale-95"
            >
              {loading ? (
                <svg className="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <>
                  {/* Ikòn loupe la ki parèt sèlman sou mobil */}
                  <svg className="w-4 h-4 md:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  {/* Tèks la ki kache sou mobil epi parèt sou desktop */}
                  <span className="hidden md:inline">Chercher</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Panneau de filtres avancés */}
        {showFilters && (
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl animate-in slide-in-from-top-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="md:col-span-2 grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                    Période d'inscription
                  </p>
                </div>
                <div>
                  <label className={labelClasses}>Du</label>
                  <input type="date" className={inputClasses} value={filters.regDateStart} onChange={e => setFilters({...filters, regDateStart: e.target.value})} />
                </div>
                <div>
                  <label className={labelClasses}>Au</label>
                  <input type="date" className={inputClasses} value={filters.regDateEnd} onChange={e => setFilters({...filters, regDateEnd: e.target.value})} />
                </div>
              </div>

              <div>
                <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                  Baptême
                </p>
                <label className={labelClasses}>Le</label>
                <input type="date" className={inputClasses} value={filters.baptismDate} onChange={e => setFilters({...filters, baptismDate: e.target.value})} />
              </div>

              <div>
                <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                  Adhésion
                </p>
                <label className={labelClasses}>Le</label>
                <input type="date" className={inputClasses} value={filters.joinDate} onChange={e => setFilters({...filters, joinDate: e.target.value})} />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button 
                type="button"
                onClick={() => setFilters({ regDateStart: '', regDateEnd: '', baptismDate: '', joinDate: '' })}
                className="text-[9px] font-bold text-slate-400 hover:text-red-500 uppercase tracking-widest transition-colors"
              >
                Réinitialiser les filtres
              </button>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center justify-center gap-2 text-red-500 text-xs font-bold animate-in fade-in zoom-in-95 duration-200">
           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
           </svg>
           {error}
        </div>
      )}

      {results.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{results.length} Résultats trouvés</p>
          </div>
          <div className="divide-y divide-slate-50 max-h-[500px] overflow-y-auto custom-scrollbar">
            {results.map((member, idx) => (
              <button
                key={member.id || idx}
                onClick={() => onMemberFound(member)}
                className="w-full flex items-center gap-5 px-8 py-5 hover:bg-slate-50 transition-all text-left group"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200/50 flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                  {member.photoUrl ? (
                    <img 
                      src={getDirectDriveImageUrl(member.photoUrl)} 
                      alt="" 
                      className="w-full h-full object-cover" 
                      onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                  ) : (
                    <span className="text-slate-400 font-bold text-sm tracking-tighter uppercase">
                      {member.firstName?.charAt(0)}{member.lastName?.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-slate-950 text-base truncate tracking-tight">{member.firstName} {member.lastName}</p>
                    <span className="px-1.5 py-0.5 bg-slate-100 rounded text-[9px] font-bold text-slate-400 uppercase">{member.id}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-1">
                    <p className="text-[11px] text-slate-400 font-medium truncate">{member.email || member.phonePrimary || 'Contact non renseigné'}</p>
                    {member.registrationDate && (
                      <span className="text-[9px] text-slate-300 font-bold uppercase tracking-widest">Inscrit le {new Date(member.registrationDate).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all text-[#1a468d]">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                   </svg>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchForm;
