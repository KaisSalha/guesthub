ALTER TABLE "invites" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "invites" DROP COLUMN IF EXISTS "invite_uuid";