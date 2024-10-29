import React, { createContext, useState } from 'react';

// Create Stocks Context
const StocksContext = createContext();

// Stocks Provider
const StocksProvider = ({ children }) => {

    const host = "http://localhost:5000"; // Base URL
    const [stocks, setStocks] = useState([]); // State to hold stocks

    // Function to add a stock
    const addStock = async (portfolioId, symbol, demat, price, quantity, exchange, type) => {
        try {
            const response = await fetch(`${host}/api/stocks/${portfolioId}/addstock`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token'), // Include auth-token from local storage
                },
                body: JSON.stringify({ symbol, demat, price, quantity, exchange, type }),
            });

            const data = await response.json();
            if (response.ok) {
                setStocks((prevStocks) => [...prevStocks, data]); // Update state with new stock
                console.log('Stock added:', data);
            } else {
                console.error('Failed to add stock:', data.message);
            }
        } catch (error) {
            console.error('Error adding stock:', error);
        }
    };

    // Fetch all stocks for a given portfolio
    const fetchStocks = async (portfolioId) => {
        try {
            const response = await fetch(`${host}/api/stocks/${portfolioId}/stocks`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token'), // Include auth-token from local storage
                },
            });

            const data = await response.json();
            if (response.ok) {
                setStocks(data); // Update state with fetched stocks
                console.log('Fetched stocks:', data);
            } else {
                console.error('Failed to fetch stocks:', data.message);
            }
        } catch (error) {
            console.error('Error fetching stocks:', error);
        }
    };

    // Function to delete a stock
    const deleteStock = async (stockId) => {
        try {
            const response = await fetch(`${host}/api/stocks/deletestock/${stockId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token'), // Include auth-token from local storage
                },
            });

            const data = await response.json();
            if (response.ok) {
                setStocks((prevStocks) => prevStocks.filter(stock => stock._id !== stockId)); // Remove deleted stock from state
                console.log('Stock deleted:', data);
            } else {
                console.error('Failed to delete stock:', data.message);
            }
        } catch (error) {
            console.error('Error deleting stock:', error);
        }
    };

    // Function to update a stock
    const updateStock = async (stockId, updatedData) => {
        try {
            const response = await fetch(`${host}/api/stocks/updatestock/${stockId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token'), // Include auth-token from local storage
                },
                body: JSON.stringify(updatedData),
            });

            const data = await response.json();
            if (response.ok) {
                setStocks((prevStocks) => prevStocks.map(stock => (stock._id === stockId ? { ...stock, ...updatedData } : stock))); // Update stock in state
                console.log('Stock updated:', data);
            } else {
                console.error('Failed to update stock:', data.message);
            }
        } catch (error) {
            console.error('Error updating stock:', error);
        }
    };

    return (
        <StocksContext.Provider value={{ stocks, addStock, fetchStocks, deleteStock, updateStock }}>
            {children}
        </StocksContext.Provider>
    );
};

export { StocksProvider, StocksContext };
