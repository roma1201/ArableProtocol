const axios = require("axios");

let ids = [
  "SOLUSDT",
  "BTCUSDT",
  "ETHUSDT",
  "BNBUSDT",
  "AVAXUSDT",
  "MATICUSDT",
  "ATOMUSDT",
  "XRPUSDT",
  "ADAUSDC",
  "DOGEUSDT",
  "DOTUSDT",
  "AAVEUSDT",
  "TRXUSDT",
  "FILUSDT",
  "THETAUSDT",
  "AXSUSDT",
  "RUNEUSDT",
  "FTMUSDT",
  "KAVAUSDT",
  "KDAUSDT",
  "ONEUSDT",
  "FTTUSDT",
  "UNIUSDT",
  "LINKUSDT",
  "NEARUSDT",
  "ALGOUSDT",
  "ICPUSDT",
  "MANAUSDT",
  "APEUSDT",
  "GLMRUSDT",
];
let url = `https://api.binance.com/api/v3/ticker/price`;

async function priceFeed() {
  let result = await axios.get(url).then(function (priceFeed) {
    return priceFeed.data;
  });

  let shorten_result = {};
  for (let i = 0; i < result.length; i++) {
    shorten_result[result[i].symbol] = result[i].price;
  }
  return shorten_result;
}

exports.priceFeed = priceFeed;
