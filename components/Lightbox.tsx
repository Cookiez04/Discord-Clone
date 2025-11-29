import React, { useEffect } from 'react';
import { X, ZoomIn, ZoomOut, ExternalLink, Download } from 'lucide-react';

interface Props {
    src: string;
    onClose: () => void;
}

export const Lightbox: React.FC<Props> = ({ src, onClose }) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center animate-in fade-in duration-200" onClick={onClose}>
            {/* Toolbar */}
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-end space-x-4 bg-gradient-to-b from-black/50 to-transparent z-10" onClick={e => e.stopPropagation()}>
                <a 
                    href={src} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-400 hover:text-white transition-colors flex items-center text-sm font-medium"
                >
                    <ExternalLink size={20} className="mr-1" />
                    Open Original
                </a>
                <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                    <X size={32} />
                </button>
            </div>

            {/* Image Container */}
            <div className="relative w-full h-full flex items-center justify-center p-10" onClick={onClose}>
                <img 
                    src={src} 
                    alt="Lightbox" 
                    className="max-w-full max-h-full object-contain rounded shadow-2xl animate-in zoom-in-95 duration-300"
                    onClick={e => e.stopPropagation()} // Prevent closing when clicking image
                />
            </div>
        </div>
    );
};
