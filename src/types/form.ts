export type ImageState = {
  file: File;
  url: string;
  width: number;
  height: number;
  croppedBlob?: Blob;
} | null;
