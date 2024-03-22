export interface Movie {
    adult: boolean;
    backdrop_path: string;
    genre_ids: number[];
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
}

export interface MovieAccountState {
    id: number,
    favorite: boolean,
    rated: boolean,
    watchlist: boolean
}

export interface MovieWithAccountState extends Movie {
    state: MovieAccountState
}

export type TmdbProxyBody = {
    uri: string,
    method: string,
    body?: object,
    headers?: object
}