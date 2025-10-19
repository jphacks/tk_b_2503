import type { FC, ReactNode } from "react";
import { useEffect, useState, useTransition } from "react";

import { createPostAndRedirect } from "./action";
import styles from "./preview-section.module.css";
import { useContent, useImage } from "./state";

import type { TextImageRequest } from "#/libs/text-to-image/types";

import { Button } from "#/components/ui";
import {
  TEXT_IMAGE_HEIGHT,
  TEXT_IMAGE_HEIGHT_WITH_IMAGE,
  TEXT_IMAGE_WIDTH,
} from "#/libs/constants";
import { renderTextToPng } from "#/libs/text-to-image";

interface TextPreview {
  blob: Blob;
  url: string;
  width: number;
  height: number;
}

interface PreviewSectionProps {
  goPrevSection: () => void;
  diaryId: string;
}

export const PreviewSection: FC<PreviewSectionProps> = ({
  goPrevSection,
  diaryId,
}) => {
  const [content] = useContent();
  const [image] = useImage();
  const [textPreview, setTextPreview] = useState<TextPreview | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setPreviewError(null);

    startTransition(async () => {
      try {
        const result = await renderTextToPng({
          text: content.trim(),
          // eslint-disable-next-line no-undef
          scale: window.devicePixelRatio || 1,
          width: TEXT_IMAGE_WIDTH,
          height: TEXT_IMAGE_HEIGHT,
        });

        const url = URL.createObjectURL(result.blob);
        setTextPreview((prev: TextPreview | null) => {
          // 既存のプレビューをクリーンアップ
          if (prev) {
            URL.revokeObjectURL(prev.url);
          }
          return {
            blob: result.blob,
            url,
            width: TEXT_IMAGE_WIDTH,
            height: TEXT_IMAGE_HEIGHT,
          };
        });
      } catch (error) {
        console.error("Text preview generation error:", error);
        setPreviewError("プレビューの生成に失敗しました");
      }
    });
  }, [content]);

  if (isPending) {
    return (
      <Layout goPrevSection={goPrevSection} diaryId={diaryId}>
        <div
          className={styles.skeletonWrapper}
          role="status"
          aria-live="polite"
        >
          <textarea className={styles.skeleton} value={content} readOnly />

          {image && (
            <div className={styles.attachmentWrapper}>
              <img
                src={image.url ?? ""}
                alt=""
                className={styles.attachment}
                width={300}
                height={300}
              />
            </div>
          )}
        </div>
      </Layout>
    );
  }

  if (previewError) {
    return (
      <Layout goPrevSection={goPrevSection} diaryId={diaryId}>
        <div role="alert" style={{ color: "red" }}>
          {previewError}
        </div>
      </Layout>
    );
  }

  return (
    <Layout goPrevSection={goPrevSection} diaryId={diaryId}>
      <div className={styles.textImageWrapper}>
        <img
          src={textPreview?.url}
          alt={content}
          className={styles.textImage}
          style={{ aspectRatio: `${TEXT_IMAGE_WIDTH} / ${TEXT_IMAGE_HEIGHT}` }}
        />
        {image && (
          <div className={styles.attachmentWrapper}>
            <img
              src={image.url ?? ""}
              alt=""
              className={styles.attachment}
              width={300}
              height={300}
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

interface LayoutProps extends PreviewSectionProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ goPrevSection, diaryId, children }) => {
  const [content] = useContent();
  const [image] = useImage();
  const [isPending, startTransition] = useTransition();

  const textImageWidth = TEXT_IMAGE_WIDTH;
  const textImageHeight =
    image !== null ? TEXT_IMAGE_HEIGHT_WITH_IMAGE : TEXT_IMAGE_HEIGHT;

  const handleSubmit = () => {
    startTransition(async () => {
      try {
        const textImageRequest: TextImageRequest = {
          text: content.trim(),
          scale: 2,
          width: textImageWidth,
          height: textImageHeight,
        };

        const { blob } = await renderTextToPng(textImageRequest);
        const textImageFile = new File([blob], "text-image.png", {
          type: "image/png",
        });

        await createPostAndRedirect({
          diaryId,
          rawText: content.trim(),
          textImage: textImageFile,
          mediaImage: image?.file,
        });
      } catch (error) {
        console.error("投稿の作成に失敗しました:", error);
        // TODO: alert表示
      }
    });
  };

  return (
    <div className={styles.container}>
      {children}
      <div className={styles.buttonGroup}>
        <Button onClick={goPrevSection} variant="secondary">
          戻る
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isPending}
          aria-busy={isPending}
        >
          {isPending ? "投稿中…" : "投稿する"}
        </Button>
      </div>
    </div>
  );
};
