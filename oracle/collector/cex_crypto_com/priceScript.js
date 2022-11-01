const axios = require("axios");

let ids = ["crousdt"];
let url = `https://api.crypto.com/v1/ticker/price`;

async function priceFeed() {
  let result = await axios.get(url).then(function (priceFeed) {
    return priceFeed.data;
  });

  return result.data;
}

exports.priceFeed = priceFeed;
