import { useContext } from "react"
import { NotificationsContext } from "../../context/notifications.context";

export const useNotifications = () => {
    return useContext(NotificationsContext);
}