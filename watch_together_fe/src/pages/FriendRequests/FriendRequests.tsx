import useScreenSize from "../../hooks/useSreenSize"
import useGetFriendRequests from "../../hooks/api/useGetFriendRequests"
import { Box, Typography } from "@mui/material"
import OtherUserList from "../../components/other-user/OtherUserList"
import ContentHeader from "../../components/content-header/ContentHeader"

const FriendRequests = () => {
    const { isDesktop, isTablet } = useScreenSize()
    const { otherUsers, isLoadingOtherUsers, error } = useGetFriendRequests()

    return (<>
        <Box sx={{padding: isDesktop ? '0 192px' : isTablet ? '0 64px' : 0}}>
            {isLoadingOtherUsers ? <p>Loading...</p> : null}
            {error && <p>{error.message}</p>}
            {!isLoadingOtherUsers && otherUsers && otherUsers.data.length !== 0 && <ContentHeader text='Friend Requests'/>}
            {!isLoadingOtherUsers && otherUsers && <OtherUserList otherUsers={otherUsers.data}/>}
            {!isLoadingOtherUsers && otherUsers.data.length === 0 && <Typography sx={{ color: 'primary.contrastText' }}>There is no Friend Requests</Typography>}
        </Box>
    </>)
}

export default FriendRequests