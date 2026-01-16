
import React, { useState } from 'react';
import { LogoBox } from '../App';

interface Props {
  onLoginSuccess: (email: string) => void;
}

const ALLOWED_EMAILS = ["patricekenleymaceus@gmail.com", "www.kpmix@gmail.com"];

const LoginView: React.FC<Props> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedEmail = email.toLowerCase().trim();
    if (ALLOWED_EMAILS.includes(normalizedEmail)) {
      onLoginSuccess(normalizedEmail);
    } else {
      setError("Accès non autorisé pour cet identifiant.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Fond épuré - Mesh gradient très subtil */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.4] pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] bg-blue-50 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] bg-slate-50 rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-[500px] animate-in fade-in slide-in-from-bottom-8 duration-1000">
        {/* Section Logo & Header */}
        <div className="text-center mb-16">
          <div className="relative inline-block mb-10">
            {/* LogoBox raffinée */}
            <LogoBox size="w-40 h-40 md:w-44 md:h-44" className="mx-auto border-slate-50 shadow-2xl" />
            
            {/* Halo de lumière très doux */}
            <div className="absolute inset-0 bg-blue-400/5 blur-[100px] rounded-full scale-[2] -z-10"></div>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter mb-4 leading-tight px-4">
            Département des <span className="uppercase">TECHNOLOGIES</span> et du <span className="uppercase">MULTIMÉDIA</span>
          </h1>
          <div className="w-12 h-1 bg-blue-600 mx-auto rounded-full mb-6"></div>
          <p className="text-slate-500 text-[11px] font-bold tracking-[0.25em] leading-relaxed">
            Base de données sécurisée de MORIYAH
          </p>
        </div>

        {/* Formulaire Minimaliste */}
        <div className="bg-white/50 backdrop-blur-sm p-2 rounded-[2.5rem] border border-slate-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)]">
          <div className="bg-white p-10 md:p-12 rounded-[2rem] border border-slate-50">
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="space-y-4">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">
                  Email de Connexion
                </label>
                <input
                  type="email"
                  required
                  placeholder="votre-email@hub.com"
                  className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 text-slate-900 focus:bg-white focus:ring-[12px] focus:ring-slate-50 focus:border-slate-200 outline-none transition-all font-semibold text-sm placeholder:text-slate-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50/50 rounded-2xl border border-red-50 animate-in shake duration-500">
                  <p className="text-red-500 text-[10px] font-black uppercase tracking-widest text-center">{error}</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-black text-white font-black py-5 rounded-2xl shadow-xl shadow-slate-200 transition-all transform active:scale-[0.98] hover:-translate-y-1 text-[10px] uppercase tracking-[0.3em]"
              >
                Vérifier mon accès
              </button>
            </form>
          </div>
        </div>
        
        {/* Footer Minimaliste */}
        <div className="text-center mt-16 space-y-4">
          <p className="text-[9px] text-slate-300 font-bold uppercase tracking-[0.5em]">Encryption AES-256 • v2.2</p>
          <div className="flex items-center justify-center gap-4 opacity-20">
             <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
             <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
             <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
