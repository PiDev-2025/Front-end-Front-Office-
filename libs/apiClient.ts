import ApiClient from '../api-client/api-client/src/apiClient';
import { useAtom } from 'jotai';
import { tokenAtom } from '../api-client/api-client/src/storage';

// Initialize the API client with the base URL
const apiClient = new ApiClient('https://noelis.qazar.cloud');

// Configure logging to show URLs
apiClient.configureLogger({
  enabled: true,
  logLevel: 'info'
});

// Create a hook to initialize the API client with the token atom
export function useInitializeApiClient() {
  const tokenAtomValue = useAtom<string | null>(tokenAtom);
  apiClient.initializeTokenAtom(tokenAtomValue);
}

export default apiClient; 