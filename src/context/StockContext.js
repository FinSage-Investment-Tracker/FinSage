import React, { createContext, useState } from 'react';

const StockContext = createContext();

const StockProvider = ({ children }) => {
    const host = "http://localhost:5000";
    const [stocks, setStocks] = useState([]);

    // Fetch all stocks in a portfolio
    const fetchStocks = async (portfolioId) => {
        try {
            const response = await fetch(`${host}/api/stocks/${portfolioId}/stocks`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem('token'),
                },
            });
            const data = await response.json();
            setStocks(data);
        } catch (error) {
            console.error("Failed to fetch stocks:", error);
        }
    };

    // Add a stock to a portfolio
    const addStock = async (portfolioId, symbol, demat, price, quantity, exchange, type) => {
        try {
            const response = await fetch(`${host}/api/stocks/${portfolioId}/addstock`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem('token'),
                },
                body: JSON.stringify({ symbol, demat, price, quantity, exchange, type }),
            });
            const stock = await response.json();
            setStocks((prevStocks) => [...prevStocks, stock]);
        } catch (error) {
            console.error("Failed to add stock:", error);
        }
    };

    // Update a stock
    const updateStock = async (id, updatedStock) => {
        try {
            const response = await fetch(`${host}/api/stocks/updatestock/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem('token'),
                },
                body: JSON.stringify(updatedStock),
            });
            const stock = await response.json();
            setStocks((prevStocks) => 
                prevStocks.map((stk) => (stk._id === id ? stock : stk))
            );
        } catch (error) {
            console.error("Failed to update stock:", error);
        }
    };

    // Delete a stock
    const deleteStock = async (id) => {
        try {
            await fetch(`${host}/api/stocks/deletestock/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem('token'),
                },
            });
            setStocks((prevStocks) => prevStocks.filter((stk) => stk._id !== id));
        } catch (error) {
            console.error("Failed to delete stock:", error);
        }
    };

    return (
        <StockContext.Provider value={{ stocks, fetchStocks, addStock, updateStock, deleteStock }}>
            {children}
        </StockContext.Provider>
    );
};

export { StockProvider, StockContext };
