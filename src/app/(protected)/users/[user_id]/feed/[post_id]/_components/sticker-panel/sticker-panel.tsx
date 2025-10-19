"use client";

import React from "react";

import styles from "./sticker-panel.module.css";

import type { StickerType } from "#/types/sticker";

type StickerPanelProps = {
  selectedSticker: StickerType;
  onStickerChange: (type: StickerType) => void;
};

const STICKER_OPTIONS: {
  type: StickerType;
  imagePath: string;
  label: string;
}[] = [
  {
    type: "blob-blue",
    imagePath: "/stickers/blob-blue.png",
    label: "ぺたブルー",
  },
  {
    type: "blob-green",
    imagePath: "/stickers/blob-green.png",
    label: "ぺたグリーン",
  },
  {
    type: "burst-blue",
    imagePath: "/stickers/burst-blue.png",
    label: "パッ！",
  },
  {
    type: "clover-green",
    imagePath: "/stickers/clover-green.png",
    label: "クローバー",
  },
  {
    type: "d-shape-purple",
    imagePath: "/stickers/d-shape-purple.png",
    label: "かどっ",
  },
  {
    type: "star-sparkle",
    imagePath: "/stickers/star-sparkle.png",
    label: "キラッ",
  },
  {
    type: "swirl-coral",
    imagePath: "/stickers/swirl-coral.png",
    label: "くるん",
  },
  { type: "uruuru", imagePath: "/stickers/uruuru.png", label: "うるうる" },
  { type: "gahahaha", imagePath: "/stickers/gahahaha.png", label: "キャハハ" },
];

export const StickerPanel = ({
  selectedSticker,
  onStickerChange,
}: StickerPanelProps) => {
  const handleStickerClick = (type: StickerType) => {
    onStickerChange(type);
  };

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3 className={styles.title}>ステッカーを選択して画像をクリック</h3>
      </div>
      <div className={styles.stickerGrid}>
        {STICKER_OPTIONS.map((sticker) => (
          <button
            key={sticker.type}
            type="button"
            className={`${styles.stickerButton} ${
              selectedSticker === sticker.type ? styles.selected : ""
            }`}
            onClick={() => handleStickerClick(sticker.type)}
            aria-label={`${sticker.label}ステッカーを選択`}
          >
            <img
              src={sticker.imagePath}
              alt={sticker.label}
              className={styles.stickerImage}
            />
            <span className={styles.label}>{sticker.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
