// Tmdb Api Response Interfaces

interface TmdbResponse {
    success?: boolean;
    failure?: boolean;
    status_message?: string;
    status_code?: number;
}

interface RequestTokenResponseFromTmdb extends TmdbResponse {
    request_token?: string;
    expires_at?: string;
}

interface SessionResponseFromTmdb extends TmdbResponse {
    session_id?: string;
}

interface UserDetailsResponseFromTmdb {
    avatar: { gravatar: { hash: string }, tmdb: { avatar_path: string } },
    id: number,
    iso_639_1: string,
    iso_3166_1: string,
    name: string,
    include_adult: boolean,
    username: string
}

// Authentication Controller and Service Interfaces

interface TmdbRequestTokenResponse {
    requestToken: string;
    redirectUrl: string;
}

interface TmdbSessionAndUserDetails {
    sessionId: string;
    userDetails: UserDetailsResponseFromTmdb;
}

interface AuthenticationTokens {
    accessToken: string;
    refreshToken: string;
}

interface RefreshToken {
    refreshToken: string;
    userId: number;
}

