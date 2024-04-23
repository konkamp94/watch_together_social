import { Outlet } from "react-router-dom"
import LeftBar from "./components/left-bar/LeftBar"
import NavBar from "./components/nav-bar/NavBar"
import RightBar from "./components/right-bar/RightBar"
import { Box } from "@mui/material"
import { useState } from "react"

const Layout = () => {
    const [activeButtonId, setActiveButtonId] = useState('home')
    
    return (
        <>
            <NavBar activeButtonId={activeButtonId} setActiveButtonId={setActiveButtonId}/>
            <Box sx={{display: 'flex', justifyContent: 'space-between', backgroundColor: 'primary.dark', minHeight: '100vh'}}>
                <LeftBar activeButtonId={activeButtonId} setActiveButtonId={setActiveButtonId}/>
                <Box sx={{flex: 3, padding: '16px'}}>
                    <Outlet/>
                </Box>
                <RightBar/>
            </Box>
        </>
    ) 
}

export default Layout