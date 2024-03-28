import { createContext, useMemo, useCallback, ReactNode} from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import * as jwt_decode from 'jwt-decode'
import { AuthContextValue, User } from './interfaces.context'

// "as" keyword used to fake typescript context initialization errors
const initialAuthContextValue= {} as AuthContextValue
export const AuthContext = createContext<AuthContextValue>(initialAuthContextValue);

export const AuthProvider = ({ children}: { children: ReactNode}) => {

    const [token, setToken, removeToken] = useLocalStorage("token");
    const [refreshToken, setRefreshToken, removeRefreshToken] = useLocalStorage("refreshToken");
    const [user, setUser, removeUser] = useLocalStorage("user");

    const login = useCallback((token: string, refreshToken: string) => {
        const user = jwt_decode.jwtDecode(token);
        setUser(JSON.stringify(user));
        setToken(token);
        setRefreshToken(refreshToken);
    }, [setToken, setRefreshToken, setUser])

    const logout = useCallback(() => {
        removeToken("token")
        removeRefreshToken("refreshToken")
        removeUser("user")
    }, [removeToken, removeRefreshToken, removeUser])

    const getUser = useCallback((): User | null => {
        return user ? JSON.parse(user) : null
    }, [user])

    const value = useMemo(() => ({ token, refreshToken, user: getUser(), login, logout }), [token, refreshToken, login, logout, getUser]);
    

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );

}

