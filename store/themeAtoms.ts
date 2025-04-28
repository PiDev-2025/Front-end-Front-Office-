import { atom } from 'jotai';
import { atomWithStore } from 'jotai-zustand';
import useThemeStore from './themeStore';

interface ThemeSelection {
  parentThemeId: string | null;
  childThemeId: string | null;
}

// Create atoms that sync with the Zustand store
const themeStoreAtom = atomWithStore(useThemeStore);

// Derived atoms for specific theme selections
const themeSelectionsAtom = atom(
  (get) => get(themeStoreAtom).themeSelections,
  (get, set, newSelections: ThemeSelection[]) => {
    const store = get(themeStoreAtom);
    newSelections.forEach((selection: ThemeSelection, index: number) => {
      store.setThemeSelection(
        index,
        selection.parentThemeId,
        selection.childThemeId
      );
    });
  }
);

// Atom for checking if a combination is used
const isCombinationUsedAtom = atom(
  (get) => (parentThemeId: string, childThemeId: string) => {
    return get(themeStoreAtom).isCombinationUsed(parentThemeId, childThemeId);
  }
);

// Atom for clearing a theme selection
const clearThemeSelectionAtom = atom(
  null,
  (get, set, index: number) => {
    const store = get(themeStoreAtom);
    store.clearThemeSelection(index);
  }
);

export {
  themeStoreAtom,
  themeSelectionsAtom,
  isCombinationUsedAtom,
  clearThemeSelectionAtom,
}; 