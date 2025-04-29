import ApiClient from '@/api-client/api-client/src/apiClient';
import { useAtom } from 'jotai';
import { tokenAtom } from '@/api-client/api-client/src/storage';

// TODO: Replace with your actual API URL, potentially from environment variables
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://noelis.qazar.cloud';

const apiClient = new ApiClient(API_URL);

// Hook to initialize the API client with the Jotai token atom's SETTER
export function useInitializeApiClient() {
  const [, setToken] = useAtom(tokenAtom); // Get only the setter function
  
  // Pass only the setter function
  apiClient.initializeTokenAtomSetter(setToken);
}

// You might want to add interceptors here for auth tokens, etc.
// Example:
// import AsyncStorage from '@react-native-async-storage/async-storage';
// apiClient.instance.interceptors.request.use(async (config) => {
//   // No need to get token from storage here if using initializeTokenAtom
//   // The interceptor in ApiClient class will handle getting the token via the atom
//   return config;
// });

export default apiClient; 