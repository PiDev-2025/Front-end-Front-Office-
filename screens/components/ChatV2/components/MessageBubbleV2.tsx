import React from 'react';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { ChatMessage } from '../types';

interface MessageBubbleV2Props {
  message: ChatMessage;
  isCurrentUser: boolean;
}

const MessageBubbleV2: React.FC<MessageBubbleV2Props> = ({ message, isCurrentUser }) => {
  return (
    <Box
      className={`p-2 px-3 m-1 rounded-lg max-w-[75%] ${
        isCurrentUser
          ? 'bg-primary-500 self-end rounded-br-none'
          : 'bg-gray-200 self-start rounded-bl-none'
      }`}
    >
      {!isCurrentUser && (
        <Text className="text-xs font-semibold text-primary-700 mb-1">{message.username}</Text>
      )}
      <Text className={`${isCurrentUser ? 'text-white' : 'text-black'}`}>
        {message.content}
      </Text>
      <Text className={`text-xs mt-1 self-end ${isCurrentUser ? 'text-primary-100' : 'text-gray-500'}`}>
        {/* Format timestamp nicely */}
        {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </Box>
  );
};

export default MessageBubbleV2; 