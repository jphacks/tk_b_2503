import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import FollowButton from "./_components/follow-button";
import ShareButton from "./_components/share-button";
import { getUserDiaries } from "./_libs/get-user-diaries";
import { getUserProfile } from "./_libs/get-user-profile";
import { getUserProfileForOgp } from "./_libs/get-user-profile-for-ogp";
import styles from "./page.module.css";

import type { DiaryWithMembersData } from "#/types/diary";

import { getSession } from "#/clients/auth/server";
import { Logo } from "#/components/ui/logo";
import {
  createProfileMetadata,
  getDefaultMetadata,
} from "#/libs/metadata/metadata";

type UserProfilePageProps = {
  params: Promise<{
    user_id: string;
  }>;
};

export const generateMetadata = async ({
  params,
}: UserProfilePageProps): Promise<Metadata> => {
  const { user_id } = await params;

  const userProfile = await getUserProfileForOgp(user_id);

  if (!userProfile) {
    return getDefaultMetadata();
  }

  return createProfileMetadata(userProfile);
};

const UserProfilePage = async ({ params }: UserProfilePageProps) => {
  const { user_id } = await params;

  const session = await getSession();
  const sessionUser = session.user;

  const [profileResult, diariesResult] = await Promise.all([
    getUserProfile(user_id),
    getUserDiaries(user_id, sessionUser.id),
  ]);

  if (!profileResult) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <p>プロフィールの読み込みに失敗しました</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.hd}>
        <Logo withText />
        <Link href="/settings">
          <Image
            src={sessionUser.image ?? "/default-avatar.webp"}
            alt={`${sessionUser.name}のアバター`}
            className={styles.hdAvatar}
            width={80}
            height={80}
          />
        </Link>
      </div>

      <div className={styles.profileCn}>
        <Image
          src={profileResult.image ?? "/default-avar.webp"}
          alt={`${profileResult.name}のアバター`}
          className={styles.avatarImage}
          width={150}
          height={150}
        />
        <div className={styles.profileTextCn}>
          <h1 className={styles.userName}>{profileResult.name}</h1>
          {profileResult.bio && (
            <p className={styles.userBio}>{profileResult.bio}</p>
          )}
        </div>
        {profileResult.isOwnProfile ? (
          <ShareButton userId={user_id} />
        ) : (
          <FollowButton
            targetUserId={user_id}
            isFollowing={profileResult.isFollowing}
            isOwnProfile={false}
          />
        )}
      </div>

      <DiariesSection
        isOwnProfile={profileResult.isOwnProfile}
        diaries={diariesResult.diaries}
      />
    </div>
  );
};

type DiariesSectionProps = {
  isOwnProfile: boolean;
  diaries: DiaryWithMembersData[];
};

const DiariesSection = ({ isOwnProfile, diaries }: DiariesSectionProps) => {
  // 日記帳が1つもない場合
  if (diaries.length === 0 && !isOwnProfile) {
    return (
      <div className={styles.diariesSection}>
        <p className={styles.emptyMessage}>まだ日記帳がありません</p>
      </div>
    );
  }

  return (
    <div className={styles.diariesSection}>
      {isOwnProfile && (
        <Link href="/new">
          <DiaryWrapper backgroundColor="var(--color-background)">
            <div className={styles.newDiaryIcon}>
              <Image src="/plus.svg" alt="" width={20} height={20} />
            </div>
          </DiaryWrapper>
        </Link>
      )}
      {diaries.map((diary) => (
        <Link key={diary.id} href={`/d/${diary.id}`}>
          <Diary diary={diary} />
        </Link>
      ))}
      {diaries.length === 0 && isOwnProfile && (
        <p className={styles.emptyMessage}>
          まだ日記帳がありません。新しく作成してみましょう！
        </p>
      )}
    </div>
  );
};

type DiaryWrapperProps = {
  backgroundColor?: string;
  rotation?: number;
  children: React.ReactNode;
};

const DiaryWrapper = ({
  backgroundColor,
  rotation = 0,
  children,
}: DiaryWrapperProps) => {
  return (
    <div className={styles.diaryCn}>
      <div
        className={styles.diary}
        style={{
          backgroundColor: `#${backgroundColor}`,
          transform: `rotate(${rotation}deg)`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

type DiaryProps = {
  diary: DiaryWithMembersData;
};

const Diary = ({ diary }: DiaryProps) => {
  // -5度から+5度の範囲でランダムな回転角度を生成
  const randomRotation = Math.random() * 10 - 5;

  const MAX_VISIBLE_MEMBERS = 6;
  const visibleMembers = diary.members.slice(0, MAX_VISIBLE_MEMBERS);
  const remainingMembersCount = Math.max(
    0,
    diary.members.length - MAX_VISIBLE_MEMBERS
  );

  return (
    <DiaryWrapper
      backgroundColor={diary.backgroundColor}
      rotation={randomRotation}
    >
      <div className={styles.diaryContent}>
        <h3 className={styles.diaryTitle}>{diary.title}</h3>
      </div>
      {diary.members.length > 0 && (
        <div className={styles.memberAvatars}>
          {remainingMembersCount > 0 && (
            <div className={styles.memberCount}>+{remainingMembersCount}</div>
          )}
          {visibleMembers.reverse().map((member) => (
            <Image
              key={member.id}
              src={member.image ?? "/default-avatar.webp"}
              alt={`${member.name}のアバター`}
              className={styles.memberAvatar}
              width={32}
              height={32}
            />
          ))}
        </div>
      )}
    </DiaryWrapper>
  );
};

export default UserProfilePage;
