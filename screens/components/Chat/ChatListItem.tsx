import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ChatListItemProps {
  chat: {
    id: string;
    name?: string;
    type: string;
    users: any[];
    lastMessage?: string;
  };
  onPress: () => void;
  myUserId: string;
}

export const ChatListItem: React.FC<ChatListItemProps> = ({ chat, onPress, myUserId }) => {
  const getChatName = () => {
    if (chat.name) return chat.name;
    if (chat.type === '1v1') {
      const otherUser = chat.users.find(user => user.id !== myUserId);
      return otherUser?.name || 'Unknown User';
    }
    return 'Group Chat';
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.name}>{getChatName()}</Text>
      {chat.lastMessage && (
        <Text style={styles.lastMessage} numberOfLines={1}>
          {chat.lastMessage}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
  },
}); 