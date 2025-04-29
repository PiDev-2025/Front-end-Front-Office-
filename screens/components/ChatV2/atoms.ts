import { atom } from 'jotai';
import { ChatRoom, ChatMessage, ChatWebSocket } from './types';

// Atom to store the list of chat rooms
export const chatRoomsAtom = atom<ChatRoom[]>([]);

// Atom to store messages for the currently active room
// Using atomFamily or a similar pattern might be better for multiple rooms
export const currentRoomMessagesAtom = atom<ChatMessage[]>([]);

// Atom to store the active WebSocket connection instance
export const chatWebSocketAtom = atom<ChatWebSocket | null>(null);

// Atom to store the ID of the currently viewed room
export const activeRoomIdAtom = atom<string | null>(null);

// Derived atom to get the currently active room details
export const activeRoomAtom = atom((get) => {
  const roomId = get(activeRoomIdAtom);
  const rooms = get(chatRoomsAtom);
  if (!roomId) return null;
  return rooms.find(room => room.id === roomId) || null;
});

// Atom for loading states related to chat
export const chatLoadingAtom = atom(false); // Example: General loading state 