import { useQuery } from "react-query"
import tmdbProxyService from "../../services/tmdb-proxy.service"
import useApiErrorHandling from "../useApiErrorHandling"
import { AxiosError } from "axios"
import { Movie, TmdbProxyBody } from "../../services/api.interfaces"

const useGetSimilarMovies = (movieId: string) => {
    const [error, handleApiError] = useApiErrorHandling()

    const getSimilarMovies = () => {
        const tmdbProxyBody = {
            'uri': `/movie/${movieId}/similar`,
            'method': 'get'
        }

        return tmdbProxyService.accessTmdbApi(tmdbProxyBody)
    }

    const getAccountStates = (movieIds: number[]) => {
        const tmdbProxyBodies = movieIds.map((movieId: number) => ({ uri: `/movie/${movieId}/account_states`, method: 'get' }))
        return Promise.all(tmdbProxyBodies.map((tmdbProxyBody: TmdbProxyBody) => tmdbProxyService.accessTmdbApi(tmdbProxyBody)))
    }

    const { data: similarMovies, isLoading: isLoadingSimilarMovies } = useQuery(['similar-movies', movieId],
        async () => {
            const similarMovies = await getSimilarMovies()
            const topSimilarMovies = similarMovies.data.results.slice(0, 4)
            const movieIds = topSimilarMovies.map((movie: Movie) => movie.id)
            const topSimilarMovieStates = await getAccountStates(movieIds)

            return [topSimilarMovies, topSimilarMovieStates]
        },
        {
            refetchOnWindowFocus: false,
            onError: (error: AxiosError) => handleApiError(error),
            select: (data) => {
                const [topSimilarMovies, topSimilarMovieStates] = data

                return topSimilarMovies.map((topSimilarMovie: Movie) => (
                    {
                        ...topSimilarMovie,
                        state: topSimilarMovieStates?.map((topSimilarMovieState) => topSimilarMovieState.data)
                            .find(topSimilarMovieState => {
                                return topSimilarMovieState.id === topSimilarMovie.id
                            })
                    }))



            }
        })

    return { similarMovies, isLoadingSimilarMovies, error }

}

export default useGetSimilarMovies