import { useAuth } from "../context/useAuth";
import useApiErrorHandling from "../useApiErrorHandling";
import { useQuery } from "react-query";
import socialService from "../../services/social.service";
import { AxiosError } from "axios";

const useGetFriends = () => {
    const { user } = useAuth()
    const [error, handleApiError] = useApiErrorHandling()

    if (!user) {
        throw new Error('User must be logged in to get friends');
    }

    const { data: friends, isLoading: isLoadingFriends } = useQuery(['get-friends'], socialService.getFriends,
        {
            onError: (error: AxiosError) => { handleApiError(error) },
            refetchOnWindowFocus: false
        })

    return { friends: friends?.data, isLoadingFriends, error }
}

export default useGetFriends