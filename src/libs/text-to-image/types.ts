export type TextImageRequest = {
  text: string;
  width: number;
  height: number;
  emoji?: {
    baseUrl: string;
    sizePx: number;
  };
  scale?: number;
};
