import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { log } from "../screens/libs/logger";;

interface ThemeSelection {
  parentThemeId: string | null;
  childThemeId: string | null;
}

interface ThemeState {
  themeSelections: ThemeSelection[];
  usedCombinations: Set<string>;
  isViewMode: boolean;
  setThemeSelection: (index: number, parentThemeId: string | null, childThemeId: string | null) => void;
  isCombinationUsed: (parentThemeId: string, childThemeId: string) => boolean;
  clearThemeSelection: (index: number) => void;
  loadSavedThemes: (savedThemes: ThemeSelection[]) => void;
  setViewMode: (isViewMode: boolean) => void;
}

const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      themeSelections: Array(3).fill({ parentThemeId: null, childThemeId: null }),
      usedCombinations: new Set<string>(),
      isViewMode: false,

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

        currentSelections[index] = { parentThemeId, childThemeId };
        
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
        
        // Add all saved combinations to usedCombinations
        savedThemes.forEach(theme => {
          if (theme.parentThemeId && theme.childThemeId) {
            const key = `${theme.parentThemeId}-${theme.childThemeId}`;
            usedCombinations.add(key);
            log.debug('ThemeStore', 'Added saved combination', { key });
          }
        });

        set({
          themeSelections: savedThemes,
          usedCombinations: usedCombinations,
          isViewMode: true
        });
        log.info('ThemeStore', 'Saved themes loaded', { 
          totalThemes: savedThemes.length,
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
          const value = await AsyncStorage.getItem(key);
          if (!value) {
            log.info('ThemeStore', 'No stored value found');
            return null;
          }
          
          const parsed = JSON.parse(value);
          // Convert usedCombinations back to a Set
          if (parsed.state.usedCombinations) {
            parsed.state.usedCombinations = new Set(parsed.state.usedCombinations);
          }
          log.info('ThemeStore', 'Loaded from storage', { 
            themeCount: parsed.state.themeSelections.length,
            combinationCount: parsed.state.usedCombinations.size
          });
          return parsed;
        },
        setItem: async (key, value) => {
          log.debug('ThemeStore', 'Saving to storage', { key });
          // Convert Set to Array for serialization
          const serializedValue = {
            ...value,
            state: {
              ...value.state,
              usedCombinations: Array.from(value.state.usedCombinations)
            }
          };
          await AsyncStorage.setItem(key, JSON.stringify(serializedValue));
          log.info('ThemeStore', 'Saved to storage', { 
            themeCount: value.state.themeSelections.length,
            combinationCount: value.state.usedCombinations.size
          });
        },
        removeItem: async (key) => {
          log.info('ThemeStore', 'Removing from storage', { key });
          await AsyncStorage.removeItem(key);
        },
      },
    }
  )
);

export default useThemeStore; 