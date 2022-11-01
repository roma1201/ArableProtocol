const { gmx_glp_collector } = require("./glp");

async function collect_gmx(coingecko) {
  const glp = await gmx_glp_collector(coingecko);

  return {
    glp,
  };
}

exports.collect_gmx = collect_gmx;
