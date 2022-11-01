const Web3 = require('web3');
const contract_abi = require('./abis/lp_abi');
const erc20 = require('./abis/erc20_abi');
const priceFtm_abi = require('./abis/priceFtm_abi');
const masterContract_abi = require('./abis/masterContract_abi');
const { default: axios } = require('axios');
const { fantom_url } = require('../../../../config/config.rpc');

const masterContractAddress = '0x2b2929e785374c651a81a63878ab22742656dcdd';
const lpContractAddress = '0xec7178f4c41f346b2721907f5cf7628e388a7a58';
const ftmAddress = '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83';
const booAddress = '0x841fad6eae12c286d1fd18d1d525dffa75c7effe';
const priceFeedFtmAddress = '0xf4766552D15AE4d256Ad41B6cf2933482B0680dc';

async function spookySwap_ftm_boo_collector() {
  try {
    const web3 = new Web3(fantom_url);

    const masterContract = new web3.eth.Contract(
      masterContract_abi,
      masterContractAddress
    );
    const poolContract = new web3.eth.Contract(contract_abi, lpContractAddress);
    const ftmContract = new web3.eth.Contract(erc20, ftmAddress);
    const booContract = new web3.eth.Contract(erc20, booAddress);
    const priceFtmContract = new web3.eth.Contract(
      priceFtm_abi,
      priceFeedFtmAddress
    );
    const poolInfo = await masterContract.methods.poolInfo(0).call();
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
    //live Price of boo
    const response = axios.get(
      'https://api.coingecko.com/api/v3/coins/spookyswap/tickers'
    );
    const priceTicker = (await response).data.tickers.filter(
      (item) => item.market.name == 'Spookyswap'
    )[0];
    const booPrice = priceTicker.converted_last.usd;
    //checking supply of the pool
    const totalSupplyPool = await poolContract.methods.totalSupply().call();
    const totalSupplyDecimals = await poolContract.methods.decimals().call();
    const totalSupply =
      (await totalSupplyPool) / Math.pow(10, totalSupplyDecimals);

    const ftmDecimals = await ftmContract.methods.decimals().call();
    const booDecimals = await booContract.methods.decimals().call();
    const reserves = await poolContract.methods.getReserves().call();
    const totalboo = (await reserves[1]) / Math.pow(10, booDecimals);
    const totalFtm = (await reserves[0]) / Math.pow(10, ftmDecimals);
    //calculating total liquidity
    const totalLiquidity = totalFtm * ftmPrice + totalboo * booPrice;
    const lpTokenPrice = totalLiquidity / totalSupply;

    return {
      poolAllocationPercent,
      poolBooRewardPerSecond,
      ftmPrice,
      booPrice,
      lpTokenPrice,
    };
  } catch (error) {
    console.log('something went wrong while fetching FTM-BOO LP pool');
  }
}

exports.spookySwap_ftm_boo_collector = spookySwap_ftm_boo_collector;
