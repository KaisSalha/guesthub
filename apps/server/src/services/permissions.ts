export const PERMISSIONS = {
	CAN_INVITE_GUESTS: false,
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

export const ADMIN_PERMISSIONS = {
	...PERMISSIONS,
	CAN_INVITE_GUESTS: true,
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

export const OWNER_PERMISSIONS: PERMISSIONS = {
	CAN_INVITE_GUESTS: true,
};
