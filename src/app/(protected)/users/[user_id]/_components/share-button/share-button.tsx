"use client";

import { useState } from "react";

import ShareDialog from "../share-dialog";

import styles from "./share-button.module.css";

type ShareButtonProps = {
  userId: string;
};

const ShareButton = ({ userId }: ShareButtonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleShare = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      <button
        className={styles.shareButton}
        onClick={handleShare}
        type="button"
      >
        プロフィールをシェア
      </button>
      <ShareDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        userId={userId}
      />
    </>
  );
};

export default ShareButton;
