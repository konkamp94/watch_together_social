import { Box, Button} from '@mui/material/'
import tmdbLogo from '../../assets/tmdb_logo.svg'
import watchTogetherLogo from '../../assets/watch-together-logo-cats.png'
import './Login.css'
import authenticationService from '../../services/authentication.service'
import { useQuery } from 'react-query'
import { AxiosError } from 'axios'

const Login = () => {
    
    const {   refetch: getTmdbRequestToken } =  useQuery('tmdb-request-token', 
                    authenticationService.getTmdbRequestToken, 
                    { enabled: false,
                      onSuccess: (response) => {window.location.href = response.data.redirectUrl},
                      onError: (error: AxiosError) =>  { throw error }
                    })


    const onLoginOrSignUp = async () => {
        await getTmdbRequestToken()
    }

    return (
        <Box
            display="flex"
            justifyContent="center"
            minHeight="100vh"
            sx={{
                backgroundColor: 'primary.dark'
            }}
        >
            <Box display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    minHeight="100vh"
                >
                    <img src={watchTogetherLogo} style={{ flex:0, marginBottom: '8px'}} alt="" />
                    <Button fullWidth variant="contained" style={{textAlign: 'center'}} onClick={onLoginOrSignUp}>
                        <span style={{marginTop:'3px'}}>Sign Up or Login with&nbsp;&nbsp;</span> <img src={tmdbLogo} width={100} height={25} />
                    </Button>
            </Box>
        </Box>
    )
}

export default Login