"use client";

import Image from "next/image";
import { useState, useTransition } from "react";

import styles from "./login-form.module.css";

import GoogleLogo from "#/assets/google-logo.svg";
import LineLogo from "#/assets/line-logo.svg";
import { authClient } from "#/clients/auth/client";
import { Button } from "#/components/ui";

const LoginForm = () => {
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleLineLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // TODO: loading animation
    startTransition(async () => {
      try {
        await authClient.signIn.social({ provider: "line" });
      } catch (error) {
        console.error("ログインに失敗しました:", error);
        setError("LINEでのログインに失敗しました。");
      }
    });
  };

  const handleGoogleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // TODO: loading animation
    startTransition(async () => {
      try {
        await authClient.signIn.social({ provider: "google" });
      } catch (error) {
        console.error("Googleでのログインに失敗しました:", error);
        setError("Googleでのログインに失敗しました。");
      }
    });
  };

  return (
    <div>
      <div className={styles.loginMethods}>
        <Button
          onClick={handleLineLogin}
          disabled={isPending}
          className={styles.lineButton}
        >
          <span className={styles.lineButtonIcon}>
            <Image src={LineLogo} alt="" width={32} height={32} />
          </span>
          <span className={styles.lineButtonText}>LINEでログイン</span>
        </Button>
        <Button
          onClick={handleGoogleLogin}
          disabled={isPending}
          className={styles.googleButton}
        >
          <span className={styles.googleButtonIcon}>
            <Image src={GoogleLogo} alt="" width={32} height={32} />
          </span>
          <span className={styles.googleButtonText}>Googleでログイン</span>
        </Button>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  );
};

export default LoginForm;
