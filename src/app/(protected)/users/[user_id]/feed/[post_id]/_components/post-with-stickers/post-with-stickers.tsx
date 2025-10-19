"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useTransition } from "react";

import { StickerDisplay } from "../sticker-display";
import { StickerPanel } from "../sticker-panel";

import { addSticker, getStickersAction, markPostAsRead } from "./action";
import styles from "./post-with-stickers.module.css";

import type { Sticker, StickerType } from "#/types/sticker";

type PostWithStickersProps = {
  postId: string;
  textImageUrl: string;
  rawText: string;
  mediaUrl?: string | null;
  initialStickers: Sticker[];
  currentUserId?: string;
};

export const PostWithStickers = ({
  postId,
  textImageUrl,
  rawText,
  mediaUrl,
  initialStickers,
  currentUserId,
}: PostWithStickersProps) => {
  const [selectedSticker, setSelectedSticker] =
    useState<StickerType>("blob-blue");
  const [_, startTransition] = useTransition();
  const [stickers, setStickers] = useState<Sticker[]>(initialStickers);
  const imageRef = useRef<HTMLDivElement>(null);

  // ページを開いてから1秒後に投稿を既読にする
  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        await markPostAsRead({ postId });
      } catch (error) {
        console.error("既読記録の更新に失敗しました:", error);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [postId]);

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // 正規化座標が0-1の範囲内であることを確認
    if (x >= 0 && x <= 1 && y >= 0 && y <= 1) {
      handleStickerAdd(selectedSticker, x, y);
    }
  };

  const handleStickerAdd = (type: StickerType, x: number, y: number) => {
    // optimistic update
    const rotation = (Math.random() - 0.5) * 60;
    const tempId = `temp-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 9)}`;
    setStickers((prev) => [
      ...prev,
      {
        id: tempId,
        type,
        x,
        y,
        // FIXME
        placedBy: null,
        rotation,
        scale: 1.0,
      },
    ]);

    startTransition(async () => {
      try {
        const result = await addSticker({
          postId,
          type,
          x,
          y,
          rotation,
        });

        if (!result) {
          console.error("ステッカーの追加に失敗しました");
          return;
        }

        // ステッカー追加後に一覧を再取得
        try {
          const result = await getStickersAction({ postId });
          if (result?.data) {
            setStickers(result.data);
          }
        } catch (error) {
          console.error("ステッカー一覧の取得に失敗しました:", error);
        }
      } catch (error) {
        console.error("ステッカーの追加に失敗しました:", error);
      }
    });
  };

  const handleStickerSelect = (type: StickerType) => {
    setSelectedSticker(type);
  };

  const handleStickerDeleted = () => {
    startTransition(async () => {
      try {
        const result = await getStickersAction({ postId });
        if (result?.data) {
          setStickers(result.data);
        }
      } catch (error) {
        console.error("ステッカー一覧の取得に失敗しました:", error);
      }
    });
  };

  return (
    <div className={styles.container}>
      <div
        ref={imageRef}
        className={styles.imageContainer}
        onClick={handleImageClick}
      >
        <Image
          src={textImageUrl}
          alt={rawText}
          width={400}
          height={600}
          className={styles.textImage}
          priority
        />
        <StickerDisplay
          stickers={stickers}
          currentUserId={currentUserId}
          onStickerDeleted={handleStickerDeleted}
        />
      </div>

      {mediaUrl && (
        <div className={styles.mediaContainer}>
          <Image
            src={mediaUrl}
            alt="投稿画像"
            width={500}
            height={500}
            className={styles.mediaImage}
          />
        </div>
      )}

      <StickerPanel
        selectedSticker={selectedSticker}
        onStickerChange={handleStickerSelect}
      />
    </div>
  );
};
