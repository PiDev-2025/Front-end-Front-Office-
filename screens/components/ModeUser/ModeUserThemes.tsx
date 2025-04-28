import React, { useState } from 'react';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Card } from '@/components/ui/card';
import { Select, SelectTrigger, SelectInput, SelectIcon, SelectPortal, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useAtom } from 'jotai';
import { tokenAtom } from '../../../api-client/api-client/src/storage';
import ApiClient from '@/api-client/api-client/src/apiClient';
import { B } from '@expo/html-elements';

const apiClient = new ApiClient(process.env.API_URL || 'https://noelis.qazar.cloud');

interface Theme {
  id: string;
  name: string;
  description: string;
  children: {
    id: string;
    name: string;
    description: string;
  }[];
}

const themes: Theme[] = [
  {
    id: '1',
    name: 'Light Theme',
    description: 'Clean and bright interface',
    children: [
      {
        id: '1-1',
        name: 'Classic Light',
        description: 'Traditional light theme with subtle shadows',
      },
    ],
  },
  {
    id: '2',
    name: 'Dark Theme',
    description: 'Elegant dark interface',
    children: [
      {
        id: '2-1',
        name: 'Midnight Dark',
        description: 'Deep dark theme with blue accents',
      },
    ],
  },
  {
    id: '3',
    name: 'Custom Theme',
    description: 'Personalized color scheme',
    children: [
      {
        id: '3-1',
        name: 'Custom Colors',
        description: 'Create your own theme',
      },
    ],
  },
];

export const ModeUserThemes: React.FC = () => {
  const [selectedParentTheme, setSelectedParentTheme] = useState<Theme | null>(null);
  const [selectedChildTheme, setSelectedChildTheme] = useState<Theme['children'][0] | null>(null);
  const [token, setToken] = useAtom(tokenAtom);
  const [isLoading, setIsLoading] = useState(false);

  const handleThemeChange = async () => {
    if (!selectedParentTheme || !selectedChildTheme) return;

    try {
      setIsLoading(true);
      await apiClient.post('/account/user/theme', {
        parentThemeId: selectedParentTheme.id,
        childThemeId: selectedChildTheme.id,
      });
      // TODO: Show success message
    } catch (error) {
      console.error('Failed to update theme:', error);
      // TODO: Show error message
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box className="flex-1 bg-background">
      <Box className="p-4">
        <Text className="text-2xl font-bold mb-4">Theme Selection</Text>
        <Text className="text-gray-500 mb-6">
          Choose your preferred theme and its variation
        </Text>

        <Card className="p-4 mb-4">
          <VStack space="md">
            <Text className="text-lg font-semibold">Parent Theme</Text>
            <Select
              selectedValue={selectedParentTheme?.id}
              onValueChange={(value) => {
                const theme = themes.find(t => t.id === value);
                setSelectedParentTheme(theme || null);
                setSelectedChildTheme(null);
              }}
            >
              <SelectTrigger>
                <SelectInput placeholder="Select a parent theme" />
                <SelectIcon />
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop />
                <SelectContent>
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>
                  {themes.map((theme) => (
                    <SelectItem
                      key={theme.id}
                      label={theme.name}
                      value={theme.id}
                    >
                      {theme.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectPortal>
            </Select>
            {selectedParentTheme && (
              <Text className="text-sm text-gray-500">
                {selectedParentTheme.description}
              </Text>
            )}
          </VStack>
        </Card>

        {selectedParentTheme && (
          <Card className="p-4 mb-4">
            <VStack space="md">
              <Text className="text-lg font-semibold">Theme Variation</Text>
              <Select
                selectedValue={selectedChildTheme?.id}
                onValueChange={(value) => {
                  const childTheme = selectedParentTheme.children.find(
                    t => t.id === value
                  );
                  setSelectedChildTheme(childTheme || null);
                }}
              >
                <SelectTrigger>
                  <SelectInput placeholder="Select a theme variation" />
                  <SelectIcon />
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent>
                    <SelectDragIndicatorWrapper>
                      <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    {selectedParentTheme.children.map((child) => (
                      <SelectItem
                        key={child.id}
                        label={child.name}
                        value={child.id}
                      >
                        {child.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectPortal>
              </Select>
              {selectedChildTheme && (
                <Text className="text-sm text-gray-500">
                  {selectedChildTheme.description}
                </Text>
              )}
            </VStack>
          </Card>
        )}

        <Button
          onPress={handleThemeChange}
          disabled={!selectedParentTheme || !selectedChildTheme || isLoading}
          className="mt-4"
        >
          {isLoading ? 'Applying...' : 'Apply Theme'}
        </Button>
      </Box>
    </Box>
  );
}; 