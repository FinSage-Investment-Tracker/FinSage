const StockDummy = require("../models/StockDummies");
const StockSymbols = require("../models/StockSymbols");
const StockTransaction = require("../models/StockTransaction");
const StockHold = require("../models/Stock");

const dummytoreal = async () => {
  try {
    const data = await StockDummy.find();
    if (data.length === 0) return;

    const stockTransactions = [];
    for (const item of data) {
      let symbol = item.symbol;
      let data2 = [];
      let length = 1;

      while (true) {
        data2 = await StockSymbols.find({
          symbol: { $regex: `^${symbol.substring(0, length)}`, $options: "i" },
        });
        length++;

        if (data2.length === 0) {
          console.log("No more data");
          break;
        }

        if (data2.length === 1) {
          const resolvedSymbol = data2[0].symbol;
          const transactionItem = { ...item._doc }; // Clone item for stockTransactions
          const stockHoldItem = { ...transactionItem }; // Clone item for StockHold
          

          transactionItem.symbol = resolvedSymbol;
          stockHoldItem.symbol = resolvedSymbol;
          console.log(stockHoldItem)

          const existingStock = await StockHold.findOne({
            symbol: stockHoldItem.symbol,
          });
          if (!existingStock) {
            delete stockHoldItem.type; // Remove 'type' if stock is new
            await StockHold.create(stockHoldItem);
          } else {
            if (stockHoldItem.type === "buy") {

              // Calculate the new average price and quantity for buy
              const newPrice =
                (existingStock.price * existingStock.quantity +
                  stockHoldItem.price * stockHoldItem.quantity) /
                (existingStock.quantity + stockHoldItem.quantity);
              const newQuantity =
                existingStock.quantity + stockHoldItem.quantity;

              // Update existing stock in StockHold
              await StockHold.updateOne(
                { _id: existingStock._id },
                { price: newPrice, quantity: newQuantity }
              );
            } 
          }

          stockTransactions.push(transactionItem); // Add to transactions array
          break;
        }
      }
    }

    if (stockTransactions.length > 0) {

      // Insert all stock transactions at once
      await StockTransaction.insertMany(stockTransactions);
      console.log("Stock transactions added successfully.");
    }

    // Clear StockDummy collection
    // await StockDummy.deleteMany({});
  } catch (error) {
    console.error("Error processing data:", error);
  }
};

module.exports = { dummytoreal };
