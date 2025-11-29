import React from 'react';
import { User, AppState } from '../types';
import { X, LogOut, Monitor, Lock, Shield, Key, Smartphone, Moon, Sun, CloudMoon, Palette } from 'lucide-react';

interface Props {
    user: User;
    theme: AppState['theme'];
    accentColor: string;
    onClose: () => void;
    onUpdateTheme: (theme: AppState['theme']) => void;
    onUpdateAccentColor: (color: string) => void;
}

const SidebarItem = ({ label, isActive = false, isRed = false, onClick }: { label: string, isActive?: boolean, isRed?: boolean, onClick?: () => void }) => (
    <div
        onClick={onClick}
        className={`
        px-2.5 py-1.5 rounded mb-[2px] cursor-pointer text-[15px] font-medium
        ${isActive ? 'bg-discord-light/60 text-white' : 'text-discord-text-muted hover:bg-discord-light/40 hover:text-discord-text-normal'}
        ${isRed ? 'text-red-400 hover:text-red-500' : ''}
    `}>
        {label}
    </div>
);

const ColorSwatch = ({ color, selected, onClick }: { color: string, selected: boolean, onClick: () => void }) => (
    <div
        onClick={onClick}
        className={`w-10 h-10 rounded-full cursor-pointer transition-transform hover:scale-110 border-2 ${selected ? 'border-white' : 'border-transparent'}`}
        style={{ backgroundColor: color }}
    />
);

export const SettingsModal: React.FC<Props> = ({ user, theme, accentColor, onClose, onUpdateTheme, onUpdateAccentColor }) => {
    const [activeTab, setActiveTab] = React.useState('My Account');

    const renderContent = () => {
        switch (activeTab) {
            case 'Appearance':
                return (
                    <div className="max-w-[700px]">
                        <h2 className="text-xl font-bold text-white mb-5">Appearance</h2>

                        {/* Theme Section */}
                        <div className="mb-8">
                            <h3 className="text-xs font-bold text-discord-text-muted uppercase mb-3">Theme</h3>
                            <div className="grid grid-cols-3 gap-4">
                                <div
                                    onClick={() => onUpdateTheme('light')}
                                    className={`bg-white rounded-lg p-4 cursor-pointer border-2 ${theme === 'light' ? 'border-discord-brand' : 'border-transparent'} hover:opacity-90`}
                                >
                                    <div className="flex items-center justify-center mb-2 text-gray-800">
                                        <Sun size={32} />
                                    </div>
                                    <div className="text-center font-bold text-gray-800">Light</div>
                                </div>
                                <div
                                    onClick={() => onUpdateTheme('dark')}
                                    className={`bg-[#36393f] rounded-lg p-4 cursor-pointer border-2 ${theme === 'dark' ? 'border-discord-brand' : 'border-transparent'} hover:opacity-90`}
                                >
                                    <div className="flex items-center justify-center mb-2 text-gray-200">
                                        <Moon size={32} />
                                    </div>
                                    <div className="text-center font-bold text-gray-200">Dark</div>
                                </div>
                                <div
                                    onClick={() => onUpdateTheme('midnight')}
                                    className={`bg-[#000000] rounded-lg p-4 cursor-pointer border-2 ${theme === 'midnight' ? 'border-discord-brand' : 'border-transparent'} hover:opacity-90`}
                                >
                                    <div className="flex items-center justify-center mb-2 text-gray-400">
                                        <CloudMoon size={32} />
                                    </div>
                                    <div className="text-center font-bold text-gray-400">Midnight</div>
                                </div>
                            </div>
                        </div>

                        {/* Accent Color Section */}
                        <div className="mb-8">
                            <h3 className="text-xs font-bold text-discord-text-muted uppercase mb-3">Accent Color</h3>
                            <div className="flex flex-wrap gap-4">
                                <ColorSwatch color="#5865F2" selected={accentColor === '#5865F2'} onClick={() => onUpdateAccentColor('#5865F2')} />
                                <ColorSwatch color="#EB459E" selected={accentColor === '#EB459E'} onClick={() => onUpdateAccentColor('#EB459E')} />
                                <ColorSwatch color="#F1C40F" selected={accentColor === '#F1C40F'} onClick={() => onUpdateAccentColor('#F1C40F')} />
                                <ColorSwatch color="#3BA55C" selected={accentColor === '#3BA55C'} onClick={() => onUpdateAccentColor('#3BA55C')} />
                                <ColorSwatch color="#ED4245" selected={accentColor === '#ED4245'} onClick={() => onUpdateAccentColor('#ED4245')} />
                                <ColorSwatch color="#00E5FF" selected={accentColor === '#00E5FF'} onClick={() => onUpdateAccentColor('#00E5FF')} />
                                <ColorSwatch color="#9B59B6" selected={accentColor === '#9B59B6'} onClick={() => onUpdateAccentColor('#9B59B6')} />
                                <ColorSwatch color="#E67E22" selected={accentColor === '#E67E22'} onClick={() => onUpdateAccentColor('#E67E22')} />
                            </div>
                        </div>
                    </div>
                );
            case 'My Account':
            default:
                return (
                    <div className="max-w-[700px]">
                        <h2 className="text-xl font-bold text-white mb-5">My Account</h2>

                        {/* Banner Card */}
                        <div className="bg-discord-darkest rounded-lg overflow-hidden relative mb-8">
                            <div className="h-[100px]" style={{ backgroundColor: user.bannerColor || accentColor }}></div>
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
                                            <div className="text-white">cyber.drifter@glitchcity.net</div>
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
                    </div>
                );
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex bg-discord-darkest">
            {/* Sidebar */}
            <div className="w-[28%] min-w-[200px] bg-discord-darker flex justify-end pt-14 pr-4 pb-4">
                <div className="w-[192px] flex flex-col">
                    <div className="px-2.5 pb-1.5 text-xs font-bold text-discord-text-muted uppercase">User Settings</div>
                    <SidebarItem label="My Account" isActive={activeTab === 'My Account'} onClick={() => setActiveTab('My Account')} />
                    <SidebarItem label="Profiles" />
                    <SidebarItem label="Privacy & Safety" />
                    <SidebarItem label="Authorized Apps" />
                    <SidebarItem label="Connections" />

                    <div className="w-full h-[1px] bg-discord-divider my-2" />

                    <div className="px-2.5 pb-1.5 text-xs font-bold text-discord-text-muted uppercase mt-2">App Settings</div>
                    <SidebarItem label="Appearance" isActive={activeTab === 'Appearance'} onClick={() => setActiveTab('Appearance')} />
                    <SidebarItem label="Accessibility" />
                    <SidebarItem label="Voice & Video" />
                    <SidebarItem label="Keybinds" />
                    <SidebarItem label="Language" />

                    <div className="w-full h-[1px] bg-discord-divider my-2" />

                    <SidebarItem label="Log Out" isRed={true} onClick={onClose} />
                    <div className="mt-4 text-xs text-discord-text-muted px-2">
                        Glitch City 2077 Client <br />
                        Build 8821.99 <br />
                        <span className="block mt-2">
                            Made by <a href="https://github.com/Cookiez04" target="_blank" rel="noopener noreferrer" className="text-discord-brand hover:underline">Cookiez04</a>
                        </span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 bg-discord-dark pt-14 pl-10 pr-10 overflow-y-auto custom-scrollbar relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-discord-text-muted hover:text-white flex flex-col items-center"
                >
                    <div className="border-2 border-discord-text-muted rounded-full p-1 mb-1 hover:border-white">
                        <X size={16} />
                    </div>
                    <span className="text-xs font-bold uppercase">ESC</span>
                </button>

                {renderContent()}
            </div>
        </div>
    );
};