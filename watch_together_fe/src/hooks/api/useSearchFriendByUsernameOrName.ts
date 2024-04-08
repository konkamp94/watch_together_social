import { useQuery } from "react-query"
import { useAuth } from "../context/useAuth"
import useApiErrorHandling from "../useApiErrorHandling"
import { AxiosError } from "axios"
import socialService from "../../services/social.service"
import { useState } from "react"

const useSearchOtherUsersByUsernameOrName = () => {
    const { user } = useAuth()
    const [errorMessage, handleApiError] = useApiErrorHandling()
    const [searchKeyword, setSearchKeyword] = useState("")

    if (!user) {
        throw new Error('User must be logged in to search for friends');
    }

    const { data: otherUsers, isLoading: isLoadingOtherUsers, refetch: refetchSearchOtherUsersByUsernameOrName } = useQuery(['search-friends', searchKeyword],
        () => socialService.searchFriends(searchKeyword), {
        onError: (error: AxiosError) => handleApiError(error),
        enabled: !!searchKeyword
    })

    return { otherUsers, isLoadingOtherUsers, errorMessage, refetchSearchOtherUsersByUsernameOrName, searchKeyword, setSearchKeyword }
}

export default useSearchOtherUsersByUsernameOrName