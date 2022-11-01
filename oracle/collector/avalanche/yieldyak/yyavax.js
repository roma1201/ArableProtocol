const { BigNumber, Contract, providers, utils } = require("ethers");
const { avax_url } = require("../../../../config/config.rpc");
const yyavax_abi = require("../../libs/yyavax_abi");
const { yyAVAXAddress } = require("../../libs/address");
const provider = new providers.JsonRpcProvider(avax_url);

const { parseEther, formatEther } = utils;

async function yieldyak_yyavax_collector(coingecko) {
  try {
    const yyAVAXContract = new Contract(yyAVAXAddress, yyavax_abi, provider);
    const multiplier = await yyAVAXContract.pricePerShare();
    const avaxPrice = coingecko.prices["avalanche-2"].usd;
    const yyAVAXPrice = parseEther(String(avaxPrice))
      .mul(multiplier)
      .div(parseEther("1"));

    return {
      yyAVAXPrice: Number(formatEther(yyAVAXPrice)),
    };
  } catch (error) {
    console.log(error);
  }
}

exports.yieldyak_yyavax_collector = yieldyak_yyavax_collector;
