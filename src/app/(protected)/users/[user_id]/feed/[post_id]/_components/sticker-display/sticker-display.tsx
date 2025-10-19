"use client";

import { useState, useTransition } from "react";

import { deleteSticker } from "./action";
import styles from "./sticker-display.module.css";

import type { StickerType, Sticker } from "#/types/sticker";

type StickerDisplayProps = {
  stickers: Sticker[];
  currentUserId?: string;
  onStickerDeleted?: () => void;
};

const STICKER_IMAGES: Record<StickerType, string> = {
  "blob-blue": "/stickers/blob-blue.png",
  "blob-green": "/stickers/blob-green.png",
  "burst-blue": "/stickers/burst-blue.png",
  "clover-green": "/stickers/clover-green.png",
  "d-shape-purple": "/stickers/d-shape-purple.png",
  "star-sparkle": "/stickers/star-sparkle.png",
  "swirl-coral": "/stickers/swirl-coral.png",
  uruuru: "/stickers/uruuru.png",
  gahahaha: "/stickers/gahahaha.png",
};

export const StickerDisplay = ({
  stickers,
  currentUserId,
  onStickerDeleted,
}: StickerDisplayProps) => {
  const [isPending, startTransition] = useTransition();
  const [recentlyAddedStickers, setRecentlyAddedStickers] = useState<
    Set<string>
  >(new Set());

  const handleStickerClick = (sticker: Sticker) => {
    // 自分が貼ったステッカーで、最近追加したもののみ削除可能
    if (
      sticker.placedBy?.id === currentUserId &&
      recentlyAddedStickers.has(sticker.id)
    ) {
      startTransition(async () => {
        try {
          const result = await deleteSticker({ stickerId: sticker.id });

          if (result) {
            setRecentlyAddedStickers((prev) => {
              const newSet = new Set(prev);
              newSet.delete(sticker.id);
              return newSet;
            });
            // 削除後にコールバック関数を呼び出して一覧を再取得
            onStickerDeleted?.();
          } else {
            console.error("ステッカー削除エラー:", result);
          }
        } catch (error) {
          console.error("ステッカーの削除に失敗しました:", error);
        }
      });
    }
  };

  return (
    <div className={styles.container}>
      {stickers.map((sticker) => {
        const canDelete =
          sticker.placedBy?.id === currentUserId &&
          recentlyAddedStickers.has(sticker.id);

        return (
          <button
            key={sticker.id}
            type="button"
            className={`${styles.sticker} ${canDelete ? styles.deletable : ""}`}
            style={{
              left: `${sticker.x * 100}%`,
              top: `${sticker.y * 100}%`,
              transform: `translate(-50%, -50%) scale(${sticker.scale}) rotate(${sticker.rotation}deg)`,
            }}
            onClick={() => handleStickerClick(sticker)}
            disabled={isPending}
            title={
              canDelete
                ? "クリックして削除（Undo）"
                : sticker.placedBy?.name || "匿名ユーザー"
            }
          >
            <img
              src={STICKER_IMAGES[sticker.type]}
              alt={`${sticker.type}ステッカー`}
              className={styles.stickerImage}
            />
            {canDelete && (
              <span className={styles.deleteIcon} aria-hidden="true">
                ×
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
