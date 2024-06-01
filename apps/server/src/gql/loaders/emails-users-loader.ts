import { db } from "../../db/index.js";
import { ContextType } from "../context.js";
import { loaderWithContext } from "../loader-with-context.js";

export const emailsUsersLoader = loaderWithContext(
	async (emails: readonly string[], _context: ContextType) => {
		const users = await db.query.users.findMany({
			where: (user, { inArray }) =>
				inArray(user.email, emails as string[]),
		});

		const usersMap = new Map();
		users.forEach((user) => {
			usersMap.set(user.email, user);
		});

		return emails.map((email) => usersMap.get(email) || null);
	}
);
