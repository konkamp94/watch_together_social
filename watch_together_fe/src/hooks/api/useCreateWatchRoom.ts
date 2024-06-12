import { AxiosError } from "axios";
import socialService from "../../services/social.service";
import useApiErrorHandling from "../useApiErrorHandling";
import { useMutation } from "react-query";

const useCreateWatchRoom = (onSuccess: (code: string) => void) => {
    const [error, handleApiError] = useApiErrorHandling();


    const { mutate, isLoading } = useMutation(socialService.createWatchRoom, {
        onSuccess: (response) => {
            if (onSuccess) { onSuccess(response.data.code) }
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