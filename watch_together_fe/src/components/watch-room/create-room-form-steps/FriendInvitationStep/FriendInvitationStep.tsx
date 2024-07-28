import { Box } from "@mui/material"
import useGetFriends from "../../../../hooks/api/useGetFriends"
import useScreenSize from "../../../../hooks/useSreenSize"
import OtherUserListInvitationForm from "../../../other-user/OtherUserListInvitationForm"

const FriendInvitationStep = ({ invitedFriends, formAction }: { invitedFriends: number[] | undefined, formAction: (friendId: number) => void}) => {
    const { friends } = useGetFriends()
    const { isDesktop, isTablet } = useScreenSize()
    
    return (friends &&
        <Box sx={{padding: isDesktop ? '0 192px' : isTablet ? '0 64px' : 0}}>
            <OtherUserListInvitationForm otherUsers={friends} formAction={formAction} invitedFriends={invitedFriends}/>
        </Box> )
}


export default FriendInvitationStep