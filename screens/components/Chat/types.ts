import { ChatMessage } from "ts-elysia-client/src/client";

export interface MessageProps {
  avatar?: string;
  username?: string;
  message: string;
  timestamp: string;
  isOutgoing?: boolean;
}

export interface ChatHeaderProps {
  themeTitle: string;
  memberCount: number;
  onSettingsPress: () => void;
  onNotificationsPress: () => void;
  onMenuPress: () => void;
  isGroupChat?: boolean;
  groupName?: string;
  groupDescription?: string;
}

export interface ChatInputProps {
  onSend: (message: string) => void;
}

export interface FeedbackProps {
  question: string;
  onYes: () => void;
  onNo: () => void;
}

export interface ChatListItemProps {
  id: string;
  name: string;
  type: '1v1' | 'group';
  lastMessage?: string;
  timestamp?: string;
  unreadCount?: number;
  participants?: string[];
  onPress: () => void;
}

export interface ChatGroupInfo {
  id: string;
  name: string;
  type: '1v1' | 'thematic' | 'dedicated';
  participants: string[];
  theme?: string;
  description?: string;
  lastMessage?: ChatMessage;
  createdAt: string;
  updatedAt: string;
  isPrivate?: boolean;
  maxParticipants?: number;
  admin?: string;
}
