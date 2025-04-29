import React from 'react';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { FlatList, Pressable, ActivityIndicator } from 'react-native';
import { useChatRooms } from './hooks/useChatRooms';
import { ChatRoom } from './types';

// TODO: Define RootStackParamList properly in navigation types
type RootStackParamList = {
  ChatV2List: undefined;
  ChatV2Room: { roomId: string, roomName: string };
  ChatV2NewRoom: undefined;
  // Add other screens from your navigation stack
};

const ChatV2ListScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { rooms, isLoading, refetchRooms } = useChatRooms();

  const renderItem = ({ item }: { item: ChatRoom }) => (
    <Pressable onPress={() => navigation.navigate('ChatV2Room', { roomId: item.id, roomName: item.name })}>
      <Box className="p-4 border-b border-gray-200 bg-white mb-2 rounded-lg shadow-sm">
        <Text className="text-lg font-semibold text-gray-800">{item.name}</Text>
      </Box>
    </Pressable>
  );

  if (isLoading) {
    return (
      <Box className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" />
      </Box>
    );
  }

  return (
    <Box className="flex-1 p-4 bg-gray-100">
      <FlatList
        data={rooms}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text className="text-center text-gray-500 mt-10">No chat rooms found.</Text>}
        refreshing={isLoading}
        onRefresh={refetchRooms}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
      <Button 
        onPress={() => navigation.navigate('ChatV2NewRoom')} 
        className="absolute bottom-6 right-6 rounded-full w-14 h-14 shadow-lg bg-primary-600"
        aria-label="Create New Chat"
      >
        <Text className="text-white text-2xl font-bold">+</Text> 
      </Button>
    </Box>
  );
};

export default ChatV2ListScreen; 