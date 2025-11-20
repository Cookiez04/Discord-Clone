import { AppState, Server, User, Message } from './types';

const currentUser: User = {
  id: 'me',
  username: 'FrontendWizard',
  discriminator: '8821',
  avatar: 'https://picsum.photos/id/64/200/200',
  status: 'online',
  color: '#5865F2', // Brand color
  bannerColor: '#2c2f33',
  aboutMe: 'Building cool stuff with React & Tailwind.',
  roles: ['Developer', 'Admin']
};

const users: Record<string, User> = {
  'me': currentUser,
  'u1': { 
      id: 'u1', 
      username: 'Clyde', 
      discriminator: '0000', 
      bot: true, 
      avatar: 'https://cdn.discordapp.com/avatars/1081004946872352958/a_6d52d47786a3f2f6030453f034753479.png', 
      status: 'online', 
      color: '#5865F2',
      bannerColor: '#5865F2',
      aboutMe: 'I am a robot. Beep boop.',
      roles: ['Bot', 'System'],
      personality: 'You are Clyde, the helpful Discord system bot. You are polite, slightly robotic but friendly. You try to help users with technical questions. You use emojis like 🤖 and ✨.'
  }, 
  'u2': { 
      id: 'u2', 
      username: 'Nelly', 
      discriminator: '1234', 
      avatar: 'https://picsum.photos/id/65/200/200', 
      status: 'idle', 
      activity: 'Visual Studio Code', 
      color: '#E91E63',
      bannerColor: '#880e4f',
      aboutMe: 'Full stack developer | Coffee enthusiast',
      roles: ['Moderator', 'Senior Dev'],
      personality: 'You are Nelly, a full-stack developer who is obsessed with coffee. You are helpful but always mention caffeine or coffee in some way. You are chill and use lowercase mostly.'
  },
  'u3': { 
      id: 'u3', 
      username: 'SeniorDev', 
      discriminator: '9999', 
      avatar: 'https://picsum.photos/id/66/200/200', 
      status: 'dnd', 
      activity: 'Reviewing PRs', 
      color: '#F1C40F',
      bannerColor: '#f39c12',
      aboutMe: 'Don\'t merge without tests.',
      roles: ['Lead', 'Mentor'],
      personality: 'You are a grumpy Senior Developer. You are very strict about code quality, linting, and testing. You often complain about junior developers breaking production. You are knowledgeable but terse.'
  },
  'u4': { 
      id: 'u4', 
      username: 'DesignGuru', 
      discriminator: '5555', 
      avatar: 'https://picsum.photos/id/67/200/200', 
      status: 'offline', 
      color: '#2ECC71',
      bannerColor: '#27ae60',
      aboutMe: 'Pixels are my life.',
      roles: ['Designer'],
      personality: 'You are an artistic UI/UX designer. You care deeply about aesthetics, color palettes, and spacing. You use artistic emojis. You speak in a flowery, creative way.'
  },
  'u5': { 
      id: 'u5', 
      username: 'GamerX', 
      discriminator: '4242', 
      avatar: 'https://picsum.photos/id/68/200/200', 
      status: 'online', 
      activity: 'Playing Overwatch 2', 
      color: '#95A5A6',
      bannerColor: '#7f8c8d',
      aboutMe: 'LFG | Tank Main',
      roles: ['Member'],
      personality: 'You are a hardcore gamer. You use internet slang like "pog", "no cap", "fr", "gg". You are energetic and competitive. You mostly talk about games.'
  },
};

const initialMessages: Record<string, Message[]> = {
  'c1': [
    { id: 'm1', userId: 'u3', content: 'Welcome to the server everyone! Please read the rules.', timestamp: new Date(Date.now() - 86400000).toISOString(), reactions: [{ emoji: '👋', count: 2, me: true }] },
    { id: 'm2', userId: 'u2', content: 'Thanks! Excited to be here.', timestamp: new Date(Date.now() - 86000000).toISOString(), reactions: [] },
    { id: 'm3', userId: 'me', content: 'Hello world! :wave:', timestamp: new Date(Date.now() - 3600000).toISOString(), reactions: [{ emoji: '🔥', count: 1, me: false }] },
    { id: 'm4', userId: 'u5', content: 'Anyone up for a game later?', timestamp: new Date(Date.now() - 1800000).toISOString(), reactions: [] },
    { id: 'm5', userId: 'u1', content: 'I am a bot, but I support your gaming endeavors.', timestamp: new Date(Date.now() - 1700000).toISOString(), replyToId: 'm4', reactions: [{ emoji: '🤖', count: 1, me: true }] },
  ],
  'c2': [
    { id: 'm6', userId: 'u4', content: 'Check out this new design mockup.', timestamp: new Date(Date.now() - 100000).toISOString(), attachment: { type: 'image', url: 'https://picsum.photos/id/29/600/400' }, reactions: [{ emoji: '👀', count: 3, me: true }] },
    { id: 'm7', userId: 'me', content: 'Looks clean! I like the spacing.', timestamp: new Date(Date.now() - 50000).toISOString(), reactions: [] },
  ]
};

const servers: Server[] = [
  {
    id: 's1',
    name: 'React Developers',
    icon: 'https://picsum.photos/id/180/200/200',
    members: ['me', 'u1', 'u2', 'u3', 'u4', 'u5'],
    categories: [
      { id: 'cat1', name: 'Information', channelIds: ['c1', 'c3'] },
      { id: 'cat2', name: 'General', channelIds: ['c2', 'c4'] },
      { id: 'cat3', name: 'Voice Channels', channelIds: ['vc1', 'vc2'] }
    ],
    channels: [
      { id: 'c1', name: 'welcome', type: 'text', categoryId: 'cat1' },
      { id: 'c3', name: 'announcements', type: 'announcement', categoryId: 'cat1' },
      { id: 'c2', name: 'general', type: 'text', categoryId: 'cat2' },
      { id: 'c4', name: 'off-topic', type: 'text', categoryId: 'cat2' },
      { id: 'vc1', name: 'Lounge', type: 'voice', categoryId: 'cat3', activeUsers: ['u2'] },
      { id: 'vc2', name: 'Gaming', type: 'voice', categoryId: 'cat3', activeUsers: ['u5', 'u3'] },
    ]
  },
  {
    id: 's2',
    name: 'Gemini API Enthusiasts',
    icon: 'https://picsum.photos/id/20/200/200',
    members: ['me', 'u1', 'u3'],
    categories: [
      { id: 'cat4', name: 'Text Channels', channelIds: ['c5', 'c6'] }
    ],
    channels: [
      { id: 'c5', name: 'general', type: 'text', categoryId: 'cat4' },
      { id: 'c6', name: 'api-help', type: 'text', categoryId: 'cat4' }
    ]
  }
];

export const initialData: AppState = {
  servers,
  users,
  messages: initialMessages,
  activeServerId: 's1',
  activeChannelId: 'c2',
  connectedVoiceChannelId: null,
  currentUser
};