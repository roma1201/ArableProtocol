const { BigNumber, Contract, providers, utils } = require("ethers");
const { avax_url } = require("../../../../config/config.rpc");
const usdcn_abi = require("../../libs/usdcn_abi");
const { USDCnAddress } = require("../../libs/address");
const provider = new providers.JsonRpcProvider(avax_url);

const { parseEther, formatEther, parseUnits } = utils;

async function vesper_usdcn_collector(coingecko) {
  try {
    const USDCnContract = new Contract(USDCnAddress, usdcn_abi, provider);
    const multiplier = await USDCnContract.pricePerShare();
    const usdcPrice = 1;
    const USDCnPrice = parseEther(String(usdcPrice))
      .mul(multiplier)
      .div(parseUnits("1", 6));

    return {
      USDCnPrice: Number(formatEther(USDCnPrice)),
    };
  } catch (error) {
    console.log(error);
  }
}

exports.vesper_usdcn_collector = vesper_usdcn_collector;
