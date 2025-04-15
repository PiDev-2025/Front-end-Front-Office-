import { atom } from 'jotai';

export interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  name: string;
  fileName?: string;
  uri?: string;
}

export const mediaAtom = atom<MediaItem[]>([]); 