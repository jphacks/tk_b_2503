"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import styles from "./logout-section.module.css";

import { authClient } from "#/clients/auth/client";
import Button from "#/components/ui/button";

const LogoutSection = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await authClient.signOut();
      router.push("/login");
    });
  };

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>ログアウト</h2>
      <Button onClick={handleLogout} disabled={isPending}>
        {isPending ? "ログアウト中..." : "ログアウト"}
      </Button>
    </div>
  );
};

export default LogoutSection;
