import { Box } from "@mui/material";
import { OtherUser } from "../../services/api.interfaces"
import OtherUserInListInvitationForm from "./OtherUserInListInvitationForm";

const OtherUserListInvitationForm = ({ otherUsers, invitedFriends, formAction }: { otherUsers: OtherUser[], invitedFriends: number[] | undefined, formAction: (friendId: number) => void }) => {
    return (
        <Box sx={{marginTop: '16px'}}>
            {otherUsers.map(otherUser => <OtherUserInListInvitationForm key={otherUser.id} otherUser={otherUser} 
                        isInvited={invitedFriends ? invitedFriends.includes(otherUser.id) : false} formAction={formAction} />)}
        </Box>
    )

}

export default OtherUserListInvitationForm