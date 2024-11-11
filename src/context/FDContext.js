import React, { createContext, useState } from 'react';

const FDContext = createContext();

const FDProvider = ({ children }) =>{
    const host = "http://localhost:5000";
    const [fixedDeposit, setFixedDeposit] = useState([]);
    const [fdtransactions, setFdTransactions] = useState([]);

    // Fetch all FD in portfolio
    const fetchFD = async (portfolioId) => {
        try {
            const response = await fetch(`${host}/api/fixeddeposit/${portfolioId}/fd`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem('token'),
                },
            });
            const data = await response.json();
            setFixedDeposit(data);
        } catch (error) {
            console.error("Failed to fetch fixed deposit:", error);
        }
    };

    // Fetch all FD transactions
    const fetchFDTransactions = async (portfolioId) => {
        try {
            const response = await fetch(`${host}/api/fixeddeposit/${portfolioId}/fdtransactions`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem('token'),
                },
            });
            const data = await response.json();
            setFdTransactions(data);
        } catch (error) {
            console.error("Failed to fetch Fixed deposit:", error);
        }
    };

    // ADD FD
    const addFD = async (portfolioId, name, bank, interest, amount, duration, date, type) => {
        try {
            const response = await fetch(`${host}/api/fixeddeposit/${portfolioId}/addFD`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem('token'),
                },
                body: JSON.stringify({ name, bank, interest, amount, duration, date, type}),
            });
            const data = await response.json();
            setFixedDeposit((prevFD) => [...prevFD, data]);
        } catch (error) {
            console.error("Failed to add Fixed Deposit:", error);
        }
    };

    

    // Update FD (optional)
    return (
        <FDContext.Provider value={{ fixedDeposit, fdtransactions, fetchFD, fetchFDTransactions, addFD }}>
            {children}
        </FDContext.Provider>
    );
};

export { FDContext, FDProvider };