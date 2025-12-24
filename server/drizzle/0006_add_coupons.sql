CREATE TABLE IF NOT EXISTS `coupons` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`code` text NOT NULL,
	`discount` real NOT NULL,
	`discount_type` text DEFAULT 'percentage' NOT NULL,
	`min_amount` real DEFAULT 0,
	`max_discount` real,
	`usage_limit` integer,
	`used_count` integer DEFAULT 0,
	`valid_from` integer,
	`valid_until` integer,
	`is_active` integer DEFAULT 1 NOT NULL,
	`created_at` integer DEFAULT (strftime('%s','now')) NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS `coupons_code_unique` ON `coupons` (`code`);


