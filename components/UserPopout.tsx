import React, { useEffect, useRef } from 'react';
import { User } from '../types';

interface Props {
  user: User;
  x: number;
  y: number;
  onClose: () => void;
}

export const UserPopout: React.FC<Props> = ({ user, x, y, onClose }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
          if (ref.current && !ref.current.contains(event.target as Node)) {
              onClose();
          }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Adjust position if off screen (simple clamp)
  const safeX = Math.min(Math.max(x, 10), window.innerWidth - 310);
  const safeY = Math.min(Math.max(y, 10), window.innerHeight - 400);

  return (
    <div 
        ref={ref}
        className="fixed w-[300px] bg-discord-darkest rounded-lg shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100"
        style={{ left: safeX, top: safeY }}
    >
       {/* Banner */}
       <div className="h-[60px]" style={{ backgroundColor: user.bannerColor || user.color || '#5865F2' }} />
       
       <div className="px-4 pb-4 relative">
           {/* Avatar */}
           <div className="absolute -top-[40px] left-4 w-[80px] h-[80px] rounded-full border-[6px] border-discord-darkest bg-discord-dark overflow-hidden">
                <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                <div className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-[3px] border-discord-darkest
                    ${user.status === 'online' ? 'bg-discord-green' : 
                      user.status === 'idle' ? 'bg-yellow-500' :
                      user.status === 'dnd' ? 'bg-discord-red' : 'bg-gray-500'}
                `} />
           </div>

           {/* Actions (top right) */}
           <div className="flex justify-end pt-3 mb-8">
               {/* Could add badges here */}
           </div>

           <div className="bg-discord-dark rounded-lg p-3 mb-3">
               <div className="font-bold text-white text-lg leading-tight">{user.username}</div>
               <div className="text-discord-text-muted text-sm mb-3">#{user.discriminator}</div>
               
               <div className="w-full h-[1px] bg-discord-divider my-2" />
               
               <div className="text-xs font-bold text-discord-text-muted uppercase mb-1">About Me</div>
               <div className="text-sm text-discord-text-normal whitespace-pre-wrap">
                   {user.aboutMe || 'Just another Discord user.'}
               </div>
               
               <div className="mt-3">
                   <div className="text-xs font-bold text-discord-text-muted uppercase mb-1">Roles</div>
                   <div className="flex flex-wrap gap-1">
                       {user.roles?.map(role => (
                           <div key={role} className="flex items-center px-1.5 py-0.5 rounded bg-discord-darker text-xs text-discord-text-muted border border-discord-divider">
                               <div className="w-2 h-2 rounded-full bg-discord-text-muted mr-1" />
                               {role}
                           </div>
                       ))}
                       {(!user.roles || user.roles.length === 0) && <span className="text-xs text-discord-text-muted italic">No roles</span>}
                   </div>
               </div>
           </div>

           <div className="mt-2">
                <input 
                    type="text" 
                    className="w-full bg-discord-darker border border-transparent rounded p-2 text-xs text-discord-text-normal placeholder-discord-text-muted focus:outline-none focus:border-discord-text-muted"
                    placeholder={`Message @${user.username}`}
                />
           </div>

       </div>
    </div>
  );
};