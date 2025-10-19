"use client";

import { useState, useTransition } from "react";

import { deletePost } from "./action";
import styles from "./delete-post-button.module.css";

type DeletePostButtonProps = {
  postId: string;
  authorId: string;
  currentUserId: string;
};

export const DeletePostButton = ({
  postId,
  authorId,
  currentUserId,
}: DeletePostButtonProps) => {
  const [showDialog, setShowDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (authorId !== currentUserId) {
    return null;
  }

  const handleDelete = () => {
    setError(null);
    startTransition(async () => {
      try {
        await deletePost({ postId });
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("削除に失敗しました。もう一度お試しください。");
        }
      }
    });
  };

  return (
    <>
      <button
        onClick={() => setShowDialog(true)}
        className={styles.deleteButton}
        disabled={isPending}
        title="投稿を削除"
      >
        🗑️
      </button>

      {showDialog && (
        <div className={styles.dialogOverlay}>
          <div className={styles.dialog}>
            <h2 className={styles.dialogTitle}>投稿の削除</h2>
            <p className={styles.dialogMessage}>
              この投稿を削除しますか？
              <br />
              この操作は取り消せません。
            </p>

            {error && <p className={styles.errorMessage}>{error}</p>}

            <div className={styles.dialogButtons}>
              <button
                onClick={() => setShowDialog(false)}
                className={styles.cancelButton}
                disabled={isPending}
              >
                キャンセル
              </button>
              <button
                onClick={handleDelete}
                className={styles.confirmButton}
                disabled={isPending}
              >
                {isPending ? "削除中..." : "削除"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
