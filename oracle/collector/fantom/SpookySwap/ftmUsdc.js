const Web3 = require('web3');
const contract_abi = require('./abis/lp_abi');
const erc20 = require('./abis/erc20_abi');
const priceUsdc_abi = require('./abis/priceUsdc_abi');
const priceFtm_abi = require('./abis/priceFtm_abi');
const masterContract_abi = require('./abis/masterContract_abi');
const { fantom_url } = require('../../../../config/config.rpc');

const masterContractAddress = '0x2b2929e785374c651a81a63878ab22742656dcdd';
const lpContractAddress = '0x2b4C76d0dc16BE1C31D4C1DC53bF9B45987Fc75c';
const ftmAddress = '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83';
const usdcAddress = '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75';
const priceFeedFtmAddress = '0xf4766552D15AE4d256Ad41B6cf2933482B0680dc';
const priceFeedUsdcAddress = '0x2553f4eeb82d5A26427b8d1106C51499CBa5D99c';

async function spookySwap_ftm_usdc_collector() {
  try {
    const web3 = new Web3(fantom_url);

    const masterContract = new web3.eth.Contract(
      masterContract_abi,
      masterContractAddress
    );
    const poolContract = new web3.eth.Contract(contract_abi, lpContractAddress);
    const ftmContract = new web3.eth.Contract(erc20, ftmAddress);
    const usdcContract = new web3.eth.Contract(erc20, usdcAddress);
    const priceFtmContract = new web3.eth.Contract(
      priceFtm_abi,
      priceFeedFtmAddress
    );
    const priceUsdcContract = new web3.eth.Contract(
      priceUsdc_abi,
      priceFeedUsdcAddress
    );

    const poolInfo = await masterContract.methods.poolInfo(2).call();
    const totalPoolAllocation = await masterContract.methods
      .totalAllocPoint()
      .call();
    //Spookyswap uses boo per second instead of per block see reason why here : https://docs.spookyswap.finance/tokenomics-1/why-boo-per-second
    const booPerSecond = await masterContract.methods.booPerSecond().call();
    const poolAllocation = poolInfo.allocPoint;
    const poolAllocationPercent = (poolAllocation * 100) / totalPoolAllocation;
    const poolBooRewardPerSecond =
      (poolAllocationPercent * booPerSecond) / 1e18 / 100;
    //live Price of FTM
    const ftmPriceRoundData = await priceFtmContract.methods
      .latestRoundData()
      .call();
    const ftmPriceRoundAnswer = await ftmPriceRoundData.answer;
    const ftmPriceDecimals = await priceFtmContract.methods.decimals().call();
    const ftmPrice =
      (await ftmPriceRoundAnswer) / Math.pow(10, ftmPriceDecimals);
    //live Price of USDC
    const usdcPriceRoundData = await priceUsdcContract.methods
      .latestRoundData()
      .call();
    const usdcPriceRoundAnswer = await usdcPriceRoundData.answer;
    const usdcPriceDecimals = await priceUsdcContract.methods.decimals().call();
    const usdcPrice =
      (await usdcPriceRoundAnswer) / Math.pow(10, usdcPriceDecimals);
    //checking supply of the pool
    const totalSupplyPool = await poolContract.methods.totalSupply().call();
    const totalSupplyDecimals = await poolContract.methods.decimals().call();
    const totalSupply =
      (await totalSupplyPool) / Math.pow(10, totalSupplyDecimals);

    const ftmDecimals = await ftmContract.methods.decimals().call();
    const usdcDecimals = await usdcContract.methods.decimals().call();
    const reserves = await poolContract.methods.getReserves().call();
    const totalUsdc = (await reserves[0]) / Math.pow(10, usdcDecimals);
    const totalFtm = (await reserves[1]) / Math.pow(10, ftmDecimals);
    //calculating total liquidity
    const totalLiquidity = totalFtm * ftmPrice + totalUsdc * usdcPrice;
    const lpTokenPrice = totalLiquidity / totalSupply;

    return {
      poolAllocationPercent,
      poolBooRewardPerSecond,
      ftmPrice,
      usdcPrice,
      lpTokenPrice,
    };
  } catch (error) {
    console.log('something went wrong while fetching USDC-FTM LP pool');
  }
}

exports.spookySwap_ftm_usdc_collector = spookySwap_ftm_usdc_collector;
