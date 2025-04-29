import { useInitializeApiClient } from './libs/apiClient';

export default function App() {
  // Initialize the API client with token management
  useInitializeApiClient();

  return (
    // ... existing app code ...
  );
} 