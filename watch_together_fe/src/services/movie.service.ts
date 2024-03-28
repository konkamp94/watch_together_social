import { AxiosResponse } from "axios"
import axiosInstance from "./axios.config"
class MovieService {

    static instance: MovieService | null = null;

    static getInstance = () => {
        if (!this.instance) {
            this.instance = new MovieService();
        }

        return this.instance;
    };

    getRandomMovieId = async (from: string = 'popular'): Promise<AxiosResponse> => {
        return await axiosInstance.get(`/movie/random-movie-id?from=${from}`)
    }

    getRecommendedMovies = async (movieId: number): Promise<AxiosResponse> => {
        return await axiosInstance.get(`/movie/recommended-movies/?movieId=${movieId}/`)
    }
}

export default MovieService.getInstance()