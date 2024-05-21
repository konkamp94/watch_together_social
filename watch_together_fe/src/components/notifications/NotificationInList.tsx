import { Avatar, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material"
import { Notification } from "../../context/interfaces.context"
import { useNavigate } from "react-router-dom"

const NotificationInList = ({ notification, setOpen }: {notification: Notification, setOpen: (open: boolean) => void}) => {
    const navigate = useNavigate()
    const renderItem = () => {
        switch(notification.type) {
            case 'FRIEND REQUEST':
                return ( <ListItem alignItems="flex-start" 
                onClick={() => {setOpen(false), 
                                navigate('/friend-requests')}}
                sx={{
                    cursor: 'pointer',
                    '&:hover': {
                        backgroundColor: 'primary.dark'
                    }
                }}>
                            <ListItemAvatar>
                                <Avatar>{
                                    notification.friendRequest.requesterUser.username.charAt(0).toUpperCase()
                                }</Avatar>
                            </ListItemAvatar>
                            <ListItemText
                            primary="Friend Request"
                            secondary={
                                    <Typography
                                        sx={{ display: 'inline' }}
                                        component="span"
                                        variant="body2"
                                        color="text.primary"
                                    >
                                        {`User ${notification.friendRequest.requesterUser.username} has just sent you a friend request`}
                                    </Typography>
                            }
                            />
                        </ListItem>)
        }
    }

    return renderItem()
}

export default NotificationInList