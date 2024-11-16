import React, { createContext, useState } from 'react';

const GoldContext = createContext();

const GoldProvider = ({children}) =>{
    const host = "http://localhost:5000";
    const [golds, setGold] = useState([]);

    const fetchGold = async (portfolioId) =>{
        try {
            const response = await fetch(`${host}/api/gold/${portfolioId}/gold`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem('token'),
                },
            });
            const data = await response.json();
            setGold(data);
        } catch (error) {
            console.error("Failed to fetch gold:", error);
        }
    }

    const addGold = async (portfolioId, type, price, date) =>{
        try {
            const response = await fetch(`${host}/api/gold/${portfolioId}/addgold`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem('token'),
                },
                body: JSON.stringify({ type, price, date}),
            });
            const res = await response.json();
            setGold((prev) => [...prev, res]);
        } catch (error) {
            console.error("Failed to add gold:", error);
        }
    }

    return(
        <GoldContext.Provider value={{golds, fetchGold, addGold}}>
            {children}
        </GoldContext.Provider>
    )
}

export { GoldProvider, GoldContext };
