import { QazClient } from '../client';
import { LoginRequest, SignupRequest, TokenResponse, User } from '../types';

export class AuthService extends QazClient {
  async login(credentials: LoginRequest): Promise<TokenResponse> {
    const response = await this.post<TokenResponse>('/auth/user/login', credentials);
    this.setTokens(response);
    console.log(response);
    return response;
  }

  async signup(data: SignupRequest): Promise<User> {
    return this.post<User>('/auth/user/signup', data);
  }

  async logout(): Promise<void> {
    await this.post('/auth/logout');
    this.clearTokens();
  }

  async getCurrentUser(): Promise<User> {
    return this.get<User>('/auth/me');
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    return this.put<User>('/auth/profile', data);
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await this.put('/auth/password', {
      old_password: oldPassword,
      new_password: newPassword,
    });
  }

  async forgotPassword(email: string): Promise<void> {
    await this.post('/auth/forgot-password', { email });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await this.post('/auth/reset-password', {
      token,
      new_password: newPassword,
    });
  }
} 