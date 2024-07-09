import { Box } from "@mui/material";
import { OtherUser } from "../../services/api.interfaces";
import OtherUserInList from "./OtherUserInList";

const OtherUserList = ({ otherUsers }: { otherUsers: OtherUser[] }) => {
    return (
        <Box sx={{marginTop: '16px'}}>
            {otherUsers.map(otherUser => <OtherUserInList otherUser={otherUser}/>)}
        </Box>
    )

}

export default OtherUserList