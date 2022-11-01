const {
  Connection,
  clusterApiUrl,
  PublicKey,
} = require('@solana/web3.js')
const {
  Currency,
  Price,
  Liquidity,
  jsonInfo2PoolKeys,
  MAINNET_LIQUIDITY_POOLS,
  MAINNET_LP_TOKENS,
  LIQUIDITY_STATE_LAYOUT_V4,
  SPL_ACCOUNT_LAYOUT,
  SPL_MINT_LAYOUT,
} = require("@raydium-io/raydium-sdk")
const {
  Market,
  OpenOrders,
} = require("@project-serum/serum")
const { cloneDeep } = require('lodash')
const axios = require('axios')
const {
  FARMS,
  LIQUIDITY_POOLS,
  STAKE_INFO_LAYOUT,
  STAKE_INFO_LAYOUT_V4,
  AMM_INFO_LAYOUT,
  AMM_INFO_LAYOUT_V3,
  AMM_INFO_LAYOUT_STABLE,
  AMM_INFO_LAYOUT_V4,
} = require('./constants')
const {TokenAmount, getBigNumber} = require('./safe-math')
const CoinGecko = require('coingecko-api')
const coinGeckoApi = new CoinGecko()

const getMainnetRaydiumPools = async () => {
  const poolsRet = await axios.get("https://sdk.raydium.io/liquidity/mainnet.json").then(resp => resp.data)
  return poolsRet.official.map((p) => jsonInfo2PoolKeys(p))
};

async function getLpTokenPrice(pair) {
  pair = pair.toUpperCase()
  let lpTokens = Object.values(MAINNET_LP_TOKENS).filter(lp => lp.symbol == pair).sort((lp1, lp2) => {
    if (lp1.version > lp2.version) return -1
    else if (lp1.version < lp2.version) return 1
    else return 0
  })
  if (lpTokens.length == 0) {
    throw pair + ' not found'
  }
  let lpToken = lpTokens[0]
  //console.log('lpToken: ' + JSON.stringify(lpToken, null, 2))
  let liquidityPool = MAINNET_LIQUIDITY_POOLS.filter((lp) => lp.lp == lpToken)[0]
  console.log('Computing LP Pool Price for ' + pair)
  
  var connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');

  let getLiquidityPoolState = connection.getAccountInfo(new PublicKey(liquidityPool.id))
  .then(accountInfo => {
    console.log('LP id: ' + liquidityPool.id)
    return LIQUIDITY_STATE_LAYOUT_V4.decode(accountInfo.data)
  })
  let getOpenOrders = getLiquidityPoolState.then(lpState => {
    let openOrdersKey = new PublicKey(lpState.openOrders);
    return connection.getAccountInfo(openOrdersKey)
    .then(accountInfo => {
      return Market.getLayout(lpState.openOrders).decode(accountInfo.data)
    })
  })
  let getQuoteVaultBalance = getLiquidityPoolState.then(lpState => {
    const quoteVaultKey = new PublicKey(lpState.quoteVault);
    return connection.getTokenAccountBalance(quoteVaultKey)
    .then(accountBalance => {
      console.log('quote vault supply: ' + JSON.stringify(accountBalance, null, 2))
      return accountBalance.value.uiAmount
    })
  })
  let getBaseVaultBalance = getLiquidityPoolState.then(lpState => {
    const baseVaultKey = new PublicKey(lpState.baseVault);
    return connection.getTokenAccountBalance(baseVaultKey)
    .then(accountBalance => {
      console.log('base vault balance: ' + JSON.stringify(accountBalance, null, 2))
      return accountBalance.value.uiAmount
    })
  })
  let getLpMintSupply = getLiquidityPoolState.then(lpState => {
    const lpMintKey = new PublicKey(lpState.lpMint);
    return connection.getTokenSupply(lpMintKey)
    .then(tokenSupply => {
      console.log('lp mint supply: ' + JSON.stringify(tokenSupply, null, 2))
      return tokenSupply.value.uiAmount
    })
  })
  return Promise.all(
    [getLiquidityPoolState, getOpenOrders, getQuoteVaultBalance, getBaseVaultBalance, getLpMintSupply]
  ).then(function(
    [lpState, openOrders, quoteVaultBalance, baseVaultBalance, lpMintSupply]
  ) {
    console.log('pool state: ' + JSON.stringify(lpState, null, 2))
    console.log('open orders: ' + JSON.stringify(openOrders, null, 2))
    console.log("baseVault: " + lpState.baseVault.toBase58())
    console.log("quoteVault: " + lpState.quoteVault.toBase58())
    console.log("baseMint: " + lpState.baseMint.toBase58())
    console.log("quoteMint: " + lpState.quoteMint.toBase58())
    console.log("lpMint: " + lpState.lpMint.toBase58())
    console.log("openOrders: " + lpState.openOrders.toBase58())
    console.log("marketId: " + lpState.marketId.toBase58())
    console.log("marketProgramId: " + lpState.marketProgramId.toBase58())
    console.log("targetOrders: " + lpState.targetOrders.toBase58())
    console.log("withdrawQueue: " + lpState.withdrawQueue.toBase58())
    console.log("tempLpVault: " + lpState.tempLpVault.toBase58())
    console.log("owner: " + lpState.owner.toBase58())
    console.log("pnlOwner: " + lpState.pnlOwner.toBase58())

    // pool_total_base = liquidity_state_layout.quoteVault.balance + liquidity_state_layout.openOrders.total_quote - liquidity_state_layout.quoteNeedTakePnl
    let poolTotalBase = quoteVaultBalance + openOrders.quoteDepositsTotal //- lpState.quoteNeedTakePnl/lpState.quoteDecimal //temporairly ignored since number is totally wrong
    // pool_total_quote = liquidity_state_layout.baseVault.balance + liquidity_state_layout.openOrders.total_base - liquidity_state_layout.baseNeedTakePnl
    let poolTotalQuote = baseVaultBalance + openOrders.baseDepositsTotal //- lpState.baseNeedTakePnl/lpState.baseDecimal //temporairly ignored since number is totally wrong
    // pool_total_lp = liquidity_state_layout.lpMint.supply
    let poolTotalLp = lpMintSupply

    console.log('quote vault balance: ' + quoteVaultBalance)
    console.log('base vault balance: ' + baseVaultBalance)
    console.log('open orders quote balance: ' + openOrders.quoteDepositsTotal)
    console.log('open orders base balance: ' + openOrders.baseDepositsTotal)
    console.log('lp state quote take pnl: ' + lpState.quoteNeedTakePnl/lpState.quoteDecimal)
    console.log('lp state base need pnl: ' + lpState.baseNeedTakePnl/lpState.baseDecimal)
    console.log('pool total base: ' + poolTotalBase)
    console.log('pool total quoute: ' + poolTotalQuote)
    console.log('pool total LP: ' + poolTotalLp)

    // base_per_lp = pool_total_base / pool_total_lp
    let basePerLp = poolTotalBase / poolTotalLp
    // quote_per_lp = pool_total_quote / pool_total_lp
    let quotePerLp = poolTotalQuote / poolTotalLp

    console.log('base per lp: ' + basePerLp)
    console.log('quote per lp: ' + quotePerLp)
    console.log('base / quote lp: ' + poolTotalBase/poolTotalQuote)
    return poolTotalBase/poolTotalQuote
  })
}

async function getLpRewardApr(pair) {
  console.log('Computing LP reward for ' + pair)
  const farms = FARMS.filter(f => f.name == pair)
  if (farms.length != 1) {
    throw 'Farm not found for ' + pair
  }
  const farm = cloneDeep(farms[0])
  const lps = LIQUIDITY_POOLS.filter(f => f.name == pair)
  if (lps.length != 1) {
    throw 'Liquditiy pool not found for ' + pair
  }
  const lp = cloneDeep(lps[0])
  return computeLpRewardsApr(farm, lp)
}

async function computeLpRewardsApr(farm, liqudityPool) {
  const farmInfo = await queryFarmInfo(farm)
  const liquidityPoolInfo = await queryLiquidityPoolInfo(liqudityPool)
  
  // adapted from https://github.com/raydium-io/raydium-ui/blob/a05e4fb79a1f62ce97e80ac85e8b10aad650573b/src/pages/farms.vue#L504-L541
  const { rewardPerShareNet, rewardPerBlock, perShare, perBlock, perShareB, perBlockB } = farmInfo.poolInfo
  const { reward, rewardB, lp } = farmInfo


  if (farmInfo.fusion) {
    // to support fusion rewards https://github.com/raydium-io/raydium-ui/blob/a05e4fb79a1f62ce97e80ac85e8b10aad650573b/src/pages/farms.vue#L447-L504
    throw 'Fusion liquidity pool not supported'
  }

  if (reward === undefined || lp === undefined) {
    throw 'Reward or LP are undefined'
  }

  const prices = await getPrices([reward.symbol, liquidityPoolInfo.coin.symbol, liquidityPoolInfo.pc.symbol])
  
  const rewardPerBlockAmount = new TokenAmount(getBigNumber(rewardPerBlock), reward.decimals)
  const rewardPerBlockAmountTotalValue = getBigNumber(rewardPerBlockAmount.toEther()) * 2 * 60 * 60 * 24 * 365 * prices[reward.symbol.toLowerCase()]
  const liquidityCoinValue = getBigNumber(liquidityPoolInfo.coin.balance.toEther()) * prices[liquidityPoolInfo.coin.symbol.toLowerCase()]
  const liquidityPcValue = getBigNumber(liquidityPoolInfo.pc.balance.toEther()) * prices[liquidityPoolInfo.pc.symbol.toLowerCase()]
  const liquidityTotalValue = liquidityPcValue + liquidityCoinValue
  const liquidityTotalSupply = getBigNumber(liquidityPoolInfo.lp.totalSupply.toEther())
  const liquidityItemValue = liquidityTotalValue / liquidityTotalSupply
  const liquidityUsdValue = getBigNumber(lp.balance.toEther()) * liquidityItemValue
  return rewardPerBlockAmountTotalValue / liquidityUsdValue
}

// reference code https://github.com/raydium-io/raydium-ui/blob/a05e4fb79a1f62ce97e80ac85e8b10aad650573b/src/store/farm.ts#L85
async function queryFarmInfo(farm) {
  farm.lp.balance = new TokenAmount(0, farm.lp.decimals)
  const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed')
  const poolInfo = await connection.getAccountInfo(new PublicKey(farm.poolId)).then(resp => {
    if ([4, 5].includes(farm.version)) {
      return STAKE_INFO_LAYOUT_V4.decode(resp.data)
    } else {
      return STAKE_INFO_LAYOUT.decode(resp.data)
    }
  })
  farm.poolInfo = poolInfo
  const tokenAccount = await connection.getAccountInfo(new PublicKey(farm.poolLpTokenAccount)).then(resp => {
    return SPL_ACCOUNT_LAYOUT.decode(resp.data)
  })
  farm.lp.balance.wei = farm.lp.balance.wei.plus(getBigNumber(tokenAccount.amount))
  return farm
}

// reference code https://github.com/raydium-io/raydium-ui/blob/fe9c9d44c2987b35efca50cfe7ea3d46d45ef058/src/store/liquidity.ts#L267
async function queryLiquidityPoolInfo(liquidityPool) {
  const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed')
  const { poolCoinTokenAccount, poolPcTokenAccount, ammOpenOrders, ammId, coin, pc, lp } = liquidityPool
  liquidityPool.coin.balance = new TokenAmount(0, coin.decimals)
  liquidityPool.pc.balance = new TokenAmount(0, pc.decimals)
  const poolCoinTokenInfo = await connection.getAccountInfo(new PublicKey(poolCoinTokenAccount)).then(resp => { return SPL_ACCOUNT_LAYOUT.decode(resp.data) })
  liquidityPool.coin.balance.wei = liquidityPool.coin.balance.wei.plus(getBigNumber(poolCoinTokenInfo.amount))

  const poolPcTokenInfo = await connection.getAccountInfo(new PublicKey(poolPcTokenAccount)).then(resp => { return SPL_ACCOUNT_LAYOUT.decode(resp.data) })
  liquidityPool.pc.balance.wei = liquidityPool.pc.balance.wei.plus(getBigNumber(poolPcTokenInfo.amount))

  const ammOpenOrdersInfo = await connection.getAccountInfo(new PublicKey(ammOpenOrders)).then(resp => {
    return OpenOrders.getLayout(liquidityPool.serumProgramId).decode(resp.data)
  })
  liquidityPool.coin.balance.wei = liquidityPool.coin.balance.wei.plus(getBigNumber(ammOpenOrdersInfo.baseTokenTotal))
  liquidityPool.pc.balance.wei = liquidityPool.pc.balance.wei.plus(getBigNumber(ammOpenOrdersInfo.quoteTokenTotal))

  const ammData = await connection.getAccountInfo(new PublicKey(ammId)).then(resp => { return resp.data })
  let parsed
  if (liquidityPool.version === 2) {
    parsed = AMM_INFO_LAYOUT.decode(ammData)
  } else if (liquidityPool.version === 3) {
    parsed = AMM_INFO_LAYOUT_V3.decode(ammData)
  } else {
    if (liquidityPool.version === 5) {
      parsed = AMM_INFO_LAYOUT_STABLE.decode(ammData)
      liquidityPool.currentK = getBigNumber(parsed.currentK)
    } else {
      parsed = AMM_INFO_LAYOUT_V4.decode(ammData)
      if (parsed.status === 7) {
        liquidityPool.poolOpenTime = getBigNumber(parsed.poolOpenTime)
      }
    }
    liquidityPool.fees = {
      swapFeeNumerator: getBigNumber(parsed.swapFeeNumerator),
      swapFeeDenominator: getBigNumber(parsed.swapFeeDenominator),
    }
  }
  const { status, needTakePnlCoin, needTakePnlPc } = parsed
  liquidityPool.status = getBigNumber(status)
  liquidityPool.coin.balance.wei = liquidityPool.coin.balance.wei.minus(getBigNumber(needTakePnlCoin))
  liquidityPool.pc.balance.wei = liquidityPool.pc.balance.wei.minus(getBigNumber(needTakePnlPc))


  const mintInfo = await connection.getAccountInfo(new PublicKey(lp.mintAddress)).then(resp => { return SPL_MINT_LAYOUT.decode(resp.data) })
  liquidityPool.lp.totalSupply = new TokenAmount(getBigNumber(mintInfo.supply), liquidityPool.lp.decimals)

  return liquidityPool
}

async function getPrices(symbols) {
  symbols = [... new Set(symbols.map(s => s.toLowerCase()))]
  let coins = (await coinGeckoApi.coins.list()).data.filter(c => symbols.includes(c.symbol))
  let priceData = (await coinGeckoApi.simple.price({
    ids: coins.map(c => c.id),
    vs_currencies: ['usd'],
  })).data
  let prices = {}
  coins.forEach(c => {
    prices[c.symbol] = priceData[c.id].usd
  })
  return prices
}

exports.getLpPoolPrice = getLpTokenPrice
exports.getLpRewardApr = getLpRewardApr