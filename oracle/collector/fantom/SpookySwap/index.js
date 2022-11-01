const { spookySwap_ftm_boo_collector } = require('./ftmBoo');
const { spookySwap_ftm_usdc_collector } = require('./ftmUsdc');

async function collect_SpookySwap() {
  const usdcFtm = await spookySwap_ftm_usdc_collector();
  const booFtm = await spookySwap_ftm_boo_collector();
  return {
    usdcFtm,
    booFtm,
  };
}

exports.collect_SpookySwap = collect_SpookySwap;
