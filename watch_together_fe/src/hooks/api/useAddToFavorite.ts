import useApiErrorHandling from "../useApiErrorHandling";
import { useMutation, useQueryClient } from 'react-query';
import { AxiosError } from "axios";
import tmdbProxyService from "../../services/tmdb-proxy.service";
import { useAuth } from "../context/useAuth";

const useAddOrRemoveFavorite = (onSuccess: (() => void) | null = null) => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [errorMessage, handleApiError] = useApiErrorHandling();

    if (!user) {
        throw new Error('User must be logged in to add to favorites');
    }

    const addOrRemoveFavorite = ({ movieId, isFavorite }: { movieId: number, isFavorite: boolean }) => {
        const tmdbProxyBody = {
            uri: `/account/${user.tmdbId}/favorite`,
            method: 'POST',
            body: { media_type: 'movie', media_id: movieId, favorite: isFavorite }
        }
        return tmdbProxyService.accessTmdbApi(tmdbProxyBody);
    }

    const { mutate, isLoading } = useMutation(addOrRemoveFavorite, {
        onSuccess: () => {
            queryClient.invalidateQueries('favorites');
            queryClient.invalidateQueries('recommended-movies-account-states')
            if (onSuccess) { onSuccess() }
        },
        onError: (error: AxiosError) => {
            handleApiError(error);
        }
    });

    return {
        addOrRemoveFavorite: mutate,
        errorMessage,
        isLoading
    };
};

export default useAddOrRemoveFavorite;