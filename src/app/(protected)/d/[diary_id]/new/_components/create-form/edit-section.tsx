import type { RefObject } from "react";
import { useEffect, useRef, type ChangeEventHandler, type FC } from "react";

import { atom, useAtom } from "jotai";

import styles from "./edit-section.module.css";
import { useContent, useImage } from "./state";

import type { ImageState } from "#/types/form";

import { Button } from "#/components/ui";

const showImageSectionAtom = atom(true);
const maxLinesErrorAtom = atom(false);

const MAX_LINES_WITH_IMAGE = 7;
const MAX_LINES = 13;

interface EditSectionProps {
  goNextSection: () => void;
  diaryId: string;
}

const calculateTextareaHeight = (
  shadowRef: RefObject<HTMLDivElement | null>,
  content: string
) => {
  if (!shadowRef.current) return 0;
  shadowRef.current.innerText = content;
  const height = shadowRef.current.offsetHeight;
  return height;
};

export const EditSection: FC<EditSectionProps> = ({
  goNextSection,
  diaryId: _diaryId,
}) => {
  const [content, setContent] = useContent();
  const [imageState, setImageState] = useImage();
  const [showImageSection, setShowImageSection] = useAtom(showImageSectionAtom);
  const [maxLinesError, setMaxLinesError] = useAtom(maxLinesErrorAtom);

  const shadowTextareaRef = useRef<HTMLDivElement>(null);

  const handleChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setContent(e.target.value);
  };

  useEffect(() => {
    if (!shadowTextareaRef.current) return;
    const height = calculateTextareaHeight(shadowTextareaRef, content);
    const fontSize = shadowTextareaRef.current
      .computedStyleMap()
      .get("font-size");
    if (fontSize === undefined || !(fontSize instanceof CSSUnitValue)) return;
    const oneLineHeight = fontSize.value * 2;
    setShowImageSection(height <= oneLineHeight * MAX_LINES_WITH_IMAGE + 1);
    setMaxLinesError(height > oneLineHeight * MAX_LINES + 1);
  }, [content]);

  const handleNextSection = () => {
    if (!showImageSection) {
      setImageState(null);
    }
    goNextSection();
  };

  return (
    <>
      <div className={styles.container}>
        <div ref={shadowTextareaRef} className={styles.shadowTextarea} />
        <textarea
          id="post-text"
          aria-label="投稿内容"
          value={content}
          onChange={handleChange}
          placeholder="今日あったことを綴りましょう"
          className={styles.textarea}
        />

        {maxLinesError ? (
          <div className={styles.error} role="alert">
            投稿が長すぎます
          </div>
        ) : (
          showImageSection && (
            <ImageSection
              imageState={imageState}
              setImageState={setImageState}
            />
          )
        )}
      </div>
      <div className={styles.nextSectionButtonContainer}>
        <div />
        <Button
          onClick={handleNextSection}
          disabled={content.trim().length === 0 || maxLinesError}
        >
          次へ
        </Button>
      </div>
    </>
  );
};

interface ImageSectionProps {
  imageState: ImageState | null;
  setImageState: (state: ImageState | null) => void;
}

const ImageSection: FC<ImageSectionProps> = ({ imageState, setImageState }) => {
  const handleFileChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setImageState({
        file,
        url,
        width: img.width,
        height: img.height,
      });
    };
    img.src = url;
  };

  const handleRemoveImage = () => {
    if (imageState?.url !== undefined) {
      URL.revokeObjectURL(imageState?.url);
    }
    setImageState(null);
  };

  return (
    <>
      <input
        id="post-image"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        hidden
      />

      <div className={styles.imageUploadButton}>
        {imageState ? (
          <div className={styles.imageContainer}>
            <div className={styles.imageWrapper}>
              <img src={imageState.url ?? ""} alt="" className={styles.image} />
              <button
                type="button"
                aria-label="画像を削除"
                onClick={handleRemoveImage}
                className={styles.removeButton}
              >
                <span className={styles.removeButtonIcon}>✖</span>
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.uploadContainer}>
            <label htmlFor="post-image" className={styles.uploadLabel}>
              <div className={styles.uploadIcon}>📷</div>
              <div className={styles.uploadText}>クリックして画像を追加</div>
            </label>
          </div>
        )}
      </div>
    </>
  );
};
