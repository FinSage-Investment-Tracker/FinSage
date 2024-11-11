const connectToMongo = require('./db');
const express = require('express');
var cors = require('cors');
const { populateStockSymbols } = require('./populateStockSymbols');

connectToMongo();

const app = express()
const port = 5000
app.use(cors());
app.use(express.json());

//available routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/portfolio', require('./routes/portfolio'))
app.use('/api/stocks', require('./routes/stocks'))
app.use('/api/mutualfunds', require('./routes/mutualfunds'))
app.use('/api/fixeddeposit', require('./routes/fixeddeposit'))
app.use('/api/charts', require('./routes/charts'))
app.use('/api/stocksymbol', require('./routes/StockSymbols'))
// populateStockSymbols();




app.listen(port, () => {
    console.log(`listening on port ${port}`)
})