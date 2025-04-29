import React from 'react';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { FlatList, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import MessageBubbleV2 from './components/MessageBubbleV2'; // Import component
import ChatInputV2 from './components/ChatInputV2'; // Import component
import { useChatMessages } from './hooks/useChatMessages'; // Import hook
import { ChatMessage } from './types'; // Import type
// TODO: Get current user ID from state
// import { useAtomValue } from 'jotai';
// import { userIdAtom } from '@/screens/states/user';

// Define RootStackParamList including roomName passed from list screen
type RootStackParamList = {
  ChatV2Room: { roomId: string, roomName: string };
  // Add other screens
};

type ChatV2RoomScreenRouteProp = RouteProp<RootStackParamList, 'ChatV2Room'>;

const ChatV2RoomScreen: React.FC = () => {
  const route = useRoute<ChatV2RoomScreenRouteProp>();
  // Get roomId from route params (roomName is also available if needed for header)
  const { roomId } = route.params; 

  // TODO: Replace with actual user ID from state
  // const currentUserId = useAtomValue(userIdAtom);
  const currentUserId = 'user1'; // Placeholder 

  // Use the hook to get messages, loading state, error state, and send function
  const { messages, isLoading, error, sendMessage } = useChatMessages(roomId);

  const renderItem = ({ item }: { item: ChatMessage }) => (
    <MessageBubbleV2 
      message={item} 
      isCurrentUser={item.userId === currentUserId} 
    />
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={{ flex: 1 }} 
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0} // Adjust offset if needed
    >
      <Box className="flex-1 bg-gray-100">
        {isLoading && messages.length === 0 ? (
          // Show loading indicator only when initially loading messages
          <Box className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" />
          </Box>
        ) : error ? (
          <Box className="flex-1 justify-center items-center p-4">
            <Text className="text-red-500 text-center">Error loading messages: {error.message}</Text>
          </Box>
        ) : (
          <FlatList
            data={messages}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            className="p-4"
            inverted // Show newest messages at the bottom
            contentContainerStyle={{ paddingTop: 10 }} // Add some padding at the top when inverted
            ListEmptyComponent={<Text className="text-center text-gray-500 mt-10">No messages yet.</Text>}
          />
        )}
        <ChatInputV2 onSend={sendMessage} />
      </Box>
    </KeyboardAvoidingView>
  );
};

export default ChatV2RoomScreen; 