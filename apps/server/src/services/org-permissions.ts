export const PERMISSIONS = {
	CAN_INVITE_GUESTS: false,
	CAN_UPDATE_ROLES: false,
	CAN_UPDATE_EVENT: false,
};

export type PERMISSIONS = typeof PERMISSIONS;

type OwnerPermissions = {
	[K in keyof PERMISSIONS]: true;
};

const OWNER_PERMISSIONS: OwnerPermissions = {
	CAN_INVITE_GUESTS: true,
	CAN_UPDATE_ROLES: true,
	CAN_UPDATE_EVENT: true,
};

const ADMIN_PERMISSIONS: PERMISSIONS = {
	CAN_INVITE_GUESTS: true,
	CAN_UPDATE_ROLES: true,
	CAN_UPDATE_EVENT: true,
};

export const getOrgPermissions = ({
	permissions = {},
	role,
}: {
	permissions?: Partial<PERMISSIONS>;
	role: string;
}): PERMISSIONS => {
	switch (role) {
		case "owner":
			return OWNER_PERMISSIONS;
		case "admin":
			return {
				...ADMIN_PERMISSIONS,
				...permissions,
			};
		default:
			return {
				...PERMISSIONS,
				...permissions,
			};
	}
};
