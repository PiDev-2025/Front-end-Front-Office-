import React, { useState } from 'react';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Input, InputField } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';
import { Select, SelectTrigger, SelectInput, SelectIcon, SelectPortal, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectItem } from '@/components/ui/select';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import apiClient from '@/libs/apiClient';
import { useToast, Toast, ToastTitle, ToastDescription } from "@/components/ui/toast";
// TODO: Import user ID from auth state (Jotai atom?)
// import { useAtomValue } from 'jotai';
// import { userIdAtom } from '@/screens/states/user';

// TODO: Define RootStackParamList properly in navigation types
type RootStackParamList = {
  ChatV2Room: { roomId: string };
  // Add other relevant screens
};

type RoomType = 'direct' | 'group';

const ChatV2NewRoomScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const toast = useToast();
  const [roomName, setRoomName] = useState('');
  const [roomType, setRoomType] = useState<RoomType>('group');
  // TODO: Replace with actual user ID from state
  // const currentUserId = useAtomValue(userIdAtom);
  const currentUserId = 'user1'; // Placeholder 
  // TODO: Implement user selection for direct messages
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]); 
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateRoom = async () => {
    // Input validation
    if (roomType === 'group' && !roomName.trim()) {
       toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toast nativeID={id} action="warning">
            <ToastTitle>Validation Error</ToastTitle>
            <ToastDescription>Group name cannot be empty.</ToastDescription>
          </Toast>
        ),
      });
      return;
    }
    // TODO: Add validation for direct message user selection (at least one other user)

    setIsLoading(true);
    try {
      const userIdsToSend = roomType === 'direct' 
        ? [currentUserId, ...selectedUserIds] // Include self and selected users
        : [currentUserId]; // For groups, initially just the creator?

      console.log('Creating room via API:', { name: roomName, type: roomType, userIds: userIdsToSend });
      const newRoom = await apiClient.createRoom({
        name: roomType === 'group' ? roomName : '', // Name might be optional/ignored for direct
        type: roomType,
        userIds: userIdsToSend,
      });
      
      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toast nativeID={id} action="success">
            <ToastTitle>Success</ToastTitle>
            <ToastDescription>Chat room created successfully!</ToastDescription>
          </Toast>
        ),
      });

      // Navigate to the new room, replacing the creation screen
      navigation.replace('ChatV2Room', { roomId: newRoom.id.toString() }); 

    } catch (error) {
      console.error('Failed to create room:', error);
      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toast nativeID={id} action="error">
            <ToastTitle>Error</ToastTitle>
            <ToastDescription>
              {error instanceof Error ? error.message : 'Failed to create chat room.'}
            </ToastDescription>
          </Toast>
        ),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box className="flex-1 p-4 bg-background">
      <Text className="text-xl font-bold mb-4">Create New Chat Room</Text>

      <Select
        selectedValue={roomType}
        onValueChange={(value) => setRoomType(value as RoomType)}
        className="mb-4"
      >
        <SelectTrigger>
          <SelectInput placeholder="Select Room Type" />
          <SelectIcon />
        </SelectTrigger>
        <SelectPortal>
          <SelectBackdrop />
          <SelectContent>
            <SelectDragIndicatorWrapper>
              <SelectDragIndicator />
            </SelectDragIndicatorWrapper>
            <SelectItem label="Group Chat" value="group" />
            <SelectItem label="Direct Message" value="direct" />
          </SelectContent>
        </SelectPortal>
      </Select>

      {roomType === 'group' && (
        <Input className="mb-4">
          <InputField
            placeholder="Group Name"
            value={roomName}
            onChangeText={setRoomName}
            aria-label="Group Name Input"
          />
        </Input>
      )}

      {/* TODO: Implement User Search/Selection Component */} 
      {roomType === 'direct' && (
         <Box className="mb-4 p-4 border border-dashed border-gray-300 rounded-md">
           <Text className="text-center text-gray-500">User selection component placeholder</Text>
           {/* Replace with actual component, e.g.: */}
           {/* <UserSearch multiple onSelectionChange={setSelectedUserIds} /> */}
         </Box>
      )}

      <Button onPress={handleCreateRoom} disabled={isLoading} className="mt-4">
        <ButtonText>{isLoading ? 'Creating...' : 'Create Room'}</ButtonText>
      </Button>
    </Box>
  );
};

export default ChatV2NewRoomScreen; 