import { Avatar, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material"
import { FriendRequestNotification, Notification, WatchRoomNotification } from "../../context/interfaces.context"
import { useNavigate } from "react-router-dom"

const NotificationInList = ({ notification, setOpen }: {notification: Notification, setOpen: (open: boolean) => void}) => {
    const navigate = useNavigate()
    const renderItem = () => {
        switch(notification.type) {
            case 'FRIEND REQUEST': {
                const friendRequestNotification = notification as FriendRequestNotification
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
                                    friendRequestNotification.friendRequest.requesterUser.username.charAt(0).toUpperCase()
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
                                        {`User ${friendRequestNotification.friendRequest.requesterUser.username} has just sent you a friend request`}
                                    </Typography>
                            }
                            />
                        </ListItem>)
            }
            case 'WATCH_ROOM_INVITE': {
                const watchRoomNotification = notification as WatchRoomNotification
                return (
                    <ListItem alignItems="flex-start" 
                        onClick={() => {setOpen(false), 
                                        navigate(`/watch-movies/join-room`)}}
                        sx={{
                            cursor: 'pointer',
                            '&:hover': {
                                backgroundColor: 'primary.dark'
                            }
                    }}>
                        <ListItemAvatar>
                            <Avatar>{
                                watchRoomNotification.watchRoom.creatorUser.username.charAt(0).toUpperCase()
                            }</Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary="Watch Movie Invitation"
                            secondary={(<>
                                        <Typography
                                            sx={{ display: 'inline' }}
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            {`User ${watchRoomNotification.watchRoom.creatorUser.username} 
                                            has invited to watch together the movie with title ${watchRoomNotification.watchRoom.movieTitle}`}
                                            
                                        </Typography>
                                        <br/>
                                        <Typography
                                            sx={{ display: 'inline' }}
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            {`The code for joining the room is ${watchRoomNotification.watchRoom.code}`}
                                        </Typography>
                                    </>)
                            }
                        />

                    </ListItem>
                )
            }
        }
    }

    return renderItem()
}

export default NotificationInList