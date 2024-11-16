import React, { createContext, useState } from 'react';

const StockContext = createContext();

const StockProvider = ({ children }) => {
    const host = "http://localhost:5000";
    const [stocks, setStocks] = useState([]);
    const [stocktransactions, setStockTransactions] = useState([]);
    const [sips, setSips] = useState([]);
    const [alerts, setAlerts] = useState([]);

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

    // fetch active sips
    const fetchSips = async (portfolioId) => {
        try {
            const response = await fetch(`${host}/api/sips/${portfolioId}/sips`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem('token'),
                },
            });
            const data = await response.json();
            setSips(data);
        } catch (error) {
            console.error("Failed to fetch SIPs:", error);
        }
    };

    // Add a stock to a portfolio
    const addSip = async (portfolioId, symbol, quantity, startDate, endDate) => {
        try {
            const response = await fetch(`${host}/api/sips/${portfolioId}/start`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem('token'),
                },
                body: JSON.stringify({ symbol, quantity, startDate, endDate}),
            });
            const data = await response.json();
            setSips((prev) => [...prev, data]);
        } catch (error) {
            console.error("Failed to add stock:", error);
        }
    };

    // Break or delete SIP
    const deleteSip = async (id) =>{
    const response = await fetch(`${host}/api/sips/deletesip/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem('token')
        }
    });
    // eslint-disable-next-line
    const json = await response.json();

    setSips(sips.filter(item => item._id !== id));
    }

    const addAlert = async (symbol, alertPrice, condition) =>{
        try {
            const response = await fetch(`${host}/api/alerts/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem('token'),
                },
                body: JSON.stringify({ symbol, alertPrice, condition }),
            });
            const data = await response.json();
            if (response.ok) {
                alert("Alert set successfully!");
            } else {
                alert(data.error || "Error setting alert");
            }
        } catch (error) {
            console.error("Error setting alert:", error.message);
        }
    }

    const fetchAlerts = async () =>{
        try {
            const response = await fetch(`${host}/api/alerts/fetchallalerts`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem('token'),
                },
            });
            const data = await response.json();
            setAlerts(data)
        } catch (error) {
            console.error("Error fetching alerts:", error.message);
        }
    }

    const deleteAlert = async (id) =>{
        try {
            const response = await fetch(`${host}/api/alerts/deletealert/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem('token')
                }
              });
              // eslint-disable-next-line
              const json = await response.json();
        
              setAlerts(alerts.filter(item => item._id !== id));
        } catch (error) {
            
        }
    }

    return (
        <StockContext.Provider value={{ stocks, stocktransactions, fetchStocktransactions, fetchStocks, addStock, addSip, fetchSips, sips, deleteSip, addAlert, fetchAlerts, alerts, deleteAlert}}>
            {children}
        </StockContext.Provider>
    );
};

export { StockProvider, StockContext };
