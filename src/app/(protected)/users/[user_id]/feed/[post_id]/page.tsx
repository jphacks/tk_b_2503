import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DeletePostButton } from "./_components/delete-post-button";
import { PostWithStickers } from "./_components/post-with-stickers";
import { getNextPost } from "./_libs/get-next-post";
import { getPost } from "./_libs/get-post";
import { getPostForOgp } from "./_libs/get-post-for-ogp";
import { getStickers } from "./_libs/get-stickers";
import styles from "./page.module.css";

import { getSession } from "#/clients/auth/server";
import {
  createPostMetadata,
  getDefaultMetadata,
} from "#/libs/metadata/metadata";

type PostPageProps = {
  params: Promise<{
    user_id: string;
    post_id: string;
  }>;
};

export const generateMetadata = async ({
  params,
}: PostPageProps): Promise<Metadata> => {
  const { post_id: postId } = await params;

  const post = await getPostForOgp(postId);

  if (!post) {
    return getDefaultMetadata();
  }

  return createPostMetadata(post);
};

const PostPage = async ({ params }: PostPageProps) => {
  const { post_id: postId, user_id: userId } = await params;
  const session = await getSession();

  // 次の投稿、ステッカーを並行して取得
  const [postResult, nextPostResult, stickersResult] = await Promise.all([
    getPost(postId),
    getNextPost(postId),
    getStickers(postId),
  ]);

  if (!postResult) {
    notFound();
  }

  return (
    <div className={styles.container}>
      <article className={styles.postCard}>
        <div className={styles.postHeader}>
          <div className={styles.authorInfo}>
            {postResult.image ? (
              <Image
                src={postResult.image}
                alt={`${postResult.authorName}のアイコン`}
                width={40}
                height={40}
                className={styles.avatar}
              />
            ) : (
              <div className={styles.avatarPlaceholder}>
                {postResult.authorName.charAt(0)}
              </div>
            )}
            <div className={styles.authorDetails}>
              <h3 className={styles.authorName}>{postResult.authorName}</h3>
              <Link
                href={`/users/${postResult.authorId}`}
                className={styles.authorLink}
              >
                プロフィールを見る
              </Link>
            </div>
          </div>
          <DeletePostButton
            postId={postResult.id}
            authorId={postResult.authorId}
            currentUserId={session.user.id}
          />
        </div>

        <div className={styles.postContent}>
          <PostWithStickers
            postId={postResult.id}
            textImageUrl={postResult.textImage}
            rawText={postResult.rawText}
            mediaUrl={postResult.image}
            initialStickers={stickersResult}
            currentUserId={session.user.id}
          />
        </div>
      </article>

      <div className={styles.navigation}>
        <Link
          href={
            nextPostResult
              ? `/users/${nextPostResult.userId}/feed/${nextPostResult.postId}`
              : `/users/${userId}/feed/completed`
          }
          className={styles.nextButton}
        >
          📖 次の投稿を読む
        </Link>
      </div>
    </div>
  );
};

export default PostPage;
