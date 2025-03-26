# QazarCloud API Client

A TypeScript client library for the QazarCloud API, providing type-safe access to all API endpoints.

## Installation

```bash
npm install @qazarcloud/qaz-client
# or
yarn add @qazarcloud/qaz-client
```

## Usage

```typescript
import QazApiClient from '@qazarcloud/qaz-client';

// Initialize the client
const client = new QazApiClient('https://api.qazarcloud.com');

// Authentication
const login = async () => {
  try {
    const response = await client.auth.login({
      email: 'user@example.com',
      password: 'password123'
    });
    console.log('Logged in successfully:', response);
  } catch (error) {
    console.error('Login failed:', error);
  }
};

// Content Management
const getContent = async () => {
  try {
    const content = await client.content.getAll({
      page: 1,
      limit: 10
    });
    console.log('Content:', content);
  } catch (error) {
    console.error('Failed to fetch content:', error);
  }
};

// Messaging
const sendMessage = async () => {
  try {
    const message = await client.messaging.sendMessage('room123', 'Hello, World!');
    console.log('Message sent:', message);
  } catch (error) {
    console.error('Failed to send message:', error);
  }
};
```

## Features

- Full TypeScript support with type definitions
- Automatic token refresh handling
- Pagination support
- Error handling
- Modular service-based architecture
- Comprehensive API coverage

## Services

### Auth Service
- Login/Signup
- Password management
- Profile management
- Token refresh

### Content Service
- CRUD operations
- User management
- Search functionality
- Type and status filtering

### Messaging Service
- Room management
- Message operations
- Direct messaging
- Read status tracking

## API Reference

### Authentication

```typescript
// Login
client.auth.login(credentials: LoginRequest): Promise<TokenResponse>

// Signup
client.auth.signup(data: SignupRequest): Promise<User>

// Get current user
client.auth.getCurrentUser(): Promise<User>

// Update profile
client.auth.updateProfile(data: Partial<User>): Promise<User>
```

### Content

```typescript
// Get all content
client.content.getAll(params?: PaginationParams): Promise<PaginatedResponse<Content>>

// Get content by ID
client.content.getById(id: string): Promise<Content>

// Create content
client.content.create(data: Partial<Content>): Promise<Content>

// Update content
client.content.update(id: string, data: Partial<Content>): Promise<Content>
```

### Messaging

```typescript
// Get rooms
client.messaging.getRooms(params?: PaginationParams): Promise<PaginatedResponse<Room>>

// Send message
client.messaging.sendMessage(roomId: string, content: string): Promise<Message>

// Get messages
client.messaging.getMessages(roomId: string, params?: PaginationParams): Promise<PaginatedResponse<Message>>
```

## Error Handling

The client includes built-in error handling and automatic token refresh. All API calls return promises that can be handled with try/catch blocks.

```typescript
try {
  const result = await client.someService.someMethod();
  // Handle success
} catch (error) {
  // Handle error
  console.error('API Error:', error);
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 