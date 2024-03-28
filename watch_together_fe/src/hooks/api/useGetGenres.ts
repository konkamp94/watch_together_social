import tmdbProxyService from "../../services/tmdb-proxy.service"
import { useQuery } from "react-query"
import { AxiosError } from "axios"

const useGetGenres = () => {

    const { data: genres, isLoading: isLoadingGenres } = useQuery(['genres'], () => {
        const tmdbProxyBody = {
            uri: `/genre/movie/list`,
            method: 'get',
        }
        return tmdbProxyService.accessTmdbApi(tmdbProxyBody)
    },
        {
            //TODO handle error
            onError: (error: AxiosError) => { console.log(error) },
            refetchOnWindowFocus: false
        })

    return { genres, isLoadingGenres }
}

export default useGetGenres