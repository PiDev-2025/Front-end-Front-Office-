import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { chatRoomsAtom, chatLoadingAtom } from '../atoms';
import { ChatRoom } from '../types'; // Import ChatRoom type
import apiClient from '@/libs/apiClient'; // Import the initialized API client

// Infer the Room type from the API client method's return type
type ApiRoom = Awaited<ReturnType<typeof apiClient.listRooms>>[number];

export const useChatRooms = () => {
  const [rooms, setRooms] = useAtom(chatRoomsAtom);
  const [isLoading, setIsLoading] = useAtom(chatLoadingAtom);

  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching rooms via API...');
      const fetchedRooms: ApiRoom[] = await apiClient.listRooms() || [];
      
      // Map API response to our internal ChatRoom type
      const mappedRooms: ChatRoom[] = fetchedRooms.map(room => ({
        id: room.id, // Assuming API returns string ID directly matching Room type
        name: room.name,
        type: room.type, // Assuming type matches 'direct' | 'group'
        // Map other fields if needed, using defaults if they don't exist on ApiRoom
        createdAt: room.created_at || new Date().toISOString(), // Use created_at from API if available
        updatedAt: room.updated_at || new Date().toISOString(), // Use updated_at from API if available
      }));

      setRooms(mappedRooms);
    } catch (error) {
      console.error('Failed to fetch chat rooms:', error);
      setRooms([]); // Clear rooms on error
      // TODO: Handle error state properly (e.g., set an error atom, show toast)
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Fetch only on mount

  return { rooms, isLoading, refetchRooms: fetchRooms };
}; 