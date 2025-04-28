import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAtom } from 'jotai';
import { tokenAtom } from '../../../api-client/api-client/src/storage';
import ApiClient from '@/api-client/api-client/src/apiClient';

const apiClient = new ApiClient(process.env.API_URL || 'https://noelis.qazar.cloud');

interface UserSettings {
  name: string;
  email: string;
  mode: string;
  preferences: {
    notifications: boolean;
    darkMode: boolean;
    language: string;
  };
}

export const ModeUserSettings: React.FC = () => {
  const [settings, setSettings] = useState<UserSettings>({
    name: '',
    email: '',
    mode: '',
    preferences: {
      notifications: true,
      darkMode: false,
      language: 'en',
    },
  });
  const [token, setToken] = useAtom(tokenAtom);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadUserSettings();
  }, [token]);

  const loadUserSettings = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/account/user');
      if (response.data) {
        setSettings(response.data);
      }
    } catch (error) {
      console.error('Failed to load user settings:', error);
      Alert.alert('Error', 'Failed to load user settings');
    } finally {
      setIsLoading(false);
    }
  };

  const saveUserSettings = async () => {
    try {
      setIsLoading(true);
      await apiClient.post('/account/user', settings);
      Alert.alert('Success', 'Settings saved successfully');
    } catch (error) {
      console.error('Failed to save user settings:', error);
      Alert.alert('Error', 'Failed to save user settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreferenceChange = (key: keyof UserSettings['preferences'], value: boolean | string) => {
    setSettings(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value,
      },
    }));
  };

  return (
    <Box className="flex-1 bg-background">
      <Box className="p-4">
        <Text className="text-2xl font-bold mb-4">User Settings</Text>
        
        <Card className="p-4 mb-4">
          <VStack space="md">
            <Text className="text-lg font-semibold">Profile Information</Text>
            
            <Input
              label="Name"
              value={settings.name}
              onChangeText={(text) => setSettings(prev => ({ ...prev, name: text }))}
              placeholder="Enter your name"
            />
            
            <Input
              label="Email"
              value={settings.email}
              onChangeText={(text) => setSettings(prev => ({ ...prev, email: text }))}
              placeholder="Enter your email"
              keyboardType="email-address"
            />
          </VStack>
        </Card>

        <Card className="p-4 mb-4">
          <VStack space="md">
            <Text className="text-lg font-semibold">Preferences</Text>
            
            <HStack className="items-center justify-between">
              <Text>Notifications</Text>
              <Pressable
                onPress={() => handlePreferenceChange('notifications', !settings.preferences.notifications)}
                className={`w-12 h-6 rounded-full ${
                  settings.preferences.notifications ? 'bg-primary-500' : 'bg-gray-300'
                }`}
              >
                <Box className="w-6 h-6 rounded-full bg-white" />
              </Pressable>
            </HStack>

            <HStack className="items-center justify-between">
              <Text>Dark Mode</Text>
              <Pressable
                onPress={() => handlePreferenceChange('darkMode', !settings.preferences.darkMode)}
                className={`w-12 h-6 rounded-full ${
                  settings.preferences.darkMode ? 'bg-primary-500' : 'bg-gray-300'
                }`}
              >
                <Box className="w-6 h-6 rounded-full bg-white" />
              </Pressable>
            </HStack>
          </VStack>
        </Card>

        <Button
          onPress={saveUserSettings}
          disabled={isLoading}
          className="mt-4"
        >
          {isLoading ? 'Saving...' : 'Save Settings'}
        </Button>
      </Box>
    </Box>
  );
}; 