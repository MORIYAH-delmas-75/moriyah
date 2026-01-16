
import React, { useState } from 'react';
import { MemberData } from '../types';
import { registerOrUpdateMember } from '../services/api';
import { getDirectDriveImageUrl } from '../services/utils';
import ImageModal from './ImageModal';

interface Props {
  initialData?: MemberData;
  isUpdate?: boolean;
  onComplete: (data: MemberData) => void;
}

const RegistrationForm: React.FC<Props> = ({ initialData, isUpdate = false, onComplete }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<MemberData>(initialData || {
    lastName: '', firstName: '', gender: 'Masculin', birthDate: '', birthPlace: '',
    maritalStatus: 'Célibataire', address: '', phonePrimary: '', phoneSecondary: '',
    email: '', churchJoinDate: '', baptismDate: '', baptismPlace: '', prevChurch: '',
    spouseName: '', childCount: 0, childNames: '', emergencyName: '', emergencyRelation: '',
    emergencyPhone: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(initialData?.photoUrl || null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const steps = [
    { id: 'civil', title: 'Identité Civile' },
    { id: 'family', title: 'Situation Familiale' },
    { id: 'contact', title: 'Coordonnées' },
    { id: 'spiritual', title: 'Parcours Spirituel' },
    { id: 'emergency', title: 'Urgence & Photo' }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setFormData(prev => ({ ...prev, photoBase64: base64String, photoName: file.name }));
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const nextStep = () => setStep(s => Math.min(s + 1, steps.length - 1));
  const prevStep = () => setStep(s => Math.max(s - 1, 0));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < steps.length - 1) {
      nextStep();
      return;
    }
    setLoading(true);
    setError(null);
    const result = await registerOrUpdateMember(formData, isUpdate);
    if (result.status === 'success') {
      const finalMemberData = Array.isArray(result.data) ? result.data[0] : result.data;
      onComplete(finalMemberData || formData);
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  const photoDisplayUrl = getDirectDriveImageUrl(photoPreview || undefined);
  const inputClasses = "w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-100 focus:border-slate-950 outline-none transition-all text-sm font-medium";
  const labelClasses = "block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1";

  return (
    <div className="max-w-2xl mx-auto mb-12">
      {/* Barre de progression */}
      <div className="mb-10 px-4">
        <div className="flex justify-between mb-4">
          {steps.map((s, i) => (
            <div key={s.id} className="flex flex-col items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${i <= step ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'bg-slate-100 text-slate-400'}`}>
                {i < step ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                ) : i + 1}
              </div>
            </div>
          ))}
        </div>
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-slate-900 transition-all duration-500 ease-out"
            style={{ width: `${(step / (steps.length - 1)) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <form onSubmit={handleSubmit} className="p-10 md:p-14">
          <header className="mb-10">
            <h2 className="text-2xl font-black text-slate-950 tracking-tight">{steps[step].title}</h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Étape {step + 1} sur {steps.length}</p>
          </header>

          <div className="min-h-[320px] animate-in fade-in slide-in-from-right-4 duration-300">
            {step === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div><label className={labelClasses}>Prénom *</label><input required type="text" className={inputClasses} value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} /></div>
                <div><label className={labelClasses}>Nom de famille *</label><input required type="text" className={inputClasses} value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} /></div>
                <div>
                  <label className={labelClasses}>Sexe</label>
                  <select className={inputClasses} value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}>
                    <option value="Masculin">Masculin</option><option value="Féminin">Féminin</option>
                  </select>
                </div>
                <div><label className={labelClasses}>Date de Naissance</label><input type="date" className={inputClasses} value={formData.birthDate} onChange={e => setFormData({ ...formData, birthDate: e.target.value })} /></div>
                <div className="md:col-span-2"><label className={labelClasses}>Lieu de Naissance</label><input type="text" placeholder="Ville, Pays" className={inputClasses} value={formData.birthPlace} onChange={e => setFormData({ ...formData, birthPlace: e.target.value })} /></div>
              </div>
            )}

            {step === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className={labelClasses}>État Civil</label>
                  <select className={inputClasses} value={formData.maritalStatus} onChange={e => setFormData({ ...formData, maritalStatus: e.target.value })}>
                    <option value="Célibataire">Célibataire</option><option value="Marié(e)">Marié(e)</option>
                    <option value="Divorcé(e)">Divorcé(e)</option><option value="Veuf/Veuve">Veuf/Veuve</option>
                  </select>
                </div>
                {formData.maritalStatus === 'Marié(e)' && (
                  <div className="md:col-span-2"><label className={labelClasses}>Nom du conjoint(e)</label><input type="text" className={inputClasses} value={formData.spouseName} onChange={e => setFormData({ ...formData, spouseName: e.target.value })} /></div>
                )}
                <div><label className={labelClasses}>Nombre d'enfants</label><input type="number" min="0" className={inputClasses} value={formData.childCount} onChange={e => setFormData({ ...formData, childCount: parseInt(e.target.value) || 0 })} /></div>
                <div className="md:col-span-2"><label className={labelClasses}>Noms des enfants</label><textarea rows={3} className={`${inputClasses} resize-none`} value={formData.childNames} onChange={e => setFormData({ ...formData, childNames: e.target.value })} /></div>
              </div>
            )}

            {step === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2"><label className={labelClasses}>Adresse Résidentielle</label><input type="text" className={inputClasses} value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} /></div>
                <div><label className={labelClasses}>Tél. Principal (+509)</label><input type="tel" className={inputClasses} value={formData.phonePrimary} onChange={e => setFormData({ ...formData, phonePrimary: e.target.value })} /></div>
                <div><label className={labelClasses}>Tél. Secondaire</label><input type="tel" className={inputClasses} value={formData.phoneSecondary} onChange={e => setFormData({ ...formData, phoneSecondary: e.target.value })} /></div>
                <div className="md:col-span-2"><label className={labelClasses}>Adresse Email</label><input type="email" disabled={isUpdate} className={`${inputClasses} ${isUpdate ? 'opacity-50' : ''}`} value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} /></div>
              </div>
            )}

            {step === 3 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div><label className={labelClasses}>Adhésion Église</label><input type="date" className={inputClasses} value={formData.churchJoinDate} onChange={e => setFormData({ ...formData, churchJoinDate: e.target.value })} /></div>
                <div><label className={labelClasses}>Date de Baptême</label><input type="date" className={inputClasses} value={formData.baptismDate} onChange={e => setFormData({ ...formData, baptismDate: e.target.value })} /></div>
                <div className="md:col-span-2"><label className={labelClasses}>Lieu de Baptême</label><input type="text" className={inputClasses} value={formData.baptismPlace} onChange={e => setFormData({ ...formData, baptismPlace: e.target.value })} /></div>
                <div className="md:col-span-2"><label className={labelClasses}>Église Précédente</label><input type="text" className={inputClasses} value={formData.prevChurch} onChange={e => setFormData({ ...formData, prevChurch: e.target.value })} /></div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2"><label className={labelClasses}>Contact d'Urgence (Nom)</label><input type="text" className={inputClasses} value={formData.emergencyName} onChange={e => setFormData({ ...formData, emergencyName: e.target.value })} /></div>
                  <div><label className={labelClasses}>Lien / Relation</label><input type="text" className={inputClasses} value={formData.emergencyRelation} onChange={e => setFormData({ ...formData, emergencyRelation: e.target.value })} /></div>
                  <div><label className={labelClasses}>Tél. Urgence</label><input type="tel" className={inputClasses} value={formData.emergencyPhone} onChange={e => setFormData({ ...formData, emergencyPhone: e.target.value })} /></div>
                </div>
                
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 border-dashed flex items-center gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-white shadow-sm border border-slate-200 overflow-hidden shrink-0">
                    {photoDisplayUrl ? <img src={photoDisplayUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-200"><svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" /></svg></div>}
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Photo d'Identité Officielle</p>
                    <label className="inline-block px-4 py-2 bg-slate-900 text-white text-[10px] font-bold rounded-lg cursor-pointer hover:bg-black transition-all uppercase tracking-widest">
                      Sélectionner
                      <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {error && <div className="mt-6 p-4 bg-red-50 text-red-500 text-[10px] font-bold rounded-xl text-center border border-red-100 uppercase tracking-widest">{error}</div>}

          <div className="mt-12 flex justify-between items-center">
            <button
              type="button"
              onClick={prevStep}
              className={`px-6 py-3 text-slate-400 font-bold text-[10px] uppercase tracking-widest transition-all hover:text-slate-900 ${step === 0 ? 'invisible' : ''}`}
            >
              Précédent
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-10 py-4 bg-slate-950 hover:bg-black text-white font-bold rounded-2xl shadow-xl shadow-slate-200 transition-all flex items-center gap-3 disabled:opacity-50 text-[10px] uppercase tracking-[0.2em]"
            >
              {loading && <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>}
              {step === steps.length - 1 ? (isUpdate ? 'Enregistrer' : 'Confirmer') : 'Suivant'}
            </button>
          </div>
        </form>
      </div>

      {photoDisplayUrl && (
        <ImageModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} src={photoDisplayUrl} />
      )}
    </div>
  );
};

export default RegistrationForm;
