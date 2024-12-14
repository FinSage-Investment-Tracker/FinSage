import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const StockItem = ({ stock, sellStock, openAlertModal }) => {
    const navigate = useNavigate();
    const handleStockClick = (symbol) => {
        navigate(`/stockinfo/${symbol}`);
    };
    const [todayPrice, setTodayPrice] = useState(null);

    const getPrice = async () => {
        const API_TOKEN = '67513154014743.32771947';
        const url = `https://eodhd.com/api/eod/${stock.symbol}.nse?api_token=${API_TOKEN}&fmt=json`;
    
        try {
            const response = await fetch(url);
            const data = await response.json();
            
            if (data && data.length > 0) {
                // Fetch the latest price from the last object in the response
                const latestPrice = data[data.length - 1].close;
                setTodayPrice(latestPrice);
            } else {
                console.error("No data available for the given stock symbol.");
            }
        } catch (error) {
            console.error("Error fetching stock price:", error);
        }
    };
    

    useEffect(() => {
        getPrice();
        // eslint-disable-next-line
    }, []);

    const invested = stock.price * stock.quantity;
    const current = todayPrice ? todayPrice * stock.quantity : 0;
    const returns_change = invested ? ((current - invested) / invested) * 100 : 0;

    return (
        <>
        <div className="card w-100 mb-3" style={{ padding: '15px' }}>
            <div className="d-flex justify-content-between align-items-center">
            <div className="col" style={{ cursor: 'pointer', color: 'blue' }}
                    onClick={() => handleStockClick(stock.symbol)}>{stock.symbol}</div>
                <div className="col">{stock.quantity}</div>
                <div className="col">{stock.price.toFixed(2)}</div>
                <div className="col">{todayPrice}</div>
                <div className="col">{invested}</div>
                <div className="col" style={{ color: current >= invested ? 'green' : 'red', fontWeight: 'bold' }}>{current.toFixed(2)}</div>
                <div className="col" style={{ color: returns_change > 0 ? 'green' : 'red', fontWeight: 'bold' }}>{returns_change.toFixed(2)}%</div>
                <button type="button" className="btn btn-danger" onClick={() => sellStock(stock)} >Sell</button>
                <i className="fa-solid fa-bell col-auto mx-3" style={{ cursor: 'pointer' }} onClick={() => openAlertModal(stock)} ></i>
            </div>
        </div>
        </>
    );
};

export default StockItem;
