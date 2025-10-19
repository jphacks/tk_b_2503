import type { Metadata } from "next";

import { env } from "#/clients/env";

export const getBaseUrl = (): string => {
  if (env.NEXT_PUBLIC_BASE_URL) {
    return env.NEXT_PUBLIC_BASE_URL;
  }

  return env.BETTER_AUTH_URL;
};

export const getDefaultOGImage = (): string => {
  const baseUrl = getBaseUrl();
  return `${baseUrl}/og-default.svg`;
};

export const sanitizeDescription = (
  text: string,
  maxLength: number = 100
): string => {
  const sanitized = text.replace(/\r?\n/g, " ");

  const normalized = sanitized.replace(/\s+/g, " ").trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.substring(0, maxLength)}...`;
};

export type UserProfileData = {
  id: string;
  name: string;
  image: string | null;
  bio: string | null;
};

export const createProfileMetadata = async (
  user: UserProfileData
): Promise<Metadata> => {
  const title = `${user.name} | haru`;
  const description = user.bio
    ? sanitizeDescription(user.bio)
    : `${user.name}のプロフィール`;

  const imageUrl = user.image ?? getDefaultOGImage();

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${user.name}のプロフィール画像`,
        },
      ],
      siteName: "haru",
      locale: "ja_JP",
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [imageUrl],
    },
  };
};

export type PostData = {
  id: string;
  authorName: string;
  authorImage: string | null;
  rawText: string;
  createdAt: Date;
};

export const createPostMetadata = async (post: PostData): Promise<Metadata> => {
  const postDate = new Date(post.createdAt);
  const month = postDate.getMonth() + 1;
  const day = postDate.getDate();

  const title = `${post.authorName}の${month}月${day}日の日記 | Haru`;

  const imageUrl = post.authorImage ?? getDefaultOGImage();

  return {
    title,
    openGraph: {
      title,
      type: "article",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${post.authorName}のプロフィール画像`,
        },
      ],
      siteName: "Haru",
      locale: "ja_JP",
      publishedTime: post.createdAt.toISOString(),
    },
    twitter: {
      card: "summary",
      title,
      images: [imageUrl],
    },
  };
};

export const getDefaultMetadata = (): Metadata => {
  const title = "Haru";
  const description = "シールでデコる日記帳";
  const imageUrl = getDefaultOGImage();

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: "Haru",
        },
      ],
      siteName: "Haru",
      locale: "ja_JP",
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [imageUrl],
    },
  };
};
