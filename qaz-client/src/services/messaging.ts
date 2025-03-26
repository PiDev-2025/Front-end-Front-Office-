import { QazClient } from '../client';
import { Message, Room, PaginatedResponse, PaginationParams } from '../types';

export class MessagingService extends QazClient {
  // Room operations
  async getRooms(params?: PaginationParams): Promise<PaginatedResponse<Room>> {
    return this.get<PaginatedResponse<Room>>('/rooms', { params });
  }

  async getRoomById(id: string): Promise<Room> {
    return this.get<Room>(`/rooms/${id}`);
  }

  async createRoom(data: Partial<Room>): Promise<Room> {
    return this.post<Room>('/rooms', data);
  }

  async updateRoom(id: string, data: Partial<Room>): Promise<Room> {
    return this.put<Room>(`/rooms/${id}`, data);
  }

  async deleteRoom(id: string): Promise<void> {
    await this.delete(`/rooms/${id}`);
  }

  async addUserToRoom(roomId: string, userId: string): Promise<Room> {
    return this.post<Room>(`/rooms/${roomId}/users`, { user_id: userId });
  }

  async removeUserFromRoom(roomId: string, userId: string): Promise<Room> {
    return this.delete<Room>(`/rooms/${roomId}/users/${userId}`);
  }

  // Message operations
  async getMessages(roomId: string, params?: PaginationParams): Promise<PaginatedResponse<Message>> {
    return this.get<PaginatedResponse<Message>>(`/rooms/${roomId}/messages`, { params });
  }

  async sendMessage(roomId: string, content: string): Promise<Message> {
    return this.post<Message>(`/rooms/${roomId}/messages`, { content });
  }

  async updateMessage(roomId: string, messageId: string, content: string): Promise<Message> {
    return this.put<Message>(`/rooms/${roomId}/messages/${messageId}`, { content });
  }

  async deleteMessage(roomId: string, messageId: string): Promise<void> {
    await this.delete(`/rooms/${roomId}/messages/${messageId}`);
  }

  async markMessageAsRead(roomId: string, messageId: string): Promise<Message> {
    return this.patch<Message>(`/rooms/${roomId}/messages/${messageId}/read`);
  }

  async getUnreadCount(roomId: string): Promise<{ count: number }> {
    return this.get<{ count: number }>(`/rooms/${roomId}/messages/unread/count`);
  }

  // Direct messaging
  async getDirectMessages(userId: string, params?: PaginationParams): Promise<PaginatedResponse<Message>> {
    return this.get<PaginatedResponse<Message>>(`/messages/direct/${userId}`, { params });
  }

  async sendDirectMessage(userId: string, content: string): Promise<Message> {
    return this.post<Message>(`/messages/direct/${userId}`, { content });
  }
} 