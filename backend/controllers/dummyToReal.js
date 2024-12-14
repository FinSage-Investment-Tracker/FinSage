const StockDummy = require("../models/StockDummies");
const StockSymbols = require("../models/StockSymbols");
const StockTransaction = require("../models/StockTransaction");
const StockHold = require("../models/Stock");

const dummytoreal = async () => {
  try {
    const dummyData = await StockDummy.find();
    if (dummyData.length === 0) {
      console.log("No dummy data found.");
      return;
    }

    const stockTransactions = [];

    for (const dummy of dummyData) {
      let { symbol, portfolio } = dummy;
      let possibleSymbols = [];
      let prefixLength = 1;

      // Resolve symbol
      while (true) {
        possibleSymbols = await StockSymbols.find({
          symbol: { $regex: `^${symbol.substring(0, prefixLength)}`, $options: "i" },
        });
        prefixLength++;

        if (possibleSymbols.length === 0) {
          console.log(`No matching symbol for: ${symbol}`);
          break;
        }

        if (possibleSymbols.length === 1) {
          const resolvedSymbol = possibleSymbols[0].symbol;

          // Prepare transaction and stock hold items
          const transactionItem = { ...dummy._doc, symbol: resolvedSymbol };
          const stockHoldItem = { ...transactionItem, symbol: resolvedSymbol };

          // Retrieve all stocks matching the symbol
          const existingStocks = await StockHold.find({ symbol: stockHoldItem.symbol });

          // Initialize flag to track if a match is found
          let matchFound = false;

          // Check each stock for a portfolio match 
          for (const existingStock of existingStocks) {
            if (existingStock.portfolio.toString() === stockHoldItem.portfolio.toString()) {
              // Match found, update stock
              const updatedPrice =
                (existingStock.price * existingStock.quantity +
                  stockHoldItem.price * stockHoldItem.quantity) /
                (existingStock.quantity + stockHoldItem.quantity);

              const updatedQuantity = existingStock.quantity + stockHoldItem.quantity;

              await StockHold.updateOne(
                { _id: existingStock._id },
                { price: updatedPrice, quantity: updatedQuantity }
              );

              console.log(
                `Updated stock in portfolio ${existingStock.portfolio}: Quantity: ${updatedQuantity}, Price: ${updatedPrice}`
              );

              matchFound = true; // Flag as found
              break;
            }
          }

          // If no match found, add new stock
          if (!matchFound) {
            delete stockHoldItem.type; // Remove 'type' for new entries
            await StockHold.create(stockHoldItem);
            console.log(`New stock added to portfolio ${stockHoldItem.portfolio}`);
          }

          // Add transaction for the stock
          stockTransactions.push(transactionItem);
          break;
        }
      }
    }

    // Batch insert stock transactions
    if (stockTransactions.length > 0) {
      await StockTransaction.insertMany(stockTransactions);
      console.log("Stock transactions added successfully.");
    }

    // Clear StockDummy collection
    await StockDummy.deleteMany({});
    console.log("StockDummy collection cleared.");
  } catch (error) {
    console.error("Error processing dummy-to-real transformation:", error);
  }
};

module.exports = { dummytoreal };
