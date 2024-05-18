import { ReactNode } from "react";
import { useAuth } from "../hooks/context/useAuth"
import { Navigate } from "react-router-dom"
import { MetadataProvider } from '../context/metadata.context'
import { NotificationsProvider } from "../context/notifications.context";

const ProtectedRoute = ({ children }: { children: ReactNode}) => {
    const { user } = useAuth();

    if(!user) { return <Navigate to="/login"/>  }
    
    return (<>
        <MetadataProvider>
            <NotificationsProvider>
                {children}
            </NotificationsProvider>
        </MetadataProvider>
    </>)
}

export default ProtectedRoute