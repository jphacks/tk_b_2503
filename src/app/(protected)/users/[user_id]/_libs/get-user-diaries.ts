import "server-only";

import { desc, eq, or } from "drizzle-orm";

import type {
  DiaryWithMembersData,
  GetUserDiariesResponse,
} from "#/types/diary";

import { db } from "#/clients/db";
import { diaries, diaryMembers, user } from "#/libs/drizzle/schema";

export const getUserDiaries = async (
  userId: string,
  currentUserId: string
): Promise<GetUserDiariesResponse> => {
  try {
    const userDiaries = await db
      .select({
        id: diaries.id,
        title: diaries.title,
        backgroundColor: diaries.backgroundColor,
        authorId: diaries.authorId,
        createdAt: diaries.createdAt,
      })
      .from(diaries)
      .leftJoin(diaryMembers, eq(diaries.id, diaryMembers.diaryId))
      .where(or(eq(diaryMembers.memberId, userId)))
      .groupBy(diaries.id)
      .orderBy(desc(diaries.createdAt));

    const diariesWithMembership: DiaryWithMembersData[] = await Promise.all(
      userDiaries.map(async (diary) => {
        // 日記帳のメンバー情報を取得
        const membersResult = await db
          .select({
            id: user.id,
            name: user.name,
            image: user.image,
          })
          .from(diaryMembers)
          .innerJoin(user, eq(diaryMembers.memberId, user.id))
          .where(eq(diaryMembers.diaryId, diary.id));

        return {
          id: diary.id,
          title: diary.title,
          backgroundColor: diary.backgroundColor,
          authorId: diary.authorId,
          createdAt: diary.createdAt,
          isAuthor: diary.authorId === currentUserId,
          members: membersResult,
        };
      })
    );

    return {
      diaries: diariesWithMembership,
      totalCount: diariesWithMembership.length,
    };
  } catch (error) {
    console.error("日記帳一覧の取得に失敗しました:", error);
    return {
      diaries: [],
      totalCount: 0,
    };
  }
};
