import { eq, desc, gt, inArray, and } from "drizzle-orm";

import { getSession } from "#/clients/auth/server";
import { db } from "#/clients/db";
import BookCard from "#/components/block/book-card";
import { formatTimeAgo } from "#/libs/date";
import { follows, posts, user } from "#/libs/drizzle/schema";

const NewBookCard = async () => {
  const session = await getSession();

  const [currentUser] = await db
    .select({ lastReadAt: user.lastReadAt })
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1);
  const lastReadAt = currentUser.lastReadAt;

  // 未読の投稿数を取得（最後の既読時刻より新しい投稿 かつ 自分がフォローしているユーザーの投稿）
  const followingUsers = await db
    .select({ followeeId: follows.followeeId })
    .from(follows)
    .where(eq(follows.followerId, session.user.id));

  const unreadPosts = await db
    .select({ count: posts.id })
    .from(posts)
    .where(
      and(
        gt(posts.createdAt, lastReadAt),
        inArray(
          posts.authorId,
          followingUsers.map((f) => f.followeeId)
        )
      )
    );
  const unreadCount = unreadPosts.length;

  // 最新の投稿時刻を取得
  const latestPost = await db
    .select({ createdAt: posts.createdAt })
    .from(posts)
    .where(
      inArray(
        posts.authorId,
        followingUsers.map((f) => f.followeeId)
      )
    )
    .orderBy(desc(posts.createdAt))
    .limit(1);

  const latestPostTime = latestPost.length > 0 ? latestPost[0].createdAt : null;

  const subtitle = latestPostTime
    ? `未読: ${unreadCount}件 | 最新: ${formatTimeAgo(latestPostTime)}`
    : `未読: ${unreadCount}件 | 最新: なし`;

  return (
    <BookCard
      type="new"
      title="新着の本"
      subtitle={subtitle}
      href={`/users/${session.user.id}/feed`}
    />
  );
};

export default NewBookCard;
