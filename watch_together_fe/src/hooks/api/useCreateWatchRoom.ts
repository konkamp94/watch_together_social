import { AxiosError } from "axios";
import socialService from "../../services/social.service";
import useApiErrorHandling from "../useApiErrorHandling";
import { useMutation } from "react-query";

const useCreateWatchRoom = (onSuccess: () => void) => {
    const [error, handleApiError] = useApiErrorHandling();


    const { mutate, isLoading } = useMutation(socialService.createWatchRoom, {
        onSuccess: () => {
            if (onSuccess) { onSuccess() }
        },
        onError: (error: AxiosError) => {
            handleApiError(error);
        }
    });

    return {
        createWatchRoom: mutate,
        error,
        isLoading
    };
}

export default useCreateWatchRoom