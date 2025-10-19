"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import type { FC, ReactNode } from "react";

import { PostWithStickers } from "../post-with-stickers";

import styles from "./diary-view.module.css";

import type { DiarySticker } from "#/app/(protected)/d/[diary_id]/_libs/get-diary-stickers";
import type { Diary, Post } from "#/clients/db";

import { Button } from "#/components/ui";

interface FlippingState {
  isFlipping: boolean;
  flipDir: "next" | "prev";
}

interface DiaryViewProps {
  diary: Diary;
  posts: Post[];
  stickers: DiarySticker[];
  currentUserId?: string;
}

export const DiaryView: FC<DiaryViewProps> = ({
  diary,
  posts,
  stickers,
  currentUserId,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [flippingState, setFlippingState] = useState<FlippingState>({
    isFlipping: false,
    flipDir: "next",
  });
  const touchStartPosition = useRef({ x: 0, y: 0 });

  const totalPages = posts.length + 1;

  const touchStartHandler = (e: React.TouchEvent) => {
    touchStartPosition.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };
  const touchEndHandler = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const xDiff = touchStartPosition.current.x - touchEndX;
    const yDiff = touchStartPosition.current.y - touchEndY;

    if (Math.abs(yDiff) * 2 < Math.abs(xDiff)) {
      if (xDiff > 50) {
        handleNextPage();
      } else if (xDiff < -50) {
        handlePrevPage();
      }
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1 && !flippingState.isFlipping) {
      setFlippingState({ isFlipping: true, flipDir: "next" });
      setTimeout(() => {
        setCurrentPage((prev) => prev + 1);
        setFlippingState({ isFlipping: false, flipDir: "next" });
      }, 300);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0 && !flippingState.isFlipping) {
      setFlippingState({ isFlipping: true, flipDir: "prev" });
      setTimeout(() => {
        setCurrentPage((prev) => prev - 1);
        setFlippingState({ isFlipping: false, flipDir: "prev" });
      }, 300);
    }
  };

  return (
    <div className={styles.container}>
      <div
        className={styles.cover}
        style={{ backgroundColor: `#${diary.backgroundColor}` }}
      >
        <div
          className={styles.page}
          onTouchStart={touchStartHandler}
          onTouchEnd={touchEndHandler}
        >
          {/* 次のページ */}
          {currentPage < totalPages - 2 && (
            <NextPageWrapper>
              <DiaryPage
                post={posts[currentPage + 1]}
                stickers={stickers}
                page={currentPage}
                totalPage={totalPages}
                currentUserId={currentUserId}
                isCurrent={false}
              />
            </NextPageWrapper>
          )}
          {currentPage === totalPages - 2 && (
            <NextPageWrapper>
              <NewPostPage
                diary={diary}
                page={currentPage}
                totalPages={totalPages}
              />
            </NextPageWrapper>
          )}

          {/* 今のページ */}
          {currentPage < totalPages - 1 && (
            <CurrentPageWrapper flippingState={flippingState}>
              <DiaryPage
                post={posts[currentPage]}
                stickers={stickers}
                page={currentPage}
                totalPage={totalPages}
                currentUserId={currentUserId}
                isCurrent={true}
              />
            </CurrentPageWrapper>
          )}
          {currentPage === totalPages - 1 && (
            <CurrentPageWrapper flippingState={flippingState}>
              <NewPostPage
                diary={diary}
                page={currentPage}
                totalPages={totalPages}
              />
            </CurrentPageWrapper>
          )}

          {/* 前のページ */}
          {currentPage > 0 && (
            <PrevPageWrapper flippingState={flippingState}>
              <DiaryPage
                post={posts[currentPage - 1]}
                stickers={stickers}
                page={currentPage}
                totalPage={totalPages}
                currentUserId={currentUserId}
                isCurrent={false}
              />
            </PrevPageWrapper>
          )}
        </div>
      </div>
    </div>
  );
};

const PrevPageWrapper: FC<{
  children: ReactNode;
  flippingState: FlippingState;
}> = ({ children, flippingState }) => {
  return (
    <div
      className={`${styles.prevPageWrapper} ${flippingState.isFlipping && flippingState.flipDir === "prev" ? styles.flippingPrev : ""}`}
    >
      {children}
    </div>
  );
};

const CurrentPageWrapper: FC<{
  children: ReactNode;
  flippingState: FlippingState;
}> = ({ children, flippingState }) => {
  return (
    <div
      className={`${styles.currentPageWrapper} ${flippingState.isFlipping && flippingState.flipDir === "next" ? styles.flippingNext : ""}`}
    >
      {children}
    </div>
  );
};

const NextPageWrapper: FC<{ children: ReactNode }> = ({ children }) => {
  return <div className={styles.nextPageWrapper}>{children}</div>;
};

const DiaryPage: FC<{
  post: Post;
  stickers: DiarySticker[];
  page: number;
  totalPage: number;
  currentUserId?: string;
  isCurrent: boolean;
}> = ({ post, stickers, page, totalPage, currentUserId, isCurrent }) => {
  return (
    <div>
      <PostWithStickers
        post={post}
        key={post.id}
        initialStickers={stickers.filter((s) => s.postId === post.id)}
        currentUserId={currentUserId}
        showStickerPanel={isCurrent}
      />
      <div className={styles.pageIndicator}>
        {page + 1} / {totalPage}
      </div>
    </div>
  );
};

const NewPostPage: FC<{ diary: Diary; page: number; totalPages: number }> = ({
  diary,
  page,
  totalPages,
}) => {
  const router = useRouter();
  return (
    <div className={styles.textImageWrapper}>
      <div className={styles.newPostPage}>
        <Button
          onClick={() => {
            router.push(`/d/${diary.id}/new`);
          }}
        >
          新しいページを追加する
        </Button>
      </div>
      <div className={styles.pageIndicator}>
        {page + 1} / {totalPages}
      </div>
    </div>
  );
};
