export interface AuthContextValue {
    token: string | null,
    user: string | null,
    login: ((token: string, refreshToken: string) => void),
    logout: (() => void)
}