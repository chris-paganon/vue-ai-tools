DROP INDEX IF EXISTS `subscriptions_stripe_id_unique`;--> statement-breakpoint
ALTER TABLE `subscriptions` DROP COLUMN `stripe_id`;