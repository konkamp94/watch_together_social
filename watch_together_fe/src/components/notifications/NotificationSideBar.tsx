import { Notification } from "../../context/interfaces.context"
import { Divider, Drawer, List, Typography } from "@mui/material"
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationInList from "./NotificationInList"
import useScreenSize from "../../hooks/useSreenSize"
import React from "react";

const NotificationSideBar = ({ notifications, open = true, setOpen }: {notifications: Notification[], open: boolean, setOpen: (open: boolean) => void}) => {
    const { isDesktop, isTablet } = useScreenSize()

    return (
        <Drawer open={open} anchor="right" variant="persistent" 
          sx={{
            '&.MuiDrawer-root .MuiDrawer-paper': { marginTop: '64px', borderWidth: 0, width: isDesktop ? '20%' : isTablet ? '40%' : '100%' , backgroundColor: 'primary.main', height: '93%', },
          }}>
            <List sx={{ height: '100%', width: '100%'}}>
            <Typography variant="h6" sx={{paddingLeft: '16px', color: 'primary.contrastText'}}> <NotificationsIcon sx={{position: 'relative', top: '5px'}} />Notifications</Typography>
            {   
                notifications.map(notification => (
                    <React.Fragment key={notification.id}>
                        <NotificationInList notification={notification} setOpen={setOpen}/>
                        <Divider variant="inset" component="li" />
                    </React.Fragment>
                )
                )
            }
            </List>
        </Drawer>
    )
}

export default NotificationSideBar