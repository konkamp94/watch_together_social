import { useMutation } from "react-query";
import useApiErrorHandling from "../useApiErrorHandling";
import { AxiosError } from "axios";
import socialService from "../../services/social.service";
import { FriendshipInfo } from "../../services/api.interfaces";
import { useAuth } from "../context/useAuth";

const useAcceptOrRejectFriend = (onSuccess: ((friendshipInfo: FriendshipInfo) => void) | null = null) => {
    // const queryClient = useQueryClient();
    const { user } = useAuth()
    const [error, handleApiError] = useApiErrorHandling();

    const { mutate, isLoading } = useMutation(socialService.acceptOrRejectFriend, {
        onSuccess: (response) => {
            const friendshipInfo: FriendshipInfo = {
                id: response.data.id,
                status: response.data.status,
                isRequesterUser: response.data.requesterUserId === user?.userId
            }
            // queryClient.invalidateQueries(['recommended-movies-account-states'])
            if (onSuccess) { onSuccess(friendshipInfo) }
        },
        onError: (error: AxiosError) => {
            handleApiError(error);
        }
    });

    return {
        acceptOrRejectFriend: mutate,
        errorAcceptOrReject: error,
        isLoadingAcceptOrReject: isLoading,
    };
};

export default useAcceptOrRejectFriend;