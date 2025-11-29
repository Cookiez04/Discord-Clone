import React, { useState, useRef, useEffect } from 'react';
import { Channel, Message, User, Server } from '../types';
import { Hash, Bell, Pin, Users, Search, PlusCircle, Gift, Sticker, Smile, HelpCircle, Inbox, MessageSquare, Trash2, Edit2, Reply, X, Command, AtSign, Volume2, Mic, Upload } from 'lucide-react';
import { renderMarkdown } from '../utils/markdown';
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react';
import confetti from 'canvas-confetti';
import { SoundboardPanel } from './SoundboardPanel';
import { Lightbox } from './Lightbox';

interface Props {
    channel: Channel;
    server: Server;
    messages: Message[];
    users: Record<string, User>;
    typingUsers: User[];
    onSendMessage: (content: string, replyToId?: string) => void;
    onEditMessage: (messageId: string, content: string) => void;
    onDeleteMessage: (messageId: string) => void;
    onAddReaction: (messageId: string, emoji: string) => void;
    onVotePoll: (messageId: string, optionIndex: number) => void;
    toggleMemberList: () => void;
    showMemberList: boolean;
    onUserClick: (e: React.MouseEvent, user: User) => void;
}

const MessageItem: React.FC<{
    message: Message;
    user: User;
    isConsecutive: boolean;
    previousMessageTime?: string;
    replyToMessage?: Message;
    replyToUser?: User;
    onDelete: () => void;
    onReply: () => void;
    onReact: (emoji: string) => void;
    onEdit: (newContent: string) => void;
    onVote: (optionIndex: number) => void;
    isCurrentUser: boolean;
    onUserClick: (e: React.MouseEvent, user: User) => void;
    onImageClick: (url: string) => void;
}> = ({
    message,
    user,
    isConsecutive,
    replyToMessage,
    replyToUser,
    onDelete,
    onReply,
    onReact,
    onEdit,
    onVote,
    isCurrentUser,
    onUserClick,
    onImageClick
}) => {
        const [isEditing, setIsEditing] = useState(false);
        const [editContent, setEditContent] = useState(message.content);
        const editInputRef = useRef<HTMLInputElement>(null);

        const date = new Date(message.timestamp);
        const today = new Date();
        const isToday = date.getDate() === today.getDate() && date.getMonth() === today.getMonth();
        const timestampStr = isToday
            ? `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
            : date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const compactTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        useEffect(() => {
            if (isEditing && editInputRef.current) {
                editInputRef.current.focus();
            }
        }, [isEditing]);

        const handleSaveEdit = () => {
            if (editContent.trim()) {
                onEdit(editContent);
                setIsEditing(false);
            } else {
                setIsEditing(false);
                setEditContent(message.content);
            }
        };

        const handleKeyDownEdit = (e: React.KeyboardEvent) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSaveEdit();
            } else if (e.key === 'Escape') {
                setIsEditing(false);
                setEditContent(message.content);
            }
        };

        const handleSpeak = () => {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel(); // Stop previous
                const utterance = new SpeechSynthesisUtterance(message.content);
                utterance.rate = 1.0;
                utterance.pitch = 1.0;
                window.speechSynthesis.speak(utterance);
            }
        };

        return (
            <div
                className={`
        group flex pr-4 pl-4 
        ${isConsecutive ? 'mt-[2px] py-0.5' : 'mt-[17px] py-0.5'} 
        hover:bg-discord-darker/30 -mx-0 relative
        ${isEditing ? 'bg-discord-darker/30' : ''}
      `}
            >
                {/* Message Actions Toolbar (Hover) */}
                {!isEditing && (
                    <div className="absolute right-4 -top-2 bg-discord-dark shadow-sm border border-discord-darker rounded flex items-center p-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <button onClick={handleSpeak} className="p-1 hover:bg-discord-light rounded text-discord-text-muted hover:text-discord-text-normal" title="Speak Message">
                            <Volume2 size={16} />
                        </button>
                        <button onClick={() => onReact('👍')} className="p-1 hover:bg-discord-light rounded text-discord-text-muted hover:text-discord-text-normal" title="Add Reaction">
                            <Smile size={16} />
                        </button>
                        <button onClick={onReply} className="p-1 hover:bg-discord-light rounded text-discord-text-muted hover:text-discord-text-normal" title="Reply">
                            <Reply size={16} />
                        </button>
                        {isCurrentUser && (
                            <button onClick={() => setIsEditing(true)} className="p-1 hover:bg-discord-light rounded text-discord-text-muted hover:text-discord-text-normal" title="Edit">
                                <Edit2 size={16} />
                            </button>
                        )}
                        {isCurrentUser && (
                            <button onClick={onDelete} className="p-1 hover:bg-discord-light rounded text-discord-red hover:text-white" title="Delete">
                                <Trash2 size={16} />
                            </button>
                        )}
                    </div>
                )}

                {/* Consecutive Timestamp Hover */}
                {isConsecutive && (
                    <div className="absolute left-0 w-[72px] text-xs text-discord-text-muted opacity-0 group-hover:opacity-100 text-right pr-2 select-none top-1 font-mono">
                        {compactTime}
                    </div>
                )}

                {/* Avatar (Non-consecutive) */}
                {!isConsecutive ? (
                    <div
                        onClick={(e) => onUserClick(e, user)}
                        className="w-10 h-10 rounded-full bg-gray-600 mr-4 mt-0.5 shrink-0 overflow-hidden cursor-pointer hover:drop-shadow-md active:translate-y-[1px] relative"
                    >
                        <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                    </div>
                ) : (
                    <div className="w-10 mr-4 shrink-0" />
                )}

                <div className="flex-1 min-w-0">
                    {/* Reply Context Header */}
                    {!isConsecutive && replyToMessage && (
                        <div className="flex items-center text-xs text-discord-text-muted mb-1 -ml-14 relative">
                            <div className="w-8 h-[2px] border-t-2 border-l-2 border-discord-light rounded-tl-md absolute left-[34px] top-2.5 w-8 h-3" />
                            <div className="ml-14 flex items-center gap-1 opacity-80 hover:opacity-100 cursor-pointer">
                                <img src={replyToUser?.avatar} className="w-4 h-4 rounded-full" alt="" />
                                <span className="font-semibold hover:underline" onClick={(e) => replyToUser && onUserClick(e, replyToUser)}>@{replyToUser?.username}</span>
                                <span className="truncate max-w-[300px]">{replyToMessage.content}</span>
                            </div>
                        </div>
                    )}

                    {/* Header (Non-consecutive) */}
                    {!isConsecutive && (
                        <div className="flex items-center">
                            <span
                                onClick={(e) => onUserClick(e, user)}
                                className="font-medium mr-2 hover:underline cursor-pointer"
                                style={{ color: user.color || '#fff' }}
                            >
                                {user.username}
                            </span>
                            {user.bot && (
                                <span className="bg-discord-brand text-white text-[10px] px-1.5 py-[1px] rounded font-bold uppercase mr-2 leading-tight align-middle">
                                    Bot
                                </span>
                            )}
                            <span className="text-xs text-discord-text-muted ml-0.5 select-none">
                                {timestampStr}
                            </span>
                        </div>
                    )}

                    {/* Content or Edit Input */}
                    {isEditing ? (
                        <div className="mt-1 bg-discord-light/50 rounded p-2">
                            <input
                                ref={editInputRef}
                                className="w-full bg-discord-darker text-discord-text-normal p-2 rounded focus:outline-none"
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                onKeyDown={handleKeyDownEdit}
                            />
                            <div className="text-xs text-discord-text-muted mt-1">
                                escape to <span className="text-discord-brand hover:underline cursor-pointer" onClick={() => setIsEditing(false)}>cancel</span> • enter to <span className="text-discord-brand hover:underline cursor-pointer" onClick={handleSaveEdit}>save</span>
                            </div>
                        </div>
                    ) : (
                        <div className={`text-discord-text-normal whitespace-pre-wrap leading-[1.375rem] ${isConsecutive ? '' : 'mt-0.5'}`}>
                            {renderMarkdown(message.content, onImageClick)}
                            {message.edited && <span className="text-[10px] text-discord-text-muted ml-1">(edited)</span>}
                        </div>
                    )}

                    {/* Poll Display */}
                    {message.poll && (
                        <div className="mt-2 max-w-md bg-discord-darker rounded p-3 border border-discord-darkest">
                            <h4 className="font-bold text-white mb-2">{message.poll.question}</h4>
                            <div className="space-y-2">
                                {message.poll.options.map((option, idx) => {
                                    const totalVotes = message.poll!.options.reduce((acc, opt) => acc + opt.votes, 0);
                                    const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
                                    const isVoted = option.voters.includes('me'); // Assuming 'me' is current user id for now

                                    return (
                                        <div 
                                            key={idx}
                                            className={`relative border rounded p-2 cursor-pointer transition-colors overflow-hidden group
                                                ${isVoted ? 'border-discord-brand' : 'border-discord-darkest hover:border-discord-text-muted'}
                                            `}
                                            // Note: We need a prop to handle voting, for now just visual
                                            onClick={() => onVote(idx)}
                                        >
                                            {/* Progress Bar Background */}
                                            <div 
                                                className={`absolute inset-0 opacity-20 transition-all duration-500 ${isVoted ? 'bg-discord-brand' : 'bg-discord-text-muted'}`} 
                                                style={{ width: `${percentage}%` }}
                                            />
                                            
                                            <div className="flex justify-between items-center relative z-10">
                                                <span className="font-medium text-white">{option.text}</span>
                                                <span className="text-xs text-discord-text-muted font-bold">{percentage}% ({option.votes})</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Embed Display */}
                    {message.embed && (
                        <div className="mt-2 max-w-lg bg-discord-darker border-l-[4px] rounded-r p-4 grid gap-2" style={{ borderLeftColor: message.embed.color || '#202225' }}>
                            <div className="flex items-start justify-between">
                                <div>
                                    {message.embed.title && <h3 className="font-bold text-white mb-1">{message.embed.title}</h3>}
                                    {message.embed.description && <p className="text-sm text-discord-text-normal whitespace-pre-wrap">{message.embed.description}</p>}
                                </div>
                                {message.embed.thumbnail && (
                                    <img src={message.embed.thumbnail} alt="thumbnail" className="w-20 h-20 rounded object-cover ml-4" />
                                )}
                            </div>

                            {message.embed.fields && (
                                <div className="grid grid-cols-1 gap-2 mt-2">
                                    {message.embed.fields.map((field, i) => (
                                        <div key={i} className={field.inline ? 'inline-block mr-4' : ''}>
                                            <div className="text-xs font-bold text-discord-text-muted mb-0.5">{field.name}</div>
                                            <div className="text-sm text-discord-text-normal">{field.value}</div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {message.embed.image && (
                                <div 
                                    className="mt-3 rounded overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onImageClick(message.embed!.image!);
                                    }}
                                >
                                    <img src={message.embed.image} alt="embed" className="w-full rounded" />
                                </div>
                            )}

                            {message.embed.footer && (
                                <div className="flex items-center mt-2 pt-2 border-t border-discord-darkest text-xs text-discord-text-muted">
                                    {message.embed.footer.icon_url && <img src={message.embed.footer.icon_url} alt="" className="w-5 h-5 rounded-full mr-2" />}
                                    <span>{message.embed.footer.text}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Attachments */}
                    {message.attachment && (
                        <div 
                            className="mt-2 max-w-sm rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={(e) => {
                                e.stopPropagation();
                                onImageClick(message.attachment!.url);
                            }}
                        >
                            <img src={message.attachment.url} alt="attachment" className="rounded-lg" />
                        </div>
                    )}

                    {/* Reactions */}
                    {message.reactions && message.reactions.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                            {message.reactions.map((reaction, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => onReact(reaction.emoji)}
                                    className={`
                            flex items-center px-1.5 py-0.5 rounded-[4px] border text-xs font-medium cursor-pointer select-none transition-colors
                            ${reaction.me
                                            ? 'bg-discord-brand/15 border-discord-brand/50 hover:bg-discord-brand/25'
                                            : 'bg-discord-darker hover:bg-discord-light border-transparent hover:border-discord-text-muted/30'}
                        `}
                                >
                                    <span className="mr-1">{reaction.emoji}</span>
                                    <span className={reaction.me ? 'text-discord-brand' : 'text-discord-text-muted'}>{reaction.count}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    };

const MentionMenu: React.FC<{
    users: User[],
    filterText: string,
    selectedIndex: number,
    onSelect: (user: User) => void
}> = ({ users, filterText, selectedIndex, onSelect }) => {
    // Filter users based on query (ignore current user 'me' usually, but showing all here)
    const filtered = users.filter(u =>
        u.id !== 'me' &&
        (u.username.toLowerCase().includes(filterText.toLowerCase()) || u.discriminator.includes(filterText))
    ).slice(0, 10);

    if (filtered.length === 0) return null;

    return (
        <div className="absolute bottom-full left-0 mb-2 w-[200px] bg-discord-darkest rounded-lg border border-[#202225] shadow-2xl overflow-hidden z-50">
            <div className="px-4 py-2 bg-discord-darker border-b border-[#202225] text-xs font-bold text-discord-text-muted uppercase">
                Members
            </div>
            <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
                {filtered.map((u, idx) => (
                    <div
                        key={u.id}
                        className={`px-4 py-2 flex items-center cursor-pointer border-l-2 ${idx === selectedIndex ? 'bg-[#40444b] border-discord-text-normal' : 'border-transparent hover:bg-[#36393f]'}`}
                        onClick={() => onSelect(u)}
                    >
                        <img src={u.avatar} className="w-5 h-5 rounded-full mr-2" alt="" />
                        <div className="font-bold text-discord-text-normal mr-1">{u.username}</div>
                        <div className="text-discord-text-muted text-xs">#{u.discriminator}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const TypingIndicator: React.FC<{ users: User[] }> = ({ users }) => {
    if (users.length === 0) return <div className="h-6 shrink-0" />; // Spacer

    return (
        <div className="h-6 flex items-center px-4 shrink-0 animate-in fade-in duration-300">
            <div className="flex space-x-1 mr-2 items-center h-full pt-1">
                <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: 'var(--discord-text-normal)', animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: 'var(--discord-text-normal)', animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: 'var(--discord-text-normal)', animationDelay: '300ms' }} />
            </div>
            <div className="text-xs font-bold text-discord-text-normal">
                {users.map(u => u.username).join(', ')}
                <span className="font-normal text-discord-text-muted"> {users.length > 1 ? 'are' : 'is'} typing...</span>
            </div>
        </div>
    );
};

export const ChatArea: React.FC<Props> = ({ channel, server, messages, users, typingUsers, onSendMessage, onDeleteMessage, onEditMessage, onAddReaction, onVotePoll, toggleMemberList, showMemberList, onUserClick }) => {
    const [inputValue, setInputValue] = useState('');
    const [replyingTo, setReplyingTo] = useState<Message | null>(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showSoundboard, setShowSoundboard] = useState(false);
    const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

    const onEmojiClick = (emojiData: EmojiClickData) => {
        setInputValue(prev => prev + emojiData.emoji);
        // Keep picker open for multiple emojis or close it? Discord keeps it open usually, but let's keep it simple.
        // Actually Discord keeps it open. Let's keep it open.
        // setShowEmojiPicker(false); 
    };

    // Mention Menu State
    const [mentionMenuOpen, setMentionMenuOpen] = useState(false);
    const [mentionQuery, setMentionQuery] = useState('');
    const [mentionIndex, setMentionIndex] = useState(0);
    const [mentionStartIndex, setMentionStartIndex] = useState(-1);

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages.length, channel.id, typingUsers.length]);

    // Logic to detect @mentions
    useEffect(() => {
        const lastAtIndex = inputValue.lastIndexOf('@');
        if (lastAtIndex !== -1) {
            // Check if there is a space before the @ or it's the start of the string
            if (lastAtIndex === 0 || inputValue[lastAtIndex - 1] === ' ') {
                // Check if there are any spaces AFTER the @ (end of mention search)
                const textAfterAt = inputValue.substring(lastAtIndex + 1);
                if (!textAfterAt.includes(' ')) {
                    setMentionMenuOpen(true);
                    setMentionQuery(textAfterAt);
                    setMentionStartIndex(lastAtIndex);
                    setMentionIndex(0);
                    return;
                }
            }
        }
        setMentionMenuOpen(false);
    }, [inputValue]);

    const insertMention = (user: User) => {
        const before = inputValue.substring(0, mentionStartIndex);
        // We add a space after the mention
        const newValue = `${before}@${user.username} `;
        setInputValue(newValue);
        setMentionMenuOpen(false);

        // Refocus input (handled by autoFocus generally, but nice to ensure)
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        const allUsers = Object.values(users);
        const filteredUsers = allUsers.filter(u => u.id !== 'me' && (u.username.toLowerCase().includes(mentionQuery.toLowerCase())));

        if (mentionMenuOpen && filteredUsers.length > 0) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setMentionIndex(prev => (prev + 1) % filteredUsers.length);
                return;
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setMentionIndex(prev => (prev - 1 + filteredUsers.length) % filteredUsers.length);
                return;
            } else if (e.key === 'Enter' || e.key === 'Tab') {
                e.preventDefault();
                insertMention(filteredUsers[mentionIndex]);
                return;
            } else if (e.key === 'Escape') {
                setMentionMenuOpen(false);
                return;
            }
        }

        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (inputValue.trim()) {
                const lower = inputValue.toLowerCase();
                let contentToSend = inputValue;

                // Confetti Logic
                if (lower.includes('congrats') || lower.includes('yay') || lower.includes('wow') || lower.includes('celebrate')) {
                    confetti({
                        particleCount: 100,
                        spread: 70,
                        origin: { y: 0.6 },
                        zIndex: 9999
                    });
                }

                // Slash Command Logic
                if (lower.startsWith('/flip')) {
                    const result = Math.random() > 0.5 ? 'Heads' : 'Tails';
                    contentToSend = `_flips a coin_ ... **${result}!**`;
                } else if (lower.startsWith('/roll')) {
                    const max = parseInt(lower.split(' ')[1]) || 100;
                    const result = Math.floor(Math.random() * max) + 1;
                    contentToSend = `_rolls a dice_ ... **${result}** (1-${max})`;
                } else if (lower.startsWith('/poll')) {
                    // Simple parser: /poll "Question" "Option1" "Option2"
                    // Or just split by quotes
                    const args = inputValue.match(/"([^"]+)"/g)?.map(s => s.replace(/"/g, ''));
                    if (args && args.length >= 3) {
                        // We need to send a special poll message.
                        // But onSendMessage only takes string content.
                        // We'll assume the App.tsx handles the /poll command parsing if it detects it?
                        // OR we assume we can pass an object.
                        // Let's pass the raw string and let App.tsx parse it, OR we hack it here.
                        // Since we can't change App.tsx signature easily without breaking everything,
                        // let's send the raw command string and handle it in App.tsx handleSendMessage.
                        contentToSend = inputValue;
                    }
                }

                onSendMessage(contentToSend, replyingTo?.id);
                setInputValue('');
                setReplyingTo(null);
                setMentionMenuOpen(false);
            }
        }
    };

    const handleReply = (msg: Message) => {
        setReplyingTo(msg);
    };

    const [isDragging, setIsDragging] = useState(false);
    const dragCounter = useRef(0);

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current++;
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            setIsDragging(true);
        }
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current--;
        if (dragCounter.current === 0) {
            setIsDragging(false);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        dragCounter.current = 0;

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith('image/')) {
                // Simulate upload by creating a local object URL
                const imageUrl = URL.createObjectURL(file);
                // In a real app, we would upload this to a server.
                // Here we just send a message with the simulated URL attachment.
                // We'll hack the onSendMessage to accept attachments or just append markdown.
                // Since our Message type supports attachment, let's assume onSendMessage can handle it
                // BUT, onSendMessage currently only takes string.
                // Let's just append the image markdown for now or trigger a special message flow.
                
                // Better approach: Directly modify messages via a prop or extend onSendMessage.
                // For this clone, let's pretend we uploaded it and send a message with the attachment.
                // Since I can't change the App.tsx logic easily from here without changing the prop signature...
                // I will format it as a markdown image for now, or we can update the interface later.
                // Actually, I'll assume the user wants to send it immediately.
                
                // Let's use the "attachment" property of the message.
                // Wait, onSendMessage only takes content.
                // I'll send a message like "[Uploaded Image: filename]" and then immediately we can see it?
                // No, that's lame.
                
                // Combined message for better UX
                onSendMessage(`![${file.name}](${imageUrl})`, replyingTo?.id);
                confetti({ particleCount: 50, spread: 50 });
            }
        }
    };

    return (
        <div 
            className="flex-1 flex flex-col min-w-0 bg-discord-dark relative"
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            {/* Lightbox */}
            {lightboxSrc && <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />}

            {/* Drag Overlay */}
            {isDragging && (
                <div className="absolute inset-0 z-50 bg-discord-brand/80 flex flex-col items-center justify-center pointer-events-none animate-in fade-in duration-200 backdrop-blur-sm">
                    <Upload size={64} className="text-white mb-4 animate-bounce" />
                    <h2 className="text-2xl font-bold text-white">Drop to Upload!</h2>
                    <p className="text-white/80">Release your mouse to send the file instantly.</p>
                </div>
            )}

            {/* Header */}
            <div className="h-12 px-4 flex items-center shadow-sm border-b border-discord-darkest shrink-0 bg-discord-dark z-10">
                <Hash className="text-discord-text-muted mr-2" size={24} />
                <h3 className="font-bold text-white mr-4 truncate">{channel.name}</h3>
                {channel.categoryId && (
                    <div className="hidden md:block text-xs text-discord-text-muted truncate max-w-md border-l border-discord-text-muted/30 pl-4">
                        {channel.type === 'text' ? 'Time to chat!' : 'Hangout room'}
                    </div>
                )}

                <div className="ml-auto flex items-center space-x-3 text-discord-text-muted">
                    <MessageSquare className="hover:text-discord-text-normal cursor-pointer hidden sm:block" size={24} />
                    <Bell className="hover:text-discord-text-normal cursor-pointer" size={24} />
                    <Pin className="hover:text-discord-text-normal cursor-pointer" size={24} />
                    <Users
                        className={`cursor-pointer transition-colors ${showMemberList ? 'text-white' : 'hover:text-discord-text-normal'}`}
                        size={24}
                        onClick={toggleMemberList}
                    />

                    <div className="bg-discord-darkest px-2 rounded flex items-center h-6 transition-all focus-within:w-48 w-36">
                        <input
                            type="text"
                            placeholder="Search"
                            className="bg-transparent text-sm text-discord-text-normal placeholder-discord-text-muted focus:outline-none w-full"
                        />
                        <Search size={16} />
                    </div>
                    <Inbox className="hover:text-discord-text-normal cursor-pointer" size={24} />
                    <HelpCircle className="hover:text-discord-text-normal cursor-pointer hidden sm:block" size={24} />
                </div>
            </div>

            {/* Message List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col pb-4" ref={scrollRef}>

                {/* Channel Welcome Message */}
                <div className="mt-auto px-4 pt-10 pb-4">
                    <div className="w-[68px] h-[68px] rounded-full bg-discord-light flex items-center justify-center mb-4">
                        <Hash size={42} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome to #{channel.name}!</h1>
                    <p className="text-discord-text-muted">This is the start of the #{channel.name} channel.</p>
                </div>

                <div className="flex flex-col justify-end">
                    {messages.map((msg, index) => {
                        const prevMsg = messages[index - 1];

                        // Date Divider Logic
                        const date = new Date(msg.timestamp);
                        const prevDate = prevMsg ? new Date(prevMsg.timestamp) : null;
                        const isSameDay = prevDate &&
                            date.getFullYear() === prevDate.getFullYear() &&
                            date.getMonth() === prevDate.getMonth() &&
                            date.getDate() === prevDate.getDate();

                        const showDateDivider = !prevDate || !isSameDay;

                        // Determine if consecutive
                        let isConsecutive = false;
                        if (prevMsg && prevMsg.userId === msg.userId && !msg.replyToId && !prevMsg.replyToId && isSameDay) {
                            const timeDiff = new Date(msg.timestamp).getTime() - new Date(prevMsg.timestamp).getTime();
                            if (timeDiff < 5 * 60 * 1000) { // 5 minutes
                                isConsecutive = true;
                            }
                        }

                        // Resolve reply context
                        let replyToMessage = undefined;
                        let replyToUser = undefined;
                        if (msg.replyToId) {
                            replyToMessage = messages.find(m => m.id === msg.replyToId);
                            if (replyToMessage) {
                                replyToUser = users[replyToMessage.userId];
                            }
                        }

                        return (
                            <React.Fragment key={msg.id}>
                                {showDateDivider && (
                                    <div className="flex items-center justify-center mt-6 mb-2 relative select-none">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-discord-darker"></div>
                                        </div>
                                        <span className="relative bg-discord-dark px-2 text-xs text-discord-text-muted font-medium">
                                            {date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </span>
                                    </div>
                                )}
                                <MessageItem
                                    message={msg}
                                    user={users[msg.userId] || { id: 'unknown', username: 'Unknown', discriminator: '0000', avatar: '', status: 'offline' }}
                                    isConsecutive={isConsecutive}
                                    replyToMessage={replyToMessage}
                                    replyToUser={replyToUser}
                                    isCurrentUser={msg.userId === 'me'}
                                    onDelete={() => onDeleteMessage(msg.id)}
                                    onReply={() => handleReply(msg)}
                                    onReact={(emoji) => onAddReaction(msg.id, emoji)}
                                    onEdit={(content) => onEditMessage(msg.id, content)}
                                    onVote={(optIdx) => onVotePoll(msg.id, optIdx)}
                                    onUserClick={onUserClick}
                                    onImageClick={setLightboxSrc}
                                />
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>

            {/* Input Area */}
            <div className="px-4 pb-6 pt-2 shrink-0 relative z-20">
                <div className="bg-discord-light rounded-lg flex flex-col relative">

                    {mentionMenuOpen && (
                        <MentionMenu
                            users={Object.values(users)}
                            filterText={mentionQuery}
                            selectedIndex={mentionIndex}
                            onSelect={insertMention}
                        />
                    )}

                    {/* Reply Banner */}
                    {replyingTo && (
                        <div className="bg-discord-darker/50 flex items-center justify-between px-4 py-2 rounded-t-lg border-b border-discord-divider/30 text-sm">
                            <div className="flex items-center text-discord-text-muted truncate">
                                <span className="mr-1">Replying to</span>
                                <span className="font-bold truncate max-w-xs mr-1 text-discord-text-normal">@{users[replyingTo.userId]?.username || 'Unknown'}</span>
                            </div>
                            <button onClick={() => setReplyingTo(null)} className="text-discord-text-muted hover:text-discord-text-normal">
                                <X size={16} />
                            </button>
                        </div>
                    )}

                    <div className="flex items-center p-2.5">
                        <button className="text-discord-text-muted hover:text-discord-text-normal mr-3 sticky">
                            <PlusCircle size={24} fill="currentColor" className="text-discord-text-muted hover:text-discord-text-normal" />
                        </button>
                        <input
                            type="text"
                            className="bg-transparent flex-1 text-discord-text-normal placeholder-discord-text-muted/70 focus:outline-none font-normal"
                            placeholder={`Message #${channel.name}`}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            autoFocus
                        />
                        <div className="flex items-center space-x-3 ml-2 text-discord-text-muted">
                        <Gift className="hover:text-discord-text-normal cursor-pointer" size={24} />
                        <div className="relative">
                            <Mic
                                className={`hover:text-discord-text-normal cursor-pointer ${showSoundboard ? 'text-discord-text-normal' : ''}`}
                                size={24}
                                onClick={() => { setShowSoundboard(!showSoundboard); setShowEmojiPicker(false); }}
                            />
                            {showSoundboard && (
                                <SoundboardPanel
                                    onClose={() => setShowSoundboard(false)}
                                    onPlaySound={(id) => {
                                        // Optional: Send a system message that a sound was played?
                                        // For now just playing local audio is enough for "wowo"
                                        console.log(`Played sound: ${id}`);
                                    }}
                                />
                            )}
                        </div>
                        <Sticker className="hover:text-discord-text-normal cursor-pointer" size={24} />
                        <div className="relative">
                            <Smile
                                className={`hover:text-discord-text-normal cursor-pointer ${showEmojiPicker ? 'text-discord-text-normal' : ''}`}
                                size={24}
                                onClick={() => { setShowEmojiPicker(!showEmojiPicker); setShowSoundboard(false); }}
                            />
                            {showEmojiPicker && (
                                <div className="absolute bottom-10 right-0 z-50 shadow-2xl rounded-lg overflow-hidden">
                                    <EmojiPicker
                                        onEmojiClick={onEmojiClick}
                                        theme={Theme.DARK}
                                        width={350}
                                        height={450}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    </div>
                </div>
                <TypingIndicator users={typingUsers} />
            </div>
        </div>
    );
};