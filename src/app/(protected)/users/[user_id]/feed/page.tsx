import { redirect } from "next/navigation";

import { getOldestUnreadPost } from "./_libs/get-oldest-unread-post";

type FeedPageProps = {
  params: Promise<{
    user_id: string;
  }>;
};

const FeedPage = async ({ params }: FeedPageProps) => {
  const { user_id: userId } = await params;

  // 未読の最古の投稿を取得
  const oldestUnreadPostId = await getOldestUnreadPost({ userId });

  if (!oldestUnreadPostId) {
    // 未読投稿がない場合やエラーの場合は、完了ページにリダイレクト
    redirect(`/users/${userId}/feed/completed`);
  }

  // 最古の未読投稿ページにリダイレクト
  redirect(`/users/${userId}/feed/${oldestUnreadPostId}`);
};

export default FeedPage;
