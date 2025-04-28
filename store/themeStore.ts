import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeSelection {
  parentThemeId: string | null;
  childThemeId: string | null;
}

interface ThemeState {
  themeSelections: ThemeSelection[];
  usedCombinations: Set<string>;
  setThemeSelection: (index: number, parentThemeId: string | null, childThemeId: string | null) => void;
  isCombinationUsed: (parentThemeId: string, childThemeId: string) => boolean;
  clearThemeSelection: (index: number) => void;
}

const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      themeSelections: Array(3).fill({ parentThemeId: null, childThemeId: null }),
      usedCombinations: new Set<string>(),

      setThemeSelection: (index, parentThemeId, childThemeId) => {
        const currentSelections = [...get().themeSelections];
        const currentCombination = currentSelections[index];
        const usedCombinations = new Set(get().usedCombinations);
        
        // Remove old combination from used set if it exists
        if (currentCombination.parentThemeId && currentCombination.childThemeId) {
          const oldKey = `${currentCombination.parentThemeId}-${currentCombination.childThemeId}`;
          usedCombinations.delete(oldKey);
        }

        // Add new combination to used set if both IDs are present
        if (parentThemeId && childThemeId) {
          const newKey = `${parentThemeId}-${childThemeId}`;
          usedCombinations.add(newKey);
        }

        currentSelections[index] = { parentThemeId, childThemeId };
        
        set({ 
          themeSelections: currentSelections,
          usedCombinations: usedCombinations
        });
      },

      isCombinationUsed: (parentThemeId, childThemeId) => {
        const key = `${parentThemeId}-${childThemeId}`;
        return get().usedCombinations.has(key);
      },

      clearThemeSelection: (index) => {
        const currentSelections = [...get().themeSelections];
        const currentCombination = currentSelections[index];
        const usedCombinations = new Set(get().usedCombinations);
        
        if (currentCombination.parentThemeId && currentCombination.childThemeId) {
          const key = `${currentCombination.parentThemeId}-${currentCombination.childThemeId}`;
          usedCombinations.delete(key);
        }

        currentSelections[index] = { parentThemeId: null, childThemeId: null };
        set({ 
          themeSelections: currentSelections,
          usedCombinations: usedCombinations
        });
      },
    }),
    {
      name: 'theme-storage',
      storage: {
        getItem: async (key) => {
          const value = await AsyncStorage.getItem(key);
          if (!value) return null;
          
          const parsed = JSON.parse(value);
          // Convert usedCombinations back to a Set
          if (parsed.state.usedCombinations) {
            parsed.state.usedCombinations = new Set(parsed.state.usedCombinations);
          }
          return parsed;
        },
        setItem: async (key, value) => {
          // Convert Set to Array for serialization
          const serializedValue = {
            ...value,
            state: {
              ...value.state,
              usedCombinations: Array.from(value.state.usedCombinations)
            }
          };
          await AsyncStorage.setItem(key, JSON.stringify(serializedValue));
        },
        removeItem: async (key) => {
          await AsyncStorage.removeItem(key);
        },
      },
    }
  )
);

export default useThemeStore; 