import React, { createContext, useState } from 'react';

const StockContext = createContext();

const StockProvider = ({ children }) => {
    const host = "http://localhost:5000";
    const [stocks, setStocks] = useState([]);
    const [stocktransactions, setStockTransactions] = useState([]);

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

    // Fetch all stocks in a stock Transactions
    const fetchStocktransactions = async (portfolioId) => {
        try {
            const response = await fetch(`${host}/api/stocks/${portfolioId}/stocktransactions`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem('token'),
                },
            });
            const data = await response.json();
            setStockTransactions(data);
        } catch (error) {
            console.error("Failed to fetch stocks:", error);
        }
    };

    // Add a stock to a portfolio
    const addStock = async (portfolioId, symbol, price, quantity, type, date) => {
        try {
            const response = await fetch(`${host}/api/stocks/${portfolioId}/addstock`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem('token'),
                },
                body: JSON.stringify({ symbol, price, quantity, type, date}),
            });
            const stock = await response.json();
            setStocks((prevStocks) => [...prevStocks, stock]);
        } catch (error) {
            console.error("Failed to add stock:", error);
        }
    };

    // Update a stock

    // Delete a stock

    return (
        <StockContext.Provider value={{ stocks, stocktransactions, fetchStocktransactions, fetchStocks, addStock}}>
            {children}
        </StockContext.Provider>
    );
};

export { StockProvider, StockContext };
