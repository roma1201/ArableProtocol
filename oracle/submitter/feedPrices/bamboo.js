const { BigNumber } = require("ethers");
const { parseEther } = require("ethers/lib/utils");
const { getAddresses } = require("../../config/address");
const { setBulkPrice, getPrices } = require("../utils/setBulkPrice");
const { getRangedValue } = require("../utils/rangedValue");

// if true,
const considerPreviousPrice =
  String(process.env.CONSIDER_PREVIOUS_PRICE || "1") === "1";

async function getPriceData(state, beaconRewardRate) {
  try {
    const {
      arBNB,
      arCAKE,
      arPancakeswapBUSDBNB,
      arPancakeswapCAKEBNB,
      arSUSHI,
      arSOL,
      arOSMO,
      arQUICK,
      arRAY,
      arDOT,
      arTRU,
      arCRV,
      arQuickswapETHUSDC,
      arQuickswapETHQUICK,
      arRaydiumRAYSOL,
      arRaydiumRAYUSDT,
      arUniswapETHUSDT,
      arSushiswapETHTRU,
      arOsmosisATOMOSMO,
      WAVAX,
      yyAVAX,
      ACRE,
      arBTC,
      arETH,
      arAVAX,
      arATOM,
      arEVMOS,
      arMATIC,
      // newly added
      arXRP,
      arADA,
      arDOGE,
      arTRX,
      arEGLD,
      arFIL,
      arAAVE,
      arTHETA,
      arAXS,
      arEOS,
      arMKR,
      arBTT,
      arZEC,
      arAR,
      arMIOTA,
      arLDO,
      arGRT,
      arHT,
      arKLAY,
      arRUNE,
      arFTM,
      arSNX,
      arCHZ,
      arBAT,
      arCVX,
      arCELO,
      arSRM,
      arMINA,
      arFXS,
      arKAVA,
      arCOMP,
      ar1INCH,
      arGNO,
      arIOST,
      arKDA,
      arIOTX,
      arONE,
      arJST,
      arGMX,
      arZRX,
      arOMG,
      arAUDIO,
      arENS,
      arPAXG,
      arGMT,
      arBIT,
      arWAVES,
      arKSM,
      arDASH,
      arLRC,
      arENJ,
      arLTC,
      arLEO,
      arFTT,
      arUNI,
      arOKB,
      arCRO,
      arLINK,
      arXLM,
      arNEAR,
      arXMR,
      arALGO,
      arXCN,
      arICP,
      arVET,
      arFLOW,
      arSAND,
      arMANA,
      arXTZ,
      arAPE,
      arQNT,
      arDYDX,
      arANKR,
      arLPT,
      arLOOKS,
      arGLMR,
      arSCRT,
      arBTCi,
      arBTC2x,
      arBTC3x,
      arETHi,
      arETH2x,
      arETH3x,
    } = getAddresses();

    const bnbPrice = state.coingecko.prices.binancecoin.usd;
    const cakePrice = state.coingecko.prices["pancakeswap-token"].usd;
    const busdBNBLpPrice = state.bsc.pancakeswap.busdBnb.busdBnbLpTokenPrice;
    const cakeBNBLpPrice = state.bsc.pancakeswap.cakeBnb.cakeBnbLpTokenPrice;
    const sushiPrice = state.coingecko.prices.sushi.usd;
    const solPrice = state.coingecko.prices.solana.usd;
    const osmoPrice = state.coingecko.prices.osmosis.usd;
    const quickPrice = state.coingecko.prices.quick.usd;
    const crvPrice = state.coingecko.prices["curve-dao-token"].usd;
    const rayPrice = state.coingecko.prices.raydium.usd;
    const dotPrice = state.coingecko.prices.polkadot.usd;
    const truPrice = state.coingecko.prices.truefi.usd;
    const wavaxPrice = state.coingecko.prices["avalanche-2"].usd;
    const yyavaxPrice = state.avalanche.yieldyak.yyAVAX.yyAVAXPrice;
    const acrePrice = state.coingecko.prices["arable-protocol"].usd;

    const btcPrice = state.coingecko.prices.bitcoin.usd;
    const ethPrice = state.coingecko.prices.ethereum.usd;
    const maticPrice = state.coingecko.prices["matic-network"].usd;
    const evmosPrice = state.coingecko.prices.evmos.usd;
    const atomPrice = state.coingecko.prices.cosmos.usd;

    const raydiumRAYSOLPrice =
      beaconRewardRate.syntheticFarms?.raySol?.lpTokenPrice ||
      state.solana.raydium?.raySol?.lp_price;
    const raydiumRAYUSDTPrice =
      beaconRewardRate.syntheticFarms?.rayUsdt?.lpTokenPrice ||
      state.solana.raydium.rayUsdt.lp_price;
    const uniswapETHUSDTPrice =
      beaconRewardRate.syntheticFarms?.uniswapEthUsdt?.lpTokenPrice ||
      state.eth.uniswap.ethUsdt.ethUsdtLpTokenPrice;
    const sushiswapETHTRUPrice =
      beaconRewardRate.syntheticFarms?.ethTru?.truEthLpTokenPrice ||
      state.eth.sushiswap.ethTru.truEthLpTokenPrice;

    const quickswapETHQUICKPrice =
      beaconRewardRate.syntheticFarms?.quickEth?.quickEthLpTokenPrice ||
      state.poly.polygonData.quickEth.quickEthLpTokenPrice / 1;
    const quickswapETHUSDCPrice =
      beaconRewardRate.syntheticFarms?.quickEthUsdc?.ethUsdcLpTokenPrice ||
      state.poly.polygonData.ethUsdc.ethUsdcLpTokenPrice / 1;

    const atomOsmoLpTokenPrice =
      beaconRewardRate.syntheticFarms?.atomOsmo?.lpTokenPrice ||
      state.osmosis.atomOsmoLpTokenPrice;

    // derivatives
    const iAssetDelta = [0.5, 1.5]; // inverse
    const x2AssetDelta = [0.5, 1.5]; // 2x
    const x3AssetDelta = [0.5, 1.5]; // 3x

    const btcAvgPrice = 20000;
    const ethAvgPrice = 1300;
    const btciPrice = getRangedValue(
      2 * btcAvgPrice - btcPrice,
      btcAvgPrice,
      iAssetDelta
    );
    const btc2xPrice = getRangedValue(
      btcPrice * 2 - btcAvgPrice,
      btcAvgPrice,
      x2AssetDelta
    );
    const btc3xPrice = getRangedValue(
      btcPrice * 3 - btcAvgPrice * 2,
      btcAvgPrice,
      x3AssetDelta
    );
    const ethiPrice = getRangedValue(
      2 * ethAvgPrice - ethPrice,
      ethAvgPrice,
      iAssetDelta
    );
    const eth2xPrice = getRangedValue(
      ethPrice * 2 - ethAvgPrice,
      ethAvgPrice,
      x2AssetDelta
    );
    const eth3xPrice = getRangedValue(
      ethPrice * 3 - ethAvgPrice * 2,
      ethAvgPrice,
      x3AssetDelta
    );

    const disabled = [
      arSUSHI,
      arCAKE,
      arZEC,
      arPAXG,
      arEGLD,
      arEOS,
      arBTT,
      arXMR,
      arXLM,
      arFLOW,
      arLTC,
      arOKB,
      arLEO,
      arVET,
      arMKR,
      arAR,
      arMIOTA,
      arLDO,
      arGRT,
      arHT,
      arKLAY,
      arEVMOS,
      arSNX,
      arCHZ,
      arBAT,
      arCVX,
      arCELO,
      arSRM,
      arMINA,
      arFXS,
      arCOMP,
      ar1INCH,
      arGNO,
      arIOST,
      arIOTX,
      arJST,
      arGMX,
      arZRX,
      arOMG,
      arAUDIO,
      arENS,
      arGMT,
      arBIT,
      arWAVES,
      arKSM,
      arDASH,
      arLRC,
      arENJ,
      arXCN,
      arSAND,
      arXTZ,
      arQNT,
      arCRV,
      arDYDX,
      arANKR,
      arLPT,
      arLOOKS,
      arSCRT,
    ];

    const tokenPriceMapping = {
      [arBNB]: bnbPrice,
      [arCAKE]: cakePrice,
      [arPancakeswapBUSDBNB]: busdBNBLpPrice,
      [arPancakeswapCAKEBNB]: cakeBNBLpPrice,
      [arSUSHI]: sushiPrice,
      [arSOL]: solPrice,
      [arOSMO]: osmoPrice,
      [arQUICK]: quickPrice,
      [arRAY]: rayPrice,
      [arDOT]: dotPrice,
      [arTRU]: truPrice,
      [arCRV]: crvPrice,
      [arQuickswapETHUSDC]: quickswapETHUSDCPrice,
      [arQuickswapETHQUICK]: quickswapETHQUICKPrice,
      [arRaydiumRAYSOL]: raydiumRAYSOLPrice,
      [arRaydiumRAYUSDT]: raydiumRAYUSDTPrice,
      [arUniswapETHUSDT]: uniswapETHUSDTPrice,
      [arSushiswapETHTRU]: sushiswapETHTRUPrice,
      [arOsmosisATOMOSMO]: atomOsmoLpTokenPrice,
      [WAVAX]: wavaxPrice,
      [yyAVAX]: yyavaxPrice,
      [ACRE]: acrePrice,
      [arBTC]: btcPrice,
      [arETH]: ethPrice,
      [arAVAX]: wavaxPrice,
      [arMATIC]: maticPrice,
      [arATOM]: atomPrice,
      [arEVMOS]: evmosPrice,
      [arXRP]: state.coingecko.prices.ripple.usd,
      [arADA]: state.coingecko.prices.cardano.usd,
      [arDOGE]: state.coingecko.prices.dogecoin.usd,
      [arTRX]: state.coingecko.prices.tron.usd,
      [arEGLD]: state.coingecko.prices["elrond-erd-2"].usd,
      [arFIL]: state.coingecko.prices.filecoin.usd,
      [arAAVE]: state.coingecko.prices.aave.usd,
      [arTHETA]: state.coingecko.prices["theta-token"].usd,
      [arAXS]: state.coingecko.prices["axie-infinity"].usd,
      [arEOS]: state.coingecko.prices.eos.usd,
      [arMKR]: state.coingecko.prices.maker.usd,
      [arBTT]: state.coingecko.prices.bittorrent.usd,
      [arZEC]: state.coingecko.prices.zcash.usd,
      [arAR]: state.coingecko.prices.arweave.usd,
      [arMIOTA]: state.coingecko.prices.iota.usd,
      [arLDO]: state.coingecko.prices["lido-dao"].usd,
      [arGRT]: state.coingecko.prices["the-graph"].usd,
      [arHT]: state.coingecko.prices["huobi-token"].usd,
      [arKLAY]: state.coingecko.prices["klay-token"].usd,
      [arRUNE]: state.coingecko.prices.thorchain.usd,
      [arFTM]: state.coingecko.prices.fantom.usd,
      [arSNX]: state.coingecko.prices.havven.usd,
      [arCHZ]: state.coingecko.prices.chiliz.usd,
      [arBAT]: state.coingecko.prices["basic-attention-token"].usd,
      [arCVX]: state.coingecko.prices["convex-finance"].usd,
      [arCELO]: state.coingecko.prices.celo.usd,
      [arSRM]: state.coingecko.prices.serum.usd,
      [arMINA]: state.coingecko.prices["mina-protocol"].usd,
      [arFXS]: state.coingecko.prices["frax-share"].usd,
      [arKAVA]: state.coingecko.prices.kava.usd,
      [arCOMP]: state.coingecko.prices["compound-governance-token"].usd,
      [ar1INCH]: state.coingecko.prices["1inch"].usd,
      [arGNO]: state.coingecko.prices.gnosis.usd,
      [arIOST]: state.coingecko.prices.iostoken.usd,
      [arKDA]: state.coingecko.prices.kadena.usd,
      [arIOTX]: state.coingecko.prices.iotex.usd,
      [arONE]: state.coingecko.prices.harmony.usd,
      [arJST]: state.coingecko.prices.just.usd,
      [arGMX]: state.coingecko.prices.gmx.usd,
      [arZRX]: state.coingecko.prices["0x"].usd,
      [arOMG]: state.coingecko.prices.omisego.usd,
      [arAUDIO]: state.coingecko.prices.audius.usd,
      [arENS]: state.coingecko.prices["ethereum-name-service"].usd,
      [arPAXG]: state.coingecko.prices["pax-gold"].usd,
      [arGMT]: state.coingecko.prices.stepn.usd,
      [arBIT]: state.coingecko.prices.bitdao.usd,
      [arWAVES]: state.coingecko.prices.waves.usd,
      [arKSM]: state.coingecko.prices.kusama.usd,
      [arDASH]: state.coingecko.prices.dash.usd,
      [arLRC]: state.coingecko.prices.loopring.usd,
      [arENJ]: state.coingecko.prices.enjincoin.usd,
      [arLTC]: state.coingecko.prices.litecoin.usd,
      [arLEO]: state.coingecko.prices["leo-token"].usd,
      [arFTT]: state.coingecko.prices["ftx-token"].usd,
      [arUNI]: state.coingecko.prices.uniswap.usd,
      [arOKB]: state.coingecko.prices.okb.usd,
      [arCRO]: state.coingecko.prices["crypto-com-chain"].usd,
      [arLINK]: state.coingecko.prices.chainlink.usd,
      [arXLM]: state.coingecko.prices.stellar.usd,
      [arNEAR]: state.coingecko.prices.near.usd,
      [arXMR]: state.coingecko.prices.monero.usd,
      [arALGO]: state.coingecko.prices.algorand.usd,
      [arXCN]: state.coingecko.prices["chain-2"].usd,
      [arICP]: state.coingecko.prices["internet-computer"].usd,
      [arVET]: state.coingecko.prices.vechain.usd,
      [arFLOW]: state.coingecko.prices.flow.usd,
      [arSAND]: state.coingecko.prices["the-sandbox"].usd,
      [arMANA]: state.coingecko.prices.decentraland.usd,
      [arXTZ]: state.coingecko.prices.tezos.usd,
      [arAPE]: state.coingecko.prices.apecoin.usd,
      [arQNT]: state.coingecko.prices["quant-network"].usd,
      [arDYDX]: state.coingecko.prices.dydx.usd,
      [arANKR]: state.coingecko.prices.ankr.usd,
      [arLPT]: state.coingecko.prices.livepeer.usd,
      [arLOOKS]: state.coingecko.prices.looksrare.usd,
      [arGLMR]: state.coingecko.prices.moonbeam.usd,
      [arSCRT]: state.coingecko.prices.secret.usd,
      [arBTCi]: btciPrice,
      [arBTC2x]: btc2xPrice,
      [arBTC3x]: btc3xPrice,
      [arETHi]: ethiPrice,
      [arETH2x]: eth2xPrice,
      [arETH3x]: eth3xPrice,
    };

    let finalTokensArray = Object.keys(tokenPriceMapping)
      .filter((e) => !!e)
      .filter((e) => !disabled.includes(e));
    let finalPriceArray = finalTokensArray.map(
      (token) => tokenPriceMapping[token]
    );

    let finalPriceMapping = {};
    finalTokensArray.map((token, index) => {
      finalPriceMapping[token] = finalPriceArray[index];
    });

    if (considerPreviousPrice) {
      const prices = await getPrices(finalTokensArray);
      finalTokensArray = finalTokensArray.filter((token, index) => {
        const newPrice = parseEther(String(tokenPriceMapping[token]));
        const prevPrice = BigNumber.from(prices[index]);

        if (prevPrice.mul(2).lt(newPrice)) {
          return false;
        }
        return true;
      });
      finalPriceArray = finalTokensArray.map(
        (token) => tokenPriceMapping[token]
      );
      finalPriceMapping = {};
      finalTokensArray.map((token, index) => {
        finalPriceMapping[token] = finalPriceArray[index];
      });
    }

    console.log("finalPriceMapping", finalPriceMapping);

    return { finalTokensArray, finalPriceArray };
  } catch (error) {
    console.log(error);

    return null;
  }
}

async function feedPrices({ finalTokensArray, finalPriceArray }) {
  try {
    await setBulkPrice(finalTokensArray, finalPriceArray);

    return true;
  } catch (error) {
    console.log(error);

    return false;
  }
}

exports.feedPrices = feedPrices;
exports.getPriceData = getPriceData;
