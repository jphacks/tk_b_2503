"use client";

import { useState } from "react";

import Cropper from "react-easy-crop";

import styles from "./image-cropper.module.css";

type AreaPixels = {
  width: number;
  height: number;
  x: number;
  y: number;
};

type ImageCropperProps = {
  imageSrc: string;
  aspect?: number;
  cropShape?: "rect" | "round";
  showGrid?: boolean;
  onCropComplete: (croppedAreaPixels: AreaPixels) => void;
  className?: string;
};

export const ImageCropper = ({
  imageSrc,
  aspect = 1,
  cropShape = "round",
  showGrid = false,
  onCropComplete,
  className,
}: ImageCropperProps) => {
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);

  return (
    <div className={`${styles.cropContainer} ${className || ""}`}>
      <div className={styles.cropArea}>
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          cropShape={cropShape}
          showGrid={showGrid}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={(_croppedArea, croppedAreaPixels) => {
            onCropComplete(croppedAreaPixels);
          }}
        />
      </div>

      <div className={styles.cropControls}>
        <label htmlFor="zoom" className={styles.label}>
          ズーム
        </label>
        <input
          id="zoom"
          type="range"
          min={1}
          max={3}
          step={0.1}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className={styles.zoomSlider}
        />
      </div>
    </div>
  );
};
