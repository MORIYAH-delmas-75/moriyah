
/**
 * Transforme un lien Google Drive en URL directe fiable.
 * Utilise le service Google UserContent qui est plus performant pour le CORS.
 */
export const getDirectDriveImageUrl = (url?: string): string | undefined => {
  if (!url) return undefined;
  
  // Si c'est déjà du Base64 (aperçu local)
  if (url.startsWith('data:image')) return url;
  
  // Extraction de l'ID du fichier Google Drive
  const match = url.match(/[-\w]{25,}/);
  if (match && match[0]) {
    const fileId = match[0];
    // Ce format est plus robuste pour contourner les blocages CORS dans les navigateurs
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }
  
  return url;
};

/**
 * Formate une date pour l'affichage en supprimant les résidus ISO.
 * Retourne une date au format local français (JJ/MM/AAAA).
 */
export const formatDisplayDate = (dateStr?: string): string => {
  if (!dateStr) return '—';
  
  const cleanDate = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
  
  try {
    const dateObj = new Date(cleanDate);
    if (!isNaN(dateObj.getTime())) {
      return dateObj.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
  } catch (e) {}
  
  return cleanDate;
};
