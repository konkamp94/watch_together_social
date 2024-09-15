import { useQuery } from "react-query"
import tmdbProxyService from "../../services/tmdb-proxy.service"
import { useAuth } from "../context/useAuth"
import useApiErrorHandling from "../useApiErrorHandling"
import { AxiosError } from "axios"
import { useState } from "react"

const useGetFavoriteMovies = (page: number = 1) => {
    const { user } = useAuth()
    const [error, handleApiError] = useApiErrorHandling()
    const [currentPage, setCurrentPage] = useState(page)

    if (!user) {
        throw new Error('User must be logged in to get favorites');
    }

    const { data: favoriteMovies, isLoading: isLoadingFavorites, refetch: getFavorites } = useQuery(['favorite-movies', currentPage], () => {
        const tmdbProxyBody = {
            uri: `/account/${user.tmdbId}/favorite/movies?page=${currentPage}&sort_by=created_at.desc`,
            method: 'get',
        }
        return tmdbProxyService.accessTmdbApi(tmdbProxyBody)
    },
        {
            onError: (error: AxiosError) => { handleApiError(error) },
            refetchOnWindowFocus: false
        })

    return { favoriteMovies, isLoadingFavorites, getFavorites, error, currentPage, setCurrentPage }
}

export default useGetFavoriteMovies