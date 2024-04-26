import { useState } from "react"
import useApiErrorHandling from "../useApiErrorHandling"
import { AxiosError, AxiosResponse } from "axios"
import { useQuery } from "react-query"
import tmdbProxyService from "../../services/tmdb-proxy.service"
import { Movie, TmdbProxyBody } from "../../services/api.interfaces"

interface SearchParams {
    keyword: string,
    year: string
    // genres: string[],
    // releaseDateGte: Date | null,
    // releaseDateLte: Date | null
}

const useSearchMovieByTitle = (page: number = 1) => {
    const [error, handleApiError] = useApiErrorHandling()
    const [currentPage, setCurrentPage] = useState(page)
    const [searchParams, setSearchParams] =
        useState<SearchParams>({
            keyword: '',
            year: ''
        })

    const searchMovies = async (searchParams: SearchParams, page: number): Promise<AxiosResponse> => {
        let uri = `/search/movie?page=${page}&include_adult=false`;
        if (searchParams.keyword) {
            uri = `${uri}&query=${searchParams.keyword}`
        }
        if (searchParams.year) {
            uri = `${uri}&year=${searchParams.year}`
        }
        const tmdbProxyBody = {
            uri,
            method: 'get',
        }
        const moviesResponse = await tmdbProxyService.accessTmdbApi(tmdbProxyBody)
        // get account states
        const movieIds = moviesResponse.data.results.map((movie: Movie) => movie.id)
        const tmdbProxyBodies = movieIds.map((movieId: number) => ({ uri: `/movie/${movieId}/account_states`, method: 'get' }))
        const movieStateResponses = await Promise.all(tmdbProxyBodies.map((tmdbProxyBody: TmdbProxyBody) => tmdbProxyService.accessTmdbApi(tmdbProxyBody)))
        const moviesWithState = moviesResponse.data.results
            .map((movie: Movie) => (
                {
                    ...movie,
                    state: movieStateResponses?.map((movieStateResponse) => movieStateResponse.data)
                        .find(movieState => {
                            return movieState.id === movie.id
                        })
                }))
        return { ...moviesResponse, data: { ...moviesResponse.data, results: moviesWithState } }
    }

    const { data: movies, isLoading: IsLoadingSearchMovies, refetch: refetchSearchMovies } =
        useQuery(['search-movies', searchParams, currentPage],
            () => searchMovies(searchParams, currentPage), {
            onError: (error: AxiosError) => handleApiError(error),
            enabled: false
        })

    return { movies, IsLoadingSearchMovies, refetchSearchMovies, error, currentPage, setCurrentPage, searchParams, setSearchParams }

}

export default useSearchMovieByTitle