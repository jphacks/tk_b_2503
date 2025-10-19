export type Diary = {
  id: string;
  title: string;
  backgroundColor: string;
  authorId: string | null;
  createdAt: Date | null;
};

// メンバー情報を含む日記帳の型
export type DiaryWithMembersData = Diary & {
  isAuthor: boolean;
  memberCount: number;
};

export type GetUserDiariesResponse = {
  diaries: DiaryWithMembersData[];
  totalCount: number;
};
