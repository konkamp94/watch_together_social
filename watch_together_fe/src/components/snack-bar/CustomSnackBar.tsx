import { IconButton, Snackbar } from "@mui/material";
import  CloseIcon from "@mui/icons-material/Close";

const CustomSnackBar = ({ isOpen, message, closeSnackBar } : { isOpen: boolean, message: string | null, closeSnackBar: (event: React.SyntheticEvent | Event, reason?: string) => void} ) => {

    return (
    <Snackbar
                open={isOpen}
                autoHideDuration={2000}
                onClose={closeSnackBar}
                message={message}
                action={<IconButton
                    size="small"
                    aria-label="close"
                    color="inherit"
                    onClick={closeSnackBar}
                >
                    <CloseIcon fontSize="small" />
                </IconButton>} 
                />
    )
}

export default CustomSnackBar