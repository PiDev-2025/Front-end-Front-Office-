import { useEffect, useState, useCallback } from 'react';
import { useAtom } from 'jotai';
import { currentRoomMessagesAtom, chatWebSocketAtom, activeRoomIdAtom } from '../atoms';
import { ChatMessage, ReceivedWebSocketMessage, ChatWebSocket } from '../types';
import apiClient from '@/libs/apiClient'; // Import API client

// Infer Message type from API client's getRoomMessages
type ApiMessage = Awaited<ReturnType<typeof apiClient.getRoomMessages>>[number];
// Infer WebSocket type from API client
type ApiChatWebSocket = Awaited<ReturnType<typeof apiClient.connectToRoom>>;
// Infer the broadcast message type from the ApiChatWebSocket onMessage callback
type MessageBroadcast = Parameters<Parameters<ApiChatWebSocket['onMessage']>[0]>[0];

export const useChatMessages = (roomId: string | null) => {
  const [messages, setMessages] = useAtom(currentRoomMessagesAtom);
  // Store the API's WebSocket type, but expose our defined ChatWebSocket type if needed externally
  const [webSocket, setWebSocket] = useAtom(chatWebSocketAtom);
  const [, setActiveRoomId] = useAtom(activeRoomIdAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Helper to map API message or Broadcast message to our internal ChatMessage type
  const mapApiMessage = (msg: ApiMessage | MessageBroadcast): ChatMessage => {
    const isApiMessage = 'sender_id' in msg;
    const messageId = ('id' in msg && msg.id) ? msg.id.toString() : `temp-${Date.now()}-${Math.random()}`; // Ensure ID is string
    const messageContent = msg.content || '';
    
    let messageRoomId: string;
    if ('roomId' in msg && typeof msg.roomId === 'string') {
      messageRoomId = msg.roomId;
    } else if (isApiMessage && 'chat_id' in msg && msg.chat_id) {
      messageRoomId = msg.chat_id; // Use chat_id from ApiMessage if roomId is missing
    } else if (roomId) {
      messageRoomId = roomId;
    } else {
      messageRoomId = 'unknown-room';
    }
    
    // Prioritize userId from broadcast, fallback to sender_id from ApiMessage
    const messageUserId = (!isApiMessage && 'userId' in msg) ? msg.userId : (isApiMessage ? msg.sender_id : 'unknown-user');
    const messageUsername = ('username' in msg && msg.username) ? msg.username : 'Unknown User';
    const messageCreatedAt = ('createdAt' in msg && msg.createdAt) 
                           ? msg.createdAt 
                           : (isApiMessage && 'created_at' in msg && msg.created_at) 
                             ? msg.created_at 
                             : new Date().toISOString(); // Guaranteed string

    return {
      id: messageId,
      content: messageContent,
      roomId: messageRoomId,
      userId: messageUserId,
      username: messageUsername,
      createdAt: messageCreatedAt,
    };
  };

  const fetchMessages = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log(`Fetching messages for room ${id} via API...`);
      const fetchedMessages: ApiMessage[] = await apiClient.getRoomMessages(id) || [];
      
      const mappedMessages = fetchedMessages
        .map(mapApiMessage)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      
      setMessages(mappedMessages);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch messages'));
      setMessages([]); // Clear messages on error
    } finally {
      setIsLoading(false);
    }
  }, [roomId, setMessages]);

  const connectWebSocket = useCallback(async (id: string) => {
    if (webSocket) {
      console.log('Closing existing WebSocket connection...');
      webSocket.close();
      setWebSocket(null);
    }
    try {
      console.log(`Connecting WebSocket for room ${id} via API...`);
      const chatWs: ApiChatWebSocket = await apiClient.connectToRoom(id);

      // Adapt the internal representation to match ChatWebSocket interface
      const internalWs: ChatWebSocket = {
        onMessage: (callback) => {
          // The callback here expects ReceivedWebSocketMessage
          // We receive MessageBroadcast from the actual ws
          chatWs.onMessage((broadcastMsg: MessageBroadcast) => {
            // Map the received MessageBroadcast to ReceivedWebSocketMessage before passing
            const receivedMsg: ReceivedWebSocketMessage = {
              content: broadcastMsg.content,
              roomId: broadcastMsg.roomId,
              userId: broadcastMsg.userId,
              username: broadcastMsg.username,
              createdAt: broadcastMsg.createdAt,
              // id is not present in broadcast, keep it undefined here
            };
            callback(receivedMsg);
          });
        },
        sendMessage: chatWs.sendMessage.bind(chatWs),
        close: chatWs.close.bind(chatWs),
      };

      // This callback now receives ReceivedWebSocketMessage
      internalWs.onMessage((message: ReceivedWebSocketMessage) => {
        console.log('Received WebSocket message (mapped):', message);
        // Map ReceivedWebSocketMessage to ChatMessage before adding to state
        const chatMsgToAdd = mapApiMessage(message as any); // Use mapApiMessage (needs type assertion)
        setMessages((prev) => [...prev, chatMsgToAdd].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()));
      });

      setWebSocket(internalWs);
    } catch (err) {
      console.error('Failed to connect WebSocket:', err);
      setError(err instanceof Error ? err : new Error('WebSocket connection failed'));
    }
  }, [webSocket, setWebSocket, setMessages, roomId]);

  // Effect to handle room changes
  useEffect(() => {
    setActiveRoomId(roomId);
    if (roomId) {
      fetchMessages(roomId);
      connectWebSocket(roomId);
    } else {
      setMessages([]);
      if (webSocket) {
        webSocket.close();
        setWebSocket(null);
      }
    }

    return () => {
      if (webSocket) {
        console.log('Cleaning up WebSocket connection...');
        webSocket.close();
        setWebSocket(null);
      }
      setActiveRoomId(null);
      setMessages([]);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, fetchMessages, connectWebSocket, setActiveRoomId, setWebSocket, setMessages]); // Add setMessages

  const sendMessage = useCallback((content: string) => {
    if (webSocket) {
      try {
        webSocket.sendMessage(content);
        // Optional: Add optimistic update here if desired
      } catch (err) {
        console.error('Failed to send message:', err);
        setError(err instanceof Error ? err : new Error('Failed to send message'));
        // TODO: Handle send error state (e.g., show toast, mark message as failed)
      }
    } else {
      console.error('WebSocket not connected. Cannot send message.');
      setError(new Error('WebSocket not connected'));
      // TODO: Handle error state
    }
  }, [webSocket]);

  return { messages, isLoading, error, sendMessage };
}; 