import movieService from "../../services/movie.service";
import tmdbProxyService from "../../services/tmdb-proxy.service";
import useApiErrorHandling from "../useApiErrorHandling";
import { useQuery } from "react-query";
import { AxiosError } from "axios";
import { Movie } from '../../services/api.interfaces'
import { TmdbProxyBody } from "../../services/api.interfaces";

const useRecommendedMovies = (recommendBy: string = 'popular') => {
    const [errorMessage, handleApiError] = useApiErrorHandling()

    const { data: randomMovie, isLoading: isLoadingRandomMovie } = useQuery('random-movie-id',
        () => movieService.getRandomMovieId(recommendBy),
        {
            onError: (error: AxiosError) => { handleApiError(error) },
            staleTime: 4 * (60 * 1000), // 4 minutes
            refetchOnWindowFocus: false
        })

    const { data: recommendedMovies, isLoading: isLoadingRandomMovies } = useQuery('recommended-movies',
        () => movieService.getRecommendedMovies(randomMovie?.data.randomMovieId),
        {
            onError: (error: AxiosError) => { handleApiError(error) },
            staleTime: 5 * (60 * 1000), // 5 minutes
            enabled: !!randomMovie,
            refetchOnWindowFocus: false
        })

    const getAccountStates = () => {
        const movieIds = recommendedMovies?.data.results.map((movie: Movie) => movie.id)
        const tmdbProxyBodies = movieIds.map((movieId: number) => ({ uri: `/movie/${movieId}/account_states`, method: 'get' }))
        return Promise.all(tmdbProxyBodies.map((tmdbProxyBody: TmdbProxyBody) => tmdbProxyService.accessTmdbApi(tmdbProxyBody)))
    }

    const { data: recommendedMoviesStates, isLoading: isLoadingAccountStates } = useQuery('recommended-movies-account-states',
        getAccountStates,
        {
            onError: (error: AxiosError) => { handleApiError(error) },
            staleTime: 5 * (60 * 1000), // 5 minutes
            enabled: !!recommendedMovies,
            refetchOnWindowFocus: false
        })

    const isLoading = isLoadingRandomMovie || isLoadingRandomMovies || isLoadingAccountStates

    return { recommendedMovies, recommendedMoviesStates, errorMessage, isLoading }
}

export default useRecommendedMovies;