const { collect_SpookySwap } = require('./SpookySwap');

async function collect_fantom() {
  const fantomData = await collect_SpookySwap();
  return {
    fantomData,
  };
}

exports.collect_fantom = collect_fantom;
