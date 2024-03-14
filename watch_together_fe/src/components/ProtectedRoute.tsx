import { ReactNode } from "react";
import { useAuth } from "../hooks/context/useAuth"
import { Navigate } from "react-router-dom"

const ProtectedRoute = ({ children }: { children: ReactNode}) => {
    const { user } = useAuth();

    if(!user) { return <Navigate to="/login"/>  }
    
    return (<>
        {children}
    </>)
}

export default ProtectedRoute