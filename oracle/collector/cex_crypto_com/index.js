const { priceFeed } = require("./priceScript");

async function cex_crypto_com_prices() {
  const prices = await priceFeed();
  return {
    prices,
  };
}
exports.cex_crypto_com_prices = cex_crypto_com_prices;
