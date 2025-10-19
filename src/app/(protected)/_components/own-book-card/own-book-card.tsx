import { eq, desc } from "drizzle-orm";

import { getSession } from "#/clients/auth/server";
import { db } from "#/clients/db";
import BookCard from "#/components/block/book-card";
import { formatTimeAgo } from "#/libs/date";
import { posts } from "#/libs/drizzle/schema";

const OwnBookCard = async () => {
  const session = await getSession();

  // 自分の投稿数を取得
  const postCount = await db
    .select({ count: posts.id })
    .from(posts)
    .where(eq(posts.authorId, session.user.id));

  // 最新の投稿時刻を取得
  const latestPost = await db
    .select({ createdAt: posts.createdAt })
    .from(posts)
    .where(eq(posts.authorId, session.user.id))
    .orderBy(desc(posts.createdAt))
    .limit(1);

  const postCountValue = postCount.length;
  const latestPostTime = latestPost.length > 0 ? latestPost[0].createdAt : null;

  const subtitle = latestPostTime
    ? `投稿数: ${postCountValue}件 | 最終更新: ${formatTimeAgo(latestPostTime)}`
    : `投稿数: ${postCountValue}件 | 最終更新: なし`;

  return (
    <BookCard
      type="own"
      title="自分の本"
      subtitle={subtitle}
      href={`/users/${session.user.id}`}
    />
  );
};

export default OwnBookCard;
