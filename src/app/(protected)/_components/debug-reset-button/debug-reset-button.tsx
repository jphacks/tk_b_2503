"use client";

import { useState, useTransition } from "react";

import { resetLastReadTime } from "./action";
import styles from "./debug-reset-button.module.css";

import Button from "#/components/ui/button";

export const DebugResetButton = () => {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string>("");

  const handleReset = () => {
    startTransition(async () => {
      const result = await resetLastReadTime();
      setMessage(result ? "リセット完了" : "エラーが発生しました");
    });
  };

  return (
    <div className={styles.container}>
      <Button onClick={handleReset} disabled={isPending} size="sm">
        {isPending ? "リセット中..." : "既読日時をリセット"}
      </Button>
      {message && <div className={styles.message}>{message}</div>}
    </div>
  );
};
