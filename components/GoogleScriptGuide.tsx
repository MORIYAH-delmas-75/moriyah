
import React from 'react';

const GoogleScriptGuide: React.FC = () => {
  const code = `
/**
 * HUB MEMBRES - CONNECTEUR GOOGLE SHEETS v2.9
 * Gère l'action 'stats' pour le Dashboard.
 */
const SHEET_ID = '1oCOWw33lZiRk0mo2l3aKqd9qKYwHI7v_qFw5bWNWhSk'; 

function doGet(e) {
  try {
    const p = e.parameter;
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheets()[0];

    if (p.action === 'stats') {
      const values = sheet.getDataRange().getValues();
      const stats = { total: 0, hommes: 0, femmes: 0, moins18: 0 };
      const today = new Date();
      
      // On commence à i=1 pour sauter les entêtes
      for (let i = 1; i < values.length; i++) {
        const row = values[i];
        if (!row[0] && !row[1]) continue; // Saute les lignes vides

        stats.total++;
        
        // --- CALCUL DU SEXE ---
        // On suppose que le Sexe est en colonne D (index 3)
        const gender = row[3] ? row[3].toString().trim().toLowerCase() : "";
        if (gender === 'masculin' || gender === 'homme' || gender === 'm') stats.hommes++;
        else if (gender === 'féminin' || gender === 'femme' || gender === 'f') stats.femmes++;
        
        // --- CALCUL DE L'ÂGE (MOINS DE 18 ANS) ---
        // On suppose que la Date de Naissance est en colonne E (index 4)
        const birthDateValue = row[4];
        if (birthDateValue && birthDateValue instanceof Date) {
          let age = today.getFullYear() - birthDateValue.getFullYear();
          const m = today.getMonth() - birthDateValue.getMonth();
          
          // Ajustement si l'anniversaire n'est pas encore passé cette année
          if (m < 0 || (m === 0 && today.getDate() < birthDateValue.getDate())) {
            age--;
          }
          
          if (age < 18) stats.moins18++;
        }
      }
      return responseJSON({ status: 'success', data: stats });
    }

    return responseJSON({ status: 'success', data: [] });
  } catch (err) {
    return responseJSON({ status: 'error', message: err.toString() });
  }
}

function responseJSON(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
  `;

  return (
    <div className="bg-slate-900 rounded-[3rem] p-12 text-left shadow-2xl border border-slate-800">
      <div className="flex items-center gap-5 mb-12">
        <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center border border-blue-500/30">
          <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <h3 className="text-white font-black text-2xl uppercase tracking-tighter">Script Google v2.9</h3>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">courtoisie departement des technologies et du multimedia</p>
        </div>
      </div>
      
      <div className="relative group">
        <pre className="p-10 bg-slate-950 rounded-[2.5rem] text-[11px] text-blue-300/90 border border-slate-800 overflow-x-auto font-mono leading-relaxed max-h-[400px] custom-scrollbar">
          <code>{code.trim()}</code>
        </pre>
      </div>

      <div className="mt-12 p-8 bg-emerald-500/10 rounded-3xl border border-emerald-500/20 flex gap-6 items-center">
        <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shrink-0 text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-emerald-100/80 text-xs leading-relaxed font-medium">
          <strong>VÉRIFICATION :</strong> Assurez-vous que la colonne <strong>Date de Naissance</strong> dans votre Sheet est bien au format "Date" pour que le calcul automatique fonctionne.
        </p>
      </div>
    </div>
  );
};

export default GoogleScriptGuide;
