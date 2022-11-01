const Web3 = require("web3");
const { Contract, providers } = require("ethers");
const { fuji_url, avax_url, bamboo_url } = require("../../config/config.rpc");

function getNetwork() {
  const chainId = Number(process.env.CHAIN_ID || "43113");
  if (chainId == 43114) {
    return "avax";
  }
  if (chainId == 43113) {
    return "fuji";
  }
  return "bamboo";
}

exports.getEthersProvider = function () {
  const network = getNetwork();
  if (network == "avax") {
    return new providers.JsonRpcProvider(avax_url);
  }
  if (network == "fuji") {
    return new providers.JsonRpcProvider(fuji_url);
  }
  return new providers.JsonRpcProvider(bamboo_url);
};

exports.setup = function () {
  const network = getNetwork();
  if (network == "avax") {
    return new Web3(avax_url);
  }
  if (network == "fuji") {
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

exports.getNetwork = getNetwork;

exports.getOffChainBackendApiUrl = function () {
  const chainId = Number(process.env.CHAIN_ID || "43113");

  if (chainId === 43114) {
    return "https://avax.arableapi.com/api";
  } else if (chainId === 43113) {
    return "https://fuji.arableapi.com/api";
  } else {
    return "https://bamboo.arableapi.com/api";
  }
};
