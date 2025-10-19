export type Diary = {
  id: string;
  title: string;
  backgroundColor: string;
  authorId: string | null;
  createdAt: Date | null;
};

// 日記帳のメンバー情報の型
export type DiaryMember = {
  id: string;
  name: string;
  image: string | null;
};

// メンバー情報を含む日記帳の型
export type DiaryWithMembersData = Diary & {
  isAuthor: boolean;
  members: DiaryMember[];
};

export type GetUserDiariesResponse = {
  diaries: DiaryWithMembersData[];
  totalCount: number;
};
