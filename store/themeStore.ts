import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { log } from "../screens/libs/logger";

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

interface ThemeSelection {
  parentThemeId: string | null;
  childThemeId: string | null;
  parentThemeName?: string;
  childThemeName?: string;
}

interface ThemeState {
  themeSelections: ThemeSelection[];
  usedCombinations: Set<string>;
  isViewMode: boolean;
  themes: Theme[];
  setThemeSelection: (index: number, parentThemeId: string | null, childThemeId: string | null) => void;
  isCombinationUsed: (parentThemeId: string, childThemeId: string) => boolean;
  clearThemeSelection: (index: number) => void;
  loadSavedThemes: (savedThemes: ThemeSelection[]) => void;
  setViewMode: (isViewMode: boolean) => void;
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

const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      themeSelections: Array(3).fill({ parentThemeId: null, childThemeId: null }),
      usedCombinations: new Set<string>(),
      isViewMode: false,
      themes: themes,

      setThemeSelection: (index, parentThemeId, childThemeId) => {
        if (get().isViewMode) {
          log.info('ThemeStore', 'Attempted to set theme selection in view mode');
          return;
        }
        
        log.info('ThemeStore', 'Setting theme selection', { index, parentThemeId, childThemeId });
        
        const currentSelections = [...get().themeSelections];
        const currentCombination = currentSelections[index];
        const usedCombinations = new Set(get().usedCombinations);
        
        // Remove old combination from used set if it exists
        if (currentCombination.parentThemeId && currentCombination.childThemeId) {
          const oldKey = `${currentCombination.parentThemeId}-${currentCombination.childThemeId}`;
          usedCombinations.delete(oldKey);
          log.debug('ThemeStore', 'Removed old combination', { oldKey });
        }

        // Add new combination to used set if both IDs are present
        if (parentThemeId && childThemeId) {
          const newKey = `${parentThemeId}-${childThemeId}`;
          usedCombinations.add(newKey);
          log.debug('ThemeStore', 'Added new combination', { newKey });
        }

        // Find theme names
        const parentTheme = themes.find(t => t.id === parentThemeId);
        const childTheme = parentTheme?.children.find(c => c.id === childThemeId);

        currentSelections[index] = {
          parentThemeId,
          childThemeId,
          parentThemeName: parentTheme?.name,
          childThemeName: childTheme?.name
        };
        
        set({ 
          themeSelections: currentSelections,
          usedCombinations: usedCombinations
        });
        log.info('ThemeStore', 'Theme selection updated', { 
          index, 
          newSelection: currentSelections[index],
          totalCombinations: usedCombinations.size 
        });
      },

      isCombinationUsed: (parentThemeId, childThemeId) => {
        const key = `${parentThemeId}-${childThemeId}`;
        const isUsed = get().usedCombinations.has(key);
        log.debug('ThemeStore', 'Checking if combination is used', { key, isUsed });
        return isUsed;
      },

      clearThemeSelection: (index) => {
        if (get().isViewMode) {
          log.info('ThemeStore', 'Attempted to clear theme selection in view mode');
          return;
        }
        
        log.info('ThemeStore', 'Clearing theme selection', { index });
        
        const currentSelections = [...get().themeSelections];
        const currentCombination = currentSelections[index];
        const usedCombinations = new Set(get().usedCombinations);
        
        if (currentCombination.parentThemeId && currentCombination.childThemeId) {
          const key = `${currentCombination.parentThemeId}-${currentCombination.childThemeId}`;
          usedCombinations.delete(key);
          log.debug('ThemeStore', 'Removed combination from used set', { key });
        }

        currentSelections[index] = { parentThemeId: null, childThemeId: null };
        set({ 
          themeSelections: currentSelections,
          usedCombinations: usedCombinations
        });
        log.info('ThemeStore', 'Theme selection cleared', { 
          index,
          totalCombinations: usedCombinations.size 
        });
      },

      loadSavedThemes: (savedThemes) => {
        log.info('ThemeStore', 'Loading saved themes', { savedThemes });
        
        const usedCombinations = new Set<string>();
        const themesWithNames = savedThemes.map(theme => {
          const parentTheme = themes.find(t => t.id === theme.parentThemeId);
          const childTheme = parentTheme?.children.find(c => c.id === theme.childThemeId);
          
          if (theme.parentThemeId && theme.childThemeId) {
            const key = `${theme.parentThemeId}-${theme.childThemeId}`;
            usedCombinations.add(key);
            log.debug('ThemeStore', 'Added saved combination', { key });
          }
          
          return {
            ...theme,
            parentThemeName: parentTheme?.name,
            childThemeName: childTheme?.name
          };
        });

        set({
          themeSelections: themesWithNames,
          usedCombinations: usedCombinations,
          isViewMode: true
        });
        log.info('ThemeStore', 'Saved themes loaded', { 
          totalThemes: themesWithNames.length,
          totalCombinations: usedCombinations.size,
          isViewMode: true
        });
      },

      setViewMode: (isViewMode) => {
        log.info('ThemeStore', 'Setting view mode', { isViewMode });
        set({ isViewMode });
      },
    }),
    {
      name: 'theme-storage',
      storage: {
        getItem: async (key) => {
          log.debug('ThemeStore', 'Loading from storage', { key });
          try {
            const value = await AsyncStorage.getItem(key);
            if (!value) {
              log.info('ThemeStore', 'No stored value found');
              return null;
            }
            
            const parsed = JSON.parse(value);
            log.debug('ThemeStore', 'Parsed storage value', { parsed });
            
            // Convert usedCombinations back to a Set
            if (parsed.state?.usedCombinations) {
              const usedCombinations = new Set(parsed.state.usedCombinations);
              parsed.state.usedCombinations = usedCombinations;
              log.debug('ThemeStore', 'Converted usedCombinations to Set', { 
                size: usedCombinations.size,
                values: Array.from(usedCombinations)
              });
            }

            // Ensure themeSelections is properly initialized
            if (!parsed.state?.themeSelections) {
              log.warn('ThemeStore', 'No themeSelections found in storage, initializing empty array');
              parsed.state = {
                ...parsed.state,
                themeSelections: Array(3).fill({ parentThemeId: null, childThemeId: null })
              };
            }

            log.info('ThemeStore', 'Loaded from storage', { 
              themeCount: parsed.state.themeSelections.length,
              combinationCount: parsed.state.usedCombinations?.size || 0,
              isViewMode: parsed.state.isViewMode || false
            });

            return parsed;
          } catch (error) {
            log.error('ThemeStore', 'Error loading from storage', { error });
            return null;
          }
        },
        setItem: async (key, value) => {
          log.debug('ThemeStore', 'Saving to storage', { 
            key,
            themeCount: value.state.themeSelections.length,
            combinationCount: value.state.usedCombinations.size,
            isViewMode: value.state.isViewMode
          });
          
          try {
            // Convert Set to Array for serialization
            const serializedValue = {
              ...value,
              state: {
                ...value.state,
                usedCombinations: Array.from(value.state.usedCombinations)
              }
            };
            
            await AsyncStorage.setItem(key, JSON.stringify(serializedValue));
            log.info('ThemeStore', 'Successfully saved to storage', { 
              themeCount: value.state.themeSelections.length,
              combinationCount: value.state.usedCombinations.size,
              isViewMode: value.state.isViewMode
            });
          } catch (error) {
            log.error('ThemeStore', 'Error saving to storage', { error });
          }
        },
        removeItem: async (key) => {
          log.info('ThemeStore', 'Removing from storage', { key });
          try {
            await AsyncStorage.removeItem(key);
            log.info('ThemeStore', 'Successfully removed from storage');
          } catch (error) {
            log.error('ThemeStore', 'Error removing from storage', { error });
          }
        },
      },
    }
  )
);

export default useThemeStore; 