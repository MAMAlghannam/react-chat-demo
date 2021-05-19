import '../styles/login-style.css'
import React, { useState } from 'react';
import { useAuth } from '../assets/context';
import { Redirect } from 'react-router';

export default function Login({ location, history }){

    const { token, signIn } = useAuth()
    const [isLogging, setIsLogging] = useState(false)

    const onSubmit = async (event) => {
        event.preventDefault();

        const { username, password } = event.target
        const requestBody = { username: username.value, user_password: password.value }
        setIsLogging(true)
        fetch('https://localhost:44362/Home/GetCredentials', 
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify(requestBody)
            }
        )
        .then(res => {
            if(!res.ok)
                throw new Error('Network response was not ok, '+res.status);
            return res.json();
        })
        .then(jsonResult => {
            // console.log(jsonResult)
            signIn(
                jsonResult, 
                (status) => { 
                    if(status)
                        history.replace("/chat")
                }
            )
        })
        .catch(e => {
            setIsLogging(false)
            console.log(e)
            alert("Error ! \n"+e)
        })
    }
    
    if(token)
        return <Redirect to="/chat" />

    return (
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: "center", paddingTop: 115}}>
            <h1>Login</h1> 
            <form onSubmit={onSubmit} style={{width: '40%', display: 'flex', flexDirection: 'column'}}>
                <input type="text" placeholder="username" name="username" className="field" autoComplete="off" />
                <input type="password" placeholder="password" name="password" className="field" autoComplete="off" />
                <input type="submit" value={isLogging ? "Joining..." : "Join"} className="login-btn" disabled={isLogging}/>
            </form>
        </div> 
    )

}