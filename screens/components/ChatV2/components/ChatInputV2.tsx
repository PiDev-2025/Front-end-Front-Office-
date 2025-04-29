import React, { useState } from 'react';
import { Box } from '@/components/ui/box';
import { Input, InputField } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react-native';
import { HStack } from '@/components/ui/hstack';

interface ChatInputV2Props {
  onSend: (message: string) => void;
  isLoading?: boolean; // Optional loading state for the send button
}

const ChatInputV2: React.FC<ChatInputV2Props> = ({ onSend, isLoading }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSend(message.trim());
      setMessage('');
    }
  };

  return (
    <HStack className="p-2 border-t border-gray-200 items-center" space="sm">
      <Input className="flex-1">
        <InputField
          placeholder="Type your message..."
          value={message}
          onChangeText={setMessage}
          onSubmitEditing={handleSend} // Allow sending with keyboard return key
          blurOnSubmit={false} // Keep keyboard open after send on mobile?
        />
      </Input>
      <Button onPress={handleSend} disabled={isLoading || !message.trim()} size="sm">
        <Send size={18} className="text-white" />
      </Button>
    </HStack>
  );
};

export default ChatInputV2; 