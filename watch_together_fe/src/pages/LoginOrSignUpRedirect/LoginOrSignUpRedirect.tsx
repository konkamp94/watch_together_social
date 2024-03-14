import { useQuery } from "react-query"
import authenticationService from "../../services/authentication.service"
import { useAuth } from "../../hooks/context/useAuth"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useEffect } from "react"
import CircularProgress from '@mui/material/CircularProgress';
import Box from "@mui/material/Box"

const LoginOrSignUpRedirect = () => {
    const navigate = useNavigate();
    const authContect = useAuth();
    const [params] = useSearchParams();
    const requestToken = params.get('request_token')
    const approved = params.get('approved')

    if (!requestToken || !approved) {
        navigate('/login')
    }

    console.log(requestToken, approved)

    const {isLoading, refetch: signUpOrLogin} = 
                useQuery('tokens', 
                    () => authenticationService.signUpOrLogin(requestToken as string), 
                    {  
                        onSuccess: (response) => { 
                            authContect.login(response.data.accessToken, response.data.refreshToken) 
                            navigate('/main-content') 
                        }, 
                       onError: () => navigate('/login'),
                       enabled: false})

    useEffect(() => {
        if( approved === 'true' ) {
            signUpOrLogin()
        }
    }, [approved, signUpOrLogin, navigate])

    return (<Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            {isLoading ? <CircularProgress size='6rem' /> : null}
        </Box>)

}

export default LoginOrSignUpRedirect