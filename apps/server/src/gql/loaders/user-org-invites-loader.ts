import { db } from "../../db/index.js";
import { ContextType } from "../context.js";
import { loaderWithContext } from "../loader-with-context.js";

export const userOrgInvitesLoader = loaderWithContext(
	async (emails: readonly string[], _context: ContextType) => {
		const orgInvites = await db.query.orgInvites.findMany({
			where: (orgInvite, { inArray }) =>
				inArray(orgInvite.email, emails as string[]),
		});

		const invitesMap = new Map();
		orgInvites.forEach((orgInvite) => {
			if (!invitesMap.has(orgInvite.email)) {
				invitesMap.set(orgInvite.email, []);
			}

			invitesMap.get(orgInvite.email).push(orgInvite);
		});

		return emails.map((email) => invitesMap.get(email) || []);
	}
);
