export interface MessageProps {
  avatar?: string;
  username: string;
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
}

export interface ChatInputProps {
  onSend: (message: string) => void;
}

export interface FeedbackProps {
  question: string;
  onYes: () => void;
  onNo: () => void;
}
