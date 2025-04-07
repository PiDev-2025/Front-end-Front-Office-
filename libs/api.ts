import axios from 'axios';
import { useAtom } from 'jotai';
import { atom } from 'jotai';

// Define the API schema
interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  timestamp: string;
}

interface Chat {
  id: string;
  name?: string;
  type: string;
  users: any[];
  lastMessage?: string;
}

interface ChatGroup {
  id: string;
  name: string;
  type: string;
  users: any[];
}

interface SignInResponse {
  jwt: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

// Create an atom to store the auth token
const authTokenAtom = atom<string | null>(null);

// Set the base URL for local development
const BASE_URL = 'https://api.qazar.cloud';

// Create the API client
const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to set environment
export const setEnvironment = (env: 'development' | 'production') => {
  const baseUrl = env === 'production' ? 'https://api.example.com' : 'http://localhost:3000';
  client.defaults.baseURL = baseUrl;
  return client;
};

// Helper function to set auth token
export const setAuthToken = (token: string) => {
  client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  return client;
};

// Hook to manage auth token
export const useSetAuthToken = () => {
  const [, setToken] = useAtom(authTokenAtom);

  const setAuthToken = (token: string | null) => {
    if (token) {
      client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete client.defaults.headers.common['Authorization'];
    }
    setToken(token);
  };

  return setAuthToken;
};

// API methods
export const api = {
  signIn: async (email: string, password: string) => {
      const token = process.env.API_ELYSIA_JWT_USER_SIGNUP__SIGNIN;
      console.log(token);
      if (!token) throw new Error('JWT token not found in environment variables');
      setAuthToken(token);
    const response = await client.post<SignInResponse>('/v1/auth/user/signin', { email, password });
    return response.data;
  },
  signUp: async (email: string, password: string, name?: string) => {
      const token = process.env.API_ELYSIA_JWT_USER_SIGNUP__SIGNIN;
      if (!token) throw new Error('JWT token not found in environment variables');
      setAuthToken(token);
    const response = await client.post<SignInResponse>('/v1/auth/user/signin', { email, password, name });
    return response.data;
  },
  chat: {
    get: async () => {
      const response = await client.get<Chat[]>('/chat');
      return response.data;
    },
    post: async (data: {
      name?: string;
      type: string;
      theme?: string;
      description?: string;
      activityType?: string;
      professionalType?: string;
      styles?: {
        main_bg?: string;
        other_bubble?: string;
        my_bubble?: string;
      };
    }) => {
      const response = await client.post<Chat>('/chat', data);
      return response.data;
    },
    messages: {
      get: async (chatId: string) => {
        const response = await client.get<ChatMessage[]>(`/chat/messages/${chatId}`);
        return response.data;
      },
      post: async (chatId: string, content: string) => {
        const response = await client.post<ChatMessage>(`/chat/messages/${chatId}`, { content });
        return response.data;
      },
    },
    groups: {
      get: async () => {
        const response = await client.get<ChatGroup[]>('/chat/groups');
        return response.data;
      },
    },
  },
}; 