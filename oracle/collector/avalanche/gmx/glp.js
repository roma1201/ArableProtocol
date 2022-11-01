const { BigNumber, Contract, providers, utils } = require("ethers");
const { avax_url } = require("../../../../config/config.rpc");
const glp_pool_abi = require("../../libs/glp_pool_abi");
const erc20_abi = require("../../libs/erc20_abi");
const yy_glp_abi = require("../../libs/yy_glp_abi");
const {
  GLPAddress,
  GLPPoolAddress,
  yyGLPAddress,
} = require("../../libs/address");
const provider = new providers.JsonRpcProvider(avax_url);

const { parseEther, formatEther, parseUnits } = utils;

async function gmx_glp_collector(coingecko) {
  try {
    const GLPContract = new Contract(GLPAddress, erc20_abi, provider);
    const glpSupply = await GLPContract.totalSupply();
    const GLPPoolContract = new Contract(
      GLPPoolAddress,
      glp_pool_abi,
      provider
    );
    const poolUsdValue = await GLPPoolContract.getAumInUsdg(true);
    const yyGLPContract = new Contract(yyGLPAddress, yy_glp_abi, provider);
    const sharePrice = await yyGLPContract.getDepositTokensForShares(
      parseEther("1")
    );
    const glpPrice = parseEther(String(poolUsdValue)).div(glpSupply);
    const yyGLPPrice = glpPrice.mul(sharePrice).div(parseEther("1"));

    return {
      glpPrice: Number(formatEther(glpPrice)),
      yyGlpPrice: Number(formatEther(yyGLPPrice)),
    };
  } catch (error) {
    console.log(error);
  }
}

exports.gmx_glp_collector = gmx_glp_collector;
