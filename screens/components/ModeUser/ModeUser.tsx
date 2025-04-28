import React, { useState } from 'react';
import { Alert, Platform } from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Card } from '@/components/ui/card';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useAtom } from 'jotai';
import { tokenAtom } from '../../../api-client/api-client/src/storage';
import ApiClient from '@/api-client/api-client/src/apiClient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

const apiClient = new ApiClient(process.env.API_URL || 'https://noelis.qazar.cloud');

interface UserMode {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

type RootStackParamList = {
  ModeUserLayout: undefined;
};

export const ModeUserScreen: React.FC = () => {
  const [modes, setModes] = useState<UserMode[]>([]);
  const [token, setToken] = useAtom(tokenAtom);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  React.useEffect(() => {
    apiClient.initializeTokenAtom([token, setToken]);
    loadUserModes();
  }, [token, setToken]);

  const loadUserModes = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      const mockModes: UserMode[] = [
        {
          id: '1',
          name: 'Free Mode',
          description: 'Basic features and limited access',
          isActive: true,
        },
        {
          id: '2',
          name: 'Paid Mode',
          description: 'Enhanced features and full access',
          isActive: false,
        },
        {
          id: '3',
          name: 'Pro Mode',
          description: 'Premium features and priority support',
          isActive: false,
        },
      ];
      setModes(mockModes);
    } catch (error) {
      console.error('Failed to load user modes:', error);
      Alert.alert('Error', 'Failed to load user modes');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = async (modeId: string) => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      setModes(prevModes =>
        prevModes.map(mode =>
          mode.id === modeId
            ? { ...mode, isActive: !mode.isActive }
            : { ...mode, isActive: false }
        )
      );
      // Navigate to layout screen when a mode is selected
      navigation.navigate('ModeUserLayout');
    } catch (error) {
      console.error('Failed to toggle mode:', error);
      Alert.alert('Error', 'Failed to toggle mode');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box className="flex-1 bg-background">
      <Box className="p-4">
        <Text className="text-2xl font-bold mb-4">User Modes</Text>
        <Text className="text-gray-500 mb-6">
          Select your current mode to customize your experience
        </Text>

        {modes.map((mode) => (
          <Card key={mode.id} className="mb-4">
            <Pressable
              onPress={() => toggleMode(mode.id)}
              disabled={isLoading}
            >
              <HStack className="p-4 items-center justify-between">
                <VStack className="flex-1">
                  <Text className="text-lg font-semibold">{mode.name}</Text>
                  <Text className="text-sm text-gray-500">{mode.description}</Text>
                </VStack>
                <Box
                  className={`w-8 h-8 rounded-full items-center justify-center ${
                    mode.isActive ? 'bg-primary-500' : 'bg-gray-200'
                  }`}
                >
                  {mode.isActive && (
                    <MaterialIcons name="check" size={20} color="#ffffff" />
                  )}
                </Box>
              </HStack>
            </Pressable>
          </Card>
        ))}
      </Box>
    </Box>
  );
}; 