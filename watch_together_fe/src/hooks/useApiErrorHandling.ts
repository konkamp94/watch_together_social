import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/useAuth";
import { useState } from "react";
import { AxiosError } from "axios";


const useApiErrorHandling = (): [{ message: string, status: number } | null, (error: AxiosError) => void] => {
    const [error, setError] = useState<{ message: string, status: number } | null>(null)
    const { logout } = useAuth()
    const navigate = useNavigate()

    const handleApiError = (error: AxiosError) => {
        if (error?.response?.status === 401) {
            //TODO refresh token login
            logout()
            navigate('/login')
        } else if (error?.response?.status === 403) {
            setError({ message: 'You cannot access this route', status: error.response.status })
        } else if (error?.response?.status === 500) {
            setError({ message: 'Something went wrong, please try again later', status: error.response.status })
        } else {
            console.log(error)
            console.log(error?.response?.data)
            // error.response ? setError(error?.response?.data?.message || 'Unknown error occurred')
            //     : setError('Check your internet connection')
        }
    }

    return [error, handleApiError]
}

export default useApiErrorHandling;