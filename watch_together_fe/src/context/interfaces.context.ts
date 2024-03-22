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