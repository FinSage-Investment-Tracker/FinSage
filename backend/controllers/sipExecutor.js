const Sip = require('../models/Sip');
const StockTransaction = require('../models/StockTransaction');
const Stock = require('../models/Stock');
const fetchStockPrice = require('../services/fetchStockPrice');

const sipExecutor = async () =>{
    try {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0); // Normalize today's date to midnight

        // Find all SIPs that are active (startDate <= today) or ended in the past
        const sips = await Sip.find({
            startDate: { $lte: today }
        });

        for (const sip of sips) {
            const startDate = new Date(sip.startDate);
            startDate.setUTCHours(0, 0, 0, 0);
            const endDate = sip.endDate ? new Date(sip.endDate) : null;

            // Set initial transaction date as lastTransactionDate or startDate
            let transactionDate = sip.lastTransactionDate ? new Date(sip.lastTransactionDate) : startDate;
            transactionDate.setUTCHours(0, 0, 0, 0); // Ensure consistent time

            // Loop through each month from the last transaction date to today or until endDate, if set
            while (transactionDate <= today) {
                // Break if the transaction date exceeds endDate (if endDate is set)
                if (endDate && transactionDate > endDate) {
                    console.log(`End date reached for ${sip.symbol}. Removing SIP entry.`);
                    await Sip.deleteOne({ _id: sip._id }); // Delete SIP after reaching endDate
                    break;
                }

                // Check if a transaction already exists for this SIP on this date
                const existingTransaction = await StockTransaction.findOne({
                    portfolio: sip.portfolio,
                    symbol: sip.symbol,
                    date: transactionDate,
                });

                if (!existingTransaction) {
                    console.log(`Processing SIP for ${sip.symbol} on ${transactionDate.toISOString().split('T')[0]}`);
                    
                    const price = await fetchStockPrice(sip.symbol, transactionDate.toISOString().split('T')[0]);

                    // Create the stock transaction
                    const stockTransaction = new StockTransaction({
                        portfolio: sip.portfolio,
                        symbol: sip.symbol,
                        price,
                        quantity: sip.quantity,
                        type: 'buy',
                        date: transactionDate,
                    });
                    await stockTransaction.save();
                    console.log(`Transaction saved for ${sip.symbol} on ${transactionDate.toISOString().split('T')[0]}`);

                    // Update the stock holding or create a new one
                    let stock = await Stock.findOne({ portfolio: sip.portfolio, symbol: sip.symbol });
                    if (stock) {
                        // Update existing stock average price and quantity
                        const totalAmount = (stock.price * stock.quantity) + (price * sip.quantity);
                        const totalQuantity = stock.quantity + sip.quantity;
                        stock.price = totalAmount / totalQuantity;
                        stock.quantity = totalQuantity;
                        await stock.save();
                    } else {
                        // Create a new stock holding
                        stock = new Stock({
                            portfolio: sip.portfolio,
                            symbol: sip.symbol,
                            price,
                            quantity: sip.quantity,
                        });
                        await stock.save();
                    }
                    console.log(`Stock updated for ${sip.symbol} on ${transactionDate.toISOString().split('T')[0]}`);

                    // Update SIP's lastTransactionDate to avoid repeated transactions
                    sip.lastTransactionDate = transactionDate;
                    await sip.save();
                } else {
                    console.log(`Transaction already exists for ${sip.symbol} on ${transactionDate.toISOString().split('T')[0]}`);
                }

                // Increment transactionDate by one month after processing
                transactionDate.setMonth(transactionDate.getMonth() + 1);
            }

            // Final deletion check: Remove the SIP if today has surpassed endDate
            if (endDate && today > endDate) {
                console.log(`Removing expired SIP for ${sip.symbol} with end date ${endDate.toISOString().split('T')[0]}`);
                await Sip.deleteOne({ _id: sip._id });
            }
        }
    } catch (error) {
        console.error('Error executing SIP transactions:', error);
    }
}

module.exports = { sipExecutor };