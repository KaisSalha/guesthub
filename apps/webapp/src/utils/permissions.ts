export const PERMISSIONS = {
  CAN_INVITE_GUESTS: false,
  CAN_UPDATE_ROLES: false,
};

export type PERMISSIONS = typeof PERMISSIONS;

// owner should have all the keys but the values should be true
type OwnerPermissions = {
  [K in keyof PERMISSIONS]: true;
};

export const OWNER_PERMISSIONS: OwnerPermissions = {
  CAN_INVITE_GUESTS: true,
  CAN_UPDATE_ROLES: true,
};
