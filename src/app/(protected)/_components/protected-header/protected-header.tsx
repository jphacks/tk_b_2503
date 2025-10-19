import Image from "next/image";
import Link from "next/link";

import styles from "./protected-header.module.css";

import { getSession } from "#/clients/auth/server";

const ProtectedHeader = async () => {
  const session = await getSession();

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <Link href="/" className={styles.logoSection}>
          <span className={styles.logoIcon}>📔</span>
          <h1 className={styles.logoText}>日記帳SNS</h1>
        </Link>

        <div className={styles.actionSection}>
          <Link
            href="/new"
            className={styles.createButton}
            aria-label="新しい投稿を作成"
          >
            <span className={styles.createIcon}>+</span>
          </Link>

          <div className={styles.profileSection}>
            <Link
              href={`/settings`}
              className={styles.profileButton}
              aria-label={`${session.user.name}のプロフィール`}
            >
              <Image
                src={session.user.image ?? ""}
                alt={session.user.name}
                width={40}
                height={40}
                className={styles.profileIcon}
              />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ProtectedHeader;
