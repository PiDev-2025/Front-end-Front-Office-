import React, { useState } from 'react';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { FlatList, ActivityIndicator, KeyboardAvoidingView, Platform, View } from 'react-native';
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
  const [showPreviousMessages, setShowPreviousMessages] = useState(false);

  // Always pass roomId for WebSocket connection, but control message loading separately
  const { messages, isLoading, error, sendMessage, loadMessages } = useChatMessages(roomId, showPreviousMessages);

  const renderItem = ({ item }: { item: ChatMessage }) => (
    <MessageBubbleV2 
      message={item} 
      isCurrentUser={item.userId === currentUserId} 
    />
  );

  const handleLoadPreviousMessages = () => {
    setShowPreviousMessages(true);
    loadMessages(roomId); // Explicitly load messages when requested
  };

  const WelcomeMessage = () => (
    <Box className="flex-1 justify-center items-center p-6 bg-gray-50">
      <Box className="bg-white rounded-2xl shadow-md p-6 w-full max-w-sm">
        <Text className="text-2xl font-bold text-center mb-4 text-purple-600">
          Welcome to {route.params.roomName}
        </Text>
        <Text className="text-gray-600 text-center mb-6">
          Ready to start a new conversation? Type your message below or load previous messages.
        </Text>
        {!showPreviousMessages && (
          <Button
            onPress={handleLoadPreviousMessages}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Text className="text-white font-medium">Load Previous Messages</Text>
          </Button>
        )}
      </Box>
    </Box>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={{ flex: 1 }} 
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0} // Adjust offset if needed
    >
      <Box className="flex-1 bg-gray-100">
        {isLoading && showPreviousMessages ? (
          <Box className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#9333ea" />
          </Box>
        ) : error ? (
          <Box className="flex-1 justify-center items-center p-4">
            <Text className="text-red-500 text-center">Error loading messages: {error.message}</Text>
          </Box>
        ) : !showPreviousMessages || messages.length === 0 ? (
          <WelcomeMessage />
        ) : (
          <FlatList
            data={messages}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            className="p-4"
            inverted // Show newest messages at the bottom
            contentContainerStyle={{ paddingTop: 10 }} // Add some padding at the top when inverted
            ListEmptyComponent={<WelcomeMessage />}
          />
        )}
        <ChatInputV2 onSend={sendMessage} />
      </Box>
    </KeyboardAvoidingView>
  );
};

export default ChatV2RoomScreen; 