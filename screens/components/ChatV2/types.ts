// Define types based on the API client structure

export interface ChatRoom {
  id: string; // Or number, depending on API
  name: string;
  type: 'direct' | 'group';
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  // Add other relevant fields like participant IDs, last message snippet, etc.
}

export interface ChatMessage {
  id: string; // Or number
  content: string;
  roomId: string; // Or number
  userId: string; // Or number
  username: string; // Sender's username
  createdAt: string; // ISO Date string
  // Add other fields like message status (sent, delivered, read), attachments, etc.
}

// For WebSocket messages received from the server (matches MessageBroadcast)
export interface ReceivedWebSocketMessage {
  content: string;
  roomId: string;
  userId: string; 
  username: string; 
  createdAt: string; // ISO Date string
  // Note: ID might be assigned client-side or might come later
  id?: string; // Make ID optional initially if assigned later
}

// You might also need types for API responses if they differ slightly
export interface ListRoomsResponse {
  rooms: ChatRoom[];
  // Add pagination info if applicable
}

export interface GetRoomMessagesResponse {
  messages: ChatMessage[];
  // Add pagination info if applicable
}

// Type for the WebSocket connection instance
export interface ChatWebSocket {
  onMessage: (callback: (message: ReceivedWebSocketMessage) => void) => void;
  sendMessage: (content: string) => void;
  close: () => void;
} 