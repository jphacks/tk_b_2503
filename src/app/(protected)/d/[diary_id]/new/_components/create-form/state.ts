import { atom, useAtom } from "jotai";

import type { ImageState } from "#/types/form";

const contentAtom = atom("");

export const useContent = () => {
  return useAtom(contentAtom);
};

const imageAtom = atom<ImageState | null>(null);

export const useImage = () => {
  return useAtom(imageAtom);
};
