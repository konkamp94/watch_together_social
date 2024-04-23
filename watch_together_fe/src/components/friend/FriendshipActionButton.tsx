import { useEffect, useState } from "react"
import { FriendshipInfo } from "../../services/api.interfaces"
import useAddFriend from "../../hooks/api/useAddFriend"
import { Button } from "@mui/material"
import { useAuth } from "../../hooks/context/useAuth";
import useAcceptOrRejectFriend from "../../hooks/api/useAcceptOrRejectFriend";
import CustomSnackBar from "../snack-bar/CustomSnackBar";

interface FriendshipActionButtonConfig { 
    isAcceptRejectCase: boolean, 
    button1Label: string | null, 
    button2Label: string | null, 
    button1Action: () => void,
    button2Action: () => void
}

const FriendshipActionButton = ({ otherUserId, friendshipInfo }: {otherUserId: number, friendshipInfo: FriendshipInfo | null}) => {
    const { user } = useAuth()
    if (!user) {
        throw new Error('User must be logged in');
    }

    const [friendshipInfoState, setFriendshipInfoState] = useState(friendshipInfo)
    const [actionButtonConfig, setActionButtonConfig] = useState<FriendshipActionButtonConfig | null>(null)
    const { addFriend, errorAddFriend, isLoadingAddFriend, } = useAddFriend((friendshipInfo) => { 
        setFriendshipInfoState(friendshipInfo)
    })
    const { acceptOrRejectFriend, errorAcceptOrReject, isLoadingAcceptOrReject } 
          = useAcceptOrRejectFriend((friendshipInfo) => setFriendshipInfoState(friendshipInfo))
    const [snackBar, setSnackBar] = useState<JSX.Element | null>(null)

    useEffect(() => {

        const config: FriendshipActionButtonConfig = { 
            isAcceptRejectCase: false, 
            button1Label: null, 
            button2Label: null,
            button1Action: () => addFriend({otherUserId, userId: user.userId}),
            button2Action: () => {}
        }

        if(!friendshipInfoState) {
            config['button1Label'] = 'Add Friend'
            setActionButtonConfig(config)
        }
        
        // check if friendship info is not null for ts error
        if(friendshipInfoState) {
            switch(friendshipInfoState.status) {
                case 'PENDING':
                    if(friendshipInfoState.isRequesterUser) { 
                        config['button1Label'] = 'Pending Request' 
                    } else {
                        config['isAcceptRejectCase'] = true
                        config['button1Label'] = 'Accept Friend' 
                        config['button2Label'] = 'Reject Friend'
                        config['button1Action'] = () => acceptOrRejectFriend({friendshipId: friendshipInfoState.id, status: 'ACCEPTED'})
                        config['button2Action'] = () => acceptOrRejectFriend({friendshipId: friendshipInfoState.id, status: 'REJECTED'})
                    }
                    break;
                case 'ACCEPTED':
                    config['button1Label'] = 'Already Friends' 
                    break;
                case 'REJECTED':
                    config['button1Label'] = 'Add Friend'
                    break;
            }
            setActionButtonConfig(config)
        }

    }, [friendshipInfoState, user, otherUserId, setActionButtonConfig, acceptOrRejectFriend, addFriend])

    useEffect(() => {
        if(errorAddFriend) {
            setSnackBar(<CustomSnackBar isOpen={true} message={errorAddFriend.message} closeSnackBar={closeSnackBar}/>)
        }
    }, [errorAddFriend])

    useEffect(() => {
        if(errorAcceptOrReject) {
            setSnackBar(<CustomSnackBar isOpen={true} message={errorAcceptOrReject.message} closeSnackBar={closeSnackBar}/>)
        }
    }, [errorAcceptOrReject])

    
    const closeSnackBar = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackBar(null)
    }

    return (<>  
                {actionButtonConfig && !actionButtonConfig.isAcceptRejectCase ? 
                    <Button 
                        variant="contained" 
                        sx={{width:'100%', backgroundColor: 'primary.dark', '&:hover': {backgroundColor: 'primary.light'}}}
                        disabled={(friendshipInfoState?.status === 'PENDING' && friendshipInfoState?.isRequesterUser) 
                                    || friendshipInfoState?.status === 'ACCEPTED'}
                        onClick={actionButtonConfig.button1Action}
                    >   
                        {actionButtonConfig.button1Label}
                    </Button>
                : actionButtonConfig  &&
                    <>
                        <Button 
                            variant="contained" 
                            sx={{width:'100%', backgroundColor: 'primary.dark', '&:hover': {backgroundColor: 'primary.light'}}}
                            onClick={actionButtonConfig.button1Action}
                        >   
                            {actionButtonConfig.button1Label}
                        </Button>
                        <Button 
                        variant="contained" 
                        sx={{width:'100%', backgroundColor: 'primary.dark', '&:hover': {backgroundColor: 'primary.light'}}}
                        onClick={actionButtonConfig.button2Action}
                        >   
                            {actionButtonConfig.button2Label}
                        </Button>
                    </>}
                    {/* error message snack bar */}
                    {snackBar}
    </>)
}

export default FriendshipActionButton