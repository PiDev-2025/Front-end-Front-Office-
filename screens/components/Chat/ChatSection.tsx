import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { MessageSquare } from 'lucide-react-native';

export const ChatSection: React.FC = () => {
  const navigation = useNavigation();

  return (
    <Box className="p-4">
      <Text className="text-lg font-semibold mb-4">Chat</Text>
      <Pressable
        onPress={() => navigation.navigate('ChatList' as never)}
        className="flex-row items-center space-x-2 p-4 bg-white rounded-lg shadow-sm"
      >
        <MessageSquare size={24} color="#6366f1" />
        <Text className="text-base">View Conversations</Text>
      </Pressable>
    </Box>
  );
}; 