const { BigNumber, Contract, providers, utils } = require("ethers");
const { avax_url } = require("../../../../config/config.rpc");
const vaavax_abi = require("../../libs/vaavax_abi");
const { vaAVAXAddress } = require("../../libs/address");
const provider = new providers.JsonRpcProvider(avax_url);

const { parseEther, formatEther } = utils;

async function vesper_vaavax_collector(coingecko) {
  try {
    const vaAVAXContract = new Contract(vaAVAXAddress, vaavax_abi, provider);
    const multiplier = await vaAVAXContract.pricePerShare();
    const avaxPrice = coingecko.prices["avalanche-2"].usd;
    const vaAVAXPrice = parseEther(String(avaxPrice))
      .mul(multiplier)
      .div(parseEther("1"));

    return {
      vaAVAXPrice: Number(formatEther(vaAVAXPrice)),
    };
  } catch (error) {
    console.log(error);
  }
}

exports.vesper_vaavax_collector = vesper_vaavax_collector;
