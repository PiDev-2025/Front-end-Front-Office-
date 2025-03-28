import { AuthService } from './services/auth';
import { ContentService } from './services/content';
import { MessagingService } from './services/messaging';
import { QazClient } from './client';

export * from './types';

export class QazApiClient extends QazClient {
  public auth: AuthService;
  public content: ContentService;
  public messaging: MessagingService;

  constructor(baseURL: string) {
    super(baseURL);
    this.auth = new AuthService(baseURL);
    this.content = new ContentService(baseURL);
    this.messaging = new MessagingService(baseURL);
  }
}

// Create a default export for easier importing
export default QazApiClient; 