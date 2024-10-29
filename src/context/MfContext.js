import React, { createContext, useState } from 'react';

// Create MFs Context
const MFContext = createContext();

// MFs Provider
const MFProvider = ({ children }) => {
    const host = "http://localhost:5000"; // Base URL
    const [mutualFunds, setMutualFunds] = useState([]); // State to hold mutual funds

    // Function to add a mutual fund
    const addMutualFund = async (portfolioId, name, nav, investedAmount, type) => {
        try {
            const response = await fetch(`${host}/api/mutualfunds/${portfolioId}/addmutualfund`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token'), // Include auth-token from local storage
                },
                body: JSON.stringify({ name, nav, investedAmount, type }),
            });

            const data = await response.json();
            if (response.ok) {
                setMutualFunds((prevMutualFunds) => [...prevMutualFunds, data]); // Update state with new mutual fund
                console.log('Mutual Fund added:', data);
            } else {
                console.error('Failed to add mutual fund:', data.message);
            }
        } catch (error) {
            console.error('Error adding mutual fund:', error);
        }
    };

    // Fetch all mutual funds for a given portfolio
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
            if (response.ok) {
                setMutualFunds(data); // Update state with fetched mutual funds
                console.log('Fetched mutual funds:', data);
            } else {
                console.error('Failed to fetch mutual funds:', data.message);
            }
        } catch (error) {
            console.error('Error fetching mutual funds:', error);
        }
    };

    // Function to delete a mutual fund
    const deleteMutualFund = async (mutualFundId) => {
        try {
            const response = await fetch(`${host}/api/mutualfunds/deletemutualfund/${mutualFundId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token'), // Include auth-token from local storage
                },
            });

            const data = await response.json();
            if (response.ok) {
                setMutualFunds((prevMutualFunds) => prevMutualFunds.filter(mf => mf._id !== mutualFundId)); // Remove deleted mutual fund from state
                console.log('Mutual Fund deleted:', data);
            } else {
                console.error('Failed to delete mutual fund:', data.message);
            }
        } catch (error) {
            console.error('Error deleting mutual fund:', error);
        }
    };

    // Function to update a mutual fund
    const updateMutualFund = async (mutualFundId, updatedData) => {
        try {
            const response = await fetch(`${host}/api/mutualfunds/updatemutualfund/${mutualFundId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token'), // Include auth-token from local storage
                },
                body: JSON.stringify(updatedData),
            });

            const data = await response.json();
            if (response.ok) {
                setMutualFunds((prevMutualFunds) => prevMutualFunds.map(mf => (mf._id === mutualFundId ? { ...mf, ...updatedData } : mf))); // Update mutual fund in state
                console.log('Mutual Fund updated:', data);
            } else {
                console.error('Failed to update mutual fund:', data.message);
            }
        } catch (error) {
            console.error('Error updating mutual fund:', error);
        }
    };

    return (
        <MFContext.Provider value={{ mutualFunds, addMutualFund, fetchMutualFunds, deleteMutualFund, updateMutualFund }}>
            {children}
        </MFContext.Provider>
    );
};

export { MFProvider, MFContext };
