"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { searchUserAction } from "./action";
import styles from "./user-search.module.css";

import { TextInput } from "#/components/ui";
import Button from "#/components/ui/button";

const UserSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);
    startTransition(async () => {
      try {
        const targetUserId = await searchUserAction({ searchQuery });

        if (targetUserId) {
          router.push(`/users/${targetUserId.data}`);
        } else {
          setError("ユーザーが見つかりません");
        }
      } catch (err) {
        console.error("クライアント側エラー:", err);
        setError("ユーザー検索に失敗しました");
      }
    });
  };

  return (
    <>
      {error && (
        <div className={styles.error} role="alert">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className={styles.form}>
        <TextInput
          id="searchQuery"
          label="ユーザー名"
          type="text"
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="ユーザー名を入力"
          required
          disabled={isPending}
          hint="検索したいユーザーの名前を正確に入力してください"
        />

        <Button type="submit" disabled={isPending}>
          {isPending ? "検索中..." : "ユーザーを検索"}
        </Button>
      </form>
    </>
  );
};

export default UserSearch;
