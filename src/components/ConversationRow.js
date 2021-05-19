import React, { useEffect } from 'react';
import '../styles/conversation-row.css'
import { useHistory } from 'react-router-dom';

export default function ConversationRow({ name, lastMessage, userId }) {

    const history = useHistory();

    const goToConversation = () => {
        history.push('/chat/123')
    }

    useEffect(() => {
        // console.log('ConversationRow mounted')

        return () => {
            // console.log('ConversationRow un-mounted')
        }

    }, [])

    return (
        <div onClick={goToConversation} className="conversation-container" >
            <span style={{fontWeight: 'bold', fontSize: 22}} >{name}</span>
            <br />
            <p style={{color: 'rgba(0,0,0,0.7)'}} > {/*last message goes here...*/}</p>
        </div>
    )
}