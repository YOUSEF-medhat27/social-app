import { createContext, useEffect, useState } from "react"


export const authcontext = createContext()

export default function AuthContextProvider({ children }) {


    const [token, setToken] = useState(null)

    function insertusertoken(tkn) {
        setToken(tkn)
    }
    function LogoutContext(){

        setToken(null)
        localStorage.removeItem("token")
    }


    useEffect(function () {
        if (localStorage.getItem("token") != null) {
            setToken(localStorage.getItem("token"))
        }
    }, [])

    return <authcontext.Provider value={
        { insertusertoken, token ,LogoutContext }
    }>

        {children}



    </authcontext.Provider>
}
