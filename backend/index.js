const connectToMongo = require('./db');
const express = require('express');
var cors = require('cors');

connectToMongo();

const app = express()
const port = 5000
app.use(cors());
app.use(express.json());

//available routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/portfolio', require('./routes/portfolio'))
app.use('/api/stocks', require('./routes/stocks'))
app.use('/api/mutualfund', require('./routes/mutualfunds'))



app.listen(port, () => {
    console.log(`listening on port ${port}`)
})