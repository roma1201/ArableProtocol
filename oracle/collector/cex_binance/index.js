const { priceFeed } = require("./priceScript");

async function cex_binance_prices() {
  const prices = await priceFeed();
  return {
    prices,
  };
}
exports.cex_binance_prices = cex_binance_prices;
