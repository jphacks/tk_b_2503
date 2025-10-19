"use client";

/* global window, navigator */

import { useRef, useEffect, useState, useTransition } from "react";

import styles from "./share-dialog.module.css";

type ShareDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
};

const ShareDialog = ({ isOpen, onClose, userId }: ShareDialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [showMessage, setShowMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const rect = dialog.getBoundingClientRect();
    const isInDialog =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;

    if (!isInDialog) {
      onClose();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === "Escape") {
      onClose();
    }
  };

  const handleCopyUrl = () => {
    startTransition(async () => {
      try {
        // ブラウザ環境かチェック
        if (typeof window === "undefined" || typeof navigator === "undefined") {
          setErrorMessage("この機能はブラウザでのみ使用できます");
          return;
        }

        // 現在のページのURLを取得
        const url = `${window.location.origin}/users/${userId}`;

        // クリップボードにコピー
        await navigator.clipboard.writeText(url);

        // 成功メッセージを表示
        setShowMessage(true);
        setErrorMessage(null);

        // 3秒後にメッセージを消す
        setTimeout(() => {
          setShowMessage(false);
        }, 3000);
      } catch (error) {
        console.error("URLのコピーに失敗しました:", error);
        setErrorMessage("URLのコピーに失敗しました");

        // 3秒後にエラーメッセージを消す
        setTimeout(() => {
          setErrorMessage(null);
        }, 3000);
      }
    });
  };

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.content}>
        <div className={styles.header}>
          <h2 className={styles.title}>プロフィールをシェア</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            type="button"
            aria-label="ダイアログを閉じる"
          >
            ×
          </button>
        </div>

        <div className={styles.body}>
          <p className={styles.description}>
            このユーザーのプロフィールページのURLを友だちに送って、プロフィールをシェアしましょう。
          </p>

          <div className={styles.urlContainer}>
            <div className={styles.urlDisplay}>
              {typeof window !== "undefined"
                ? `${window.location.origin}/users/${userId}`
                : ""}
            </div>
            <button
              className={styles.copyButton}
              onClick={handleCopyUrl}
              disabled={isPending}
              type="button"
            >
              {isPending ? "コピー中..." : "URLをコピー"}
            </button>
          </div>

          {showMessage && (
            <div className={styles.successMessage}>
              URLをクリップボードにコピーしました！
            </div>
          )}
          {errorMessage && (
            <div className={styles.errorMessage}>{errorMessage}</div>
          )}
        </div>
      </div>
    </dialog>
  );
};

export default ShareDialog;
