export interface User {
  id: string;
  username: string;
  avatar: string;
  status: 'online' | 'idle' | 'dnd' | 'offline';
  discriminator: string;
  bot?: boolean;
  activity?: string;
  color?: string; // Hex color for role
  bannerColor?: string;
  aboutMe?: string;
  roles?: string[];
  personality?: string; // AI Prompt instruction
}

export interface PollOption {
  text: string;
  votes: number;
  voters: string[]; // User IDs
}

export interface Message {
  id: string;
  userId: string;
  content: string;
  timestamp: string; // ISO string
  reactions: { emoji: string; count: number; me: boolean }[];
  attachment?: { type: 'image'; url: string };
  replyToId?: string;
  edited?: boolean;
  pinned?: boolean;
  poll?: {
    question: string;
    options: PollOption[];
  };
  embed?: {
    title: string;
    description?: string;
    color?: string;
    image?: string;
    thumbnail?: string;
    fields?: { name: string; value: string; inline?: boolean }[];
    footer?: { text: string; icon_url?: string };
  };
}

export interface Channel {
  id: string;
  name: string;
  type: 'text' | 'voice' | 'announcement';
  categoryId?: string;
  unread?: boolean;
  activeUsers?: string[]; // For voice channels
}

export interface Category {
  id: string;
  name: string;
  channelIds: string[];
}

export interface Server {
  id: string;
  name: string;
  icon: string;
  channels: Channel[];
  categories: Category[];
  members: string[]; // User IDs
}

export interface AppState {
  servers: Server[];
  users: Record<string, User>;
  messages: Record<string, Message[]>; // ChannelId -> Messages
  activeServerId: string;
  activeChannelId: string;
  connectedVoiceChannelId?: string | null; // New: Track voice connection
  currentUser: User;
  theme: 'dark' | 'light' | 'midnight';
  accentColor: string;
}