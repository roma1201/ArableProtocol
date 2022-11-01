const { yieldyak_yyavax_collector } = require("./yyavax");

async function collect_yieldyak(coingecko) {
  const yyAVAX = await yieldyak_yyavax_collector(coingecko);

  return {
    yyAVAX,
  };
}

exports.collect_yieldyak = collect_yieldyak;
