import { ReactNode, createContext, useEffect, useState } from "react"
import { WatchRoomContextValue } from "./interfaces.context"
import { useAuth } from "../hooks/context/useAuth"
import { Socket, io } from "socket.io-client"
import { useParams } from "react-router-dom"
import useGetWatchRoomInfo from "../hooks/api/useGetWatchRoomInfo"

const initialWatchRoomContextValue = {} as WatchRoomContextValue 
export const WatchRoomContext = createContext<WatchRoomContextValue>(initialWatchRoomContextValue)

const wsBaseUrl = import.meta.env.VITE_WS_BASE_URL_DEV

export const WatchRoomContextProvider = ({children}: {children: ReactNode}) => {
    const { token, user } = useAuth()
    const { code } = useParams()
    const [lastEvent, setLastEvent] = useState<any | null>(null)
    const { watchRoomInfo, isLoadingWatchRoomInfo, error} = useGetWatchRoomInfo(code as string)
    const [socket, setSocket] = useState<Socket | null>(null)

    useEffect(() => {
        console.log(code)
        const socket: Socket = io(`${wsBaseUrl}/watch-room?code=${code}`, { extraHeaders: { 'Authorization': `Bearer ${token}`  }});
        setSocket(socket)
        
        socket.on("connect", () => {
            console.log("Socket.IO connection established");
            console.log(socket)
            socket.emit('events', {  type: 'sync-new-user-request', 
                                     newUserId: user?.userId, 
                                     timestamp: Date.now() 
                                    })
        });

        socket.on("events", (event: string) => {
            const eventJson = JSON.parse(event)
            if(!lastEvent) {
                setLastEvent(eventJson)
                return;
            }
            if(lastEvent.timestamp < eventJson.timestamp) {
                setLastEvent(eventJson)
            } 
        });

        socket.on("connect_error", (error) => {
            console.error("Socket.IO connection error", error);
        });

        socket.on("disconnect", () => {
            console.log("Socket.IO connection disconnected");
        });

        return () => {
            socket.disconnect();
        };
    }, [code, token])

    return (
        <WatchRoomContext.Provider value={{ lastEvent, watchRoomInfo, isLoadingWatchRoomInfo, error, socket }}>
            {children}
        </WatchRoomContext.Provider>
    )
}