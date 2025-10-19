"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { createDiary } from "./action";
import { ColorPicker } from "./color-picker";
import styles from "./diary-create-form.module.css";
// import { DiaryPreview } from "./diary-preview";
import { MemberSelector } from "./member-selector";

type User = {
  id: string;
  name: string;
  image: string | null;
};

type BackgroundColor =
  | "FF4548"
  | "FD785B"
  | "FDB51C"
  | "27A157"
  | "0A74A2"
  | "B563BC";

type DiaryCreateFormProps = {
  followingUsers: User[];
};

export const DiaryCreateForm = ({ followingUsers }: DiaryCreateFormProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState("");
  const [backgroundColor, setBackgroundColor] =
    useState<BackgroundColor>("FF4548");
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);

    if (!title.trim()) {
      setError("タイトルを入力してください");
      return;
    }

    if (title.length > 100) {
      setError("タイトルは100文字以内で入力してください");
      return;
    }

    startTransition(async () => {
      try {
        const result = await createDiary({
          title: title.trim(),
          backgroundColor,
          memberIds: selectedMemberIds,
        });

        if (result.success && result.diaryId) {
          // 作成成功後、Diaryページへ遷移
          router.push(`/d/${result.diaryId}`);
        } else {
          setError(result.error || "日記帳の作成に失敗しました");
        }
      } catch (err) {
        console.error("日記帳作成エラー:", err);
        setError("予期しないエラーが発生しました");
      }
    });
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>新しい日記帳を作成</h1>

      <div className={styles.formContent}>
        <div className={styles.formSection}>
          <label htmlFor="title" className={styles.label}>
            タイトル
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="日記帳のタイトル"
            className={styles.input}
            maxLength={100}
            disabled={isPending}
          />
          <p className={styles.charCount}>{title.length}/100</p>
        </div>

        <div className={styles.formSection}>
          <ColorPicker
            selectedColor={backgroundColor}
            onColorChange={setBackgroundColor}
          />
        </div>

        <div className={styles.formSection}>
          <MemberSelector
            users={followingUsers}
            selectedUserIds={selectedMemberIds}
            onSelectionChange={setSelectedMemberIds}
          />
        </div>

        {/* <div className={styles.formSection}>
          <DiaryPreview
            title={title}
            backgroundColor={backgroundColor}
            memberCount={selectedMemberIds.length}
          />
        </div> */}

        {error && (
          <div className={styles.error} role="alert">
            {error}
          </div>
        )}

        <div className={styles.actions}>
          <button
            type="button"
            onClick={handleCancel}
            className={styles.cancelButton}
            disabled={isPending}
          >
            キャンセル
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className={styles.submitButton}
            disabled={isPending || !title.trim()}
          >
            {isPending ? "作成中..." : "作成"}
          </button>
        </div>
      </div>
    </div>
  );
};
