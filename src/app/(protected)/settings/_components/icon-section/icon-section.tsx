"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { updateIcon } from "./action";
import styles from "./icon-section.module.css";

type IconSectionProps = {
  initialIconUrl: string;
};

const IconSection = ({ initialIconUrl }: IconSectionProps) => {
  const [iconError, setIconError] = useState<string | null>(null);
  const [iconSuccess, setIconSuccess] = useState<string | null>(null);
  const [isIconPending, startIconTransition] = useTransition();
  const router = useRouter();

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIconError(null);
    setIconSuccess(null);

    startIconTransition(async () => {
      try {
        const result = await updateIcon({ icon: file });
        if (result) {
          setIconSuccess("アイコンが更新されました");
          // ページをリフレッシュして新しいアイコンを反映
          router.refresh();
        } else {
          setIconError("アイコンの更新に失敗しました");
        }
      } catch (error) {
        setIconError(
          error instanceof Error
            ? error.message
            : "アイコンの更新に失敗しました"
        );
      }
    });
  };

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>アイコン設定</h2>

      <div className={styles.iconContainer}>
        <div className={styles.iconWrapper}>
          <img
            src={initialIconUrl}
            alt="現在のアイコン"
            className={styles.iconImage}
          />
        </div>

        <input
          type="file"
          id="iconFile"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={isIconPending}
          className={styles.hiddenInput}
        />
        <label htmlFor="iconFile" className={styles.iconButton}>
          アイコンを変える
        </label>

        {iconError && <div className={styles.errorMessage}>{iconError}</div>}

        {iconSuccess && (
          <div className={styles.successMessage}>{iconSuccess}</div>
        )}
      </div>
    </div>
  );
};

export default IconSection;
