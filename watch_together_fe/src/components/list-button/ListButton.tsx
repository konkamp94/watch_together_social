import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material"
import { ReactNode } from "react"

const ListButton = ({ label, icon, handleClick, isActive }: {label: string, icon: ReactNode, handleClick: () => void, isActive: boolean}) => {

    return (
        <ListItemButton
            key={label}
            className={isActive ? 'active-button' : ''}
            sx={{ 
                color: 'primary.contrastText', 
                '&:hover': {
                    color: 'primary.contrastText',
                    backgroundColor: 'primary.light',
                }, 
                borderRadius: '12px',
                marginBottom: '8px'
            }}
            onClick={handleClick}
        >
            <ListItemIcon sx={{ color: 'inherit' }}>
                {icon}
            </ListItemIcon>
            <ListItemText
                primary={label}
                primaryTypographyProps={{ fontSize: 14, fontWeight: 'medium' }}
            />
        </ListItemButton>
    )
}

export default ListButton