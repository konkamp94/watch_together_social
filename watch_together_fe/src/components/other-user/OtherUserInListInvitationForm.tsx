import { Avatar, Box, Typography } from "@mui/material"
import { OtherUser } from "../../services/api.interfaces"
import RoomInvitationButton from "../action-buttons/RoomInvitationButton"

const OtherUserInListInvitationForm = ({ otherUser, isInvited, formAction }: { otherUser: OtherUser, isInvited: boolean, formAction: (friendId: number) => void }) => {

    return (
        <>
            <Box display="flex" sx={{backgroundColor: 'primary.dark', borderRadius: '8px', padding: '16px', marginBottom: '8px', color: 'primary.contrastText'}}>
                <Box flex={0.5}>
                    <Avatar>{otherUser.username.charAt(0).toUpperCase()}</Avatar>
                </Box>
                <Box flex={3}>
                        <Typography sx={{fontWeight: 'bold'}} variant="body2">{otherUser.name}</Typography>
                        <Typography sx={{fontWeight: 'bold'}} variant="body2">{otherUser.username}</Typography>
                </Box>
                <Box flex={1.5}>
                    <RoomInvitationButton friendId={otherUser.id} action={formAction} isInvitedValue={isInvited}/>
                </Box>
            </Box>
        </>
    )
}

export default OtherUserInListInvitationForm