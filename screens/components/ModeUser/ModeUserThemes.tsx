import React, { useState } from 'react';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Card } from '@/components/ui/card';
import { Select, SelectTrigger, SelectInput, SelectIcon, SelectPortal, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useAtom } from 'jotai';
import { themeSelectionsAtom, isCombinationUsedAtom, clearThemeSelectionAtom } from '@/store/themeAtoms';
import { useToast } from '@/components/ui/toast';
import ApiClient from '@/api-client/api-client/src/apiClient';
import { B } from '@expo/html-elements';
import { Toast, ToastTitle, ToastDescription } from '@/components/ui/toast';

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
      {
        id: '1-2',
        name: 'Modern Light',
        description: 'Contemporary light theme with minimal design',
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
      {
        id: '2-2',
        name: 'Obsidian Dark',
        description: 'Pure black theme with high contrast',
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
  const [themeSelections, setThemeSelections] = useAtom(themeSelectionsAtom);
  const isCombinationUsed = useAtom(isCombinationUsedAtom)[0];
  const [, clearThemeSelection] = useAtom(clearThemeSelectionAtom);
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleThemeChange = async () => {
    try {
      setIsLoading(true);
      // TODO: Implement API call to save theme selections
      toast.show({
        render: () => (
          <Toast action="success">
            <ToastTitle>Success</ToastTitle>
            <ToastDescription>Themes updated successfully</ToastDescription>
          </Toast>
        ),
      });
    } catch (error) {
      console.error('Failed to update themes:', error);
      toast.show({
        render: () => (
          <Toast action="error">
            <ToastTitle>Error</ToastTitle>
            <ToastDescription>Failed to update themes</ToastDescription>
          </Toast>
        ),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateThemeSelection = (index: number, parentTheme: Theme | null, childTheme: Theme['children'][0] | null) => {
    if (parentTheme && childTheme) {
      if (isCombinationUsed(parentTheme.id, childTheme.id)) {
        toast.show({
          render: () => (
            <Toast action="error">
              <ToastTitle>Invalid Selection</ToastTitle>
              <ToastDescription>This theme combination is already selected</ToastDescription>
            </Toast>
          ),
        });
        return;
      }
    }

    const newSelections = [...themeSelections];
    newSelections[index] = {
      parentThemeId: parentTheme?.id || null,
      childThemeId: childTheme?.id || null,
    };
    setThemeSelections(newSelections);
  };

  const handleClearSelection = (index: number) => {
    clearThemeSelection(index);
  };

  return (
    <Box className="flex-1 bg-background">
      <Box className="p-3">
        <Text className="text-xl font-bold mb-3">Theme Selection</Text>
        <Text className="text-sm text-gray-500 mb-4">
          Choose your preferred themes and their variations
        </Text>

        {themeSelections.map((selection, index) => (
          <Card key={index} className="p-3 mb-3">
            <VStack space="sm" className='gap-2'>
              <HStack className="justify-between items-center">
                <Text className="text-base font-semibold">Theme {index + 1}</Text>
                {selection.parentThemeId && (
                  <Button
                    size="xs"
                    variant="outline"
                    onPress={() => handleClearSelection(index)}
                  >
                    <Text className="text-xs text-red-500">Recommencez</Text>
                  </Button>
                )}
              </HStack>
              
              <VStack space="xs">
                <Text className="text-sm font-medium">Parent Theme</Text>
                <Select
                  selectedValue={selection.parentThemeId}
                  onValueChange={(value) => {
                    const theme = themes.find(t => t.id === value);
                    updateThemeSelection(index, theme || null, null);
                  }}
                >
                  <SelectTrigger size="sm">
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
                          <Text>{theme.name}</Text>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </SelectPortal>
                </Select>
                {selection.parentThemeId && (
                  <Text className="text-xs text-gray-500">
                    {themes.find(t => t.id === selection.parentThemeId)?.description}
                  </Text>
                )}
              </VStack>

              {selection.parentThemeId && (
                <VStack space="xs">
                  <Text className="text-sm font-medium">Theme Variation</Text>
                  <Select
                    selectedValue={selection.childThemeId}
                    onValueChange={(value) => {
                      const parentTheme = themes.find(t => t.id === selection.parentThemeId);
                      const childTheme = parentTheme?.children.find(t => t.id === value);
                      updateThemeSelection(index, parentTheme || null, childTheme || null);
                    }}
                  >
                    <SelectTrigger size="sm">
                      <SelectInput placeholder="Select a theme variation" />
                      <SelectIcon />
                    </SelectTrigger>
                    <SelectPortal>
                      <SelectBackdrop />
                      <SelectContent>
                        <SelectDragIndicatorWrapper>
                          <SelectDragIndicator />
                        </SelectDragIndicatorWrapper>
                        {themes
                          .find(t => t.id === selection.parentThemeId)
                          ?.children
                          .map((child) => {
                            // Check if this child theme is used in any other selection with the same parent theme
                            const isUsed = themeSelections.some((otherSelection, otherIndex) => 
                              otherIndex !== index && 
                              otherSelection.parentThemeId === selection.parentThemeId && 
                              otherSelection.childThemeId === child.id
                            );
                            
                            // Only render the SelectItem if it's the current selection or not used elsewhere
                            if (child.id === selection.childThemeId || !isUsed) {
                              return (
                                <SelectItem
                                  key={child.id}
                                  label={child.name}
                                  value={child.id}
                                >
                                  <Text>{child.name}</Text>
                                </SelectItem>
                              );
                            }
                            return null;
                          })}
                      </SelectContent>
                    </SelectPortal>
                  </Select>
                  {selection.childThemeId && (
                    <Text className="text-xs text-gray-500">
                      {themes
                        .find(t => t.id === selection.parentThemeId)
                        ?.children.find(t => t.id === selection.childThemeId)
                        ?.description}
                    </Text>
                  )}
                </VStack>
              )}
            </VStack>
          </Card>
        ))}

        <Button
          onPress={handleThemeChange}
          disabled={isLoading || themeSelections.some(selection => !selection.parentThemeId || !selection.childThemeId)}
          className="mt-3"
          size="sm"
        >
          <Text>{isLoading ? 'Applying...' : 'Apply Themes'}</Text>
        </Button>
      </Box>
    </Box>
  );
}; 