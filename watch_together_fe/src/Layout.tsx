import { Outlet, useLocation } from "react-router-dom"
import LeftBar from "./components/left-bar/LeftBar"
import NavBar from "./components/nav-bar/NavBar"
import RightBar from "./components/right-bar/RightBar"
import { Box } from "@mui/material"
import { useEffect, useState } from "react"
import useMetadata from './hooks/context/useMetadata'
import { useNotifications } from "./hooks/context/useNotifcations"

const Layout = ({ withLeftBar = true, withRightBar= true }: {withLeftBar?: boolean, withRightBar?: boolean}) => {
    const location = useLocation()
    const [activeButtonId, setActiveButtonId] = useState('home')
    const { genres } = useMetadata()
    const { notifications } = useNotifications()

    useEffect(() => {
        const mapRouteNameToActiveButtonId: { [key: string]: string } = {
            '/home': 'home',
            '/favorites': 'favorite',
            '/watchlist': 'watchlist',
            '/watch-movies/create-room': 'watch-movies',
            '/watch-movies/join-room': 'watch-movies',
            '/find-movies': 'find-movies',
            '/find-friends': 'find-friends',
            '/friend-requests': 'friend-requests'
        }
        const pathName = location.pathname as string
        setActiveButtonId(mapRouteNameToActiveButtonId[pathName] ?? '')
    }, [location, setActiveButtonId])
    
    return (
        <>
        {genres && notifications? 
            <Box sx={{ minHeight: '100vh', backgroundColor: 'primary.dark'}}>
                <NavBar activeButtonId={activeButtonId} setActiveButtonId={setActiveButtonId}/>
                <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                    {withLeftBar && <LeftBar activeButtonId={activeButtonId} setActiveButtonId={setActiveButtonId}/>}
                    <Box sx={{flex: !withLeftBar && !withRightBar ? 1 : 3, padding: '16px'}}>
                        <Outlet/>
                    </Box>
                    {withRightBar && <RightBar/>}
                </Box>
            </Box> 
            : null
        }
        </>
    ) 
}

export default Layout