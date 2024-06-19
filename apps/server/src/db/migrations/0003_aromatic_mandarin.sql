ALTER TABLE "events" ADD COLUMN "start_date" date NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "end_date" date NOT NULL;--> statement-breakpoint
ALTER TABLE "events" DROP COLUMN IF EXISTS "start_time";--> statement-breakpoint
ALTER TABLE "events" DROP COLUMN IF EXISTS "end_time";