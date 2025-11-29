import React from 'react';
import { User } from '../types';
import { Music, Gamepad2, Code, Monitor, Coffee, MessageSquare } from 'lucide-react';

interface Props {
    user: User;
    x: number;
    y: number;
    onClose: () => void;
}

const ActivityIcon: React.FC<{ activity: string }> = ({ activity }) => {
    const lower = activity.toLowerCase();
    if (lower.includes('spotify') || lower.includes('music') || lower.includes('listening')) return <Music size={14} className="mr-1" />;
    if (lower.includes('play') || lower.includes('game') || lower.includes('overwatch') || lower.includes('minecraft')) return <Gamepad2 size={14} className="mr-1" />;
    if (lower.includes('code') || lower.includes('visual studio') || lower.includes('compiling')) return <Code size={14} className="mr-1" />;
    if (lower.includes('hack')) return <Monitor size={14} className="mr-1" />;
    if (lower.includes('coffee')) return <Coffee size={14} className="mr-1" />;
    return null;
};

export const UserPopout: React.FC<Props> = ({ user, x, y, onClose }) => {
    // Calculate position to keep it on screen
    // Ideally we would use a library like popper.js, but simple clamping works for now
    const style: React.CSSProperties = {
        position: 'absolute',
        top: Math.min(y, window.innerHeight - 400),
        left: Math.max(10, Math.min(x - 320, window.innerWidth - 340)), // Show to the left of cursor if possible
        zIndex: 1000 // Ensure it's on top of everything
    };

    return (
        <>
            {/* Backdrop to close */}
            <div className="fixed inset-0 z-[999]" onClick={onClose} />
            
            <div 
                style={style}
                className="w-[300px] bg-discord-darker rounded-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-discord-darkest"
            >
                {/* Banner */}
                <div className="h-[60px]" style={{ backgroundColor: user.bannerColor || user.color || '#5865F2' }}></div>
                
                {/* Avatar */}
                <div className="px-4 pb-4 relative">
                    <div className="absolute -top-[40px] w-[80px] h-[80px] rounded-full border-[6px] border-discord-darker bg-gray-700 overflow-hidden">
                        <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                        <div className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-[4px] border-discord-darker
                            ${user.status === 'online' ? 'bg-discord-green' : 
                              user.status === 'idle' ? 'bg-yellow-500' :
                              user.status === 'dnd' ? 'bg-discord-red' : 'bg-gray-500'}
                        `} />
                    </div>

                    {/* Badges (Fake for now) */}
                    <div className="flex justify-end pt-3 space-x-1 min-h-[24px]">
                        {user.roles?.includes('Admin') && (
                             <div className="w-5 h-5 bg-discord-dark rounded flex items-center justify-center text-[10px]" title="Admin">🛡️</div>
                        )}
                         {user.bot && (
                             <div className="w-5 h-5 bg-discord-brand rounded flex items-center justify-center text-[10px] text-white font-bold" title="Bot">BOT</div>
                        )}
                    </div>

                    {/* User Info */}
                    <div className="mt-4">
                        <div className="text-xl font-bold text-white leading-tight">
                            {user.username}
                            <span className="text-discord-text-muted text-lg font-medium ml-1 opacity-60">#{user.discriminator}</span>
                        </div>
                    </div>

                    <div className="w-full h-[1px] bg-discord-divider my-3" />

                    {/* About Me */}
                    {user.aboutMe && (
                        <div className="mb-3">
                            <div className="text-xs font-bold text-discord-text-muted uppercase mb-1">About Me</div>
                            <div className="text-sm text-discord-text-normal">{user.aboutMe}</div>
                        </div>
                    )}

                    {/* Roles */}
                    {user.roles && user.roles.length > 0 && (
                        <div className="mb-3">
                            <div className="text-xs font-bold text-discord-text-muted uppercase mb-1">Roles</div>
                            <div className="flex flex-wrap gap-1">
                                {user.roles.map(role => (
                                    <div key={role} className="flex items-center bg-discord-dark border border-discord-darkest rounded px-1.5 py-0.5 text-xs font-medium text-discord-text-normal">
                                        <div className="w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: user.color || '#99aab5' }}></div>
                                        {role}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Activity */}
                    {user.activity && (
                         <div className="mb-3">
                            <div className="text-xs font-bold text-discord-text-muted uppercase mb-1">Activity</div>
                            <div className="flex items-center text-sm text-white">
                                <ActivityIcon activity={user.activity} />
                                <span className="ml-1 font-medium">{user.activity}</span>
                            </div>
                        </div>
                    )}

                    <div className="w-full h-[1px] bg-discord-divider my-3" />
                    
                    <input 
                        type="text" 
                        placeholder={`Message @${user.username}`}
                        className="w-full bg-discord-dark text-sm px-2 py-2 rounded focus:outline-none text-white placeholder-discord-text-muted transition-colors border border-transparent focus:border-discord-text-muted"
                    />
                </div>
            </div>
        </>
    );
};
