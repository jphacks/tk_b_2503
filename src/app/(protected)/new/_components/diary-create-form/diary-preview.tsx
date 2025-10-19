import type { FC } from "react";

import styles from "./diary-preview.module.css";

type DiaryPreviewProps = {
  title: string;
  backgroundColor: string;
  memberCount: number;
};

export const DiaryPreview: FC<DiaryPreviewProps> = ({
  title,
  backgroundColor,
  memberCount,
}) => {
  return (
    <div className={styles.container}>
      <label className={styles.label}>プレビュー</label>
      <div
        className={styles.previewCard}
        style={{ backgroundColor: `#${backgroundColor}` }}
      >
        <div className={styles.content}>
          <h3 className={styles.title}>{title || "日記帳のタイトル"}</h3>
          <p className={styles.memberInfo}>メンバー: {memberCount + 1}人</p>
        </div>
      </div>
    </div>
  );
};
