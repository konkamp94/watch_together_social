import { Box } from "@mui/material"
import CustomStepper from "../stepper/CustomStepper"
import MovieSelectionStep from "./create-room-form-steps/MovieSelectionStep/MovieSelectionStep"
import { useEffect, useState } from "react"

const WatchRoomForm = () => {
    const [formValue, setFormValue] = useState<{movieId?: number, movieTitle?: string, friendIds?: number[]}>({})
    const [steps, setSteps] = useState<{stepLabel: string, isCompleted: boolean}[]>([
        {stepLabel: 'Search and Select movie', isCompleted: false},
        {stepLabel: 'Invite Friends', isCompleted: false},
        {stepLabel: 'Create Watch Room', isCompleted: false},
    ])
  

    useEffect(() => {
        setSteps((prevSteps) => {
            const updatedSteps = [...prevSteps]
            if(formValue?.movieId && formValue?.movieTitle) {
                updatedSteps[0] = {...prevSteps[0], isCompleted: true}
            } 
            if(formValue?.friendIds && formValue.friendIds.length !== 0) {
                updatedSteps[1] = {...prevSteps[0], isCompleted: true}
            }
            return updatedSteps
        })
    }, [formValue, setSteps])

    const stepComponents = [
        <Box sx={{padding: '16px'}}>
        <MovieSelectionStep 
            selectedMovieId={formValue?.movieId}
            selectedMovieTitle={formValue?.movieTitle} 
            formAction={(movieInfo) => setFormValue((formValue) => 
                ({ ...formValue, movieId: movieInfo.movieId, movieTitle: movieInfo.movieTitle })
            )}
        />
    </Box>
    ]

    return (<Box sx={{ backgroundColor: 'primary.main', padding: 3, marginTop: '16px'}}>
        <CustomStepper steps={steps} stepComponents={stepComponents}/>
    </Box>)
}

export default WatchRoomForm