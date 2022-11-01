const { vesper_vaavax_collector } = require("./vaavax");
const { vesper_usdcn_collector } = require("./usdcn");

async function collect_vesper(coingecko) {
  const vaAVAX = await vesper_vaavax_collector(coingecko);
  const USDCn = await vesper_usdcn_collector(coingecko);

  return {
    vaAVAX,
    USDCn,
  };
}

exports.collect_vesper = collect_vesper;
