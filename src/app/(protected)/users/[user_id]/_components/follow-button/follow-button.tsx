"use client";

import { useState, useTransition } from "react";

import { followUser, unfollowUser } from "./action";
import styles from "./follow-button.module.css";

type FollowButtonProps = {
  targetUserId: string;
  isFollowing: boolean;
  isOwnProfile: boolean;
};

const FollowButton = ({
  targetUserId,
  isFollowing: initialIsFollowing,
  isOwnProfile,
}: FollowButtonProps) => {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleFollowToggle = () => {
    if (isOwnProfile) return;

    startTransition(async () => {
      try {
        setError(null);

        if (isFollowing) {
          const result = await unfollowUser({ targetUserId });
          if (result) {
            setIsFollowing(false);
          }
        } else {
          const result = await followUser({ targetUserId });
          if (result) {
            setIsFollowing(true);
          }
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "操作に失敗しました");
      }
    });
  };

  if (isOwnProfile) {
    return null; // 自分のプロフィールの場合は何も表示しない
  }

  return (
    <>
      <button
        className={`${styles.followButton} ${
          isFollowing ? styles.following : styles.notFollowing
        }`}
        onClick={handleFollowToggle}
        disabled={isPending}
      >
        {isPending
          ? isFollowing
            ? "アンフォロー中..."
            : "フォロー中..."
          : isFollowing
            ? "フォロー中"
            : "フォロー"}
      </button>
      {error && <div className={styles.error}>{error}</div>}
    </>
  );
};

export default FollowButton;
