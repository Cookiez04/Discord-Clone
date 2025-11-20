import React from 'react';
import { User, Server } from '../types';

interface Props {
  server: Server;
  users: Record<string, User>;
  onUserClick: (e: React.MouseEvent, user: User) => void;
}

const MemberItem: React.FC<{ user: User, onClick: (e: React.MouseEvent) => void }> = ({ user, onClick }) => (
  <div 
    onClick={onClick}
    className="flex items-center px-2.5 py-1.5 rounded hover:bg-discord-hover/40 cursor-pointer group opacity-90 hover:opacity-100"
  >
    <div className="relative mr-3">
      <div className="w-8 h-8 rounded-full bg-gray-600 overflow-hidden">
        <img src={user.avatar} alt={user.username} className="w-full h-full object-cover opacity-100" />
      </div>
      <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-[3px] border-[#2f3136]
         ${user.status === 'online' ? 'bg-discord-green' : 
           user.status === 'idle' ? 'bg-yellow-500' :
           user.status === 'dnd' ? 'bg-discord-red' : 'bg-gray-500'}
      `} />
    </div>
    <div className="flex flex-col min-w-0">
      <div className="flex items-center">
          <span 
            className={`font-medium truncate group-hover:text-discord-text-normal ${user.status === 'offline' ? 'text-discord-text-muted' : ''}`}
            style={{ color: user.status !== 'offline' ? (user.color || '#dcddde') : undefined }}
          >
            {user.username}
          </span>
          {user.bot && (
             <span className="ml-1.5 bg-discord-brand text-white text-[10px] px-1.5 py-[1px] rounded font-bold uppercase leading-tight">Bot</span>
          )}
      </div>
      {user.activity && (
          <div className="text-xs text-discord-text-muted truncate">
              {user.activity}
          </div>
      )}
    </div>
  </div>
);

export const MemberSidebar: React.FC<Props> = ({ server, users, onUserClick }) => {
  // Filter members belonging to this server
  const members = server.members.map(id => users[id]).filter(Boolean);
  
  // Sort members: Online first, then alphabetically
  const onlineMembers = members.filter(m => m.status !== 'offline').sort((a, b) => a.username.localeCompare(b.username));
  const offlineMembers = members.filter(m => m.status === 'offline').sort((a, b) => a.username.localeCompare(b.username));

  return (
    <div className="w-60 bg-discord-darker flex flex-col h-full overflow-y-auto custom-scrollbar p-3">
      {onlineMembers.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xs font-bold text-discord-text-muted uppercase mb-2 px-2.5">
            Online — {onlineMembers.length}
          </h3>
          {onlineMembers.map(user => (
            <MemberItem key={user.id} user={user} onClick={(e) => onUserClick(e, user)} />
          ))}
        </div>
      )}

      {offlineMembers.length > 0 && (
        <div>
          <h3 className="text-xs font-bold text-discord-text-muted uppercase mb-2 px-2.5">
            Offline — {offlineMembers.length}
          </h3>
          {offlineMembers.map(user => (
            <MemberItem key={user.id} user={user} onClick={(e) => onUserClick(e, user)} />
          ))}
        </div>
      )}
    </div>
  );
};