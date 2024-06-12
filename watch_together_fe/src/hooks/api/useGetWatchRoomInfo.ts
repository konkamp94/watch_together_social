import { useQuery } from "react-query"
import { AxiosError } from "axios"
import socialService from "../../services/social.service"
import useApiErrorHandling from "../useApiErrorHandling"
import tmdbProxyService from "../../services/tmdb-proxy.service"

const useGetWatchRoomInfo = (code: string) => {
    const [error, handleApiError] = useApiErrorHandling()

    const getMovieVideos = async (movieId: number) => {
        const tmdbProxyBody = {
            'uri': `/movie/${movieId}/videos`,
            'method': 'get'
        }

        return tmdbProxyService.accessTmdbApi(tmdbProxyBody)
    }

    const { data: watchRoomInfo, isLoading: isLoadingWatchRoomInfo, refetch: getWatchRoomInfo } = useQuery(['watch-room-info', code],
        async () => {
            const watchRoomInfo = await socialService.getWatchRoomInfo(code)
            console.log(watchRoomInfo.data)
            const movieVideos = await getMovieVideos(watchRoomInfo.data.movieId)

            return { watchRoomInfo, movieVideos }
        },
        {
            //TODO handle error
            onError: (error: AxiosError) => { handleApiError(error) },
            refetchOnWindowFocus: false,
            select: (response) => {
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

                return { ...response.watchRoomInfo.data, trailer }
            }
        })

    return { watchRoomInfo, isLoadingWatchRoomInfo, error: error?.message, getWatchRoomInfo }
}

export default useGetWatchRoomInfo