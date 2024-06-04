export const PERMISSIONS = {
	CAN_INVITE_GUESTS: false,
	CAN_UPDATE_ROLES: false,
};

export type PERMISSIONS = typeof PERMISSIONS;

export const getUserPermissions = ({
	permissions,
}: {
	permissions: Partial<PERMISSIONS>;
}): PERMISSIONS => {
	return {
		...PERMISSIONS,
		...permissions,
	};
};

type OwnerPermissions = {
	[K in keyof PERMISSIONS]: true;
};

export const ADMIN_PERMISSIONS: OwnerPermissions = {
	CAN_INVITE_GUESTS: true,
	CAN_UPDATE_ROLES: true,
};

export const getAdminPermissions = ({
	permissions,
}: {
	permissions: Partial<PERMISSIONS>;
}): PERMISSIONS => {
	return {
		...ADMIN_PERMISSIONS,
		...permissions,
	};
};

export const OWNER_PERMISSIONS: OwnerPermissions = {
	CAN_INVITE_GUESTS: true,
	CAN_UPDATE_ROLES: true,
};
