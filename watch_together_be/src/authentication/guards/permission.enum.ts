export enum GeneralPermissionTitle {
    IS_OWNER = 'IS_OWNER',
}

export enum SocialPermissionTitle {
    CAN_CREATE_FRIENDSHIP = 'CAN_CREATE_FRIENDSHIP',
    CAN_UPDATE_FRIENDSHIP_STATUS = 'CAN_UPDATE_FRIENDSHIP_STATUS',
    CAN_DELETE_FRIENDSHIP = 'CAN_DELETE_FRIENDSHIP',
    CAN_BLOCK_USER = 'CAN_BLOCK_USER',
}

export type PermissionTitle = GeneralPermissionTitle | SocialPermissionTitle;