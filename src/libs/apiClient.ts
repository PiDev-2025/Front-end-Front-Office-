import ApiClient from '../../api-client/api-client/src/apiClient';
import { useAtom } from 'jotai';
import { tokenAtom } from '../../api-client/api-client/src/storage';
import { useEffect } from 'react';

// Create a single instance with your API base URL
export const apiClient = new ApiClient('https://your-api-base-url.com');

// Hook to initialize the apiClient with the Jotai atom setter
export function useInitializeApiClient() {
  const [, setToken] = useAtom(tokenAtom);

  useEffect(() => {
    // Initialize the token atom setter
    apiClient.initializeTokenAtomSetter(setToken);
  }, [setToken]);
}

export default apiClient; 