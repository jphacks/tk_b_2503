import "server-only";

import { count, desc, eq, or } from "drizzle-orm";

import type {
  DiaryWithMembersData,
  GetUserDiariesResponse,
} from "#/types/diary";

import { db } from "#/clients/db";
import { diaries, diaryMembers } from "#/libs/drizzle/schema";

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
        const memberCountResult = await db
          .select({ count: count() })
          .from(diaryMembers)
          .where(eq(diaryMembers.diaryId, diary.id));

        const memberCount = memberCountResult[0]?.count || 0;

        const totalMemberCount = memberCount;

        return {
          id: diary.id,
          title: diary.title,
          backgroundColor: diary.backgroundColor,
          authorId: diary.authorId,
          createdAt: diary.createdAt,
          isAuthor: diary.authorId === currentUserId,
          memberCount: totalMemberCount,
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
