import { QazClient } from '../client';
import { Content, PaginatedResponse, PaginationParams } from '../types';

export class ContentService extends QazClient {
  async getAll(params?: PaginationParams): Promise<PaginatedResponse<Content>> {
    return this.get<PaginatedResponse<Content>>('/content', { params });
  }

  async getById(id: string): Promise<Content> {
    return this.get<Content>(`/content/${id}`);
  }

  async create(data: Partial<Content>): Promise<Content> {
    return this.post<Content>('/content', data);
  }

  async update(id: string, data: Partial<Content>): Promise<Content> {
    return this.put<Content>(`/content/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    await this.delete(`/content/${id}`);
  }

  async addUser(id: string, userId: string): Promise<Content> {
    return this.post<Content>(`/content/${id}/users`, { user_id: userId });
  }

  async removeUser(id: string, userId: string): Promise<Content> {
    return this.delete<Content>(`/content/${id}/users/${userId}`);
  }

  async getByType(type: string, params?: PaginationParams): Promise<PaginatedResponse<Content>> {
    return this.get<PaginatedResponse<Content>>(`/content/type/${type}`, { params });
  }

  async getByStatus(status: string, params?: PaginationParams): Promise<PaginatedResponse<Content>> {
    return this.get<PaginatedResponse<Content>>(`/content/status/${status}`, { params });
  }

  async search(query: string, params?: PaginationParams): Promise<PaginatedResponse<Content>> {
    return this.get<PaginatedResponse<Content>>('/content/search', {
      params: { ...params, q: query },
    });
  }
} 