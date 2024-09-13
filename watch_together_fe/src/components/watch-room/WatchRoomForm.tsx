import { Box, Typography } from "@mui/material"
import CustomStepper from "../stepper/CustomStepper"
import MovieSelectionStep from "./create-room-form-steps/MovieSelectionStep/MovieSelectionStep"
import { useEffect, useState } from "react"
import FriendInvitationStep from "./create-room-form-steps/FriendInvitationStep/FriendInvitationStep"
import useCreateWatchRoom from "../../hooks/api/useCreateWatchRoom"
import { useNavigate } from "react-router-dom"
import CustomSnackBar from "../snack-bar/CustomSnackBar"

const WatchRoomForm = () => {
    const navigate = useNavigate()
    const [formValue, setFormValue] = useState<{movieId?: number, movieTitle?: string, friendIds?: number[]}>({})
    const [steps, setSteps] = useState<{stepLabel: string, isCompleted: boolean}[]>([
        {stepLabel: 'Search and Select movie', isCompleted: false},
        {stepLabel: 'Invite Friends', isCompleted: false},
        {stepLabel: 'Create Watch Room', isCompleted: false},
    ])
    const {createWatchRoom, error} = useCreateWatchRoom((code:string) => navigate(`/watch-room/${code}`))
    const [snackBar, setSnackBar] = useState<JSX.Element | null>(null)

    useEffect(() => {
        setSteps((prevSteps) => {
            const updatedSteps = [...prevSteps]
            if(formValue?.movieId && formValue?.movieTitle) {
                updatedSteps[0] = {...prevSteps[0], isCompleted: true}
            } 
            if(formValue?.friendIds && formValue.friendIds.length !== 0) {
                updatedSteps[1] = {...prevSteps[1], isCompleted: true}
            }
            return updatedSteps
        })
        console.log(formValue)
    }, [formValue, setSteps])

    useEffect(() => {
        if(error) {
            setSnackBar(<CustomSnackBar isOpen={true} message={error.message} closeSnackBar={closeSnackBar}/>)
        }
    }, [error])

    const closeSnackBar = (_event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackBar(null)
    }

    const stepComponents = [
            <MovieSelectionStep 
                selectedMovieId={formValue?.movieId}
                selectedMovieTitle={formValue?.movieTitle} 
                formAction={(movieInfo) => setFormValue((formValue) => 
                    ({ ...formValue, movieId: movieInfo.movieId, movieTitle: movieInfo.movieTitle })
                )}
            />,
            <FriendInvitationStep 
                invitedFriends={formValue?.friendIds}
                formAction={(friendId: number) => setFormValue(formValue => {
                    if(formValue.friendIds) { 
                        formValue.friendIds.push(friendId) 
                    } else {
                        formValue.friendIds = []
                        formValue.friendIds.push(friendId) 
                    }
                    return ({...formValue})
                })
            }
            />,
            <Typography variant="body1" sx={{color: 'primary.contrastText'}}>Click finish when you are ready!</Typography>
    ]

    return (<Box sx={{ backgroundColor: 'primary.main', padding: 3, marginTop: '16px'}}>
        <CustomStepper steps={steps} 
                      stepComponents={stepComponents} 
                      formAction={() => createWatchRoom({ 
                                    movieId: formValue.movieId as number, 
                                    movieTitle: formValue.movieTitle as string,
                                    invitedUsersIds: formValue.friendIds as number[]
                                 })}
        />
        {snackBar}
    </Box>)
}

export default WatchRoomForm