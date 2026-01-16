
import { MemberData, ApiResponse } from '../types';

/**
 * URL du script Google Apps Script (Version Finale).
 */
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwdA03QD1rE6dKbMpI1QY-InHR60ul-vemnfEzIlj9DFQWMkYxXzDm6HpuwadSSwRTP/exec';

/**
 * Aide à la construction d'URL pour gérer les paramètres de requête de manière robuste.
 */
const buildUrl = (baseUrl: string, params: Record<string, string>) => {
  const url = new URL(baseUrl);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });
  return url.toString();
};

/**
 * Enregistre ou met à jour un membre dans la feuille Google Sheets.
 */
export const registerOrUpdateMember = async (data: MemberData, isUpdate: boolean = false): Promise<ApiResponse> => {
  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        action: isUpdate ? 'update' : 'register',
        payload: data
      }),
      redirect: 'follow'
    });
    
    if (!response.ok) {
       throw new Error(`Erreur serveur: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Erreur API Enregistrement:", error);
    return { 
      status: 'error', 
      message: 'Impossible de joindre le serveur Google Cloud.' 
    };
  }
};

/**
 * Recherche un membre avec des filtres avancés.
 */
export const fetchMemberByQuery = async (params: Record<string, string>): Promise<ApiResponse> => {
  try {
    const queryParams: Record<string, string> = {};
    Object.entries(params).forEach(([key, value]) => {
      if (value && value.trim() !== "") {
        queryParams[key] = value.trim();
      }
    });

    const url = buildUrl(SCRIPT_URL, queryParams);
    
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      redirect: 'follow',
      cache: 'no-cache'
    });
    
    if (!response.ok) {
      throw new Error(`Erreur réseau (${response.status})`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Erreur API Recherche:", error);
    return { 
      status: 'error', 
      message: `Défaut de liaison avec la base de données.` 
    };
  }
};

export interface DashboardStats {
  total: number;
  men: number;
  women: number;
  youth: number;
}

/**
 * Récupère les statistiques détaillées pour le Dashboard (Action: stats).
 */
export const fetchDashboardStats = async (): Promise<DashboardStats | null> => {
  try {
    const url = buildUrl(SCRIPT_URL, { 
      action: 'stats',
      t: Date.now().toString() 
    });

    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      redirect: 'follow'
    });
    
    if (!response.ok) return null;
    const result = await response.json();
    
    if (result.status === 'success') {
      // Support des formats {status, total, men, women, youth} 
      // et {status, data: {total, hommes, femmes, moins18}}
      const d = result.data || result;
      return {
        total: d.total || 0,
        men: d.hommes || d.men || 0,
        women: d.femmes || d.women || 0,
        youth: d.moins18 || d.youth || 0
      };
    }
    return null;
  } catch (error) {
    console.error("Erreur Fetch Stats:", error);
    return null;
  }
};
