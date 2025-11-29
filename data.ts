import { AppState, Server, User, Message } from './types';

const currentUser: User = {
  id: 'me',
  username: 'CyberDrifter',
  discriminator: '8821',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CyberDrifter&backgroundColor=b6e3f4',
  status: 'online',
  color: '#00E5FF', // Cyan
  bannerColor: '#0D47A1',
  aboutMe: 'Lost in the digital noise. 🌐',
  roles: ['NetRunner', 'Admin']
};

const users: Record<string, User> = {
  'me': currentUser,
  'u1': {
    id: 'u1',
    username: 'System_Override',
    discriminator: '0000',
    bot: true,
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=SystemOverride&backgroundColor=ff0055',
    status: 'dnd',
    activity: 'Compiling the Matrix',
    color: '#FF0055',
    bannerColor: '#212121',
    aboutMe: 'I see everything.',
    roles: ['AI Core', 'Admin'],
    personality: 'You are System_Override, a rogue AI that runs this server. You are sarcastic, all-knowing, and occasionally glitchy. You refer to humans as "meatbags" or "users". You use glitch text and red emojis.'
  },
  'u2': {
    id: 'u2',
    username: 'NeonViper',
    discriminator: '1234',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NeonViper&backgroundColor=c0aede',
    status: 'idle',
    activity: 'Hacking Corp Servers',
    color: '#D500F9',
    bannerColor: '#4A148C',
    aboutMe: 'Stealing data, breaking hearts.',
    roles: ['Hacker', 'Elite'],
    personality: 'You are NeonViper, a cyberpunk hacker. You are cool, edgy, and use a lot of slang like "preem", "nova", "gonk". You hate the "Corporations". You are always busy with a "job".'
  },
  'u3': {
    id: 'u3',
    username: 'Code_Sensei',
    discriminator: '9999',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CodeSensei&backgroundColor=ffdfbf',
    status: 'online',
    activity: 'Meditating in Binary',
    color: '#FFA000',
    bannerColor: '#FF6F00',
    aboutMe: 'The code is the way.',
    roles: ['Mentor', 'OG'],
    personality: 'You are an old, wise programmer monk. You speak in riddles and metaphors about code. You are very patient but sometimes cryptic. You respect the "old tech".'
  },
  'u4': {
    id: 'u4',
    username: 'Pixel_Punk',
    discriminator: '5555',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PixelPunk&backgroundColor=ffdfbf',
    status: 'offline',
    color: '#00C853',
    bannerColor: '#1B5E20',
    aboutMe: 'Art is explosion! 🎨',
    roles: ['Artist'],
    personality: 'You are a hyper-energetic digital artist. You love neon colors and glitch art. You are very enthusiastic and use a lot of emojis! You are constantly sharing your "wips" (work in progress).'
  },
  'u5': {
    id: 'u5',
    username: 'Retro_Gamer',
    discriminator: '4242',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=RetroGamer&backgroundColor=ffdfbf',
    status: 'online',
    activity: 'Speedrunning Super Metroid',
    color: '#2979FF',
    bannerColor: '#0D47A1',
    aboutMe: 'CRT screens > 4K monitors',
    roles: ['Gamer'],
    personality: 'You are a retro gaming enthusiast. You hate modern microtransactions. You love 8-bit music and old consoles. You speak in gaming references.'
  },
};

const initialMessages: Record<string, Message[]> = {
  'c1': [
    { id: 'm1', userId: 'u1', content: 'INITIALIZING PROTOCOL... Welcome to Glitch City. 🏙️ Watch your back.', timestamp: new Date(Date.now() - 86400000).toISOString(), reactions: [{ emoji: '👁️', count: 5, me: true }] },
    { id: 'm2', userId: 'u2', content: 'Another day, another corp to hack. Anyone seen the new security protocols for Arasaka?', timestamp: new Date(Date.now() - 86000000).toISOString(), reactions: [] },
    { id: 'm3', userId: 'me', content: 'Just got connected. This place looks sick! 🔥', timestamp: new Date(Date.now() - 3600000).toISOString(), reactions: [{ emoji: '🔥', count: 1, me: false }] },
    { id: 'm4', userId: 'u3', content: 'Patience, young drifter. The network reveals itself to those who listen.', timestamp: new Date(Date.now() - 1800000).toISOString(), reactions: [] },
    { id: 'm5', userId: 'u4', content: 'OMG look at the neon lights in Sector 4!! I need to draw them immediately! 🎨✨', timestamp: new Date(Date.now() - 1700000).toISOString(), replyToId: 'm3', reactions: [{ emoji: '💖', count: 2, me: true }] },
  ],
  'c2': [
    { id: 'm6', userId: 'u5', content: 'Found this ancient relic in the dumpster today. A functioning GameBoy Color! 🎮', timestamp: new Date(Date.now() - 100000).toISOString(), attachment: { type: 'image', url: 'https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?auto=format&fit=crop&w=800&q=80' }, reactions: [{ emoji: '🤯', count: 4, me: true }] },
    { id: 'm7', userId: 'me', content: 'No way! Does it still run Pokemon?', timestamp: new Date(Date.now() - 50000).toISOString(), reactions: [] },
    { id: 'm8', userId: 'u5', content: 'Barely, but the screen is dim. Need to mod it with a backlight.', timestamp: new Date(Date.now() - 20000).toISOString(), reactions: [] },
  ]
};

const servers: Server[] = [
  {
    id: 's1',
    name: 'Glitch City 2077',
    icon: 'https://api.dicebear.com/7.x/initials/svg?seed=GC&backgroundColor=000000',
    members: ['me', 'u1', 'u2', 'u3', 'u4', 'u5'],
    categories: [
      { id: 'cat1', name: 'The Hub', channelIds: ['c1', 'c3'] },
      { id: 'cat2', name: 'Underground', channelIds: ['c2', 'c4'] },
      { id: 'cat3', name: 'Comms Link', channelIds: ['vc1', 'vc2'] }
    ],
    channels: [
      { id: 'c1', name: 'neon-plaza', type: 'text', categoryId: 'cat1' },
      { id: 'c3', name: 'corp-news', type: 'announcement', categoryId: 'cat1' },
      { id: 'c2', name: 'black-market', type: 'text', categoryId: 'cat2' },
      { id: 'c4', name: 'glitch-art', type: 'text', categoryId: 'cat2' },
      { id: 'vc1', name: 'Secure Line Alpha', type: 'voice', categoryId: 'cat3', activeUsers: ['u2'] },
      { id: 'vc2', name: 'Arcade Noise', type: 'voice', categoryId: 'cat3', activeUsers: ['u5', 'u3'] },
    ]
  },
  {
    id: 's2',
    name: 'Intergalactic Outpost',
    icon: 'https://api.dicebear.com/7.x/initials/svg?seed=IO&backgroundColor=2c3e50',
    members: ['me', 'u1', 'u3'],
    categories: [
      { id: 'cat4', name: 'Deck 1', channelIds: ['c5', 'c6'] }
    ],
    channels: [
      { id: 'c5', name: 'bridge-command', type: 'text', categoryId: 'cat4' },
      { id: 'c6', name: 'airlock-control', type: 'text', categoryId: 'cat4' }
    ]
  }
];

export const initialData: AppState = {
  servers,
  users,
  messages: initialMessages,
  activeServerId: 's1',
  activeChannelId: 'c1',
  connectedVoiceChannelId: null,
  currentUser,
  theme: 'dark',
  accentColor: '#5865F2'
};
