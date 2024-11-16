const { default: axios } = require('axios');
const MFSymbol = require('./models/MfSymbols');

// Define the function to populate stock symbols
const populateMFSymbols = async () => {
    console.log('Populate stock symbols function called');  // To confirm if function is being triggered
    try {
        // Fetch stock symbols from the API
        const response = await axios.get('https://eodhd.com/api/exchange-symbol-list/NSE?api_token=66e9e5a7c52aa6.43032743&fmt=json');

        // Extract symbols and names
        const symbols = response.data
            .filter(stock => stock.Code && stock.Name && (stock.Type=="ETF" || stock.Type=="FUND"))  // Ensure both Code and Name are present
            .map(stock => ({ 
                symbol: stock.Code, 
                name: stock.Name  // Adding the name field
            }));

        // Log before inserting to verify symbols data
        console.log('Inserting the following symbols:', symbols);

        // Insert symbols into the database
        const result = await MFSymbol.insertMany(symbols);
        console.log('Stock symbols inserted successfully:', result);  // Log the result to verify insertion
    } catch (error) {
        console.error('Error inserting stock symbols:', error);  // Log any errors during insert
    }
};

module.exports = { populateMFSymbols };