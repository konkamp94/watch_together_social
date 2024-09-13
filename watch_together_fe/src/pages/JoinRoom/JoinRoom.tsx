import { Button, Grid, TextField } from "@mui/material"
import { useEffect, useState } from "react"
import { useNavigate,useSearchParams } from "react-router-dom"

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
                <TextField sx={{ input: { color: 'primary.contrastText'},
                                "& .MuiInput-underline:after": {
                                    borderBottomColor: 'primary.contrastText'
                                },
                                '& .Mui-focused': {
                                    color: 'primary.contrastText'
                                }
                                }}
                id="room-code-input" value={codeInputValue} onChange={(event) => setCodeInputValue(event.target.value)} fullWidth label="Enter your Room Code" variant="standard" />
            </Grid>
            <Grid item xs={6}>
                <Button sx={{height: '100%', 
                            width:'100%', 
                            backgroundColor: 'primary.dark',
                            color: 'primary.contrastText',
                            '&:hover': { backgroundColor: 'primary.light' }
                        }}
                        onClick={() => navigate(`/watch-room/${codeInputValue}`)}
                >
                    Join Room
                </Button>
            </Grid>
        </Grid>
    )
}

export default JoinRoom