import React from 'react';
import { getColor } from '../assets/colors';
import '../styles/message-style.css'

export default function Message({ message, senderName, time, isCurrentUserMessage = false}) {

    const date = new Date(time);
    
    return (
        <div style={{display: 'flex', justifyContent: isCurrentUserMessage ? 'flex-start' : 'flex-end', padding: 10}} >
            <div className="message-container" style={{backgroundColor: isCurrentUserMessage ? '#ec897a' : getColor('pink')}} >
                {senderName && 
                <>
                    <span className="sender-name-container" >{isCurrentUserMessage ? "You" : senderName}</span>
                    <br />
                    <span> &nbsp; </span>
                </>}
                <p style={{margin: 0}} >
                    {message}
                </p>
                <br />
                <code style={{fontSize: 8, color: getColor('darkpink')}} >
                    {date.getDate()}/{date.getMonth()+1} . {date.getHours()}:{date.getMinutes()}
                </code>
            </div>
        </div>
    )
}