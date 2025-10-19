import { DiaryView } from "./_components/diary/diary-view";
import { getDiary } from "./_libs/get-diary";
import { getDiaryPosts } from "./_libs/get-diary-posts";
import { getDiaryStickers } from "./_libs/get-diary-stickers";

import { getSession } from "#/clients/auth/server";

type DiaryPageProps = {
  params: Promise<{
    diary_id: string;
  }>;
};

const DiaryPage = async (props: DiaryPageProps) => {
  const { diary_id: diaryId } = await props.params;

  const [diary, posts, stickers, session] = await Promise.all([
    getDiary(diaryId),
    getDiaryPosts(diaryId),
    getDiaryStickers(diaryId),
    getSession(),
  ] as const);
  if (!diary) {
    return <div>日記が見つかりません。</div>;
  }

  return (
    <div>
      <DiaryView
        diary={diary}
        posts={posts}
        stickers={stickers}
        currentUserId={session.user.id}
      />
    </div>
  );
};

export default DiaryPage;
