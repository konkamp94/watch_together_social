export interface User {
    userId: number,
    username: string,
    name: string,
    tmdbId: number,
    iat: number,
    exp: number
}

export interface AuthContextValue {
    token: string | null,
    user: User | null,
    login: ((token: string, refreshToken: string) => void),
    logout: (() => void)
}

export interface MetadataContextValue {
    genres: GenresMap | null
    isLoadingGenres: boolean
}


export type GenresMap = { [id: number]: string }

export interface NotificationsContextValue {
    notifications: Notification[]
    unseenNotificationsCount: number
    isLoadingNotifications: boolean
}

export interface FriendRequestNotification {
    id: number,
    userId: number,
    type: string,
    createdAt: string,
    seen: boolean,
    friendRequest: {
        status: string,
        createdAt: string,
        requesterUser: {
            id: number,
            username: string,
            name: string
        }
    }
}

export type Notification = FriendRequestNotification