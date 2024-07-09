import { Button, Grid, TextField } from "@mui/material"
import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"

const JoinRoom = () => {
    const [params] = useSearchParams()
    const [codeInputValue, setCodeInputValue] = useState(params.get('code') ?? null)
    const navigate = useNavigate()

    useEffect(() => {
        setCodeInputValue(params.get('code') ?? null)
    }, [params])

    return (
        <Grid container 
              justifyContent={'center'} 
              sx={{backgroundColor: 'primary.main', padding: '16px', borderRadius: '8px', marginTop: '16px'}}>
            <Grid item xs={6}>
                <TextField id="room-code-input" value={codeInputValue} onChange={(event) => setCodeInputValue(event.target.value)} fullWidth label="Enter your Room Code" variant="standard" />
            </Grid>
            <Grid item xs={6}>
                <Button sx={{height: '100%', 
                            width:'100%', 
                            backgroundColor: 'primary.dark', 
                            '&:hover': {backgroundColor: 'primary.light'}}}
                        onClick={() => navigate(`/watch-room/${codeInputValue}`)}
                >
                    Join Room
                </Button>
            </Grid>
        </Grid>
    )
}

export default JoinRoom