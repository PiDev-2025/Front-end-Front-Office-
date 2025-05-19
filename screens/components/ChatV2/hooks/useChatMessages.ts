import { useEffect, useState, useCallback } from 'react';
import { useAtom } from 'jotai';
import { currentRoomMessagesAtom } from '../atoms';
import { ChatMessage } from '../types';
import apiClient from '@/libs/apiClient';

// Infer Message type from API client's getRoomMessages
type ApiMessage = Awaited<ReturnType<typeof apiClient.getRoomMessages>>[number];

// Polling interval in milliseconds
const POLLING_INTERVAL = 60000; // 60 seconds

export const useChatMessages = (roomId: string | null, shouldLoadMessages: boolean = false) => {
  const [messages, setMessages] = useAtom(currentRoomMessagesAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastMessageTime, setLastMessageTime] = useState<string | null>(null);
  const [roomExists, setRoomExists] = useState<boolean>(false);

  // Helper to map API message to our internal ChatMessage type
  const mapApiMessage = (msg: ApiMessage): ChatMessage => {
    return {
      id: msg.id.toString(),
      content: msg.content || '',
      roomId: msg.chat_id,
      userId: msg.sender_id,
      username: 'User', // TODO: Get username from user service
      createdAt: msg.created_at,
    };
  };

  // Check if room exists
  const checkRoomExists = useCallback(async (id: string) => {
    try {
      const rooms = await apiClient.listRooms();
      const exists = rooms.some(room => room.id === id);
      setRoomExists(exists);
      if (!exists) {
        setError(new Error('Chat room not found. Please make sure you have access to this room.'));
      }
      return exists;
    } catch (err) {
      console.error('Failed to check room existence:', err);
      setError(err instanceof Error ? err : new Error('Failed to verify room access'));
      return false;
    }
  }, []);

  const fetchMessages = useCallback(async (id: string) => {
    if (!shouldLoadMessages) return;
    
    setIsLoading(true);
    setError(null);
    try {
      // Check room existence first
      const exists = await checkRoomExists(id);
      if (!exists) {
        setMessages([]);
        return;
      }

      console.log(`Fetching messages for room ${id} via API...`);
      const fetchedMessages: ApiMessage[] = await apiClient.getRoomMessages(id) || [];
      
      const mappedMessages = fetchedMessages
        .map(mapApiMessage)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      
      setMessages(mappedMessages);
      
      // Update last message time for polling optimization
      if (mappedMessages.length > 0) {
        setLastMessageTime(mappedMessages[mappedMessages.length - 1].createdAt);
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch messages'));
      setMessages([]); // Clear messages on error
    } finally {
      setIsLoading(false);
    }
  }, [shouldLoadMessages, setMessages, checkRoomExists]);

  // Expose loadMessages function for manual loading
  const loadMessages = useCallback((id: string) => {
    if (!id) return;
    fetchMessages(id);
  }, [fetchMessages]);

  // Effect to handle room changes and setup polling
  useEffect(() => {
    let pollInterval: NodeJS.Timeout | null = null;

    if (roomId) {
      // Check room existence when entering
      checkRoomExists(roomId);

      // Initial fetch if shouldLoadMessages is true
      if (shouldLoadMessages) {
        fetchMessages(roomId);
        
        // Setup polling
        pollInterval = setInterval(() => {
          fetchMessages(roomId);
        }, POLLING_INTERVAL);
      }
    } else {
      setMessages([]);
    }

    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
      setMessages([]);
    };
  }, [roomId, shouldLoadMessages, fetchMessages, setMessages, checkRoomExists]);

  const sendMessage = useCallback(async (content: string) => {
    if (!roomId) {
      console.error('No room ID available');
      setError(new Error('No room ID available'));
      return;
    }

    try {
      // Verify room exists before sending
      const exists = await checkRoomExists(roomId);
      if (!exists) {
        return;
      }

      const response = await apiClient.sendMessage(roomId, { content });
      const newMessage = mapApiMessage(response);
      
      setMessages((prev) => [...prev, newMessage].sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      ));
      
      // Update last message time
      setLastMessageTime(newMessage.createdAt);
    } catch (err) {
      console.error('Failed to send message:', err);
      // Check for foreign key violation error
      if (err instanceof Error && err.message.includes('foreign key constraint')) {
        setError(new Error('Cannot send message: Chat room not found or you don\'t have access.'));
      } else {
        setError(err instanceof Error ? err : new Error('Failed to send message'));
      }
    }
  }, [roomId, setMessages, checkRoomExists]);

  return { messages, isLoading, error, sendMessage, loadMessages, roomExists };
}; 