const { default: axios } = require('axios');
const StockSymbol = require('./models/StockSymbols');

// Define the function to populate stock symbols
const populateStockSymbols = async () => {
    console.log('Populate stock symbols function called');  // To confirm if function is being triggered
    try {
        // Fetch stock symbols from the API
        const response = await axios.get('https://eodhd.com/api/exchange-symbol-list/NSE?api_token=YOUR_API_KEY&fmt=json');

        // Extract symbols and names
        const symbols = response.data
            .filter(stock => stock.Code && stock.Name && stock.Type=="Common Stock")  // Ensure both Code and Name are present
            .map(stock => ({ 
                symbol: stock.Code, 
                name: stock.Name  // Adding the name field
            }));

        // Log before inserting to verify symbols data
        console.log('Inserting the following symbols:', symbols);

        // Insert symbols into the database
        const result = await StockSymbol.insertMany(symbols);
        console.log('Stock symbols inserted successfully:', result);  // Log the result to verify insertion
    } catch (error) {
        console.error('Error inserting stock symbols:', error);  // Log any errors during insert
    }
};

module.exports = { populateStockSymbols };