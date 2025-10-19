"use client";

import { useRef } from "react";

import styles from "./image-uploader.module.css";

import { ImageCropper } from "#/components/block/image-cropper";

type AreaPixels = {
  width: number;
  height: number;
  x: number;
  y: number;
};

type ImageUploaderConfig = {
  accept?: string;
  aspect?: number;
  cropShape?: "rect" | "round";
  placeholder?: string;
  showCropper?: boolean;
};

type ImageUploaderState = {
  disabled?: boolean;
  error?: string | null;
  success?: string | null;
};

type ImageUploaderProps = {
  onImageSelect: (file: File) => void;
  onCroppedImage?: (blob: Blob) => void;
  imageSrc: string | null;
  croppedAreaPixels: AreaPixels | null;
  onCropComplete: (croppedAreaPixels: AreaPixels) => void;
  config?: ImageUploaderConfig;
  state?: ImageUploaderState;
  className?: string;
};

export const ImageUploader = ({
  onImageSelect,
  onCroppedImage,
  imageSrc,
  croppedAreaPixels,
  onCropComplete,
  config = {},
  state = {},
  className,
}: ImageUploaderProps) => {
  const {
    accept = "image/*",
    aspect = 1,
    cropShape = "round",
    placeholder = "画像を選択するとプレビューが表示されます",
    showCropper = true,
  } = config;

  const { disabled = false, error = null, success = null } = state;
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  const handleCroppedImage = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    try {
      const blob = await getCroppedBlob(imageSrc, croppedAreaPixels);
      onCroppedImage?.(blob);
    } catch (error) {
      console.error("クロップ画像の生成に失敗しました:", error);
    }
  };

  return (
    <div className={`${styles.container} ${className || ""}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className={styles.fileInput}
        disabled={disabled}
      />

      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}

      {imageSrc && showCropper ? (
        <ImageCropper
          imageSrc={imageSrc}
          aspect={aspect}
          cropShape={cropShape}
          showGrid={false}
          onCropComplete={onCropComplete}
        />
      ) : imageSrc ? (
        <div className={styles.previewContainer}>
          <img src={imageSrc} alt="プレビュー" className={styles.preview} />
        </div>
      ) : (
        <div className={styles.placeholder}>
          <span>{placeholder}</span>
        </div>
      )}

      {imageSrc && croppedAreaPixels && (
        <button
          type="button"
          onClick={handleCroppedImage}
          className={styles.cropButton}
          disabled={disabled}
        >
          クロップ画像を生成
        </button>
      )}
    </div>
  );
};

// ユーティリティ関数
export const readFileAsDataUrl = async (file: File): Promise<string> => {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () =>
      reject(new Error("ファイルの読み込みに失敗しました"));
    reader.readAsDataURL(file);
  });
};

const createImage = async (url: string): Promise<HTMLImageElement> => {
  return await new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", () =>
      reject(new Error("画像の読込に失敗しました"))
    );
    image.crossOrigin = "anonymous";
    image.src = url;
  });
};

const getCroppedBlob = async (src: string, area: AreaPixels): Promise<Blob> => {
  const image = await createImage(src);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvasコンテキストの取得に失敗しました");
  }

  canvas.width = area.width;
  canvas.height = area.height;

  ctx.drawImage(
    image,
    area.x,
    area.y,
    area.width,
    area.height,
    0,
    0,
    area.width,
    area.height
  );

  return await new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("クロップ画像の生成に失敗しました"));
        return;
      }
      resolve(blob);
    }, "image/png");
  });
};
