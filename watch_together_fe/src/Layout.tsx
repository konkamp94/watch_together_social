import { Outlet } from "react-router-dom"
import LeftBar from "./components/left-bar/LeftBar"
import NavBar from "./components/nav-bar/NavBar"
import RightBar from "./components/right-bar/RightBar"
import { Box } from "@mui/material"
import { useState } from "react"
import useMetadata from './hooks/context/useMetadata'
import { useNotifications } from "./hooks/context/useNotifcations"

const Layout = () => {
    const [activeButtonId, setActiveButtonId] = useState('home')
    const { genres } = useMetadata()
    const { notifications } = useNotifications()
    
    return (
        <>
        {genres && notifications? 
            <Box sx={{ minHeight: '100vh', backgroundColor: 'primary.dark'}}>
                <NavBar activeButtonId={activeButtonId} setActiveButtonId={setActiveButtonId}/>
                <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                    <LeftBar activeButtonId={activeButtonId} setActiveButtonId={setActiveButtonId}/>
                    <Box sx={{flex: 3, padding: '16px'}}>
                        <Outlet/>
                    </Box>
                    <RightBar/>
                </Box>
            </Box> 
            : null
        }
        </>
    ) 
}

export default Layout