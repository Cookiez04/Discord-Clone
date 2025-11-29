import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ServerSidebar } from './components/ServerSidebar';
import { ChannelSidebar } from './components/ChannelSidebar';
import { ChatArea } from './components/ChatArea';
import { MemberSidebar } from './components/MemberSidebar';
import { SettingsModal } from './components/SettingsModal';
import { UserPopout } from './components/UserPopout';
import { QuickSwitcher } from './components/QuickSwitcher';
import { initialData } from './data';
import { AppState, User, Message } from './types';
import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";

// Helper ID generator
const generateId = () => Math.random().toString(36).substr(2, 9);

// Helper to escape regex characters
function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function App() {
    console.log('App.tsx: Rendering App component...');
    const [state, setState] = useState<AppState>(initialData);
    const [showMemberList, setShowMemberList] = useState(true);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isQuickSwitcherOpen, setIsQuickSwitcherOpen] = useState(false);
    const [typingUsers, setTypingUsers] = useState<User[]>([]);
    const [popoutState, setPopoutState] = useState<{ visible: boolean, x: number, y: number, user: User | null }>({
        visible: false, x: 0, y: 0, user: null
    });

    // Refs for accessing latest state in async callbacks
    const stateRef = useRef(state);
    useEffect(() => {
        stateRef.current = state;
    }, [state]);

    // Apply Theme & Accent Color
    useEffect(() => {
        // Theme Logic
        const root = document.documentElement;
        root.classList.remove('theme-dark', 'theme-light', 'theme-midnight');
        root.classList.add(`theme-${state.theme}`);

        // Accent Color Logic
        root.style.setProperty('--discord-brand', state.accentColor);
    }, [state.theme, state.accentColor]);

    const activeServer = state.servers.find(s => s.id === state.activeServerId);
    const activeChannel = activeServer?.channels.find(c => c.id === state.activeChannelId);

    // Global Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Quick Switcher: Ctrl + K
            if (e.ctrlKey && e.key === 'k') {
                e.preventDefault();
                setIsQuickSwitcherOpen(prev => !prev);
            }
            // Escape to close modals
            if (e.key === 'Escape') {
                if (isQuickSwitcherOpen) setIsQuickSwitcherOpen(false);
                if (isSettingsOpen) setIsSettingsOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isQuickSwitcherOpen, isSettingsOpen]);

    const handlePinMessage = (messageId: string) => {
        setState(prev => {
            const activeChannelId = prev.activeChannelId;
            if (!activeChannelId) return prev;

            const channelMessages = prev.messages[activeChannelId] || [];
            const newMessages = channelMessages.map(msg => {
                if (msg.id === messageId) {
                    return { ...msg, pinned: !msg.pinned };
                }
                return msg;
            });

            return {
                ...prev,
                messages: {
                    ...prev.messages,
                    [activeChannelId]: newMessages
                }
            };
        });
    };

    const handleServerClick = useCallback((serverId: string) => {
        const server = state.servers.find(s => s.id === serverId);
        if (server) {
            // Default to first text channel
            const firstChannel = server.channels.find(c => c.type === 'text');
            setState(prev => ({
                ...prev,
                activeServerId: serverId,
                activeChannelId: firstChannel ? firstChannel.id : prev.activeChannelId
            }));
        }
    }, [state.servers]);

    const handleChannelClick = useCallback((channelId: string, type: string) => {
        if (type === 'voice') {
            // Voice channel logic
            setState(prev => ({
                ...prev,
                connectedVoiceChannelId: channelId
            }));
        } else {
            // Text channel logic
            setState(prev => ({ ...prev, activeChannelId: channelId }));
        }
    }, []);

    const handleDisconnectVoice = useCallback(() => {
        setState(prev => ({ ...prev, connectedVoiceChannelId: null }));
    }, []);

    const handleStatusChange = useCallback((newStatus: 'online' | 'idle' | 'dnd' | 'offline') => {
        setState(prev => ({
            ...prev,
            currentUser: { ...prev.currentUser, status: newStatus },
            users: {
                ...prev.users,
                [prev.currentUser.id]: { ...prev.users[prev.currentUser.id], status: newStatus }
            }
        }));
    }, []);

    // AI Orchestrator Logic
    const triggerAIResponse = async (targetUserId: string, channelId: string, promptContext: string) => {
        const currentState = stateRef.current; // Use ref to get latest state
        const targetUser = currentState.users[targetUserId];

        // Basic validation
        if (!targetUser || !targetUser.personality) return;
        if (targetUser.status === 'offline') return;

        console.log(`[AI] Triggering response for ${targetUser.username} in ${channelId}...`);

        // Set typing indicator
        setTypingUsers(prev => {
            if (prev.find(u => u.id === targetUserId)) return prev;
            return [...prev, targetUser];
        });

        const startTime = Date.now();

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

            // Gather history from the REF to ensure we include the message just sent
            const channelMessages = currentState.messages[channelId] || [];
            const history = channelMessages.slice(-20).map(m => {
                const u = currentState.users[m.userId];
                const name = u?.username || 'User';
                // Filter out system messages or messages with no content if any
                if (!m.content) return '';
                return `${name}: ${m.content}`;
            }).filter(Boolean).join('\n') || '(No previous messages)';

            const systemInstruction = `You are simulating a user in a Discord chat room. 
          Your profile name is ${targetUser.username}. 
          Your Personality: ${targetUser.personality}.
          
          Rules:
          1. Keep your response casual, short, and relevant (1-3 sentences).
          2. Respond directly to the "Current Message" or the context of the chat history.
          3. Do not prefix your response with your username.
          4. If the user says "hi" or "hello", greet them back in character.
          5. Be realistic.
          6. ALWAYS generate a response, do not stay silent unless the message is pure gibberish.
          `;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: {
                    parts: [{
                        text: `CHAT CONTEXT:\n${history}\n\nUSER JUST SAID: "${promptContext}"\n\n(Reply now as ${targetUser.username})`
                    }]
                },
                config: {
                    systemInstruction: { parts: [{ text: systemInstruction }] },
                    maxOutputTokens: 500, // Increased to prevent cutoff
                    thinkingConfig: { thinkingBudget: 0 }, // Disable thinking to prevent token starvation
                    temperature: 1.1,
                    safetySettings: [
                        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
                        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
                        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                    ],
                }
            });

            const text = response.text;

            // Ensure a minimum typing duration of 1.5s for realism
            const elapsed = Date.now() - startTime;
            if (elapsed < 1500) {
                await new Promise(resolve => setTimeout(resolve, 1500 - elapsed));
            }

            if (text) {
                const newMessage: Message = {
                    id: generateId(),
                    userId: targetUserId,
                    content: text.trim(),
                    timestamp: new Date().toISOString(),
                    reactions: []
                };

                setState(prev => {
                    const msgs = prev.messages[channelId] || [];
                    return {
                        ...prev,
                        messages: {
                            ...prev.messages,
                            [channelId]: [...msgs, newMessage]
                        }
                    };
                });
            } else {
                console.warn(`[AI] No text generated for ${targetUser.username}. Checking candidates...`);
                if (response.candidates && response.candidates.length > 0) {
                    console.warn(`[AI] Finish Reason: ${response.candidates[0].finishReason}`);
                }

                // Fallback: If the AI refuses or glitches, just post a shrug so user sees SOMETHING
                const fallbackMessage: Message = {
                    id: generateId(),
                    userId: targetUserId,
                    content: "...",
                    timestamp: new Date().toISOString(),
                    reactions: []
                };
                setState(prev => {
                    const msgs = prev.messages[channelId] || [];
                    return {
                        ...prev,
                        messages: {
                            ...prev.messages,
                            [channelId]: [...msgs, fallbackMessage]
                        }
                    };
                });
            }
        } catch (error: any) {
            console.error("[AI] Generation Error:", error);
            const errorMessage: Message = {
                id: generateId(),
                userId: 'system', // Use a system ID or the bot's ID
                content: `⚠️ **AI Error**: ${error.message || "Unknown error"}. Check console for details.`,
                timestamp: new Date().toISOString(),
                reactions: []
            };
            setState(prev => {
                const msgs = prev.messages[channelId] || [];
                return {
                    ...prev,
                    messages: {
                        ...prev.messages,
                        [channelId]: [...msgs, errorMessage]
                    }
                };
            });
        } finally {
            // Remove typing indicator
            setTypingUsers(prev => prev.filter(u => u.id !== targetUserId));
        }
    };

    const handleSendMessage = async (content: string, replyToId?: string) => {
        if (!state.activeChannelId) return;

        let pollData = undefined;
        // Poll Command Parsing
        if (content.startsWith('/poll')) {
            const args = content.match(/"([^"]+)"/g)?.map(s => s.replace(/"/g, ''));
            if (args && args.length >= 3) {
                pollData = {
                    question: args[0],
                    options: args.slice(1).map(opt => ({ text: opt, votes: 0, voters: [] }))
                };
                // Clean up content to not show the raw command
                content = "📊 **Poll Started!**"; 
            }
        }

        const newMessage: Message = {
            id: generateId(),
            userId: state.currentUser.id,
            content: content,
            timestamp: new Date().toISOString(),
            reactions: [],
            replyToId,
            poll: pollData
        };

        // 1. Add User Message Immediately
        setState(prev => {
            const channelMessages = prev.messages[prev.activeChannelId] || [];
            return {
                ...prev,
                messages: {
                    ...prev.messages,
                    [prev.activeChannelId]: [...channelMessages, newMessage]
                }
            };
        });

        // 2. Determine who should reply
        const currentState = stateRef.current; // Access latest for logic
        const channelMessages = currentState.messages[state.activeChannelId] || [];

        // Get candidates (offline users can't talk)
        const otherUsers = Object.values(currentState.users).filter(u => u.id !== 'me' && u.status !== 'offline');
        const onlineUserIds = new Set(otherUsers.map(u => u.id));

        let targetUserIds: Set<string> = new Set();

        // Priority 1: Explicit Reply via UI
        if (replyToId) {
            const replyMsg = currentState.messages[state.activeChannelId]?.find(m => m.id === replyToId);
            if (replyMsg && replyMsg.userId !== 'me' && onlineUserIds.has(replyMsg.userId)) {
                console.log(`[AI] Logic: Selected ${replyMsg.userId} due to Reply UI.`);
                targetUserIds.add(replyMsg.userId);
            }
        }

        // Priority 2: Mentions (@Username) AND Soft Mentions (Just Username)
        otherUsers.forEach(u => {
            const escapedName = escapeRegExp(u.username);

            // Strict Mention: @Name (allows for @Name: or @Name,)
            const strictRegex = new RegExp(`@${escapedName}\\b`, 'i');
            // Soft Mention: Name (must be word bounded)
            const softRegex = new RegExp(`\\b${escapedName}\\b`, 'i');

            if (strictRegex.test(content) || softRegex.test(content)) {
                console.log(`[AI] Logic: Selected ${u.username} due to Mention.`);
                targetUserIds.add(u.id);
            }
        });

        // Priority 3: Contextual Continuity (The "Wrong Person" Fix)
        // If I didn't mention anyone, am I replying to the last person who spoke?
        if (targetUserIds.size === 0 && channelMessages.length > 0) {
            const lastMessage = channelMessages[channelMessages.length - 1];
            // If last message was NOT me, and was recent (within 2 mins), I am likely talking to them.
            if (lastMessage.userId !== 'me' && onlineUserIds.has(lastMessage.userId)) {
                const timeDiff = Date.now() - new Date(lastMessage.timestamp).getTime();
                if (timeDiff < 2 * 60 * 1000) {
                    // 80% chance to reply if the conversation is active
                    if (Math.random() < 0.8) {
                        console.log(`[AI] Logic: Selected ${lastMessage.userId} due to Context (Last Speaker).`);
                        targetUserIds.add(lastMessage.userId);
                    }
                }
            }
        }

        // Priority 4: Random Ambience (If truly starting a new topic)
        // Only trigger if NO ONE was targeted yet.
        if (targetUserIds.size === 0) {
            const isQuestion = content.trim().endsWith('?');
            const isGreeting = /^(hi|hello|hey|yo|sup|morning|evening)\b/i.test(content);

            // 60% chance for questions/greetings, 20% for random statements
            const chance = (isQuestion || isGreeting) ? 0.6 : 0.2;

            if (Math.random() < chance && otherUsers.length > 0) {
                const randomUser = otherUsers[Math.floor(Math.random() * otherUsers.length)];
                console.log(`[AI] Logic: Selected ${randomUser.username} due to Random Ambience.`);
                targetUserIds.add(randomUser.id);
            }
        }

        // 3. Trigger AI for selected targets
        const targets = Array.from(targetUserIds);
        targets.forEach((uid, index) => {
            // Randomize start delay slightly (1s - 3s) to prevent robotic sync
            const delay = 800 + (index * 1500) + (Math.random() * 1000);
            setTimeout(() => {
                triggerAIResponse(uid, state.activeChannelId, content);
            }, delay);
        });
    };

    const handleEditMessage = useCallback((messageId: string, content: string) => {
        if (!state.activeChannelId) return;
        setState(prev => {
            const channelMessages = prev.messages[prev.activeChannelId] || [];
            const updatedMessages = channelMessages.map(msg => {
                if (msg.id !== messageId) return msg;
                return { ...msg, content, edited: true };
            });
            return {
                ...prev,
                messages: {
                    ...prev.messages,
                    [prev.activeChannelId]: updatedMessages
                }
            }
        });
    }, [state.activeChannelId]);

    const handleDeleteMessage = useCallback((messageId: string) => {
        if (!state.activeChannelId) return;
        setState(prev => {
            const channelMessages = prev.messages[prev.activeChannelId] || [];
            return {
                ...prev,
                messages: {
                    ...prev.messages,
                    [prev.activeChannelId]: channelMessages.filter(m => m.id !== messageId)
                }
            }
        });
    }, [state.activeChannelId]);

    const handleAddReaction = useCallback((messageId: string, emoji: string) => {
        if (!state.activeChannelId) return;
        setState(prev => {
            const channelMessages = prev.messages[prev.activeChannelId] || [];
            const updatedMessages = channelMessages.map(msg => {
                if (msg.id !== messageId) return msg;

                const existingReactionIndex = msg.reactions.findIndex(r => r.emoji === emoji);
                let newReactions = [...msg.reactions];

                if (existingReactionIndex >= 0) {
                    const reaction = newReactions[existingReactionIndex];
                    if (reaction.me) {
                        reaction.count -= 1;
                        reaction.me = false;
                        if (reaction.count <= 0) {
                            newReactions.splice(existingReactionIndex, 1);
                        }
                    } else {
                        reaction.count += 1;
                        reaction.me = true;
                    }
                } else {
                    newReactions.push({ emoji, count: 1, me: true });
                }

                return { ...msg, reactions: newReactions };
            });

            return {
                ...prev,
                messages: {
                    ...prev.messages,
                    [prev.activeChannelId]: updatedMessages
                }
            };
        });
    }, [state.activeChannelId]);

    const handleUserClick = (e: React.MouseEvent, user: User) => {
        e.stopPropagation();
        // Simple positioning
        setPopoutState({
            visible: true,
            x: e.clientX + 20,
            y: e.clientY - 50,
            user
        });
    };

    // Quick Switcher Selection
    const handleQuickSwitch = (serverId: string, channelId: string) => {
        const server = state.servers.find(s => s.id === serverId);
        if (!server) return;

        setState(prev => ({
            ...prev,
            activeServerId: serverId,
            activeChannelId: channelId
        }));
    };

    const handleVotePoll = (messageId: string, optionIndex: number) => {
        setState(prev => {
            const activeChannelId = prev.activeChannelId;
            if (!activeChannelId) return prev;

            const channelMessages = prev.messages[activeChannelId] || [];
            const newMessages = channelMessages.map(msg => {
                if (msg.id === messageId && msg.poll) {
                    // Check if user already voted for this option
                    const option = msg.poll.options[optionIndex];
                    const hasVoted = option.voters.includes(prev.currentUser.id);
                    
                    // Toggle vote
                    let newVoters = hasVoted 
                        ? option.voters.filter(id => id !== prev.currentUser.id)
                        : [...option.voters, prev.currentUser.id];
                    
                    // Simulate Random Bot Votes (only if this is the first time the user votes on this poll)
                    // We check if total votes are 0 (or just low) to trigger initial bot engagement
                    const totalVotes = msg.poll.options.reduce((acc, o) => acc + o.votes, 0);
                    let botVotesAdded = false;
                    
                    const newOptions = [...msg.poll.options];
                    
                    // If this is a fresh poll (or low engagement), let's add some bot chaos
                    if (!hasVoted && totalVotes < 3) {
                        const otherUsers = Object.keys(prev.users).filter(uid => uid !== 'me');
                        
                        otherUsers.forEach(botId => {
                            // 30% chance for each bot to vote
                            if (Math.random() > 0.7) {
                                const randomOptionIndex = Math.floor(Math.random() * newOptions.length);
                                // Don't vote if they already voted (simplified check, assuming bots vote once)
                                // Actually, let's just add them to the random option
                                const botOption = newOptions[randomOptionIndex];
                                if (!botOption.voters.includes(botId)) {
                                     // We need to update the option in the newOptions array
                                     // But wait, we might be updating the SAME option as the user just voted for
                                     // So we need to handle index carefully.
                                     
                                     // Let's do this: modify newOptions directly
                                     // BUT, optionIndex (user's choice) is already being modified below.
                                     // So we should do bot logic first? No, simpler to do it in a separate pass or just modify the array.
                                     
                                     // Let's just push to voters array of the target option
                                     if (!newOptions[randomOptionIndex].voters) newOptions[randomOptionIndex].voters = [];
                                     newOptions[randomOptionIndex].voters.push(botId);
                                     newOptions[randomOptionIndex].votes += 1;
                                     botVotesAdded = true;
                                }
                            }
                        });
                    }

                    // Update User's Vote (Apply changes to the potentially modified newOptions)
                    // We re-fetch the option from newOptions because it might have been mutated by bot logic above
                    const targetOption = newOptions[optionIndex];
                    // Ensure we don't double add if bot logic coincidentally added 'me' (it shouldn't)
                    
                    // Re-calculate user vote on the potentially modified option
                    const userVoters = hasVoted 
                         ? targetOption.voters.filter(id => id !== prev.currentUser.id)
                         : [...targetOption.voters, prev.currentUser.id];

                    newOptions[optionIndex] = {
                        ...targetOption,
                        voters: userVoters,
                        votes: userVoters.length
                    };

                    return {
                        ...msg,
                        poll: {
                            ...msg.poll,
                            options: newOptions
                        }
                    };
                }
                return msg;
            });

            return {
                ...prev,
                messages: {
                    ...prev.messages,
                    [activeChannelId]: newMessages
                }
            };
        });
    };

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-discord-dark text-white font-sans antialiased selection:bg-discord-brand selection:text-white">

            {/* Modals and Overlays */}
            {isSettingsOpen && (
                <SettingsModal
                    user={state.currentUser}
                    theme={state.theme}
                    accentColor={state.accentColor}
                    onClose={() => setIsSettingsOpen(false)}
                    onUpdateTheme={(theme) => setState(prev => ({ ...prev, theme }))}
                    onUpdateAccentColor={(accentColor) => setState(prev => ({ ...prev, accentColor }))}
                />
            )}

            <QuickSwitcher
                isOpen={isQuickSwitcherOpen}
                onClose={() => setIsQuickSwitcherOpen(false)}
                servers={state.servers}
                onSelectChannel={handleQuickSwitch}
            />

            {popoutState.visible && popoutState.user && (
                <UserPopout
                    user={popoutState.user}
                    x={popoutState.x}
                    y={popoutState.y}
                    onClose={() => setPopoutState(prev => ({ ...prev, visible: false }))}
                />
            )}

            {/* Left Sidebar (Servers) */}
            <ServerSidebar
                servers={state.servers}
                activeServerId={state.activeServerId}
                onServerClick={handleServerClick}
            />

            {/* Secondary Sidebar (Channels) */}
            {activeServer && (
                <ChannelSidebar
                    server={activeServer}
                    activeChannelId={state.activeChannelId}
                    connectedVoiceChannelId={state.connectedVoiceChannelId}
                    onChannelClick={handleChannelClick}
                    onDisconnectVoice={handleDisconnectVoice}
                    currentUser={state.currentUser}
                    onOpenSettings={() => setIsSettingsOpen(true)}
                    onStatusChange={handleStatusChange}
                />
            )}

            {/* Main Chat Area */}
            {activeChannel && activeServer && (
                <ChatArea
                    channel={activeChannel}
                    server={activeServer}
                    messages={state.messages[activeChannel.id] || []}
                    users={state.users}
                    typingUsers={typingUsers}
                    onSendMessage={handleSendMessage}
                    onDeleteMessage={handleDeleteMessage}
                    onEditMessage={handleEditMessage}
                    onAddReaction={handleAddReaction}
                    onVotePoll={handleVotePoll}
                    onPinMessage={handlePinMessage}
                    toggleMemberList={() => setShowMemberList(!showMemberList)}
                    showMemberList={showMemberList}
                    onUserClick={handleUserClick}
                />
            )}

            {/* Right Sidebar (Members) - Hidden on small screens */}
            {showMemberList && activeServer && (
                <div className="hidden lg:flex border-l border-discord-darkest h-full">
                    <MemberSidebar
                        server={activeServer}
                        users={state.users}
                        onUserClick={handleUserClick}
                    />
                </div>
            )}

        </div>
    );
}

export default App;