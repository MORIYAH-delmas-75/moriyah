
import React, { useState, useRef, useEffect } from 'react';
import { MemberData } from '../types';
import { getDirectDriveImageUrl, formatDisplayDate } from '../services/utils';
import ImageModal from './ImageModal';
import { LOGO_URL } from '../App';

interface Props {
  member: MemberData;
  onEdit: (data: MemberData) => void;
  onBack: () => void;
}

const ProfileView: React.FC<Props> = ({ member, onEdit, onBack }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [localPhoto, setLocalPhoto] = useState<string | null>(null);
  const [localLogo, setLocalLogo] = useState<string | null>(null);
  
  const profileRef = useRef<HTMLDivElement>(null);

  // Chargement des images en Base64 au montage pour éviter les problèmes CORS dans le PDF
  useEffect(() => {
    const localizeImages = async () => {
      const photoUrl = getDirectDriveImageUrl(member.photoUrl);
      if (photoUrl) {
        const b64 = await fetchAsBase64(photoUrl);
        setLocalPhoto(b64);
      }
      
      const b64Logo = await fetchAsBase64(LOGO_URL);
      setLocalLogo(b64Logo);
    };
    
    localizeImages();
  }, [member.photoUrl]);

  /**
   * Fonction pour convertir une image en Base64 via Fetch
   */
  const fetchAsBase64 = async (url: string): Promise<string> => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (e) {
      console.warn("Échec conversion Base64 pour:", url);
      return url;
    }
  };

  const handleDownloadPDF = async () => {
    if (!profileRef.current) return;
    setIsGenerating(true);
    
    try {
      const element = profileRef.current;
      const opt = {
        margin:       [10, 10, 10, 10],
        filename:     `Profil_${member.firstName}_${member.lastName}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { 
          scale: 2, 
          useCORS: true, 
          logging: false,
          letterRendering: true,
          backgroundColor: '#ffffff'
        },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      // @ts-ignore
      await window.html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("Erreur PDF:", error);
      alert("Erreur lors de la génération du PDF.");
    } finally {
      setIsGenerating(false);
    }
  };

  const DetailRow = ({ label, value }: { label: string; value?: string | number }) => (
    <div className="py-3 border-b border-slate-50 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
      <span className="text-sm font-semibold text-slate-900">{value || '—'}</span>
    </div>
  );

  const displayName = `${member.firstName} ${member.lastName}`.toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const finalPhoto = localPhoto || getDirectDriveImageUrl(member.photoUrl);
  const finalLogo = localLogo || LOGO_URL;

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-10 print:hidden">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors text-xs font-bold uppercase tracking-widest"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour
        </button>
        
        <div className="flex gap-4">
          <button 
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className="w-14 h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-900 shadow-xl shadow-slate-200/50 hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50"
          >
            {isGenerating ? (
              <svg className="animate-spin h-6 w-6 text-blue-600" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            )}
          </button>

          <button 
            onClick={() => onEdit(member)}
            disabled={isGenerating}
            className="w-14 h-14 bg-[#1a468d] text-white rounded-2xl flex items-center justify-center shadow-xl shadow-blue-900/20 hover:bg-[#153a75] transition-all active:scale-95 disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>
      </div>

      <div 
        ref={profileRef} 
        className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-2xl overflow-hidden print:shadow-none print:border-none relative"
      >
        <div className="h-44 bg-[#1a468d] rounded-t-[2.5rem] relative print:h-32">
          <div className="absolute top-6 right-10 opacity-[0.15] pointer-events-none">
             <img 
               src={finalLogo} 
               alt="" 
               className="w-32 h-32 object-contain brightness-0 invert" 
             />
          </div>
          
          <div className="absolute bottom-0 left-12 transform translate-y-1/2 z-30">
             <div 
               className="w-36 h-36 rounded-[2rem] bg-white p-2 shadow-2xl border border-slate-100 cursor-pointer group transition-all ring-[10px] ring-white"
               onClick={() => finalPhoto && setIsModalOpen(true)}
             >
               <div className="w-full h-full rounded-2xl overflow-hidden bg-slate-50 relative">
                 {finalPhoto ? (
                   <div 
                    className="w-full h-full bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url(${finalPhoto})` }}
                   >
                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity print:hidden">
                       <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                       </svg>
                     </div>
                   </div>
                 ) : (
                   <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300">
                     <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                       <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                     </svg>
                   </div>
                 )}
               </div>
             </div>
          </div>
        </div>

        <div className="relative z-10 pt-24 px-12 pb-16 md:px-16 print:pt-20">
          <div className="mb-12">
            <h1 className="text-3xl font-black text-slate-950 tracking-tight">{displayName}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-3">
               <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg font-bold text-[9px] uppercase tracking-widest">ID: {member.id || 'N/A'}</span>
               <span className="px-3 py-1 bg-blue-50 text-[#1a468d] rounded-lg font-bold text-[9px] uppercase tracking-widest">{member.gender}</span>
               <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-lg font-bold text-[9px] uppercase tracking-widest border border-amber-100">{member.maritalStatus}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            <div className="space-y-10">
              <section>
                <h3 className="text-[10px] font-black text-[#1a468d] uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#1a468d] rounded-full"></div>
                  Informations Civiles
                </h3>
                <div className="bg-slate-50/40 rounded-3xl p-6 border border-slate-100/50">
                  <DetailRow label="Date de naissance" value={formatDisplayDate(member.birthDate)} />
                  <DetailRow label="Lieu de naissance" value={member.birthPlace} />
                  <DetailRow label="Adresse" value={member.address} />
                  <DetailRow label="Téléphone" value={member.phonePrimary} />
                  <DetailRow label="Email" value={member.email} />
                </div>
              </section>

              <section>
                <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
                  Vie Spirituelle
                </h3>
                <div className="bg-slate-50/40 rounded-3xl p-6 border border-slate-100/50">
                  <DetailRow label="Date d'Adhésion" value={formatDisplayDate(member.churchJoinDate)} />
                  <DetailRow label="Date de Baptême" value={formatDisplayDate(member.baptismDate)} />
                  <DetailRow label="Lieu de Baptême" value={member.baptismPlace} />
                </div>
              </section>
            </div>

            <div className="space-y-10">
              <section>
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-slate-500 rounded-full"></div>
                  Famille
                </h3>
                <div className="bg-slate-50/40 rounded-3xl p-6 border border-slate-100/50">
                  <DetailRow label="Conjoint(e)" value={member.spouseName} />
                  <DetailRow label="Nombre d'enfants" value={member.childCount} />
                  <div className="py-3 flex flex-col gap-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Noms des enfants</span>
                    <span className="text-xs font-semibold text-slate-800 leading-relaxed">{member.childNames || '—'}</span>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                  Urgence
                </h3>
                <div className="bg-slate-50/40 rounded-3xl p-6 border border-slate-100/50">
                  <DetailRow label="Contact" value={member.emergencyName} />
                  <DetailRow label="Relation" value={member.emergencyRelation} />
                  <DetailRow label="Téléphone" value={member.emergencyPhone} />
                </div>
              </section>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-slate-100 text-center flex flex-col items-center gap-3">
            <img 
              src={finalLogo} 
              alt="" 
              className="w-12 h-12 grayscale opacity-30" 
            />
            <p className="text-[9px] text-slate-300 font-black uppercase tracking-[0.4em]">
              MORIYAH CLOUD PLATFORM • v2.2
            </p>
            <p className="text-[8px] text-slate-300 font-medium">
              Généré le {new Date().toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body { background: white !important; padding: 0 !important; }
          .print\\:hidden { display: none !important; }
          .rounded-\\[2\\.5rem\\] { border-radius: 0 !important; border: none !important; box-shadow: none !important; }
          .bg-slate-50\\/40 { background-color: white !important; border: 1px solid #f1f5f9 !important; border-radius: 1.5rem !important; }
          .ring-white { ring-width: 0 !important; border: 8px solid white !important; }
          img { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          @page { size: A4; margin: 0; }
        }
      `}} />

      {finalPhoto && (
        <ImageModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          src={finalPhoto} 
        />
      )}
    </div>
  );
};

export default ProfileView;
