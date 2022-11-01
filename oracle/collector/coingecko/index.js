const { priceFeed } = require('./priceScript');

async function coingecko_prices() {
  const prices = await priceFeed();
  return {
    prices,
  };
}
exports.coingecko_prices = coingecko_prices;
