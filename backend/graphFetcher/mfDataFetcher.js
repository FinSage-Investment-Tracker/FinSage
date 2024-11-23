const fetch = require('node-fetch');
const MFTransaction = require('../models/MfTransaction'); // Import the StockTransaction model


async function fetchStockData(symbol, fromDate, toDate, period) {

    const apiKey = process.env.EODHD; // You need to insert your API key here.
    
    // Build the URL with the appropriate period (weekly or daily)
    const url = `https://eodhd.com/api/eod/${symbol}.NSE?from=${fromDate}&to=${toDate}&period=${period}&api_token=${apiKey}&fmt=json`;

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

async function getAllStockData(stocks, duration) {
    const allStockData = new Array(stocks.length);
    const quantities = new Array(stocks.length);
    const buy_dates = new Array(stocks.length);
    const types = new Array(stocks.length); // Array for transaction types
    
    const today = new Date();
    const toDate = today.toISOString().slice(0, 10);

    let fromDateString;

    if (duration === "all") {
        // Ensure there are transactions to process
        if (stocks.length === 0) {
            console.error("No transactions found in portfolio.");
            return;  // or handle this case appropriately
        }
    
        // Filter out invalid buy dates if necessary
        const validStocks = stocks.filter(stock => !isNaN(new Date(stock.buy_date).getTime()));
    
        if (validStocks.length === 0) {
            console.error("No valid buy dates found in transactions.");
            return;  // or handle this case appropriately
        }
    
        // Find the earliest buy date from all transactions
        const earliestDate = new Date(Math.min(...validStocks.map(stock => new Date(stock.buy_date))));
        fromDateString = earliestDate.toISOString().slice(0, 10);
        console.log(`Earliest buy date: ${fromDateString}`);  // Debugging log for the earliest date
    }else {
        // If duration is not "all", calculate fromDate based on duration in months
        const fromDate = new Date(today);
        fromDate.setMonth(today.getMonth() - duration); // Subtract duration in months
        fromDateString = fromDate.toISOString().slice(0, 10);
    }

    // Determine the period based on the duration
    let period = duration === "1" ? 'd' : 'w';  // If duration is 1 month, use daily ('d'), otherwise use weekly ('w')
    if (duration === "all") {
        // If duration is "all", we always fetch weekly data
        period = 'w';
    }

    for (let i = 0; i < stocks.length; i++) {
        quantities[i] = stocks[i].quantity;
        buy_dates[i] = stocks[i].buy_date;
        types[i] = stocks[i].type; // Store the transaction type

        const stockData = await fetchStockData(stocks[i].symbol, fromDateString, toDate, period);
        if (stockData) {
            allStockData[i] = stockData;
        } else {
            allStockData[i] = [];
        }
    }

    return { allStockData, quantities, buy_dates, types }; // Return types as well
}

async function processMFData(portfolioId, duration) {
    // Fetch transactions for the given portfolio ID
    const transactions = await MFTransaction.find({ portfolio: portfolioId }).exec();
    
    // Log the fetched transactions for debugging

    const stocks = transactions.map(transaction => ({
        symbol: transaction.symbol,
        quantity: transaction.units,
        buy_date: transaction.date,
        type: transaction.type // Ensure you get the transaction type
    }));

    // Get stock data, quantities, buy dates, and types
    const { allStockData, quantities, buy_dates, types } = await getAllStockData(stocks, duration);

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