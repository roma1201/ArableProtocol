const {
  Anchor,
  columbus5,
  AddressProviderFromJson,
  MARKET_DENOMS,
} = require('@anchor-protocol/anchor.js');
const { LCDClient } = require('@terra-money/terra.js');

const collect_anchor = async () => {
  const lcd = new LCDClient({
    URL: 'https://lcd.terra.dev',
    chainID: 'columbus-5',
  });
  const addressProvider = new AddressProviderFromJson(columbus5);
  const anchor = new Anchor(lcd, addressProvider);

  const APY = await anchor.earn.getAPY({ market: MARKET_DENOMS.UUSD });
  return { APY }; //returns 19.49%
};

exports.collect_anchor = collect_anchor;
