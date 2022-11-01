const { collect_yieldyak } = require("./yieldyak");
const { collect_vesper } = require("./vesper");
const { collect_gmx } = require("./gmx");

async function collect_avalanche(coingecko) {
  const yieldyak = await collect_yieldyak(coingecko);
  const vesper = await collect_vesper(coingecko);
  const gmx = await collect_gmx(coingecko);
  return {
    yieldyak,
    vesper,
    gmx,
  };
}

exports.collect_avalanche = collect_avalanche;
