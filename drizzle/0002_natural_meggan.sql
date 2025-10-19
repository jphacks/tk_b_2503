CREATE TABLE `diaries` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`background_color` text NOT NULL,
	`author_id` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`author_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `diary_users` (
	`diary_id` text NOT NULL,
	`member_id` text NOT NULL,
	FOREIGN KEY (`diary_id`) REFERENCES `diaries`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`member_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `posts` ADD `diary_id` text NOT NULL REFERENCES diaries(id);