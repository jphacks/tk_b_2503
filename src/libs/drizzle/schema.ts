import { sql } from "drizzle-orm";
import {
  index,
  integer,
  primaryKey,
  real,
  sqliteTable,
  text,
  unique,
} from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";

// ユーザーテーブル
export const user = sqliteTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash"),
  name: text("name").notNull(),
  image: text("image"),
  bio: text("bio"),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .$defaultFn(() => false)
    .notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  lastReadAt: integer("last_read_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
});

// セッションテーブル
export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`(unixepoch())`
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(
    sql`(unixepoch())`
  ),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
});

export const sessionExpiresAtIdx = index("idx_session_expires_at").on(
  session.expiresAt
);

// アカウントテーブル（OAuth用）
export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", {
    mode: "timestamp",
  }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", {
    mode: "timestamp",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`(unixepoch())`
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(
    sql`(unixepoch())`
  ),
});

export const accountUniqueIdx = unique("idx_account_unique").on(
  account.providerId,
  account.accountId
);

// 認証用検証テーブル
export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`(unixepoch())`
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(
    sql`(unixepoch())`
  ),
});

// フォローテーブル
export const follows = sqliteTable(
  "follows",
  {
    followerId: text("follower_id")
      .notNull()
      .references(() => user.id),
    followeeId: text("followee_id")
      .notNull()
      .references(() => user.id),
    createdAt: integer("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.followerId, table.followeeId] })]
);

// シール日記帳テーブル
export const diaries = sqliteTable("diaries", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  title: text("title").notNull(),
  backgroundColor: text("background_color").notNull(),
  authorId: text("author_id")
    .notNull()
    .references(() => user.id),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
});

export type Diary = (typeof diaries)["$inferSelect"];

// 投稿テーブル
export const posts = sqliteTable("posts", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  authorId: text("author_id")
    .notNull()
    .references(() => user.id),
  rawText: text("raw_text").notNull(),
  textImage: text("text_image").notNull(),
  image: text("image"),
  diaryId: text("diary_id")
    .notNull()
    .references(() => diaries.id),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
});

export type Post = (typeof posts)["$inferSelect"];

// ステッカーテーブル
export const stickers = sqliteTable("stickers", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  postId: text("post_id")
    .notNull()
    .references(() => posts.id),
  placedBy: text("placed_by")
    .notNull()
    .references(() => user.id),
  type: text("type", {
    enum: [
      "blob-blue",
      "blob-green",
      "burst-blue",
      "clover-green",
      "d-shape-purple",
      "star-sparkle",
      "swirl-coral",
      "uruuru",
      "gahahaha",
    ],
  }).notNull(),
  x: real("x").notNull(),
  y: real("y").notNull(),
  scale: real("scale").notNull().default(1.0),
  rotation: real("rotation").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
});

// DiaryとUserの中間テーブル
export const diaryMembers = sqliteTable(
  "diary_users",
  {
    diaryId: text("diary_id")
      .notNull()
      .references(() => diaries.id),
    memberId: text("member_id")
      .notNull()
      .references(() => user.id),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.diaryId, table.memberId] }),
    };
  }
);
