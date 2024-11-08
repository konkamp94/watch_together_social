import './LeftBar.css'
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LocalMoviesIcon from '@mui/icons-material/LocalMovies';
import ListButton from '../list-button/ListButton';
import { useNavigate } from 'react-router-dom';

const LeftBar = ({ activeButtonId, setActiveButtonId }: {activeButtonId: string, setActiveButtonId: React.Dispatch<React.SetStateAction<string>> }) => {
    const navigate = useNavigate()
    const buttonsConfig = [{id: 'find-movies', label: 'Find Movies', icon: <LocalMoviesIcon/>, navigatePath: '/find-movies'},
                           {id: 'find-friends', label: 'Find Friends', icon: <PeopleIcon/>, navigatePath: '/find-friends'},
                           {id: 'friend-requests', label: 'Friend Requests', icon: <PersonAddIcon/>, navigatePath: '/friend-requests'}]

    return (
    
        <div className="left-bar-container">
            <ul className='sticky-ul' style={{paddingLeft: '8px'}}>
                {
                    buttonsConfig.map(buttonConfig => {
                        return <ListButton 
                                key={buttonConfig.id}
                                isActive={activeButtonId === buttonConfig.id}
                                label={buttonConfig.label} 
                                icon={buttonConfig.icon}
                                handleClick={
                                    () => {
                                        setActiveButtonId(buttonConfig.id)
                                        navigate(buttonConfig.navigatePath)
                                    }
                                }/>
                })
                }
            </ul>
        </div>
    )
    
}

export default LeftBar