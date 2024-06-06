import { User as LuciaUser } from "lucia";
import { PERMISSIONS } from "../services/permissions.js";

export interface User extends LuciaUser {
	orgMemberships?: Array<{
		organization: {
			id: number;
			owner_id: number;
			name: string;
		};
		role: {
			name: string;
			permissions: PERMISSIONS;
		};
	}>;
}
