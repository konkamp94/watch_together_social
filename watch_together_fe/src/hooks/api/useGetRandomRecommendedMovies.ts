import movieService from "../../services/movie.service";
import tmdbProxyService from "../../services/tmdb-proxy.service";
import useApiErrorHandling from "../useApiErrorHandling";
import { useQuery } from "react-query";
import { AxiosError } from "axios";
import { Movie } from '../../services/api.interfaces'
import { TmdbProxyBody } from "../../services/api.interfaces";
import { useEffect, useState } from 'react';
import useLocalStorage from "../useLocalStorage";

const useGetRandomRecommendedMovies = (recommendBy: string = 'popular', count: number = 8) => {
    const [error, handleApiError] = useApiErrorHandling()

    const [storedRecommendedMovies, saveRecommendedMovies] = useLocalStorage('recommendedMovies')
    const [recommendedMovies, setRecommendedMovies] =
        useState(storedRecommendedMovies ? JSON.parse(storedRecommendedMovies) : null)

    const [storedRecommendedMoviesWithState, saveRecommendedMoviesWithState] = useLocalStorage('recommendedMoviesWithState')
    const [recommendedMoviesWithState, setRecommendedMoviesWithState] =
        useState(storedRecommendedMoviesWithState ? JSON.parse(storedRecommendedMoviesWithState) : null)

    const [fetchingStage, setFetchingStage] = useState('recommended-movies')
    const [accountStatesIsEnabled, setAccountStatesIsEnabled] = useState(false)

    const { isLoading: isLoadingRecommendedMovies, isFetching: isFetchingRecommendedMovies } = useQuery('recommended-movies',
        async () => {
            const randomMovie = await movieService.getRandomMovieId(recommendBy)
            return await movieService.getRecommendedMovies(randomMovie.data.randomMovieId)
        },
        {
            onSuccess: (recommendedMoviesResponse) => {
                const randomRecommendedMovies = recommendedMoviesResponse.data.results
                    .sort(() => 0.5 - Math.random())
                    .slice(0, count)

                setRecommendedMovies(randomRecommendedMovies)
                saveRecommendedMovies(JSON.stringify(randomRecommendedMovies))
                setFetchingStage('recommended-movies-account-states')
            },
            onError: (error: AxiosError) => { handleApiError(error) },

            staleTime: 1 * (60 * 1000), // 4 minutes
            refetchOnWindowFocus: false,
        }
    )

    const getAccountStates = () => {
        if (recommendedMovies) {
            const tmdbProxyBodies = recommendedMovies?.map((movie: Movie) => movie.id)
                .map((movieId: number) => ({ uri: `/movie/${movieId}/account_states`, method: 'get' }))
            return Promise.all(tmdbProxyBodies.map((tmdbProxyBody: TmdbProxyBody) => tmdbProxyService.accessTmdbApi(tmdbProxyBody)))
        }
    }

    const { isLoading: isLoadingAccountStates, isFetching: isFetchingAccountStates, isRefetching: isRefetchingAccountStates, refetch: getAccountStatesFetch } = useQuery('recommended-movies-account-states',
        getAccountStates,
        {
            onSuccess: ((recommendedMoviesStates) => {
                setFetchingStage('recommended-movies')
                const recommendedMoviesWithState = recommendedMovies
                    .map((recommendedMovie: Movie) => (
                        {
                            ...recommendedMovie,
                            state: recommendedMoviesStates?.map((recommendedMovieState) => recommendedMovieState.data)
                                .find(recommendedMovieState => {
                                    return recommendedMovieState.id === recommendedMovie.id
                                })
                        }))
                // use the state here so I can return the same result in every component rerender until the query runs again
                setRecommendedMoviesWithState(recommendedMoviesWithState)
                saveRecommendedMoviesWithState(JSON.stringify(recommendedMoviesWithState))
            }),
            onError: (error: AxiosError) => { handleApiError(error) },
            enabled: accountStatesIsEnabled,
            refetchOnWindowFocus: false
        })

    useEffect(() => {
        console.log(fetchingStage)
        if (recommendedMovies) {
            console.log(recommendedMovies)
            getAccountStatesFetch()
        }
    }, [recommendedMovies, getAccountStatesFetch])

    // this runs on the component unmount. I want to enable the query for the movies's state update so I can
    // invalidate query from other components when a movie is added to favorites or watchlist
    useEffect(() => {
        return setAccountStatesIsEnabled(true)
    }, [setAccountStatesIsEnabled])

    const isLoading = isLoadingRecommendedMovies || isLoadingAccountStates
    const isFetching = isFetchingRecommendedMovies || isFetchingAccountStates

    return { recommendedMoviesWithState, error, isLoading, isFetching, isRefetchingAccountStates }
}

export default useGetRandomRecommendedMovies;