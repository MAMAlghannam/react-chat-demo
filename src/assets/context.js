import { createContext, useContext, useEffect, useState } from "react";
import { Redirect, Route } from "react-router";

export const AuthContext = createContext(null);

export function ProvideAuth({ children }) {
    const auth = useProvideAuth()
    return (
        auth.isLoading ?
            <div>Loading...</div> 
        : 
            <AuthContext.Provider value={auth}>
                {children}
            </AuthContext.Provider>
    )
}

export function useAuth(){
    return useContext(AuthContext)
}

export function useProvideAuth(){
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        
        const tokenInSessionStorage = sessionStorage.getItem("token")
        if(tokenInSessionStorage){
            setToken(JSON.parse(tokenInSessionStorage))
        }
        setIsLoading(false)

    }, [])

    const signIn = (token, callBack) => {
        sessionStorage.setItem("token", JSON.stringify(token))
        setToken(token);
        callBack(true);
    }

    const signOut = (callBack) => {
        sessionStorage.removeItem("token")
        setToken(null);
        callBack();
    }

    return { isLoading, token, signIn, signOut }
}

export function PrivateRoute({ children, ...rest }) {
    let auth = useAuth();
    return (
        <Route
            {...rest}
            render={({ location }) => 
                auth.token ? (
                    children
                ) : (
                    <Redirect 
                        to={{
                            pathname: "/",
                            state: { from: location }
                        }} 
                    />
                )
            }
        />
    )
} 