import Link from "next/link";

import { getUserProfile } from "../../_libs/get-user-profile";

import styles from "./page.module.css";

import Button from "#/components/ui/button";

type CompletedPageProps = {
  params: Promise<{
    user_id: string;
  }>;
};

const CompletedPage = async ({ params }: CompletedPageProps) => {
  const { user_id: userId } = await params;

  // ユーザープロフィールを取得
  const userResult = await getUserProfile(userId);

  if (!userResult) {
    return (
      <div className={styles.container}>
        <h1>エラーが発生しました</h1>
        <p>ユーザー情報を取得できませんでした。</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.completedContent}>
        <h1>🎉 お疲れ様でした！</h1>
        <p>
          <strong>{userResult.name}</strong>さんの投稿をすべて読み終えました。
        </p>
        <div className={styles.actions}>
          <Link href="/">
            <Button variant="secondary">トップに戻る</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CompletedPage;
