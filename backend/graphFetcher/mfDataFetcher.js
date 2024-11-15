const fetch = require('node-fetch');
//###############################################
const MFTransaction = require('../models/MfTransaction'); // Import the StockTransaction model

const duration = 12;

async function fetchMFData(symbol, fromDate, toDate) {
    //66e9e5a7c52aa6.43032743
    //6729f2d7d26559.77635622
    const apiKey = process.env.EODHD;
    const url = `https://eodhd.com/api/eod/${symbol}.NSE?from=${fromDate}&to=${toDate}&period=w&api_token=${apiKey}&fmt=json`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching data for ${symbol}: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function getAllMFData(stocks) {
    const allStockData = new Array(stocks.length);
    const quantities = new Array(stocks.length);
    const buy_dates = new Array(stocks.length);
    const types = new Array(stocks.length); // Array for transaction types
    
    const today = new Date();
    const toDate = today.toISOString().slice(0, 10);
    
    const fromDate = new Date(today);
    fromDate.setMonth(today.getMonth() - duration);
    const fromDateString = fromDate.toISOString().slice(0, 10);

    for (let i = 0; i < stocks.length; i++) {
        quantities[i] = stocks[i].quantity;
        buy_dates[i] = stocks[i].buy_date;
        types[i] = stocks[i].type; // Store the transaction type

        const stockData = await fetchMFData(stocks[i].symbol, fromDateString, toDate);
        if (stockData) {
            allStockData[i] = stockData;
        } else {
            allStockData[i] = [];
        }
    }

    return { allStockData, quantities, buy_dates, types }; // Return types as well
}

async function processMFData(portfolioId) {
    // Fetch transactions for the given portfolio ID
    //####################################################
    const transactions = await MFTransaction.find({ portfolio: portfolioId }).exec();
    
    // Log the fetched transactions for debugging
    // console.log("MF Transactions:", transactions); 

    const stocks = transactions.map(transaction => ({
        symbol: transaction.symbol,
        quantity: transaction.invested / transaction.nav,
        buy_date: transaction.date,
        type: transaction.type // Ensure you get the transaction type
    }));
    // console.log("MF: ", stocks);

    // Get stock data, quantities, buy dates, and types
    const { allStockData, quantities, buy_dates, types } = await getAllMFData(stocks);

    if (allStockData[0] && allStockData[0].length > 0) {
        const Data = new Array(allStockData[0].length).fill(null).map(() => ({ date: "", value: 0 }));

        for (let i = 0; i < allStockData.length; i++) {
            const stockData = allStockData[i];
            const buy_date = buy_dates[i];
            let quantity = quantities[i]; // Use a mutable quantity for calculations

            stockData.forEach((item, index) => {
                Data[index].date = item.date;

                // Check the transaction type to adjust quantity accordingly
                if (new Date(item.date) > new Date(buy_date)) {
                    // If the transaction type is 'buy', add quantity, else subtract it
                    if (types[i] === 'buy') {
                        Data[index].value += quantity * item.close; // Add for buy
                    } else if (types[i] === 'sell') {
                        Data[index].value -= quantity * item.close; // Subtract for sell
                    }
                }
            });
        }

        return Data; // Return processed data
    } else {
        console.error("No MF data available for processing.");
        return [];
    }
}

// Make sure to export the function properly
module.exports = { processMFData };