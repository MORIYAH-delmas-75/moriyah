
import React from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  src: string;
}

const ImageModal: React.FC<Props> = ({ isOpen, onClose, src }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"></div>
      
      {/* Close button */}
      <button 
        className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-10"
        onClick={onClose}
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Image container */}
      <div 
        className="relative max-w-full max-h-full flex items-center justify-center animate-in zoom-in-95 duration-300 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        <img 
          src={src} 
          alt="Agrandissement" 
          className="rounded-2xl shadow-2xl max-w-full max-h-[85vh] object-contain border border-white/10"
        />
      </div>
    </div>
  );
};

export default ImageModal;
