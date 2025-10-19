"use client";

import { useState, useTransition } from "react";

import { updatePassword } from "./action";
import styles from "./password-section.module.css";

import { TextInput } from "#/components/ui";
import Button from "#/components/ui/button";

const PasswordSection = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [isPasswordPending, startPasswordTransition] = useTransition();

  const handlePasswordUpdate = () => {
    if (newPassword !== confirmPassword) {
      setPasswordError("新しいパスワードが一致しません");
      return;
    }

    startPasswordTransition(async () => {
      try {
        setPasswordError(null);
        setPasswordSuccess(null);

        const result = await updatePassword({
          currentPassword,
          newPassword,
        });
        if (result) {
          setPasswordSuccess("パスワードが更新されました");
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        } else {
          setPasswordError("パスワードの更新に失敗しました");
        }
      } catch (error) {
        setPasswordError(
          error instanceof Error
            ? error.message
            : "パスワードの更新に失敗しました"
        );
      }
    });
  };

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>パスワード変更</h2>

      <div className={styles.passwordContainer}>
        <TextInput
          id="currentPassword"
          label="現在のパスワード"
          type="password"
          value={currentPassword}
          onChange={setCurrentPassword}
          autoComplete="current-password"
        />

        <TextInput
          id="newPassword"
          label="新しいパスワード"
          type="password"
          value={newPassword}
          onChange={setNewPassword}
          autoComplete="new-password"
          minLength={8}
        />

        <TextInput
          id="confirmPassword"
          label="新しいパスワード（確認）"
          type="password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          autoComplete="new-password"
        />

        <Button
          onClick={handlePasswordUpdate}
          disabled={
            isPasswordPending ||
            !currentPassword ||
            !newPassword ||
            !confirmPassword
          }
        >
          {isPasswordPending ? "更新中..." : "更新する"}
        </Button>

        {passwordError && <div className={styles.error}>{passwordError}</div>}
        {passwordSuccess && (
          <div className={styles.success}>{passwordSuccess}</div>
        )}
      </div>
    </div>
  );
};

export default PasswordSection;
