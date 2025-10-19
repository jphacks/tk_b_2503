import { env } from "#/clients/env";

export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

// テキスト画像の設定
export const TEXT_IMAGE_WIDTH = 500;
export const TEXT_IMAGE_HEIGHT = 780;
export const TEXT_IMAGE_HEIGHT_WITH_IMAGE = 450;

// 文字数制限
export const MAX_LENGTH_WITHOUT_IMAGE = 220;
export const MAX_LENGTH_WITH_IMAGE = 120;

// プレビュー生成のデバウンス時間
export const PREVIEW_DEBOUNCE_MS = 500;

export const ALLOWED_ORIGINS = [
  env.NEXT_PUBLIC_BASE_URL,
  "https://sticker-sns.vercel.app",
  "https://jphacks-newts-projects.vercel.app",
  "https://jphacks-git-main-newts-projects.vercel.app",
  "http://localhost:3000",
];
