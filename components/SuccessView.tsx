
import React, { useState } from 'react';
import { MemberData } from '../types';
import { getDirectDriveImageUrl } from '../services/utils';
import ImageModal from './ImageModal';

interface Props {
  member: MemberData;
  onGoToDashboard: () => void;
  onGoToSearch: () => void;
}

const SuccessView: React.FC<Props> = ({ member, onGoToDashboard, onGoToSearch }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const photoDisplayUrl = getDirectDriveImageUrl(member.photoUrl);

  return (
    <div className="max-w-xl mx-auto bg-white rounded-3xl border border-slate-200/60 p-12 text-center shadow-xl">
      <div className="w-16 h-16 bg-slate-950 text-white rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <h2 className="text-2xl font-bold text-slate-950 tracking-tight mb-3">Opération réussie</h2>
      <p className="text-slate-500 mb-10 text-sm font-medium leading-relaxed">
        Le profil de <strong>{member.firstName} {member.lastName}</strong> est désormais à jour et synchronisé avec la base de données centrale.
      </p>

      <div 
        className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4 text-left mb-10 max-w-sm mx-auto cursor-pointer group hover:bg-white hover:border-indigo-100 transition-all shadow-sm hover:shadow-md"
        onClick={() => photoDisplayUrl && setIsModalOpen(true)}
      >
        <div className="w-12 h-12 rounded-xl bg-white border border-slate-200/50 flex items-center justify-center overflow-hidden shrink-0 relative">
          {photoDisplayUrl ? (
            <>
              <img src={photoDisplayUrl} className="w-full h-full object-cover" alt="Avatar" />
              <div className="absolute inset-0 bg-indigo-600/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                 <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                 </svg>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-300">PF</div>
          )}
        </div>
        <div className="min-w-0">
          <p className="font-bold text-slate-900 text-sm truncate">{member.firstName} {member.lastName}</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider truncate">{member.email || 'Identité validée'}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={onGoToDashboard}
          className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-black text-white font-bold rounded-xl transition-all text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-slate-200"
        >
          Accueil
        </button>
        <button
          onClick={onGoToSearch}
          className="w-full sm:w-auto px-8 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold rounded-xl transition-all text-[10px] uppercase tracking-[0.2em]"
        >
          Recherche
        </button>
      </div>

      {photoDisplayUrl && (
        <ImageModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          src={photoDisplayUrl} 
        />
      )}
    </div>
  );
};

export default SuccessView;
