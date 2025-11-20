import React from 'react';
import { AppState, Server } from '../types';
import { Plus, Compass, Download } from 'lucide-react';

interface Props {
  servers: Server[];
  activeServerId: string;
  onServerClick: (id: string) => void;
}

const ServerIcon: React.FC<{ 
  server?: Server; 
  isActive?: boolean; 
  onClick?: () => void 
}> = ({ 
  server, 
  isActive, 
  onClick 
}) => {
  if (!server) return null;
  
  return (
    <div className="relative group w-full flex justify-center cursor-pointer" onClick={onClick}>
      {/* Selection Pill */}
      <div 
        className={`absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-r-full transition-all duration-200
          ${isActive ? 'h-10 w-[4px]' : 'h-2 w-[4px] scale-0 group-hover:scale-100 group-hover:h-5'}
        `} 
      />
      
      {/* Icon */}
      <div 
        className={`
          w-12 h-12 transition-all duration-200 overflow-hidden
          ${isActive ? 'rounded-[16px] bg-discord-brand' : 'rounded-[24px] bg-discord-dark group-hover:rounded-[16px] group-hover:bg-discord-brand'}
        `}
      >
        <img src={server.icon} alt={server.name} className="w-full h-full object-cover" />
      </div>
    </div>
  );
};

const ActionIcon = ({ 
  icon: Icon, 
  color = "text-discord-green", 
  bgColor = "bg-discord-dark"
}: { 
  icon: React.ElementType, 
  color?: string,
  bgColor?: string 
}) => (
  <div className="relative group w-full flex justify-center cursor-pointer group">
     <div 
        className={`absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-r-full transition-all duration-200 h-2 w-[4px] scale-0 group-hover:scale-100 group-hover:h-5`} 
      />
    <div className={`w-12 h-12 rounded-[24px] ${bgColor} flex items-center justify-center transition-all duration-200 group-hover:rounded-[16px] group-hover:bg-discord-green`}>
      <Icon size={24} className={`${color} group-hover:text-white transition-colors`} />
    </div>
  </div>
);

export const ServerSidebar: React.FC<Props> = ({ servers, activeServerId, onServerClick }) => {
  return (
    <div className="w-[72px] bg-discord-darkest flex flex-col items-center py-3 space-y-2 overflow-y-auto scrollbar-hide z-20">
      
      {/* Direct Messages / Home Placeholder */}
      <div className="relative group w-full flex justify-center cursor-pointer">
         <div className={`absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-r-full transition-all duration-200 ${activeServerId === 'home' ? 'h-10 w-[4px]' : 'h-2 w-[4px] scale-0 group-hover:scale-100 group-hover:h-5'}`} />
         <div className={`w-12 h-12 rounded-[24px] bg-discord-dark flex items-center justify-center transition-all duration-200 hover:rounded-[16px] hover:bg-discord-brand ${activeServerId === 'home' ? 'bg-discord-brand rounded-[16px]' : ''}`}>
           <img src="https://assets-global.website-files.com/6257adef93867e56f84d3092/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png" className="w-7 h-7" alt="Home" />
         </div>
      </div>

      <div className="w-8 h-[2px] bg-discord-darker rounded-lg mx-auto" />

      {servers.map(server => (
        <ServerIcon 
          key={server.id} 
          server={server} 
          isActive={activeServerId === server.id}
          onClick={() => onServerClick(server.id)}
        />
      ))}

      <div className="w-8 h-[2px] bg-discord-darker rounded-lg mx-auto" />

      <ActionIcon icon={Plus} />
      <ActionIcon icon={Compass} />
      <ActionIcon icon={Download} />
    </div>
  );
};