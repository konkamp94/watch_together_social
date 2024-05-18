import { useEffect } from 'react'
import { useNotifications } from '../../hooks/context/useNotifcations'
import './RightBar.css'

const RightBar = () => {
    const { notifications } = useNotifications()

    useEffect(() => {console.log(notifications)}, [])
    return (<div className="right-bar-container">
        <h1>Right Bar</h1>
        {
            notifications.map(notification => <p>{notification.type}</p>)
        }
    </div>)
    
}

export default RightBar