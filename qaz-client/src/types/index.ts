export interface Base {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface User extends Base {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  type: string;
}

export interface Content extends Base {
  name: string;
  title: string;
  description: string;
  type: string;
  url: string;
  status: string;
  owner: User;
  users: User[];
}

export interface Message extends Base {
  sender_id: string;
  receiver_id: string;
  content: string;
  date: string;
  flag?: string;
  sender: User;
  receiver: User;
}

export interface Room extends Base {
  name: string;
  description: string;
  type: string;
  users: User[];
  messages: Message[];
  status: string;
}

export interface Program extends Base {
  name: string;
  description: string;
  type: string;
  status: string;
  owner: User;
  users: User[];
  paths: Path[];
}

export interface Path extends Base {
  name: string;
  description: string;
  type: string;
  status: string;
  program: Program;
  order: number;
}

export interface Order extends Base {
  user: User;
  program: Program;
  status: string;
  amount: number;
  currency: string;
  payment_method: string;
  payment_status: string;
}

export interface Advancement extends Base {
  user: User;
  path: Path;
  status: string;
  progress: number;
  completed_at?: string;
}

export interface Spot extends Base {
  name: string;
  description: string;
  type: string;
  status: string;
  localization: Localization;
}

export interface Localization extends Base {
  country: string;
  city: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface Activity extends Base {
  name: string;
  description: string;
  type: string;
  status: string;
  start_date: string;
  end_date: string;
  spot: Spot;
  users: User[];
}

export interface Lineup extends Base {
  activity: Activity;
  user: User;
  status: string;
  start_time: string;
  end_time: string;
}

export interface Link extends Base {
  name: string;
  url: string;
  type: string;
  status: string;
  content: Content;
}

export interface Theme extends Base {
  name: string;
  description: string;
  type: string;
  status: string;
  colors: Record<string, string>;
}

export interface Tag extends Base {
  name: string;
  description: string;
  type: string;
  status: string;
  content: Content[];
}

// Request/Response Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  type: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
} 