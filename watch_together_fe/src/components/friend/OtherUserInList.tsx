import { Avatar, Box, Typography } from "@mui/material"
import { OtherUser } from "../../services/api.interfaces"
import FriendshipActionButton from "./FriendshipActionButton"

const OtherUserInList = ({ otherUser }: { otherUser: OtherUser }) => {

    return (
        <>
            {/* <Grid container spacing={2} className='grid-container-custom' sx={{backgroundColor: 'primary.main', borderRadius: '8px', padding: '16px'}}>
                <Grid item xs={3} sm={2} md={2} sx={{padding: 0}}>
                        <Avatar>{friend.username.charAt(0).toUpperCase()}</Avatar>
                </Grid>
                <Grid item xs={6} sm={8} md={4} sx={{padding: 0, color: 'primary.contrastText'}}>
                        <Typography variant="body2">{friend.name} Kostantinos Kampourelis</Typography>
                        <Typography variant="body2">{friend.username}</Typography>
                </Grid>
                <Grid item sx={{padding: 0}} xs={3} sm={2} md={6}>
                    <button>Add friend</button>
                </Grid>
            </Grid> */}
            <Box display="flex" sx={{backgroundColor: 'primary.main', borderRadius: '8px', padding: '16px', marginBottom: '8px', color: 'primary.contrastText'}}>
                <Box flex={0.5}>
                    <Avatar>{otherUser.username.charAt(0).toUpperCase()}</Avatar>
                </Box>
                <Box flex={3}>
                        <Typography sx={{fontWeight: 'bold'}} variant="body2">{otherUser.name} Konstantinos Kampourelis</Typography>
                        <Typography sx={{fontWeight: 'bold'}} variant="body2">{otherUser.username}</Typography>
                </Box>
                <Box flex={1.5}>
                    <FriendshipActionButton otherUserId={otherUser.id} friendshipInfo={otherUser.friendshipInfo}/>
                </Box>
            </Box>
        </>
    )
}

export default OtherUserInList