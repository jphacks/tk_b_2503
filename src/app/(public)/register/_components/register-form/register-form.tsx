"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import styles from "./register-form.module.css";

import { authClient } from "#/clients/auth/client";
import { TextInput } from "#/components/ui";

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("パスワードは8文字以上で入力してください。");
      return;
    }

    if (name.trim().length === 0) {
      setError("表示名を入力してください。");
      return;
    }

    startTransition(async () => {
      try {
        await authClient.signUp.email({
          email,
          password,
          name,
        });
        router.push("/");
      } catch (error) {
        console.error("アカウント作成に失敗しました:", error);
        setError("アカウント作成に失敗しました。入力内容を確認してください。");
      }
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && <div className={styles.errorMessage}>{error}</div>}
      <div className={styles.fields}>
        <TextInput
          id="name"
          label="表示名"
          type="text"
          value={name}
          onChange={setName}
          placeholder="表示名を入力"
          autoComplete="name"
          required
          maxLength={50}
        />
        <TextInput
          id="email"
          label="メールアドレス"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="メールアドレスを入力"
          autoComplete="email"
          required
        />
        <TextInput
          id="password"
          label="パスワード (8文字以上)"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="パスワードを入力"
          autoComplete="new-password"
          required
          minLength={8}
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={isPending}
          className={styles.submitButton}
        >
          {isPending ? "作成中..." : "アカウントを作成"}
        </button>
      </div>

      <div className={styles.linkSection}>
        <a href="/login" className={styles.link}>
          既にアカウントをお持ちの方はこちら
        </a>
      </div>
    </form>
  );
};

export default RegisterForm;
