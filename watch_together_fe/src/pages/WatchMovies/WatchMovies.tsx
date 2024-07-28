import { Box, Tab, Tabs } from "@mui/material"
import CustomTabPanel from "../../components/tabs/CustomTabPanel"
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import WatchRoomForm from "../../components/watch-room/WatchRoomForm";
import JoinRoom from "../JoinRoom/JoinRoom";

const WatchMovies = () => {
    const location = useLocation();
    const { tab } = useParams();
    const navigate = useNavigate();
    // hide the 2 tabs in a different url path param
    const [tabValue, setTabValue] = useState(() => tab === 'create-room' ? 0 : tab === 'join-room' ? 1 : 2 );

    useEffect(() => {
        // This effect runs every time the location changes
        setTabValue(tab === 'create-room' ? 0 : tab === 'join-room' ? 1 : 2 )
    }, [location, tab]);

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
      if(newValue === 0) {
        navigate(`/watch-movies/create-room`, { replace: true });
      } else if (newValue === 1) {
        navigate(`/watch-movies/join-room`, { replace: true });
      }
    };

    return (<>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="Create Watch Room" id={`tab-0`} aria-controls={`tabpanel-0`} />
                <Tab label="Join Watch Room" id={`tab-1`} aria-controls={`tabpanel-1`}/>
            </Tabs>
        </Box>
        <CustomTabPanel value={tabValue} index={0}>
            <WatchRoomForm/>
        </CustomTabPanel>
        <CustomTabPanel value={tabValue} index={1}>
            <JoinRoom/>
        </CustomTabPanel>
    </>)
}

export default WatchMovies