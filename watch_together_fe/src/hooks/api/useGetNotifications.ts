import { useAuth } from "../context/useAuth";
import useApiErrorHandling from "../useApiErrorHandling";
import { useQuery } from "react-query";
import socialService from "../../services/social.service";
import { AxiosError } from "axios";

const useGetNotifications = () => {
    const { user } = useAuth()
    const [error, handleApiError] = useApiErrorHandling()

    if (!user) {
        throw new Error('User must be logged in to get favorites');
    }

    const { data: notifications, isLoading: isLoadingNotifications } = useQuery(['notifications'], socialService.getNotifications,
        {
            onError: (error: AxiosError) => { handleApiError(error) },
            refetchOnWindowFocus: false
        })

    return { notifications: notifications?.data, isLoadingNotifications, error }
}

export default useGetNotifications