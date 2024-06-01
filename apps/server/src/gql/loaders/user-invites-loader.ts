import { db } from "../../db/index.js";
import { ContextType } from "../context.js";
import { loaderWithContext } from "../loader-with-context.js";

export const userInvitesLoader = loaderWithContext(
	async (emails: readonly string[], _context: ContextType) => {
		const invites = await db.query.invites.findMany({
			where: (invite, { inArray }) =>
				inArray(invite.email, emails as string[]),
		});

		const invitesMap = new Map();
		invites.forEach((invite) => {
			if (!invitesMap.has(invite.email)) {
				invitesMap.set(invite.email, []);
			}

			invitesMap.get(invite.email).push(invite);
		});

		return emails.map((email) => invitesMap.get(email) || []);
	}
);
