import { useBeforeUnload, useParams } from "react-router-dom";
import { useWatchRoom } from "../../hooks/context/useWatchRoom";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactPlayer from 'react-player/youtube'
import { Box, Typography } from "@mui/material";
import Chat from "../../components/watch-room/Chat";
import useLocalStorage from "../../hooks/useLocalStorage";
import ContentHeader from "../../components/content-header/ContentHeader";


const WatchRoom = () => {
    const { code } = useParams();
    const { lastEvent, watchRoomInfo, isLoadingWatchRoomInfo, error, socket } = useWatchRoom()
    const videoRef = useRef<any>()
    const [messages, setMessages] = useState<{senderUsername: string, message: string, timestamp: string}[]>([])
    const [user] = useLocalStorage("user");
    const [internalPlayer, setInternalPlayer] = useState<any>(null)
    const lastActionAndSource = useRef<{ type: string, action: string } | null>(null)
    const ignoreNextOnPlayEventRef = useRef(false)
    const ignoreNextOnPauseEventRef = useRef(false)

    useBeforeUnload(useCallback(() => { socket?.disconnect()}, [socket]))

    useEffect(() => {
        if(!lastEvent) {
            return;
        }
        if(!internalPlayer) {
            return;
        }

        console.log('NEW EVENT')
        console.log(lastEvent)
        switch(lastEvent.type) {
            case('navigation'): 
                if(lastEvent.action === 'play') {
                    console.log('new play event logic')
                    videoRef.current?.seekTo(lastEvent.videoTime + (Math.floor((Date.now() - lastEvent.timestamp) / 1000)), 'seconds')
                    ignoreNextOnPlayEventRef.current = true
                    lastActionAndSource.current = { type: 'event', action: 'play'}
                    internalPlayer?.playVideo()
                } else if (lastEvent.action === 'pause') {
                    console.log('new pause event logic')
                    videoRef.current?.seekTo(lastEvent.videoTime, 'seconds')
                    ignoreNextOnPauseEventRef.current = true
                    lastActionAndSource.current = { type: 'event', action: 'pause'}
                    internalPlayer?.pauseVideo()
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
                                            isPlaying: videoRef.current?.player?.isPlaying,
                                            timestamp: Date.now() 
                            })
                break;
            case('sync-new-user-response'):
                if(lastEvent.isPlaying) {
                    videoRef.current?.seekTo(lastEvent.videoTime + ((Date.now() - lastEvent.timestamp) / 1000), 'seconds')
                    internalPlayer?.playVideo()
                }
                break;
            }
        }, [lastEvent, socket, internalPlayer])

    const mapUsers = useCallback((watchRoomInfo: any) => {
        return [
            watchRoomInfo.creatorUser,
            ...watchRoomInfo.invitedUsers
        ]
    }, [])  

    const handleStateChange = (event) => {
        if(event.data !== 1 && event.data !== 2 && event.data !== 3) { return }
        console.log(event.data)
        if(event.data === 3) {
            console.log(lastActionAndSource.current)
        }
        // fix the buffering state problem
        if(event.data === 3 && lastActionAndSource.current?.type === 'user' && lastActionAndSource.current.action === 'play') {
            ignoreNextOnPlayEventRef.current = false
        } else if(event.data === 3 && lastActionAndSource.current?.type === 'user' && lastActionAndSource.current.action === 'pause') {
            ignoreNextOnPauseEventRef.current = false
        } else if(event.data === 3 && lastActionAndSource.current?.type === 'event' && lastActionAndSource.current.action === 'play') {
            ignoreNextOnPlayEventRef.current = true
        } else if(event.data === 3 && lastActionAndSource.current?.type === 'event' && lastActionAndSource.current.action === 'pause') {
            ignoreNextOnPauseEventRef.current = true
        }
        //playing
        if(event.data === 1 && !ignoreNextOnPlayEventRef.current) {
            ignoreNextOnPauseEventRef.current = false
            console.log('play from action')
            lastActionAndSource.current = { type: 'user', action: 'play'}
            socket?.emit('events', {type: 'navigation', action: 'play', videoTime: (videoRef.current?.getCurrentTime()), timestamp: Date.now()})
        } else if(event.data === 1){
            console.log('play from event')
            ignoreNextOnPlayEventRef.current = false
            ignoreNextOnPauseEventRef.current = false
        }
        // paused
        if(event.data === 2 && !ignoreNextOnPauseEventRef.current) {
            ignoreNextOnPlayEventRef.current = false
            console.log('paused from action')
            lastActionAndSource.current = { type: 'user', action: 'pause'}
            socket?.emit('events', {type: 'navigation', action: 'pause', videoTime: videoRef.current?.getCurrentTime(), timestamp: Date.now()})
        } else if(event.data === 2){
            console.log('paused from event')
            ignoreNextOnPauseEventRef.current = false
            ignoreNextOnPlayEventRef.current = false
        }
    }


    
    return (<>
                { error?.status === 403 ? <Typography variant="body1" sx={{color: 'primary.contrastText'}}> Sorry, You cannot participate to this room </Typography> : null}
                { !isLoadingWatchRoomInfo && !watchRoomInfo?.trailer && !error ? <Typography variant="body1" sx={{color: 'primary.contrastText'}}>Sorry, we didn't find any videos for this movie</Typography> : null}
                { watchRoomInfo && (
                    <Box>
                        <ContentHeader text={`Room Code: ${code}`}></ContentHeader>
                        <br/>
                        <Box sx={{ display: 'flex', height: '100%', flex:1 }}>
                            <Box sx={{ flex: 4, position: 'relative', paddingTop: `80vh` }}>
                                <ReactPlayer
                                    ref={videoRef as React.RefObject<ReactPlayer>}
                                    muted={true}
                                    url={`https://www.youtube.com/watch?v=${watchRoomInfo.trailer?.key}`} 
                                    controls={true} 
                                    width={'100%'}
                                    height={'100%'}
                                    style={{   position: 'absolute',
                                        top: 0,
                                        left: 0
                                    }}
                                    onReady={() => {
                                        const internalPlayer = videoRef.current?.getInternalPlayer()
                                        internalPlayer?.addEventListener("onStateChange", (event) => {
                                            handleStateChange(event)
                                        })
                                        setInternalPlayer(videoRef.current?.getInternalPlayer())
                                    }}
                                    // playing={playerState.isPlaying}
                                    // onPlay={() => { 
                                    //                 if(!ignoreNextOnPlayEventRef.current) {
                                    //                     console.log('play from action', Date.now())
                                    //                     socket?.emit('events', {type: 'navigation', action: 'play', videoTime: videoRef.current?.getCurrentTime(), timestamp: Date.now()})
                                    //                 } else {
                                    //                     console.log('play from event', Date.now())
                                    //                     ignoreNextOnPlayEventRef.current = false
                                    //                 }
                                    //             }
                                    //         }
                                    // onPause={() => { 
                                    //                 if(!ignoreNextOnPauseEventRef.current) {
                                    //                     console.log('paused from action', Date.now())
                                    //                     socket?.emit('events', {type: 'navigation', action: 'pause', videoTime: videoRef.current?.getCurrentTime(), timestamp: Date.now()})
                                    //                 } else { 
                                    //                     console.log('paused from event', Date.now())
                                    //                     ignoreNextOnPauseEventRef.current = false
                                    //                 }       
                                    // }}
                                    /> 
                            </Box>
                            <Box sx={{ display: 'flex', flex: 1, width: '100%' }}>
                                <Chat myUser={JSON.parse(user as string)} 
                                    users={mapUsers(watchRoomInfo)} 
                                    messages={messages} 
                                    setMessages={setMessages} 
                                    socket={socket}/>
                            </Box>
                        </Box>
                    </Box>
                ) }
            
    </>)
}

export default WatchRoom