import { useContext } from "react"
import { WatchRoomContext } from "../../context/watch-room.context";

export const useWatchRoom = () => {
    return useContext(WatchRoomContext);
}