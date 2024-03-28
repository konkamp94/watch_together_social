import useApiErrorHandling from "../useApiErrorHandling";
import { useMutation, useQueryClient } from 'react-query';
import { AxiosError } from "axios";
import tmdbProxyService from "../../services/tmdb-proxy.service";
import { useAuth } from "../context/useAuth";

const useAddOrRemoveWatchlist = (onSuccess: (() => void) | null = null) => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [errorMessage, handleApiError] = useApiErrorHandling();

    if (!user) {
        throw new Error('User must be logged in to add to favorites');
    }

    const addOrRemoveWatchlist = ({ movieId, isWatchlist }: { movieId: number, isWatchlist: boolean }) => {
        const tmdbProxyBody = {
            uri: `/account/${user.tmdbId}/watchlist`,
            method: 'POST',
            body: { media_type: 'movie', media_id: movieId, watchlist: isWatchlist }
        }
        return tmdbProxyService.accessTmdbApi(tmdbProxyBody);
    }

    const { mutate, isLoading } = useMutation(addOrRemoveWatchlist, {
        onSuccess: () => {
            queryClient.invalidateQueries(['recommended-movies-account-states'])
            if (onSuccess) { onSuccess() }
        },
        onError: (error: AxiosError) => {
            handleApiError(error);
        }
    });

    return {
        addOrRemoveWatchlist: mutate,
        errorMessage,
        isLoading
    };
};

export default useAddOrRemoveWatchlist;