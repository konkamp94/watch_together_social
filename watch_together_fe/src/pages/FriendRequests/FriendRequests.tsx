import useScreenSize from "../../hooks/useSreenSize"
import useGetFriendRequests from "../../hooks/api/useGetFriendRequests"
import { Box } from "@mui/material"
import OtherUserList from "../../components/friend/OtherUserList"

const FriendRequests = () => {
    const { isDesktop, isTablet } = useScreenSize()
    const { otherUsers, isLoadingOtherUsers, error } = useGetFriendRequests()
    
    return (<>
        <Box sx={{padding: isDesktop ? '0 192px' : isTablet ? '0 64px' : 0}}>
            {isLoadingOtherUsers ? <p>Loading...</p> : null}
            {error && <p>{error.message}</p>}
            {!isLoadingOtherUsers && otherUsers && <OtherUserList otherUsers={otherUsers.data}/>}
        </Box>
    </>)
}

export default FriendRequests