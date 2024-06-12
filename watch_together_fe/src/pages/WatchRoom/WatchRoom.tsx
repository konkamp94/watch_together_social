import { useParams } from "react-router-dom";
import { useWatchRoom } from "../../hooks/context/useWatchRoom";
import { useEffect, useRef, useState } from "react";
import ReactPlayer from 'react-player/youtube'
import { Typography } from "@mui/material";
import Chat from "../../components/watch-room/Chat";


const WatchRoom = () => {
    const { code } = useParams();
    const { lastEvent, watchRoomInfo, isLoadingWatchRoomInfo, error, socket } = useWatchRoom()
    const videoRef = useRef<ReactPlayer | null>()
    const [isPlaying, setIsPlaying] = useState(false)
    const ignoreNextOnPlayEventRef = useRef(false) 
    const ignoreNextOnPauseEventRef = useRef(false) 

    useEffect(() => {
        if(lastEvent) {
            const lastEventJson = JSON.parse(lastEvent)
            switch(lastEventJson.type) {
                case('navigation'): 
                    if(lastEventJson.action === 'play') {
                        console.log('play from event')
                        videoRef.current?.seekTo(lastEventJson.videoTime > 1 ? lastEventJson.videoTime : 1 )
                        ignoreNextOnPlayEventRef.current = true
                        setIsPlaying(true)
                    } else if (lastEventJson.action === 'pause') {
                        console.log('paused from event')
                        ignoreNextOnPauseEventRef.current = true
                        ignoreNextOnPlayEventRef.current = true
                        setIsPlaying(false)
                    }
            }
        }
    }, [lastEvent])
    
    return (<>
            <h1>{`Room Page with code ${code}`}</h1>
            <span>{lastEvent}</span>
            {watchRoomInfo  ?
                        (<>
                            <ReactPlayer
                                    ref={videoRef as React.RefObject<ReactPlayer>} 
                                    muted={true}
                                    url={`https://www.youtube.com/watch?v=${watchRoomInfo.trailer?.key}`} 
                                    controls={true} 
                                    width={'100%'}
                                    height={'50%'}
                                    style={{width: '100%',  height: '50%' }}
                                    playing={isPlaying}
                                    onPlay={() => { console.log('ignoreNextPlay', ignoreNextOnPlayEventRef)
                                                    if(!ignoreNextOnPlayEventRef.current) {
                                                        console.log('play from action')
                                                        setIsPlaying(true)
                                                        socket?.emit('events', {type: 'navigation', action: 'play', videoTime: videoRef.current?.getCurrentTime(), currentTimestamp: Date.now()})
                                                    } else {
                                                        ignoreNextOnPlayEventRef.current = false
                                                    }
                                                }
                                            }
                                    onPause={() => { console.log('ignoreNextPause', ignoreNextOnPauseEventRef) 
                                                    if(!ignoreNextOnPauseEventRef.current) {
                                                        console.log('paused from action')
                                                        setIsPlaying(false)
                                                        socket?.emit('events', {type: 'navigation', action: 'pause', currentTimestamp: Date.now()})
                                                    } else { 
                                                        ignoreNextOnPauseEventRef.current = false
                                                        ignoreNextOnPlayEventRef.current = false
                                                    }       
                                    }}
                            /> 
                            <Chat/>
                        </>)
                        : <Typography variant="body1" sx={{color: 'primary.contrastText'}}>Sorry, we didn't find any videos for this movie</Typography>
            }
            
    </>)
}

export default WatchRoom