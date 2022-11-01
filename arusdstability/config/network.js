const Web3 = require("web3");
const { fuji_url, avax_url, bamboo_url } = require("../../config/config.rpc");

function getNetwork() {
  const args = process.argv.slice(2);
  return args[0] || "fuji";
}

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
    return "https://api.arable.finance/api";
  }
  return "https://api.bamboo.arable.finance/api";
};
