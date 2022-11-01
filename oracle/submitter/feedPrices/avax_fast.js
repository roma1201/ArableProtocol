const { BigNumber } = require("ethers");
const { parseEther } = require("ethers/lib/utils");
const { getAddresses } = require("../../config/address");
const { setBulkPrice, getPrices } = require("../utils/setBulkPrice");
const { getRangedValue } = require("../utils/rangedValue");

// if true,
const considerPreviousPrice =
  String(process.env.CONSIDER_PREVIOUS_PRICE || "1") === "1";

async function getFastPriceData(state, beaconRewardRate) {
  try {
    const {
      arBNB,
      arCAKE,
      arSUSHI,
      arSOL,
      arOSMO,
      arQUICK,
      arRAY,
      arDOT,
      arTRU,
      arCRV,
      arBTC,
      arETH,
      arAVAX,
      arATOM,
      arEVMOS,
      arMATIC,
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

    const bnbPrice =
      state.cex_binance.prices["BNBUSDT"] ||
      state.coingecko.prices.binancecoin.usd;
    const cakePrice = state.coingecko.prices["pancakeswap-token"].usd;
    const sushiPrice = state.coingecko.prices.sushi.usd;
    const solPrice =
      state.cex_binance.prices["SOLUSDT"] || state.coingecko.prices.solana.usd;
    const osmoPrice = state.coingecko.prices.osmosis.usd;
    const quickPrice = state.coingecko.prices.quick.usd;
    const crvPrice = state.coingecko.prices["curve-dao-token"].usd;
    const rayPrice = state.coingecko.prices.raydium.usd;
    const dotPrice =
      state.cex_binance.prices["DOTUSDT"] ||
      state.coingecko.prices.polkadot.usd;
    const truPrice = state.coingecko.prices.truefi.usd;
    const wavaxPrice =
      state.cex_binance.prices["AVAXUSDT"] ||
      state.coingecko.prices["avalanche-2"].usd;

    const btcPrice =
      state.cex_binance.prices["BTCUSDT"] || state.coingecko.prices.bitcoin.usd;
    const ethPrice =
      state.cex_binance.prices["ETHUSDT"] ||
      state.coingecko.prices.ethereum.usd;
    const maticPrice =
      state.cex_binance.prices["MATICUSDT"] ||
      state.coingecko.prices["matic-network"].usd;
    const evmosPrice = state.coingecko.prices.evmos.usd;
    const atomPrice =
      state.cex_binance.prices["ATOMUSDT"] || state.coingecko.prices.cosmos.usd;
    const xrpPrice =
      state.cex_binance.prices["XRPUSDT"] || state.coingecko.prices.ripple.usd;
    const adaPrice =
      state.cex_binance.prices["ADAUSDC"] || state.coingecko.prices.cardano.usd;
    const dogePrice =
      state.cex_binance.prices["DOGEUSDT"] ||
      state.coingecko.prices.dogecoin.usd;
    const trxPrice =
      state.cex_binance.prices["TRXUSDT"] || state.coingecko.prices.tron.usd;
    const aavePrice =
      state.cex_binance.prices["AAVEUSDT"] || state.coingecko.prices.aave.usd;
    const filPrice =
      state.cex_binance.prices["FILUSDT"] ||
      state.coingecko.prices.filecoin.usd;
    const thetaPrice =
      state.cex_binance.prices["THETAUSDT"] ||
      state.coingecko.prices["theta-token"].usd;
    const axsPrice =
      state.cex_binance.prices["AXSUSDT"] ||
      state.coingecko.prices["axie-infinity"].usd;
    const runePrice =
      state.cex_binance.prices["RUNEUSDT"] ||
      state.coingecko.prices.thorchain.usd;
    const ftmPrice =
      state.cex_binance.prices["FTMUSDT"] || state.coingecko.prices.fantom.usd;
    const kavaPrice =
      state.cex_binance.prices["KAVAUSDT"] || state.coingecko.prices.kava.usd;
    const kdaPrice =
      state.cex_binance.prices["KDAUSDT"] || state.coingecko.prices.kadena.usd;
    const onePrice =
      state.cex_binance.prices["ONEUSDT"] || state.coingecko.prices.harmony.usd;
    const fttPrice =
      state.cex_binance.prices["FTTUSDT"] ||
      state.coingecko.prices["ftx-token"].usd;
    const uniPrice =
      state.cex_binance.prices["UNIUSDT"] || state.coingecko.prices.uniswap.usd;
    const linkPrice =
      state.cex_binance.prices["LINKUSDT"] ||
      state.coingecko.prices.chainlink.usd;
    const nearPrice =
      state.cex_binance.prices["NEARUSDT"] || state.coingecko.prices.near.usd;
    const algoPrice =
      state.cex_binance.prices["ALGOUSDT"] ||
      state.coingecko.prices.algorand.usd;
    const icpPrice =
      state.cex_binance.prices["ICPUSDT"] ||
      state.coingecko.prices["internet-computer"].usd;
    const manaPrice =
      state.cex_binance.prices["MANAUSDT"] ||
      state.coingecko.prices.decentraland.usd;
    const apePrice =
      state.cex_binance.prices["APEUSDT"] || state.coingecko.prices.apecoin.usd;
    const glmrPrice =
      state.cex_binance.prices["GLMRUSDT"] ||
      state.coingecko.prices.moonbeam.usd;
    const croPrice =
      (state.cex_crypto_com?.prices || {})["crousdt"] ||
      state.coingecko.prices["crypto-com-chain"].usd;

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
      arSUSHI,
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
      arCAKE,
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
      [arSUSHI]: sushiPrice,
      [arSOL]: solPrice,
      [arOSMO]: osmoPrice,
      [arQUICK]: quickPrice,
      [arRAY]: rayPrice,
      [arDOT]: dotPrice,
      [arTRU]: truPrice,
      [arCRV]: crvPrice,
      [arBTC]: btcPrice,
      [arETH]: ethPrice,
      [arAVAX]: wavaxPrice,
      [arMATIC]: maticPrice,
      [arATOM]: atomPrice,
      [arEVMOS]: evmosPrice,
      [arXRP]: xrpPrice,
      [arADA]: adaPrice,
      [arDOGE]: dogePrice,
      [arTRX]: trxPrice,
      [arEGLD]: state.coingecko.prices["elrond-erd-2"].usd,
      [arFIL]: filPrice,
      [arAAVE]: aavePrice,
      [arTHETA]: thetaPrice,
      [arAXS]: axsPrice,
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
      [arRUNE]: runePrice,
      [arFTM]: ftmPrice,
      [arSNX]: state.coingecko.prices.havven.usd,
      [arCHZ]: state.coingecko.prices.chiliz.usd,
      [arBAT]: state.coingecko.prices["basic-attention-token"].usd,
      [arCVX]: state.coingecko.prices["convex-finance"].usd,
      [arCELO]: state.coingecko.prices.celo.usd,
      [arSRM]: state.coingecko.prices.serum.usd,
      [arMINA]: state.coingecko.prices["mina-protocol"].usd,
      [arFXS]: state.coingecko.prices["frax-share"].usd,
      [arKAVA]: kavaPrice,
      [arCOMP]: state.coingecko.prices["compound-governance-token"].usd,
      [ar1INCH]: state.coingecko.prices["1inch"].usd,
      [arGNO]: state.coingecko.prices.gnosis.usd,
      [arIOST]: state.coingecko.prices.iostoken.usd,
      [arKDA]: kdaPrice,
      [arIOTX]: state.coingecko.prices.iotex.usd,
      [arONE]: onePrice,
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
      [arFTT]: fttPrice,
      [arUNI]: uniPrice,
      [arOKB]: state.coingecko.prices.okb.usd,
      [arCRO]: croPrice,
      [arLINK]: linkPrice,
      [arXLM]: state.coingecko.prices.stellar.usd,
      [arNEAR]: nearPrice,
      [arXMR]: state.coingecko.prices.monero.usd,
      [arALGO]: algoPrice,
      [arXCN]: state.coingecko.prices["chain-2"].usd,
      [arICP]: icpPrice,
      [arVET]: state.coingecko.prices.vechain.usd,
      [arFLOW]: state.coingecko.prices.flow.usd,
      [arSAND]: state.coingecko.prices["the-sandbox"].usd,
      [arMANA]: manaPrice,
      [arXTZ]: state.coingecko.prices.tezos.usd,
      [arAPE]: apePrice,
      [arQNT]: state.coingecko.prices["quant-network"].usd,
      [arDYDX]: state.coingecko.prices.dydx.usd,
      [arANKR]: state.coingecko.prices.ankr.usd,
      [arLPT]: state.coingecko.prices.livepeer.usd,
      [arLOOKS]: state.coingecko.prices.looksrare.usd,
      [arGLMR]: glmrPrice,
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

exports.getFastPriceData = getFastPriceData;
