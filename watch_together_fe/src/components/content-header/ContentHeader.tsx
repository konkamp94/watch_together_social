import { Typography } from "@mui/material"
import './ContentHeader.css'

const ContentHeader = ({text}: {text: string}) => {  
    return (
        <Typography variant="h4" component="h1" className="content-header" 
            sx={{color: 'primary.contrastText', borderLeft: '4px solid', borderColor: 'primary.contrastText', paddingLeft: '4px'}}>
            <span>{text}</span>
        </Typography>
    ) 
}

export default ContentHeader