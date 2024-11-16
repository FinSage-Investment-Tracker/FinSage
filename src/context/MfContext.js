import React, { createContext, useState } from 'react';

const MFContext = createContext();

const MFProvider = ({ children }) => {
    const host = "http://localhost:5000";
    const [mutualFunds, setMutualFunds] = useState([]);
    const [mfTransactions, setMfTransactions] = useState([]);

    // fetch all mutualfunds
    const fetchMutualFunds = async (portfolioId) => {
        try {
            const response = await fetch(`${host}/api/mutualfunds/${portfolioId}/mutualfunds`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token'), // Include auth-token from local storage
                },
            });

            const data = await response.json();
            setMutualFunds(data);
        } catch (error) {
            console.error('Error fetching mutual funds:', error);
        }
    };

    // fetch all mf transactions
    const fetchMfTransactions = async (portfolioId) => {
        try {
            const response = await fetch(`${host}/api/mutualfunds/${portfolioId}/mftransactions`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem('token'),
                },
            });
            const data = await response.json();
            setMfTransactions(data);
        } catch (error) {
            console.error("Failed to fetch mutual funds:", error);
        }
    };

    // add a mutual fund
    const addMutualFund = async (portfolioId, symbol, nav, units, type, date) => {
        try {
            const response = await fetch(`${host}/api/mutualfunds/${portfolioId}/addmutualfund`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token'), // Include auth-token from local storage
                },
                body: JSON.stringify({ symbol, nav, units, type, date }),
            });

            const data = await response.json();
            setMutualFunds((prevMutualFunds) => [...prevMutualFunds, data]);
        } catch (error) {
            console.error('Error adding mutual fund:', error);
        }
    };

    // update a mutualfund

    // delete a mutual fund



    return (
        <MFContext.Provider value={{ mutualFunds, mfTransactions, fetchMutualFunds, fetchMfTransactions, addMutualFund }}>
            {children}
        </MFContext.Provider>
    );
};

export { MFProvider, MFContext };
