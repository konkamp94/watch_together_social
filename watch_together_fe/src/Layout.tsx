import { Outlet } from "react-router-dom"
import LeftBar from "./components/left-bar/LeftBar"
import NavBar from "./components/nav-bar/NavBar"
import RightBar from "./components/right-bar/RightBar"

const Layout = () => {
    return (
        <>
            <NavBar></NavBar>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <LeftBar/>
                <Outlet></Outlet>
                <RightBar/>
            </div>
        </>
    ) 
}

export default Layout