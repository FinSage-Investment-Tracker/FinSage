async function fetchStockPrice(symbol, formattedDate) {
    const API_KEY = ""; // Add your API key here 66f3115d0f1214.40427570
    const url = `https://eodhd.com/api/eod/${symbol}.nse?from=${formattedDate}&to=${formattedDate}&period=d&api_token=${API_KEY}&fmt=json`;
    try {
        // const response = await fetch(url);
        // const data = await response.json();
        // const close = data[0].close;
        const close = 100;
        return close;
    } catch (error) {
        console.error('Error fetching stock price:', error);
        throw new Error('Could not fetch stock price');
    }
}

module.exports = fetchStockPrice;
