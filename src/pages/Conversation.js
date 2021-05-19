import React, { useEffect } from 'react';
import { getColor } from '../assets/colors';
// import { useHistory } from 'react-router-dom';
// import Message from '../components/Message';
import "../styles/conversation-style.css"

export default function Conversation({ children, sendMessage }){

    const submitMessage = async (event) => {
        event.preventDefault();
        console.log('in submitMessage')

        try{
            await sendMessage(event.target.message.value)
            event.target.reset();
        } catch(e) {
            alert(e)
            console.log(e)
        }

    }

    return (
        <div style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
            <div style={{height: 60, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 10, color: 'white', backgroundColor: getColor('darkblue')}} >
                <div style={{display: 'flex', alignItems: 'center'}} >
                    {/* <button disabled onClick={() => history.goBack() } style={{fontSize: 45, transform: "rotate(-90deg)", color: 'rgba(0,0,0,0)', border: 'none', background: 'none'}} > 
                        &#x025B4; 
                    </button> */}
                    &nbsp; &nbsp;
                    <code>Public group</code>
                </div>
            </div>
            <div id={'chats'} style={{flex: 1, display: 'flex', flexDirection: 'column-reverse', overflowY: 'auto'}} >
                {children}
            </div>
            <div style={{height: 80, backgroundColor: getColor('darkblue')}} >
                <form onSubmit={submitMessage} id="message-form">
                    <input type="text" placeholder="type..." name="message" autoComplete="off" />
                    <input type="submit" value="send" />
                </form>
            </div>
        </div>
    )

}