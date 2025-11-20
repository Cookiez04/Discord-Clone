import React from 'react';
import { User } from '../types';
import { X, LogOut, Monitor, Lock, Shield, Key, Smartphone } from 'lucide-react';

interface Props {
  user: User;
  onClose: () => void;
}

const SidebarItem = ({ label, isActive = false, isRed = false }: { label: string, isActive?: boolean, isRed?: boolean }) => (
    <div className={`
        px-2.5 py-1.5 rounded mb-[2px] cursor-pointer text-[15px] font-medium
        ${isActive ? 'bg-discord-light/60 text-white' : 'text-discord-text-muted hover:bg-discord-light/40 hover:text-discord-text-normal'}
        ${isRed ? 'text-red-400 hover:text-red-500' : ''}
    `}>
        {label}
    </div>
);

export const SettingsModal: React.FC<Props> = ({ user, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex bg-discord-darkest">
      {/* Sidebar */}
      <div className="w-[28%] min-w-[200px] bg-[#2f3136] flex justify-end pt-14 pr-4 pb-4">
          <div className="w-[192px] flex flex-col">
             <div className="px-2.5 pb-1.5 text-xs font-bold text-discord-text-muted uppercase">User Settings</div>
             <SidebarItem label="My Account" isActive={true} />
             <SidebarItem label="Profiles" />
             <SidebarItem label="Privacy & Safety" />
             <SidebarItem label="Authorized Apps" />
             <SidebarItem label="Connections" />
             
             <div className="w-full h-[1px] bg-discord-divider my-2" />
             
             <div className="px-2.5 pb-1.5 text-xs font-bold text-discord-text-muted uppercase mt-2">App Settings</div>
             <SidebarItem label="Appearance" />
             <SidebarItem label="Accessibility" />
             <SidebarItem label="Voice & Video" />
             <SidebarItem label="Keybinds" />
             <SidebarItem label="Language" />

             <div className="w-full h-[1px] bg-discord-divider my-2" />
             
             <SidebarItem label="Log Out" isRed={true} />
          </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-discord-dark pt-14 pl-10 pr-10 overflow-y-auto custom-scrollbar">
         <div className="max-w-[700px]">
             <h2 className="text-xl font-bold text-white mb-5">My Account</h2>
             
             {/* Banner Card */}
             <div className="bg-discord-darkest rounded-lg overflow-hidden relative mb-8">
                 <div className="h-[100px]" style={{ backgroundColor: user.bannerColor || '#5865F2' }}></div>
                 <div className="p-4 pt-12 relative">
                     <div className="absolute -top-[40px] left-4 w-[80px] h-[80px] rounded-full border-[6px] border-discord-darkest bg-gray-700 overflow-hidden">
                        <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                        <div className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-[4px] border-discord-darkest
                            ${user.status === 'online' ? 'bg-discord-green' : 
                              user.status === 'idle' ? 'bg-yellow-500' :
                              user.status === 'dnd' ? 'bg-discord-red' : 'bg-gray-500'}
                        `} />
                     </div>
                     
                     <div className="flex justify-between items-end">
                         <div>
                             <div className="text-xl font-bold text-white flex items-center">
                                 {user.username}
                                 <span className="text-discord-text-muted text-lg font-medium ml-1">#{user.discriminator}</span>
                             </div>
                         </div>
                         <button className="bg-discord-brand hover:bg-discord-brand/80 text-white px-4 py-1.5 rounded text-sm font-medium transition-colors">
                             Edit User Profile
                         </button>
                     </div>

                     {/* User Info Fields */}
                     <div className="mt-6 bg-discord-light/30 rounded-lg p-4 space-y-4">
                         <div className="flex justify-between items-center">
                             <div>
                                 <div className="text-xs font-bold text-discord-text-muted uppercase mb-1">Display Name</div>
                                 <div className="text-white">{user.username}</div>
                             </div>
                             <button className="bg-discord-light hover:bg-discord-hover text-white px-3 py-1.5 rounded text-sm">Edit</button>
                         </div>
                         <div className="flex justify-between items-center">
                             <div>
                                 <div className="text-xs font-bold text-discord-text-muted uppercase mb-1">Email</div>
                                 <div className="text-white">frontend.wizard@example.com</div>
                             </div>
                             <button className="bg-discord-light hover:bg-discord-hover text-white px-3 py-1.5 rounded text-sm">Edit</button>
                         </div>
                         <div className="flex justify-between items-center">
                             <div>
                                 <div className="text-xs font-bold text-discord-text-muted uppercase mb-1">Phone Number</div>
                                 <div className="text-white">*******8821</div>
                             </div>
                             <button className="bg-discord-light hover:bg-discord-hover text-white px-3 py-1.5 rounded text-sm">Edit</button>
                         </div>
                     </div>
                 </div>
             </div>

             <div className="w-full h-[1px] bg-discord-divider mb-8" />

             <h2 className="text-xl font-bold text-white mb-4">Password and Authentication</h2>
             <button className="bg-discord-brand hover:bg-discord-brand/80 text-white px-4 py-2 rounded text-sm font-medium transition-colors mb-6">
                 Change Password
             </button>

             <div className="bg-discord-darkest rounded-lg p-4 mb-8">
                <div className="text-xs font-bold text-discord-text-muted uppercase mb-3">Two-Factor Authentication</div>
                <div className="flex justify-between items-center">
                    <div className="text-discord-text-muted text-sm max-w-[400px]">
                        Protect your Discord account with an extra layer of security. Once configured, you'll be required to enter both your password and an authentication code from your mobile phone in order to sign in.
                    </div>
                    <button className="bg-discord-brand hover:bg-discord-brand/80 text-white px-4 py-2 rounded text-sm font-medium transition-colors">
                        Enable 2FA
                    </button>
                </div>
             </div>

         </div>
      </div>

      {/* Escape Button */}
      <div className="w-[18%] pt-14 pl-4 pr-4">
          <div className="flex flex-col items-start sticky top-14">
              <button 
                  onClick={onClose}
                  className="group flex flex-col items-center justify-center w-9 h-9 rounded-full border-2 border-discord-text-muted text-discord-text-muted hover:bg-discord-text-muted/20 hover:text-discord-text-normal transition-all mb-2"
              >
                  <X size={18} strokeWidth={3} />
              </button>
              <div className="text-xs font-bold text-discord-text-muted group-hover:text-discord-text-normal text-center w-9">ESC</div>
          </div>
      </div>
    </div>
  );
};