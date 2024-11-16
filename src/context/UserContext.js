import React, { createContext, useState } from 'react';

const UserContext = createContext();

const UserProvider = ({children}) => {
    const host = "http://localhost:5000";
    const [details, setDetails] = useState({name:"", email:""})

    // get user details
    const fetchUserDetails = async () =>{
        const response = await fetch(`${host}/api/auth/getuser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "auth-token": localStorage.getItem('token')
            }
        });
        const json = await response.json();
        setDetails(json);
    };

    return (
        <UserContext.Provider value={{details, fetchUserDetails}}>
            {children}
        </UserContext.Provider>
    );
}

export { UserContext, UserProvider }