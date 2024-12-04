async function fetchStockPrice(symbol, formattedDate) {
    const API_KEY = '67509a113de9e2.28909585';
    const baseURL = `https://eodhd.com/api/eod/${symbol}.nse`;
    const maxRetries = 5; // Maximum number of days to try
    let currentDate = new Date(formattedDate);

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        const formattedCurrentDate = currentDate.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
        const url = `${baseURL}?from=${formattedCurrentDate}&to=${formattedCurrentDate}&period=d&api_token=${API_KEY}&fmt=json`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data && data.length > 0) {
                const close = data[0].close;
                return close; // Return the close price if data is available
            } else {
                console.log(`No data for ${formattedCurrentDate}, trying next date...`);
            }
            // return 100;
        } catch (error) {
            console.error(`Error fetching stock price for ${formattedCurrentDate}:`, error);
        }

        // Move to the next date
        currentDate.setDate(currentDate.getDate() + 1);
    }

    throw new Error(`Could not fetch stock price for ${symbol} within ${maxRetries} days of ${formattedDate}`);
}

module.exports = fetchStockPrice;
