import { useQuery } from "react-query"
import tmdbProxyService from "../../services/tmdb-proxy.service"
import { useAuth } from "../context/useAuth"
import useApiErrorHandling from "../useApiErrorHandling"
import { AxiosError } from "axios"
import { useState } from "react"

const useGetWatchlistMovies = (page: number = 1) => {
    const { user } = useAuth()
    const [error, handleApiError] = useApiErrorHandling()
    const [currentPage, setCurrentPage] = useState(page)

    if (!user) {
        throw new Error('User must be logged in to get favorites');
    }

    const { data: watchlistMovies, isLoading: isLoadingWatchlist, refetch: getWatchlist } = useQuery(['watchlist-movies', currentPage], () => {
        const tmdbProxyBody = {
            uri: `/account/${user.tmdbId}/watchlist/movies?page=${currentPage}`,
            method: 'get',
        }
        return tmdbProxyService.accessTmdbApi(tmdbProxyBody)
    },
        {
            onError: (error: AxiosError) => { handleApiError(error) },
            refetchOnWindowFocus: false
        })

    return { watchlistMovies, isLoadingWatchlist, getWatchlist, error, currentPage, setCurrentPage }
}

export default useGetWatchlistMovies