import { AxiosResponse } from "axios"
import { axiosInstance, createAuthHeaders } from "./axios.config"
class MovieService {

    static instance: MovieService | null = null;

    static getInstance = () => {
        if (!this.instance) {
            this.instance = new MovieService();
        }

        return this.instance;
    };

    getRandomMovieId = async (from: string = 'popular'): Promise<AxiosResponse> => {
        return await axiosInstance.get(`/movie/random-movie-id?from=${from}`, { headers: createAuthHeaders() })
    }

    getRecommendedMovies = async (movieId: number): Promise<AxiosResponse> => {
        return await axiosInstance.get(`/movie/recommended-movies/?movieId=${movieId}`, { headers: createAuthHeaders() })
    }
}

export default MovieService.getInstance()