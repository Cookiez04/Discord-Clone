import React, { useState } from 'react';
import { Server, Channel, Category, User } from '../types';
import { ChevronDown, Hash, Volume2, Mic, Headphones, Settings, UserPlus, Phone, Video, Globe, Monitor, PhoneOff } from 'lucide-react';

interface Props {
  server: Server;
  activeChannelId: string;
  connectedVoiceChannelId?: string | null;
  currentUser: User;
  onChannelClick: (id: string, type: string) => void;
  onDisconnectVoice: () => void;
  onOpenSettings: () => void;
  onStatusChange: (status: 'online' | 'idle' | 'dnd' | 'offline') => void;
}

const ChannelItem: React.FC<{ 
  channel: Channel; 
  isActive: boolean; 
  isConnectedVoice?: boolean;
  onClick: () => void 
}> = ({ 
  channel, 
  isActive, 
  isConnectedVoice,
  onClick 
}) => {
  const isVoice = channel.type === 'voice';

  return (
    <div 
      onClick={onClick}
      className={`
        group px-2 mx-2 py-[5px] rounded flex items-center cursor-pointer mb-[2px] select-none
        ${isActive ? 'bg-discord-hover/60 text-white' : 'text-discord-text-muted hover:bg-discord-hover/40 hover:text-discord-text-normal'}
      `}
    >
      <div className="mr-1.5 text-discord-text-muted group-hover:text-discord-text-normal">
        {isVoice ? <Volume2 size={18} /> : <Hash size={18} />}
      </div>
      <span className={`font-medium truncate ${isActive ? 'text-white' : ''} ${isConnectedVoice ? 'text-discord-green' : ''}`}>
        {channel.name}
      </span>
      
      {/* Voice Channel Users */}
      {isVoice && channel.activeUsers && channel.activeUsers.length > 0 && (
        <div className="ml-auto flex items-center">
             <div className="flex -space-x-2">
                 {channel.activeUsers.map(uid => (
                     <div key={uid} className="w-4 h-4 rounded-full bg-gray-500 border border-discord-darker" />
                 ))}
             </div>
        </div>
      )}
    </div>
  );
};

const CategoryHeader = ({ name }: { name: string }) => (
  <div className="flex items-center justify-between px-4 pt-4 pb-1 text-xs font-bold text-discord-text-muted uppercase hover:text-discord-text-normal cursor-pointer select-none">
    <div className="flex items-center">
      <ChevronDown size={10} className="mr-0.5" />
      {name}
    </div>
    <PlusButton />
  </div>
);

const PlusButton = () => (
  <button className="text-discord-text-muted hover:text-discord-text-normal">
    <svg width="18" height="18" viewBox="0 0 24 24">
       <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
    </svg>
  </button>
);

const VoiceConnectionPanel = ({ 
    channelName, 
    serverName, 
    onDisconnect 
}: { 
    channelName: string; 
    serverName: string;
    onDisconnect: () => void;
}) => (
    <div className="bg-discord-dark border-b border-discord-darkest p-2">
        <div className="flex items-center justify-between text-discord-green mb-1">
            <div className="flex items-center text-xs font-bold">
                <Globe size={14} className="mr-1" />
                <span>Voice Connected</span>
            </div>
        </div>
        <div className="flex items-center justify-between">
            <div className="text-xs truncate max-w-[120px]">
                <div className="text-white font-medium">{channelName} / {serverName}</div>
            </div>
            <div className="flex items-center space-x-2">
                 <button className="p-1.5 rounded hover:bg-discord-darker text-white" title="Share Screen">
                    <Monitor size={16} />
                 </button>
                 <button 
                    className="p-1.5 rounded hover:bg-discord-darker text-white" 
                    title="Disconnect"
                    onClick={(e) => { e.stopPropagation(); onDisconnect(); }}
                >
                    <PhoneOff size={16} />
                 </button>
            </div>
        </div>
    </div>
);

const UserControls = ({ user, onOpenSettings, onStatusChange }: { user: User, onOpenSettings: () => void, onStatusChange: (s: 'online' | 'idle' | 'dnd' | 'offline') => void }) => {
    const [showStatusMenu, setShowStatusMenu] = useState(false);

    return (
        <div className="h-[52px] bg-[#292b2f] flex items-center px-2 shrink-0 relative">
            {/* Status Menu Popup */}
            {showStatusMenu && (
                <div className="absolute bottom-14 left-2 w-[200px] bg-discord-darkest rounded-lg shadow-xl p-2 z-50 border border-discord-dark">
                    <div 
                        className="flex items-center px-2 py-1.5 rounded hover:bg-discord-brand/20 cursor-pointer group"
                        onClick={() => { onStatusChange('online'); setShowStatusMenu(false); }}
                    >
                        <div className="w-2.5 h-2.5 rounded-full bg-discord-green mr-2" />
                        <span className="text-sm font-medium text-discord-text-normal group-hover:text-white">Online</span>
                    </div>
                    <div 
                        className="flex items-center px-2 py-1.5 rounded hover:bg-discord-brand/20 cursor-pointer group"
                        onClick={() => { onStatusChange('idle'); setShowStatusMenu(false); }}
                    >
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 mr-2" />
                        <span className="text-sm font-medium text-discord-text-normal group-hover:text-white">Idle</span>
                    </div>
                    <div 
                        className="flex items-center px-2 py-1.5 rounded hover:bg-discord-brand/20 cursor-pointer group"
                        onClick={() => { onStatusChange('dnd'); setShowStatusMenu(false); }}
                    >
                        <div className="w-2.5 h-2.5 rounded-full bg-discord-red mr-2" />
                        <span className="text-sm font-medium text-discord-text-normal group-hover:text-white">Do Not Disturb</span>
                    </div>
                    <div 
                        className="flex items-center px-2 py-1.5 rounded hover:bg-discord-brand/20 cursor-pointer group"
                        onClick={() => { onStatusChange('offline'); setShowStatusMenu(false); }}
                    >
                        <div className="w-2.5 h-2.5 rounded-full bg-gray-500 mr-2 border-2 border-discord-text-muted box-border" />
                        <span className="text-sm font-medium text-discord-text-normal group-hover:text-white">Invisible</span>
                    </div>
                </div>
            )}
            
            {/* Click outside blocker for status menu */}
            {showStatusMenu && <div className="fixed inset-0 z-40" onClick={() => setShowStatusMenu(false)} />}

            <div 
                className="group flex items-center mr-auto py-1 px-0.5 rounded hover:bg-discord-light cursor-pointer min-w-0"
                onClick={() => setShowStatusMenu(!showStatusMenu)}
            >
            <div className="relative mr-2">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-600">
                    <img src={user.avatar} alt={user.username} className="w-full h-full object-cover"/>
                </div>
                <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-[3px] border-[#292b2f]
                    ${user.status === 'online' ? 'bg-discord-green' : 
                    user.status === 'idle' ? 'bg-yellow-500' :
                    user.status === 'dnd' ? 'bg-discord-red' : 'bg-gray-500'}
                `} />
            </div>
            <div className="flex flex-col mr-2 min-w-0">
                <div className="text-sm font-semibold text-white truncate leading-tight">{user.username}</div>
                <div className="text-xs text-discord-text-muted truncate leading-tight">#{user.discriminator}</div>
            </div>
            </div>
            <div className="flex items-center space-x-0">
            <button className="w-8 h-8 rounded flex items-center justify-center hover:bg-discord-light text-discord-text-normal">
                <Mic size={18} />
            </button>
            <button className="w-8 h-8 rounded flex items-center justify-center hover:bg-discord-light text-discord-text-normal">
                <Headphones size={18} />
            </button>
            <button 
                onClick={onOpenSettings}
                className="w-8 h-8 rounded flex items-center justify-center hover:bg-discord-light text-discord-text-normal"
            >
                <Settings size={18} />
            </button>
            </div>
        </div>
    );
}

export const ChannelSidebar: React.FC<Props> = ({ server, activeChannelId, connectedVoiceChannelId, onChannelClick, onDisconnectVoice, currentUser, onOpenSettings, onStatusChange }) => {
  
  const connectedChannel = connectedVoiceChannelId ? server.channels.find(c => c.id === connectedVoiceChannelId) : null;

  return (
    <div className="w-60 bg-discord-darker flex flex-col h-full">
      {/* Server Header */}
      <div className="h-12 px-4 flex items-center justify-between shadow-sm hover:bg-discord-light/30 cursor-pointer transition-colors shrink-0 border-b border-discord-darkest">
        <h1 className="font-bold text-white truncate">{server.name}</h1>
        <ChevronDown size={20} className="text-white" />
      </div>

      {/* Channel List Scroller */}
      <div className="flex-1 overflow-y-auto custom-scrollbar py-3 space-y-[2px]">
        {server.categories.map(category => (
          <div key={category.id}>
            <CategoryHeader name={category.name} />
            {category.channelIds.map(channelId => {
              const channel = server.channels.find(c => c.id === channelId);
              if (!channel) return null;
              return (
                <ChannelItem 
                  key={channel.id} 
                  channel={channel} 
                  isActive={activeChannelId === channel.id} 
                  isConnectedVoice={connectedVoiceChannelId === channel.id}
                  onClick={() => onChannelClick(channel.id, channel.type)}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Active Voice Status */}
      {connectedChannel && (
          <VoiceConnectionPanel 
            channelName={connectedChannel.name} 
            serverName={server.name}
            onDisconnect={onDisconnectVoice}
          />
      )}
      
      {/* User Controls */}
      <UserControls user={currentUser} onOpenSettings={onOpenSettings} onStatusChange={onStatusChange} />
    </div>
  );
};