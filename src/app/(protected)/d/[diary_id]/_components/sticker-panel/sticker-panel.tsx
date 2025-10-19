"use client";

import React, { useCallback, useState } from "react";

import styles from "./sticker-panel.module.css";

import type { StickerType } from "#/types/sticker";

import { Button } from "#/components/ui";

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
  { type: "jphacks", imagePath: "/stickers/jphacks.png", label: "JPHACKS" },
];

export const StickerPanel = ({
  selectedSticker,
  onStickerChange,
}: StickerPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleStickerClick = useCallback(
    (type: StickerType) => {
      onStickerChange(type);
    },
    [onStickerChange]
  );

  const toggleOpen = useCallback(() => {
    setIsOpen((v) => !v);
  }, []);

  return (
    <div
      className={`${styles.panel} ${isOpen ? styles.open : styles.collapsed}`}
      aria-hidden={false}
    >
      <Button
        type="button"
        className={styles.handle}
        onClick={toggleOpen}
        aria-expanded={isOpen}
        aria-controls="sticker-grid"
        aria-label={
          isOpen ? "ステッカーパネルを閉じる" : "ステッカーパネルを開く"
        }
      >
        <span className={styles.handleBar} />
      </Button>

      <div id="sticker-grid" className={styles.stickerGrid} role="list">
        {STICKER_OPTIONS.map((sticker) => (
          <button
            key={sticker.type}
            type="button"
            role="listitem"
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
