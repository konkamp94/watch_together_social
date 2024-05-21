import { useQuery } from "react-query";
import { useAuth } from "../context/useAuth";
import useApiErrorHandling from "../useApiErrorHandling";
import socialService from "../../services/social.service";
import { AxiosError } from "axios";

const useMarkNotificationsAsSeen = (notificationsCount: number, onSuccess: () => void) => {
    const { user } = useAuth()
    const [error, handleApiError] = useApiErrorHandling()

    if (!user) {
        throw new Error('User must be logged in to mark notifications as seen');
    }

    const { refetch: markNotificationsAsSeen, isLoading: isLoadingMarkNotificationsAsSeen } = useQuery(['mark-notifications-as-seen', notificationsCount],
        () => socialService.markNotificationsAsSeen(notificationsCount),
        {
            onSuccess: () => { onSuccess() },
            onError: (error: AxiosError) => { handleApiError(error) },
            enabled: false,
        })

    return { markNotificationsAsSeen, isLoadingMarkNotificationsAsSeen, error }
}

export default useMarkNotificationsAsSeen