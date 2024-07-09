import { useQuery } from "react-query"
import { useAuth } from "../context/useAuth"
import useApiErrorHandling from "../useApiErrorHandling"
import { AxiosError } from "axios"
import socialService from "../../services/social.service"

const useGetFriendRequests = () => {
    const { user } = useAuth()
    const [error, handleApiError] = useApiErrorHandling()

    if (!user) {
        throw new Error('User must be logged in to search for friends');
    }

    const { data: otherUsers, isLoading: isLoadingOtherUsers } = useQuery(['friend-requests'],
        socialService.getFriendRequests, {
        onError: (error: AxiosError) => handleApiError(error),
        refetchOnWindowFocus: false
    })

    return { otherUsers, isLoadingOtherUsers, error }
}

export default useGetFriendRequests