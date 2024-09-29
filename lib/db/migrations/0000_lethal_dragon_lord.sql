CREATE TABLE `article_html` (
	`id` text PRIMARY KEY NOT NULL,
	`html` text,
	`version` integer DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE `articles` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text,
	`description` text,
	`slug` text,
	`keywords` text,
	`status` text DEFAULT 'draft',
	`author_name` text,
	`published_at` integer,
	`last_updated_at` integer DEFAULT CURRENT_TIMESTAMP,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	`html` text,
	FOREIGN KEY (`html`) REFERENCES `article_html`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `articles_slug_unique` ON `articles` (`slug`);