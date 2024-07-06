DO $$ BEGIN
 CREATE TYPE "public"."event_attendance_status" AS ENUM('pending', 'accepted', 'declined');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."event_user_attendance_type" AS ENUM('team', 'org_guest', 'special_guest');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "event_attendance" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(256) NOT NULL,
	"event_id" integer NOT NULL,
	"attendance_type" "event_user_attendance_type" DEFAULT 'team' NOT NULL,
	"status" "event_attendance_status" DEFAULT 'pending' NOT NULL,
	"travel_required" boolean NOT NULL,
	"accommodation_required" boolean NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "event_attendance" ADD CONSTRAINT "event_attendance_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "event_attendance_email_event_idx" ON "event_attendance" USING btree ("email","event_id");