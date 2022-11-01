const { collect_avalanche } = require("./avalanche");
const { collect_bsc } = require("./bsc");
const { collect_osmosis } = require("./osmosis");
const { collect_solana } = require("./solana");
const { collect_eth } = require("./ethereum");
const { collect_polygon } = require("./polygon");
const { coingecko_prices } = require("./coingecko");
const { collect_terra } = require("./terra");
const { cex_binance_prices } = require("./cex_binance");
const { cex_crypto_com_prices } = require("./cex_crypto_com");

async function collect() {
  let coingecko = {},
    avalanche = {},
    bsc = {},
    solana = {},
    osmosis = {},
    eth = {},
    poly = {},
    terra = {},
    cex_binance = {},
    cex_crypto_com = {};
  try {
    console.log("collecting coingecko prices");
    coingecko = await coingecko_prices();
  } catch (error) {
    console.error(error);
  }

  try {
    console.log("collecting avalanche information");
    avalanche = await collect_avalanche(coingecko);
  } catch (error) {
    console.error(error);
  }

  try {
    console.log("collecting bsc information");
    bsc = await collect_bsc(coingecko);
  } catch (error) {
    console.error(error);
  }

  try {
    console.log("collecting solana information");
    solana = await collect_solana(coingecko);
  } catch (error) {
    console.error(error);
  }

  try {
    console.log("collecting osmosis information");
    osmosis = {}; //  await collect_osmosis(coingecko);
  } catch (error) {
    console.error(error);
  }

  try {
    console.log("collecting ethereum information");
    eth = await collect_eth(coingecko);
  } catch (error) {
    console.error(error);
  }

  try {
    console.log("collecting polygon information");
    poly = await collect_polygon(coingecko);
  } catch (error) {
    console.error(error);
  }

  try {
    console.log("collecting terra information");
    terra = await collect_terra(coingecko);
  } catch (error) {
    console.error(error);
  }

  try {
    console.log("collecting cex binance information");
    cex_binance = await cex_binance_prices();
  } catch (error) {
    console.error(error);
  }

  try {
    console.log("collecting cex crypto.com information");
    cex_crypto_com = await cex_crypto_com_prices();
  } catch (error) {
    console.error(error);
  }

  return {
    coingecko,
    avalanche,
    bsc,
    solana,
    osmosis,
    eth,
    poly,
    terra,
    cex_binance,
    cex_crypto_com,
  };
}

async function collect_fast_prices() {
  let coingecko = {},
    cex_binance = {},
    cex_crypto_com = {};
  try {
    console.log("collecting fast coingecko prices");
    coingecko = await coingecko_prices();
  } catch (error) {
    console.error(error);
  }

  try {
    console.log("collecting fast cex binance information");
    cex_binance = await cex_binance_prices();
  } catch (error) {
    console.error(error);
  }

  try {
    console.log("collecting fast cex crypto.com information");
    cex_crypto_com = await cex_crypto_com_prices();
  } catch (error) {
    console.error(error);
  }

  return {
    coingecko,
    cex_binance,
    cex_crypto_com,
  };
}

exports.collect = collect;
exports.collect_fast_prices = collect_fast_prices;
