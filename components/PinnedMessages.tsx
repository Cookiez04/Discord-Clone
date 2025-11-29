import React from 'react';
import { Message, User } from '../types';
import { Pin, X, ExternalLink } from 'lucide-react';

interface Props {
    messages: Message[];
    users: Record<string, User>;
    onClose: () => void;
    onJumpToMessage: (messageId: string) => void;
    onUnpinMessage: (messageId: string) => void;
}

export const PinnedMessages: React.FC<Props> = ({ messages, users, onClose, onJumpToMessage, onUnpinMessage }) => {
    const pinnedMessages = messages.filter(m => m.pinned);

    return (
        <div className="absolute top-12 right-0 w-[400px] h-[calc(100%-48px)] bg-discord-darker border-l border-discord-darkest shadow-xl z-[100] flex flex-col animate-in slide-in-from-right-10 duration-200">
            {/* Header */}
            <div className="p-4 bg-discord-dark border-b border-discord-darkest flex items-center justify-between shrink-0">
                <div className="flex items-center font-bold text-white">
                    <Pin size={20} className="mr-2 text-discord-text-muted" />
                    Pinned Messages
                </div>
                <button onClick={onClose} className="text-discord-text-muted hover:text-white transition-colors">
                    <X size={20} />
                </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                {pinnedMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-70">
                        <div className="w-24 h-24 bg-discord-dark rounded-full flex items-center justify-center mb-4">
                            <Pin size={40} className="text-discord-text-muted" />
                        </div>
                        <div className="text-white font-bold mb-2">No pinned messages</div>
                        <div className="text-sm text-discord-text-muted">Pin important messages to see them here!</div>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {pinnedMessages.map(msg => {
                            const user = users[msg.userId];
                            return (
                                <div key={msg.id} className="bg-discord-dark p-3 rounded border border-discord-darkest group relative hover:border-discord-text-muted transition-colors">
                                    <div className="flex items-center mb-1">
                                        <img src={user?.avatar} alt="" className="w-6 h-6 rounded-full mr-2" />
                                        <span className="font-bold text-white text-sm mr-2">{user?.username}</span>
                                        <span className="text-xs text-discord-text-muted">{new Date(msg.timestamp).toLocaleDateString()}</span>
                                    </div>
                                    <div className="text-sm text-discord-text-normal pl-8 mb-1 line-clamp-4">
                                        {msg.content}
                                    </div>
                                    
                                    {/* Actions Overlay */}
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex space-x-1 bg-discord-dark rounded shadow-sm border border-discord-darkest p-0.5">
                                        <button 
                                            onClick={() => onJumpToMessage(msg.id)}
                                            className="p-1 text-discord-text-muted hover:text-white hover:bg-discord-light rounded"
                                            title="Jump to message"
                                        >
                                            <ExternalLink size={14} />
                                        </button>
                                        <button 
                                            onClick={() => onUnpinMessage(msg.id)}
                                            className="p-1 text-discord-text-muted hover:text-discord-red hover:bg-discord-light rounded"
                                            title="Unpin"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};
