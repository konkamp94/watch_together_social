import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/useAuth";
import { useState } from "react";
import { AxiosError } from "axios";


const useApiErrorHandling = (): [string | null, (error: AxiosError) => void] => {
    const [error, setError] = useState<string | null>(null)
    const { logout } = useAuth()
    const navigate = useNavigate()

    const handleApiError = (error: AxiosError) => {
        if (error?.response?.status === 401) {
            //TODO refresh token login
            logout()
            navigate('/login')
        } else if (error?.response?.status === 500) {
            setError('Something went wrong, please try again later')
        } else {
            console.log(error?.response?.data)
            // error.response ? setError(error?.response?.data?.message || 'Unknown error occurred')
            //     : setError('Check your internet connection')
        }
    }

    return [error, handleApiError]
}

export default useApiErrorHandling;