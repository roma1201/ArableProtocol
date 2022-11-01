const Web3 = require("web3");
const { fuji_url, avax_url, bamboo_url } = require("../../config/config.rpc");

exports.setup = function () {
  const chainId = Number(process.env.CHAIN_ID || "43113");
  if (chainId == 43114) {
    return new Web3(avax_url);
  }
  if (chainId == 43113) {
    return new Web3(fuji_url);
  }
  return new Web3(bamboo_url);
};

exports.getBackendApiUrl = function () {
  const chainId = Number(process.env.CHAIN_ID || "43113");
  if (chainId == 43114) {
    return "https://api.arable.finance/api";
  }
  if (chainId == 43113) {
    return "https://api.fuji.arable.finance/api";
  }
  return "https://api.bamboo.arable.finance/api";
};

exports.getLiquidationSubgraphEndPoint = function () {
  const chainId = Number(process.env.CHAIN_ID || "43113");
  if (chainId == 43114) {
    return "https://api.thegraph.com/subgraphs/name/arableprotocol/arable-liquidation-avax";
  }
  if (chainId == 43113) {
    return "https://api.thegraph.com/subgraphs/name/arableprotocol/arable-liquidation-fuji";
  }
  return "https://thegraph-bamboo.arableapi.com/subgraphs/name/liquidation";
};
