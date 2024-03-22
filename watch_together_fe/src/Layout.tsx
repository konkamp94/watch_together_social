import { Outlet } from "react-router-dom"
import LeftBar from "./components/left-bar/LeftBar"
import NavBar from "./components/nav-bar/NavBar"
import RightBar from "./components/right-bar/RightBar"
import { Box } from "@mui/material"
const Layout = () => {
    return (
        <>
            <NavBar/>
            <Box sx={{display: 'flex', justifyContent: 'space-between', backgroundColor: 'primary.dark', minHeight: '100vh'}}>
                <LeftBar/>
                <Box sx={{flex: 3, padding: '16px'}}>
                    <Outlet/>
                </Box>
                <RightBar/>
            </Box>
        </>
    ) 
}

export default Layout