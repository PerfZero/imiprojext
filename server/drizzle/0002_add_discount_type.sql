-- Отключаем проверку внешних ключей
PRAGMA foreign_keys = OFF;
--> statement-breakpoint
-- Изменение типа discount с integer на real для поддержки десятичных значений
-- В SQLite нельзя напрямую изменить тип колонки, поэтому создаем новую таблицу
CREATE TABLE `products_new` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`price` real NOT NULL,
	`currency` text DEFAULT 'RUB' NOT NULL,
	`image` text,
	`category_id` integer,
	`discount` real DEFAULT 0,
	`discount_type` text DEFAULT 'percentage',
	`stock` integer DEFAULT 0,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT (strftime('%s','now')) NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
-- Копируем данные из старой таблицы
INSERT INTO `products_new` SELECT 
	`id`,
	`name`,
	`description`,
	`price`,
	`currency`,
	`image`,
	`category_id`,
	CAST(`discount` AS real) AS `discount`,
	'percentage' AS `discount_type`,
	`stock`,
	`is_active`,
	`created_at`
FROM `products`;
--> statement-breakpoint
-- Удаляем старую таблицу
DROP TABLE `products`;
--> statement-breakpoint
-- Переименовываем новую таблицу
ALTER TABLE `products_new` RENAME TO `products`;
--> statement-breakpoint
-- Включаем проверку внешних ключей обратно
PRAGMA foreign_keys = ON;
