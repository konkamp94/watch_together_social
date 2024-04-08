import useApiErrorHandling from "../useApiErrorHandling";
import { useMutation } from 'react-query';
import { AxiosError } from "axios";
import socialService from "../../services/social.service";
import { FriendshipInfo } from "../../services/api.interfaces"
import { useAuth } from "../context/useAuth";

const useAddFriend = (onSuccess: ((friendshipInfo: FriendshipInfo) => void) | null = null) => {
    // const queryClient = useQueryClient();
    const { user } = useAuth()
    const [errorMessage, handleApiError] = useApiErrorHandling();

    const { mutate, isLoading } = useMutation(socialService.addFriend, {
        onSuccess: (response) => {
            // queryClient.invalidateQueries(['recommended-movies-account-states'])
            const friendshipInfo: FriendshipInfo = {
                id: response.data.id,
                status: response.data.status,
                isRequesterUser: response.data.requesterUserId === user?.userId
            }
            if (onSuccess) { onSuccess(friendshipInfo) }
        },
        onError: (error: AxiosError) => {
            handleApiError(error);
        }
    });

    return {
        addFriend: mutate,
        errorMessageAddFriend: errorMessage,
        isLoadingAddFriend: isLoading,
    };
};

export default useAddFriend;