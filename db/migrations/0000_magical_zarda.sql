CREATE TABLE `chat_message` (
	`id` integer PRIMARY KEY NOT NULL,
	`chat_id` integer NOT NULL,
	`role` text NOT NULL,
	`content` text NOT NULL,
	`created` text DEFAULT (current_timestamp) NOT NULL,
	`updated` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`chat_id`) REFERENCES `chat`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `chat` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`user_id` text,
	`created` text DEFAULT (current_timestamp) NOT NULL,
	`updated` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` text,
	`stripe_id` text NOT NULL,
	`created` text DEFAULT (current_timestamp) NOT NULL,
	`updated` text DEFAULT (current_timestamp) NOT NULL,
	`level` text NOT NULL,
	`current_period_end` text NOT NULL,
	`cancel_at` text,
	`status` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` integer PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`user_id` text,
	`created` text DEFAULT (current_timestamp) NOT NULL,
	`updated` text DEFAULT (current_timestamp) NOT NULL,
	`status` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `email_verification` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`code` text NOT NULL,
	`email` text NOT NULL,
	`expires_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `password_reset` (
	`token_hash` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`password` text NOT NULL,
	`email` text NOT NULL,
	`created` text DEFAULT (current_timestamp) NOT NULL,
	`updated` text DEFAULT (current_timestamp) NOT NULL,
	`stripe_id` text,
	`email_verified` integer DEFAULT false NOT NULL,
	`email_consent` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `subscriptions_stripe_id_unique` ON `subscriptions` (`stripe_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_stripe_id_unique` ON `user` (`stripe_id`);