import { useParams } from "react-router-dom";
import { useWatchRoom } from "../../hooks/context/useWatchRoom";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactPlayer from 'react-player/youtube'
import { Typography } from "@mui/material";
import Chat from "../../components/watch-room/Chat";
import useLocalStorage from "../../hooks/useLocalStorage";
import ContentHeader from "../../components/content-header/ContentHeader";


const WatchRoom = () => {
    const { code } = useParams();
    const { lastEvent, watchRoomInfo, isLoadingWatchRoomInfo, error, socket } = useWatchRoom()
    const videoRef = useRef<ReactPlayer | null>()
    const [messages, setMessages] = useState<{senderUsername: string, message: string, timestamp: string}[]>([])
    const [isPlaying, setIsPlaying] = useState(false)
    const [user] = useLocalStorage("user");
    const ignoreNextOnPlayEventRef = useRef(false) 
    const ignoreNextOnPauseEventRef = useRef(false) 

    useEffect(() => {
        if(!lastEvent) {
            return;
        }

        console.log('NEW EVENT')
        console.log(lastEvent)

        switch(lastEvent.type) {
            case('navigation'): 
                if(lastEvent.action === 'play') {
                    console.log('play from event')
                    videoRef.current?.seekTo(lastEvent.videoTime, 'seconds')
                    ignoreNextOnPlayEventRef.current = true
                    setIsPlaying(true)
                } else if (lastEvent.action === 'pause') {
                        console.log('paused from event')
                        ignoreNextOnPauseEventRef.current = true
                        ignoreNextOnPlayEventRef.current = true
                        setIsPlaying(false)
                }
                break;
            case('message'):
                setMessages(oldMessages => {
                    return ([...oldMessages, 
                            {senderUsername: lastEvent.senderUsername, 
                                message: lastEvent.message, 
                                timestamp: lastEvent.timestamp}])
                })
                break;
            case('sync-new-user-request'):
                console.log('sync-new-user-request')
                socket?.emit('events', { type: 'sync-new-user-response', 
                                            newUserId: lastEvent.newUserId, 
                                            videoTime: videoRef.current?.getCurrentTime(),
                                            isPlaying: isPlaying,
                                            timestamp: Date.now() 
                            })
                break;
            case('sync-new-user-response'):
                if(lastEvent.isPlaying) {
                    videoRef.current?.seekTo(lastEvent.videoTime, 'seconds')
                    ignoreNextOnPlayEventRef.current = true
                    setIsPlaying(true)
                }
            break;
            }
        }, [lastEvent, setIsPlaying, socket])

    const mapUsers = useCallback((watchRoomInfo: any) => {
        return [
            watchRoomInfo.creatorUser,
            ...watchRoomInfo.invitedUsers
        ]
    }, [])
    
    return (<>
            <ContentHeader text={`Room Code: ${code}`}></ContentHeader>
            <br/>
            {/* <span>{lastEvent}</span> */}
            {watchRoomInfo  ?
                        (<>
                            <ReactPlayer
                                    ref={videoRef as React.RefObject<ReactPlayer>} 
                                    muted={true}
                                    url={`https://www.youtube.com/watch?v=${watchRoomInfo.trailer?.key}`} 
                                    controls={true} 
                                    width={'100%'}
                                    height={'50%'}
                                    playing={isPlaying}
                                    onPlay={() => { console.log('ignoreNextPlay', ignoreNextOnPlayEventRef)
                                                    if(!ignoreNextOnPlayEventRef.current) {
                                                        console.log('play from action')
                                                        setIsPlaying(true)
                                                        socket?.emit('events', {type: 'navigation', action: 'play', videoTime: videoRef.current?.getCurrentTime(), timestamp: Date.now()})
                                                    } else {
                                                        ignoreNextOnPlayEventRef.current = false
                                                    }
                                                }
                                            }
                                    onPause={() => { console.log('ignoreNextPause', ignoreNextOnPauseEventRef) 
                                                    if(!ignoreNextOnPauseEventRef.current) {
                                                        console.log('paused from action')
                                                        setIsPlaying(false)
                                                        socket?.emit('events', {type: 'navigation', action: 'pause', timestamp: Date.now()})
                                                    } else { 
                                                        ignoreNextOnPauseEventRef.current = false
                                                        ignoreNextOnPlayEventRef.current = false
                                                    }       
                                    }}
                            /> 
                        </>)
                        : <Typography variant="body1" sx={{color: 'primary.contrastText'}}>Sorry, we didn't find any videos for this movie</Typography>
            }
            {watchRoomInfo && <Chat myUser={JSON.parse(user as string)} users={mapUsers(watchRoomInfo)} messages={messages} setMessages={setMessages} socket={socket}/>}
            
    </>)
}

export default WatchRoom