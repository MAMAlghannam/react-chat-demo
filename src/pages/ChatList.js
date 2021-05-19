import React, { useEffect, useRef, useState } from 'react';
import { getColor } from '../assets/colors';
import ConversationRow from '../components/ConversationRow';
import { useAuth } from '../assets/context'
import Conversation from './Conversation';
import { HubConnectionBuilder } from '@microsoft/signalr'
import Message from '../components/Message';

const connection = new HubConnectionBuilder()
        .withUrl("https://localhost:44362/chatHub")
        // .configureLogging(signalR.LogLevel.Information)
        .build();

export default function ChatList(props){
    
    const { token, signOut }  = useAuth();
    const divRef = useRef();

    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState({});
    const [isConnecting, setIsConnecting] = useState(true);

    useEffect(() => {
            
        connection.on("ReceiveConnectedUsers", handleReceiveConnectedUsers);
        connection.on('SomeoneJoined', handleSomeoneJoined);
        connection.on('SomeoneLeft', handleSomeoneLeft);
        connection.on('ReceiveMessage', handleReceiveMessage);
        connection.on('SomeoneIsTyping', handleSomeoneIsTyping);
        
        const start = async () => {
            try {
                await connection.start();
                console.log('Subscribing...')
                await connection.invoke("Subscribe", token.userId+"", token.username+"")
                console.log('Subscribed')

                setIsConnecting(false)
            } catch (error) {
                console.log('SignalR error', error)
                setTimeout(() => signOut(() => null), 1000)
            }
        }
        
        start();

        connection.onclose(info => {
            const shoudlReconnect = window.confirm('connection closed !, re try again?')
            if(shoudlReconnect)
                start();
        })

        return () => {
            connection.stop();
        }

    }, [])

    const handleReceiveConnectedUsers = (list) => {
        console.log('handleReceiveConnectedUsers', list)
        setUsers(list);
    }

    const handleSomeoneJoined = (user) => {
        console.log('handleSomeoneJoined', user)
        setUsers(prev => {
            prev[user.userId+""] = { connectionId: user.connectionId, username: user.username }
            return {...prev}
        })
    }

    const handleSomeoneLeft = (userId) => {
        console.log('Someone left', userId)
        setUsers(prev => {
            delete prev[userId]
            return { ...prev }
        });
    }
    
    const handleReceiveMessage = (message) => {
        console.log('handleReceiveMessage', message)
        setMessages(prev => [message, ...prev])
    }
    
    const handleSomeoneIsTyping = (user) => {

    }

    const sendMessage = (message) => {
        return connection.invoke("SendMessage", message)
        .then(rep => {
            setMessages(prev => [
                {   
                    userId: token.userId, 
                    username: token.username, 
                    content: message, 
                    timestamp: new Date().getTime()
                }, 
                ...prev
            ])
            return true;
        })
        .catch(error => error)
    }

    if(isConnecting)
        return <p>connecting...</p>

    return (
        <div ref={divRef} style={{flex: 1, display: "grid", gridTemplateColumns: "25% 75%",  flexDirection: 'column'}} >
            <div /* header and conversations */ style={{display: 'flex', flexDirection: 'column', overflow: 'auto'}} >
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 10, color: 'white', backgroundColor: getColor('darkblue')}} >
                    <div style={{display: 'flex', alignItems: 'center'}} >
                        <span style={{fontSize: 45}} >🕺</span>
                        &nbsp; &nbsp;
                        <code>{token?.username}</code>
                    </div>
                    <button style={{color: 'red', textDecorationLine: 'underline', cursor: 'pointer', background: 'none', border: 'none'}} onClick={() => signOut(() => null)} >
                        <code>Logout</code>
                    </button>
                </div>
                <div style={{overflow: 'auto', flex: 1}} >
                {
                    Object.entries(users).map((user/*, index*/) => 
                        <ConversationRow 
                            key={user[0]} 
                            name={user[1].username === token.username ? "You" : user[1].username} 
                        />
                    )   
                }
                </div>
            </div>
            <div style={{backgroundColor: 'deepskyblue', overflow: 'auto'}} >
                <Conversation sendMessage={sendMessage} >
                {
                    messages.map(message => 
                        <Message 
                            key={message.timestamp+"-"+message.username} 
                            senderName={message.username}
                            message={message.content} 
                            time={message.timestamp}
                            isCurrentUserMessage={token.userId === message.userId}
                        /> 
                    )
                }
                </Conversation>
            </div>
        </div>
    )
}