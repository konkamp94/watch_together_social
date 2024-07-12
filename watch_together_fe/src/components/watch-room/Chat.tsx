import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Fab from '@mui/material/Fab';
import SendIcon from '@mui/icons-material/Send';
import { Socket } from 'socket.io-client';
import { useEffect, useRef, useState } from 'react';
import { User } from '../../context/interfaces.context';


const Chat = ({ myUser, users, messages, setMessages, socket }: { 
    myUser: User
    users: { id: number, username: string }[], 
    setMessages:  React.Dispatch<React.SetStateAction<{
    senderUsername: string;
    message: string;
    timestamp: string;}[]>>,
    messages: {senderUsername: string, message:string, timestamp:string}[], 
    socket: Socket | null}) => {

  const [textInputValue,setTextInputValue] = useState<string>("")
  const inboxElement = useRef<null | HTMLDivElement>(null)
  const isFirstRender = useRef(true)

  useEffect(() => {
    if(isFirstRender) { isFirstRender.current = false}
    if(inboxElement.current) {
        console.log(messages)
        inboxElement.current.scrollTo({top: inboxElement.current.scrollHeight , behavior: isFirstRender.current ? 'instant' : 'smooth' });
    }
  }, [messages])

  const sendMessage = () => {
    const currentTimestamp = Date.now().toString()
    socket?.emit('events', {
        type: 'message',
        message: textInputValue,
        senderUsername: myUser.username,
        currentTimestamp: currentTimestamp,
    });
    setMessages(oldMessages => [...oldMessages, { message: textInputValue, senderUsername: myUser.username, timestamp: currentTimestamp }])
    setTextInputValue("")
  }

  return (
      <Paper sx={{ marginTop: '16px', backgroundColor: 'primary.dark', padding: '8px', height: '50%'}} elevation={12}>
        <Grid container>
            <Grid item xs={3} >
                <List sx={{marginRight: '8px'}}>
                    {users.map((user) => {
                        return (
                            <ListItem key={user.id} sx={{backgroundColor: user.username === myUser.username ? 'primary.main' : 'primary.light', borderRadius: '16px', marginBottom: '8px'}}>
                                <ListItemIcon>
                                    <Avatar>{user.username.charAt(0).toUpperCase()}</Avatar>
                                </ListItemIcon>
                                <ListItemText>{user.username}</ListItemText>
                            </ListItem>
                        )
                    })}
                </List>
            </Grid>
            <Grid item xs={9}>
                <List sx={{ height: '100%', maxHeight: '200px', minHeight:'200px',overflowY: 'auto'}} ref={inboxElement as React.RefObject<any>}>
                    {messages.map((message, index) => (
                        <Grid container sx={{marginBottom: '16px'}}>
                            {myUser.username === message.senderUsername ? <Grid item xs={6}></Grid> : null}
                            <Grid item xs={6}>
                                <ListItem key={index} sx={{backgroundColor: myUser.username === message.senderUsername ? 
                                                                'primary.main' : 'primary.light', borderRadius: '8px'}}>
                                    <Grid container>
                                        <Grid item xs={12}>
                                            <ListItemText sx={{overflowWrap: 'break-word'}} primary={message.message}></ListItemText>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <ListItemText sx={{textAlign: 'right'}} secondary={message.senderUsername}></ListItemText>
                                        </Grid>
                                    </Grid>
                                </ListItem>
                            </Grid>
                        </Grid>
                    ))}
                </List>
            </Grid>
        </Grid>
        <Grid container sx={{marginTop: '16px'}}>
                    <Grid item xs={3} sx={{padding: 0}}> {/* Offset Column */} </Grid>
                    <Grid item xs={8} sx={{padding: 0}}>
                        <TextField
                            id="message-text"
                            label="Type Something"
                            value={textInputValue}
                            autoComplete='off'
                            fullWidth
                            onChange={(event) => setTextInputValue(event.target.value)}
                            onKeyUp={(event) => {
                                if (event.code === 'Enter') {
                                    sendMessage()
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={1} textAlign="end">
                        <Fab color="primary" aria-label="add" onClick={() => sendMessage()}><SendIcon /></Fab>
                    </Grid>
                </Grid>
      </Paper>
  );
}

export default Chat;