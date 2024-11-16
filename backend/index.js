const connectToMongo = require('./db');
const express = require('express');
var cors = require('cors');
const { populateStockSymbols } = require('./populateStockSymbols');
const getStockNews = require('./routes/stockNewsScrapper')

const cron = require('node-cron');
const { populateMFSymbols } = require('./populateMfSymbols');

connectToMongo();

const app = express()
const port = 5000
app.use(cors());
app.use(express.json());

//available routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/portfolio', require('./routes/portfolio'))
app.use('/api/stocks', require('./routes/stocks'))
app.use('/api/gold', require('./routes/gold'))
app.use('/api/sips', require('./routes/sip'))
app.use('/api/mutualfunds', require('./routes/mutualfunds'))
app.use('/api/fixeddeposit', require('./routes/fixeddeposit'))
app.use('/api/charts', require('./routes/charts'))
app.use('/api/stocksymbol', require('./routes/StockSymbols'))
app.use('/api/mfsymbol', require('./routes/MfSymbols'))
app.use('/api/news', require('./routes/news'))
app.get('/api/stock-news', async (req, res) => {
    const company = req.query.company; // Get company name from query or default to "Tata Steel"
    try {
      const news = await getStockNews(company); // Pass company to the scraper
      res.json(news);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching news', error });
    }
  });

app.use('/api/alerts', require('./routes/alert'))

require('./services/sipScheduler');
require('./services/alertChecker');


// populateStockSymbols();
// populateMFSymbols();



app.listen(port, () => {
    console.log(`listening on port ${port}`)
})