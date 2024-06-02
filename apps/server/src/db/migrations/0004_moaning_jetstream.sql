CREATE INDEX IF NOT EXISTS "memberships_user_idx" ON "memberships" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "memberships_organization_idx" ON "memberships" ("organization_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "memberships_user_organization_idx" ON "memberships" ("user_id","organization_id");