import React from 'react';
import { Volume2 } from 'lucide-react';

interface Props {
    onClose: () => void;
    onPlaySound: (soundId: string) => void;
}

const sounds = [
    { id: 'airhorn', label: '📢 Airhorn', url: 'https://www.myinstants.com/media/sounds/airhorn.mp3' },
    { id: 'vine-boom', label: '💥 Vine Boom', url: 'https://www.myinstants.com/media/sounds/vine-boom.mp3' },
    { id: 'quack', label: '🦆 Quack', url: 'https://www.myinstants.com/media/sounds/quack.mp3' },
    { id: 'bruh', label: '😑 Bruh', url: 'https://www.myinstants.com/media/sounds/movie_1.mp3' },
    { id: 'cricket', label: '🦗 Cricket', url: 'https://www.myinstants.com/media/sounds/cricket.mp3' },
    { id: 'drumroll', label: '🥁 Drumroll', url: 'https://www.myinstants.com/media/sounds/drumroll.mp3' },
];

export const SoundboardPanel: React.FC<Props> = ({ onClose, onPlaySound }) => {
    const handlePlay = (sound: { id: string, url: string }) => {
        const audio = new Audio(sound.url);
        audio.play().catch(e => console.error("Audio play failed", e));
        onPlaySound(sound.id);
    };

    return (
        <div className="absolute bottom-16 right-4 w-[320px] bg-discord-darkest border border-discord-dark rounded-lg shadow-2xl z-50 overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-200">
            <div className="p-3 bg-discord-darker border-b border-discord-dark flex items-center justify-between">
                <div className="flex items-center text-white font-bold text-sm">
                    <Volume2 size={16} className="mr-2 text-discord-brand" />
                    Soundboard
                </div>
            </div>
            <div className="p-3 grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                {sounds.map(sound => (
                    <button
                        key={sound.id}
                        onClick={() => handlePlay(sound)}
                        className="flex items-center justify-center p-3 bg-discord-light hover:bg-discord-hover text-white rounded font-medium text-sm transition-colors active:scale-95"
                    >
                        {sound.label}
                    </button>
                ))}
            </div>
        </div>
    );
};
