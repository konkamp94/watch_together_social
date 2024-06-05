import { Button } from "@mui/material"
import { useState } from "react"

const RoomInvitationButton = ({ friendId, isInvitedValue, action }: {friendId:number, isInvitedValue: boolean, action: (friendId: number) => void}) => {
    const [isInvited, setIsInvited] = useState(isInvitedValue)

    return <Button  variant="contained" sx={{width:'100%', backgroundColor: 'primary.main', '&:hover': {backgroundColor: 'primary.light'}}}
                    disabled={isInvited}
                    onClick={() => { action(friendId), setIsInvited(true) }}>{!isInvited ? "Invite" : "Invited"}</Button>
}

export default RoomInvitationButton