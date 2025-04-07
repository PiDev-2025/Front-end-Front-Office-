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
export const setAuthToken = (token: string | null) => {
  if (token) {
    client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete client.defaults.headers.common['Authorization'];
  }
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
    // For signin/signup, we don't need the auth token
    client.defaults.headers.common['Authorization'] = 'Bearer e7cbb254c3bf52a2c50ff113bd36695529f26f74f2fa14e6cb96bf29ae07b44895b3d217c940ef07d3f4a32e3ac7990bcbc0728d56d57c86337ed49b2d09b2ded851c2a1a40d990415a224b4d7848146311f7fbc3419d10f3b5d856d79950d8d4d0dc7571597102e16deea4f751012d77f1dfd91553a874a085c73998a2b09375ccead4cdb48a12a0720cdae82e4b59f75abce7388b4abb88e862761c3532e455d70fc6746ed36a088b50181e5a0c358b903fc91'
    const response = await client.post<SignInResponse>('/v1/auth/user/signin', { email, password });
    // Set the auth token from the response
    setAuthToken(response.data.jwt);
    return response.data;
  },
  signUp: async (email: string, password: string, username: string) => {
    // For signin/signup, we don't need the auth token
    client.defaults.headers.common['Authorization'] = 'Bearer e7cbb254c3bf52a2c50ff113bd36695529f26f74f2fa14e6cb96bf29ae07b44895b3d217c940ef07d3f4a32e3ac7990bcbc0728d56d57c86337ed49b2d09b2ded851c2a1a40d990415a224b4d7848146311f7fbc3419d10f3b5d856d79950d8d4d0dc7571597102e16deea4f751012d77f1dfd91553a874a085c73998a2b09375ccead4cdb48a12a0720cdae82e4b59f75abce7388b4abb88e862761c3532e455d70fc6746ed36a088b50181e5a0c358b903fc91'
    const response = await client.post<SignInResponse>('/v1/auth/user/signup', { email, password, username });
    // Set the auth token from the response
    setAuthToken(response.data.jwt);
    return response.data;
  },
  chat: {
    get: async (userId: string) => {
      const response = await client.get<Chat[]>(`/v1/chat/user/${userId}`);
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