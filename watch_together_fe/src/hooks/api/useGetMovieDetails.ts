import { useQuery } from "react-query"
import tmdbProxyService from "../../services/tmdb-proxy.service"
import useApiErrorHandling from "../useApiErrorHandling"
import { AxiosError } from "axios"

const useGetMovieDetails = (movieId: string) => {
    const [error, handleApiError] = useApiErrorHandling()

    const getMovieDetails = () => {
        const tmdbProxyBody = {
            'uri': `/movie/${movieId}`,
            'method': 'get'
        }

        return tmdbProxyService.accessTmdbApi(tmdbProxyBody)
    }

    const getMovieCredits = () => {
        const tmdbProxyBody = {
            'uri': `/movie/${movieId}/credits`,
            'method': 'get'
        }

        return tmdbProxyService.accessTmdbApi(tmdbProxyBody)
    }

    const getMovieVideos = () => {
        const tmdbProxyBody = {
            'uri': `/movie/${movieId}/videos`,
            'method': 'get'
        }

        return tmdbProxyService.accessTmdbApi(tmdbProxyBody)
    }

    const getAccountState = () => {
        const tmdbProxyBody = { uri: `/movie/${movieId}/account_states`, method: 'get' }
        return tmdbProxyService.accessTmdbApi(tmdbProxyBody)
    }

    const { data: movieDetails, isLoading: isLoadingMovieDetails } =
        useQuery(['movie', movieId], async () => {
            const [movieDetails, movieState, movieCredits, movieVideos] = await Promise.all([
                getMovieDetails(),
                getAccountState(),
                getMovieCredits(),
                getMovieVideos(),
            ]);
            return { movieDetails, movieState, movieCredits, movieVideos }
        },
            {
                onError: (error: AxiosError) => handleApiError(error),
                refetchOnWindowFocus: false,
                select: (response) => {
                    // console.log(response.movieVideos.data.cast.)
                    console.log(response.movieVideos.data.results)
                    const trailer = response.movieVideos.data.results.find(
                        (video) => {
                            console.log(video.official && video.type === 'Trailer' && video.site === 'YouTube')
                            console.log(video.type === 'Trailer' && video.site === 'YouTube')
                            console.log(video.site === 'YouTube')
                            return (video.official && video.type === 'Trailer' && video.site === 'YouTube') ||
                                (video.type === 'Trailer' && video.site === 'YouTube') ||
                                (video.site === 'YouTube')
                        }
                    )

                    const mainActors = response.movieCredits.data.cast.filter((actor) => actor.order <= 3)

                    const writers = response.movieCredits.data.crew.filter(
                        (credit) => (credit.known_for_department === 'Writing')
                    )

                    const directors = response.movieCredits.data.crew.filter(
                        (credit) => (credit.known_for_department === 'Directing')
                    )

                    return {
                        ...response.movieDetails.data,
                        state: response.movieState.data,
                        credits: response.movieCredits.data,
                        trailer,
                        mainActors,
                        writers,
                        directors
                    }
                }
            })

    return { movieDetails, isLoadingMovieDetails, error }

}

export default useGetMovieDetails