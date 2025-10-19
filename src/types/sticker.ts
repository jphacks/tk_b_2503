export type StickerType =
  | "blob-blue"
  | "blob-green"
  | "burst-blue"
  | "clover-green"
  | "d-shape-purple"
  | "star-sparkle"
  | "swirl-coral"
  | "uruuru"
  | "gahahaha";

export type Sticker = {
  id: string;
  type: StickerType;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  placedBy: {
    id: string;
    name: string;
  } | null;
};
