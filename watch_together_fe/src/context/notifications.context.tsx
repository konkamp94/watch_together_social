import { createContext, ReactNode, useEffect, useState} from "react";
import { Notification, NotificationsContextValue } from "./interfaces.context";
import useGetNotifications from "../hooks/api/useGetNotifications";
import { io, Socket } from "socket.io-client";
import { useAuth } from "../hooks/context/useAuth";
import useMarkNotificationsAsSeen from "../hooks/api/useMarkNotificationsAsSeen";

const initialNotificationContextValue = {} as NotificationsContextValue 
export const NotificationsContext = createContext<NotificationsContextValue>(initialNotificationContextValue)

const wsBaseUrl = import.meta.env.VITE_WS_BASE_URL_DEV

export const NotificationsProvider = ({ children}: { children: ReactNode}) => {
    const { token } = useAuth()
    const { notifications, isLoadingNotifications } = useGetNotifications()
    const [liveNotifications, setLiveNotifications] = useState<Notification[]>(notifications);
    const [unseenNotificationsCount, setUnseenNotificationsCount] = useState<number>(0)
    const { markNotificationsAsSeen } = useMarkNotificationsAsSeen(unseenNotificationsCount, () => setUnseenNotificationsCount(0))

    useEffect(() => {
        if(notifications) {
            let unseenNotifications = 0
            notifications.forEach((notification: Notification) => {
              unseenNotifications = !notification.seen ? unseenNotifications + 1 : unseenNotifications
            })
            setUnseenNotificationsCount(unseenNotifications)
        }
        setLiveNotifications(notifications);
    }, [notifications]);
    
    useEffect(() => {
        if(!isLoadingNotifications) {
            const socket: Socket = io(`${wsBaseUrl}/notifications`, { transports: ['websocket', 'polling'],  query: { token } });

            socket.on("connect", () => {
                console.log("Socket.IO connection established");
            });

            socket.on("notifications", (newNotification: string) => {
                const newNotificationJson = JSON.parse(newNotification) as Notification
                setUnseenNotificationsCount((prevCount) => prevCount + 1)
                setLiveNotifications((prevNotifications) => [newNotificationJson, ...prevNotifications]);
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
        }
    }, [isLoadingNotifications, token]);

    const onClickBellIcon = () => {
        if(unseenNotificationsCount !== 0) {
            markNotificationsAsSeen()
        }
    }

    return (<NotificationsContext.Provider value={{ notifications: liveNotifications , unseenNotificationsCount, isLoadingNotifications, onClickBellIcon }}>
                {children}
            </NotificationsContext.Provider>)
}