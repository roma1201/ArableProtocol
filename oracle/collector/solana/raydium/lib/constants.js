const { publicKey, u128, u64 } = require('@project-serum/borsh')
const { blob, struct, u8 } = require('buffer-layout')

// pulled from https://github.com/raydium-io/raydium-ui/blob/8545c79af3c2bc6b791e578d79c301e6f15a8eb1/src/utils/ids.ts#L11-L23
const SERUM_PROGRAM_ID_V3 = '9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin'
const LIQUIDITY_POOL_PROGRAM_ID_V4 = '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8'
const STAKE_PROGRAM_ID = 'EhhTKczWMGQt46ynNeRX1WfeagwwJd7ufHvCDjRxjo5Q'


// ulled from https://github.com/raydium-io/raydium-ui/blob/8545c79af3c2bc6b791e578d79c301e6f15a8eb1/src/utils/tokens.ts#L85
const NATIVE_SOL = {
    symbol: 'SOL',
    name: 'Native Solana',
    mintAddress: '11111111111111111111111111111111',
    decimals: 9,
    tags: ['raydium'],
}

// pulled from https://github.com/raydium-io/raydium-ui/blob/8545c79af3c2bc6b791e578d79c301e6f15a8eb1/src/utils/tokens.ts#L93
const TOKENS = {
    RAY: {
        symbol: 'RAY',
        name: 'Raydium',
        mintAddress: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
        decimals: 6,
        referrer: '33XpMmMQRf6tSPpmYyzpwU4uXpZHkFwCZsusD9dMYkjy',
        tags: ['raydium'],
    },
    USDT: {
        symbol: 'USDT',
        name: 'USDT',
        mintAddress: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
        decimals: 6,
        referrer: '8DwwDNagph8SdwMUdcXS5L9YAyutTyDJmK6cTKrmNFk3',
        tags: ['raydium']
    },
}

// pulled from https://github.com/raydium-io/raydium-ui/blob/8545c79af3c2bc6b791e578d79c301e6f15a8eb1/src/utils/tokens.ts#L1115
const LP_TOKENS = {
    'RAY-SOL-V4': {
        symbol: 'RAY-SOL',
        name: 'RAY-SOL LP',
        coin: { ...TOKENS.RAY },
        pc: { ...NATIVE_SOL },
    
        mintAddress: '89ZKE4aoyfLBe2RuV6jM3JGNhaV18Nxh8eNtjRcndBip',
        decimals: TOKENS.RAY.decimals,
    },
    'RAY-USDT-V4': {
        symbol: 'RAY-USDT',
        name: 'RAY-USDT LP',
        coin: { ...TOKENS.RAY },
        pc: { ...TOKENS.USDT },
    
        mintAddress: 'C3sT1R3nsw4AVdepvLTLKr5Gvszr7jufyBWUCvy4TUvT',
        decimals: TOKENS.RAY.decimals
    },
}

// pulled from https://github.com/raydium-io/raydium-ui/blob/8545c79af3c2bc6b791e578d79c301e6f15a8eb1/src/utils/farms.ts#L82
const FARMS = [
    {
        name: 'RAY-SOL',
        lp: { ...LP_TOKENS['RAY-SOL-V4'] },
        reward: { ...TOKENS.RAY },
        isStake: false,
    
        fusion: false,
        legacy: false,
        dual: false,
        version: 3,
        programId: STAKE_PROGRAM_ID,
    
        poolId: 'HUDr9BDaAGqi37xbQHzxCyXvfMCKPTPNF8g9c9bPu1Fu',
        poolAuthority: '9VbmvaaPeNAke2MAL3h2Fw82VubH1tBCzwBzaWybGKiG',
        poolLpTokenAccount: 'A4xQv2BQPB1WxsjiCC7tcMH7zUq255uCBkevFj8qSCyJ', // lp vault
        poolRewardTokenAccount: '6zA5RAQYgazm4dniS8AigjGFtRi4xneqjL7ehrSqCmhr' // reward vault A
    },
    {
        name: 'RAY-USDT',
        lp: { ...LP_TOKENS['RAY-USDT-V4'] },
        reward: { ...TOKENS.RAY },
        isStake: false,
    
        fusion: false,
        legacy: false,
        dual: false,
        version: 3,
        programId: STAKE_PROGRAM_ID,
    
        poolId: 'AvbVWpBi2e4C9HPmZgShGdPoNydG4Yw8GJvG9HUcLgce',
        poolAuthority: '8JYVFy3pYsPSpPRsqf43KSJFnJzn83nnRLQgG88XKB8q',
        poolLpTokenAccount: '4u4AnMBHXehdpP5tbD6qzB5Q4iZmvKKR5aUr2gavG7aw', // lp vault
        poolRewardTokenAccount: 'HCHNuGzkqSnw9TbwpPv1gTnoqnqYepcojHw9DAToBrUj' // reward vault
    },
]

// pulled from https://github.com/raydium-io/raydium-ui/blob/fe9c9d44c2987b35efca50cfe7ea3d46d45ef058/src/utils/pools.ts#L219
const LIQUIDITY_POOLS = [
    {
        name: 'RAY-SOL',
        coin: { ...TOKENS.RAY },
        pc: { ...NATIVE_SOL },
        lp: { ...LP_TOKENS['RAY-SOL-V4'] },
    
        version: 4,
        programId: LIQUIDITY_POOL_PROGRAM_ID_V4,
    
        ammId: 'AVs9TA4nWDzfPJE9gGVNJMVhcQy3V9PGazuz33BfG2RA',
        ammAuthority: '5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1',
        ammOpenOrders: '6Su6Ea97dBxecd5W92KcVvv6SzCurE2BXGgFe9LNGMpE',
        ammTargetOrders: '5hATcCfvhVwAjNExvrg8rRkXmYyksHhVajWLa46iRsmE',
        // no need
        ammQuantities: NATIVE_SOL.mintAddress,
        poolCoinTokenAccount: 'Em6rHi68trYgBFyJ5261A2nhwuQWfLcirgzZZYoRcrkX',
        poolPcTokenAccount: '3mEFzHsJyu2Cpjrz6zPmTzP7uoLFj9SbbecGVzzkL1mJ',
        poolWithdrawQueue: 'FSHqX232PHE4ev9Dpdzrg9h2Tn1byChnX4tuoPUyjjdV',
        poolTempLpTokenAccount: '87CCkBfthmyqwPuCDwFmyqKWJfjYqPFhm5btkNyoALYZ',
        serumProgramId: SERUM_PROGRAM_ID_V3,
        serumMarket: 'C6tp2RVZnxBPFbnAsfTjis8BN9tycESAT4SgDQgbbrsA',
        serumBids: 'C1nEbACFaHMUiKAUsXVYPWZsuxunJeBkqXHPFr8QgSj9',
        serumAsks: '4DNBdnTw6wmrK4NmdSTTxs1kEz47yjqLGuoqsMeHvkMF',
        serumEventQueue: '4HGvdannxvmAhszVVig9auH6HsqVH17qoavDiNcnm9nj',
        serumCoinVaultAccount: '6U6U59zmFWrPSzm9sLX7kVkaK78Kz7XJYkrhP1DjF3uF',
        serumPcVaultAccount: '4YEx21yeUAZxUL9Fs7YU9Gm3u45GWoPFs8vcJiHga2eQ',
        serumVaultSigner: '7SdieGqwPJo5rMmSQM9JmntSEMoimM4dQn7NkGbNFcrd',
        official: true
    },
    {
        name: 'RAY-USDT',
        coin: { ...TOKENS.RAY },
        pc: { ...TOKENS.USDT },
        lp: { ...LP_TOKENS['RAY-USDT-V4'] },
    
        version: 4,
        programId: LIQUIDITY_POOL_PROGRAM_ID_V4,
    
        ammId: 'DVa7Qmb5ct9RCpaU7UTpSaf3GVMYz17vNVU67XpdCRut',
        ammAuthority: '5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1',
        ammOpenOrders: '7UF3m8hDGZ6bNnHzaT2YHrhp7A7n9qFfBj6QEpHPv5S8',
        ammTargetOrders: '3K2uLkKwVVPvZuMhcQAPLF8hw95somMeNwJS7vgWYrsJ',
        // no need
        ammQuantities: NATIVE_SOL.mintAddress,
        poolCoinTokenAccount: '3wqhzSB9avepM9xMteiZnbJw75zmTBDVmPFLTQAGcSMN',
        poolPcTokenAccount: '5GtSbKJEPaoumrDzNj4kGkgZtfDyUceKaHrPziazALC1',
        poolWithdrawQueue: '8VuvrSWfQP8vdbuMAP9AkfgLxU9hbRR6BmTJ8Gfas9aK',
        poolTempLpTokenAccount: 'FBzqDD1cBgkZ1h6tiZNFpkh4sZyg6AG8K5P9DSuJoS5F',
        serumProgramId: SERUM_PROGRAM_ID_V3,
        serumMarket: 'teE55QrL4a4QSfydR9dnHF97jgCfptpuigbb53Lo95g',
        serumBids: 'AvKStCiY8LTp3oDFrMkiHHxxhxk4sQUWnGVcetm4kRpy',
        serumAsks: 'Hj9kckvMX96mQokfMBzNCYEYMLEBYKQ9WwSc1GxasW11',
        serumEventQueue: '58KcficuUqPDcMittSddhT8LzsPJoH46YP4uURoMo5EB',
        serumCoinVaultAccount: '2kVNVEgHicvfwiyhT2T51YiQGMPFWLMSp8qXc1hHzkpU',
        serumPcVaultAccount: '5AXZV7XfR7Ctr6yjQ9m9dbgycKeUXWnWqHwBTZT6mqC7',
        serumVaultSigner: 'HzWpBN6ucpsA9wcfmhLAFYqEUmHjE9n2cGHwunG5avpL',
        official: true
    },
]

// pulled from https://github.com/raydium-io/raydium-ui/blob/master/src/utils/stake.ts#L887-L918
const STAKE_INFO_LAYOUT = struct([
    u64('state'),
    u64('nonce'),
    publicKey('poolLpTokenAccount'),
    publicKey('poolRewardTokenAccount'),
    publicKey('owner'),
    publicKey('feeOwner'),
    u64('feeY'),
    u64('feeX'),
    u64('totalReward'),
    u128('rewardPerShareNet'),
    u64('lastBlock'),
    u64('rewardPerBlock')
])
  
const STAKE_INFO_LAYOUT_V4 = struct([
    u64('state'),
    u64('nonce'),
    publicKey('poolLpTokenAccount'),
    publicKey('poolRewardTokenAccount'),
    u64('totalReward'),
    u128('perShare'),
    u64('perBlock'),
    u8('option'),
    publicKey('poolRewardTokenAccountB'),
    blob(7),
    u64('totalRewardB'),
    u128('perShareB'),
    u64('perBlockB'),
    u64('lastBlock'),
    publicKey('owner')
])

// pulled from https://github.com/raydium-io/raydium-ui/blob/fe9c9d44c2987b35efca50cfe7ea3d46d45ef058/src/utils/liquidity.ts#L659-L863
const AMM_INFO_LAYOUT = struct([
    u64('status'),
    u64('nonce'),
    u64('orderNum'),
    u64('depth'),
    u64('coinDecimals'),
    u64('pcDecimals'),
    u64('state'),
    u64('resetFlag'),
    u64('fee'),
    u64('minSize'),
    u64('volMaxCutRatio'),
    u64('pnlRatio'),
    u64('amountWaveRatio'),
    u64('coinLotSize'),
    u64('pcLotSize'),
    u64('minPriceMultiplier'),
    u64('maxPriceMultiplier'),
    u64('needTakePnlCoin'),
    u64('needTakePnlPc'),
    u64('totalPnlX'),
    u64('totalPnlY'),
    u64('systemDecimalsValue'),
    publicKey('poolCoinTokenAccount'),
    publicKey('poolPcTokenAccount'),
    publicKey('coinMintAddress'),
    publicKey('pcMintAddress'),
    publicKey('lpMintAddress'),
    publicKey('ammOpenOrders'),
    publicKey('serumMarket'),
    publicKey('serumProgramId'),
    publicKey('ammTargetOrders'),
    publicKey('ammQuantities'),
    publicKey('poolWithdrawQueue'),
    publicKey('poolTempLpTokenAccount'),
    publicKey('ammOwner'),
    publicKey('pnlOwner')
])

const AMM_INFO_LAYOUT_V3 = struct([
    u64('status'),
    u64('nonce'),
    u64('orderNum'),
    u64('depth'),
    u64('coinDecimals'),
    u64('pcDecimals'),
    u64('state'),
    u64('resetFlag'),
    u64('fee'),
    u64('min_separate'),
    u64('minSize'),
    u64('volMaxCutRatio'),
    u64('pnlRatio'),
    u64('amountWaveRatio'),
    u64('coinLotSize'),
    u64('pcLotSize'),
    u64('minPriceMultiplier'),
    u64('maxPriceMultiplier'),
    u64('needTakePnlCoin'),
    u64('needTakePnlPc'),
    u64('totalPnlX'),
    u64('totalPnlY'),
    u64('poolTotalDepositPc'),
    u64('poolTotalDepositCoin'),
    u64('systemDecimalsValue'),
    publicKey('poolCoinTokenAccount'),
    publicKey('poolPcTokenAccount'),
    publicKey('coinMintAddress'),
    publicKey('pcMintAddress'),
    publicKey('lpMintAddress'),
    publicKey('ammOpenOrders'),
    publicKey('serumMarket'),
    publicKey('serumProgramId'),
    publicKey('ammTargetOrders'),
    publicKey('ammQuantities'),
    publicKey('poolWithdrawQueue'),
    publicKey('poolTempLpTokenAccount'),
    publicKey('ammOwner'),
    publicKey('pnlOwner'),
    publicKey('srmTokenAccount')
])

const AMM_INFO_LAYOUT_V4 = struct([
    u64('status'),
    u64('nonce'),
    u64('orderNum'),
    u64('depth'),
    u64('coinDecimals'),
    u64('pcDecimals'),
    u64('state'),
    u64('resetFlag'),
    u64('minSize'),
    u64('volMaxCutRatio'),
    u64('amountWaveRatio'),
    u64('coinLotSize'),
    u64('pcLotSize'),
    u64('minPriceMultiplier'),
    u64('maxPriceMultiplier'),
    u64('systemDecimalsValue'),
    // Fees
    u64('minSeparateNumerator'),
    u64('minSeparateDenominator'),
    u64('tradeFeeNumerator'),
    u64('tradeFeeDenominator'),
    u64('pnlNumerator'),
    u64('pnlDenominator'),
    u64('swapFeeNumerator'),
    u64('swapFeeDenominator'),
    // OutPutData
    u64('needTakePnlCoin'),
    u64('needTakePnlPc'),
    u64('totalPnlPc'),
    u64('totalPnlCoin'),
  
    u64('poolOpenTime'),
    u64('punishPcAmount'),
    u64('punishCoinAmount'),
    u64('orderbookToInitTime'),
  
    u128('swapCoinInAmount'),
    u128('swapPcOutAmount'),
    u64('swapCoin2PcFee'),
    u128('swapPcInAmount'),
    u128('swapCoinOutAmount'),
    u64('swapPc2CoinFee'),
  
    publicKey('poolCoinTokenAccount'),
    publicKey('poolPcTokenAccount'),
    publicKey('coinMintAddress'),
    publicKey('pcMintAddress'),
    publicKey('lpMintAddress'),
    publicKey('ammOpenOrders'),
    publicKey('serumMarket'),
    publicKey('serumProgramId'),
    publicKey('ammTargetOrders'),
    publicKey('poolWithdrawQueue'),
    publicKey('poolTempLpTokenAccount'),
    publicKey('ammOwner'),
    publicKey('pnlOwner')
])

const AMM_INFO_LAYOUT_STABLE = struct([
    u64('status'),
    publicKey('own_address'),
    u64('nonce'),
    u64('orderNum'),
    u64('depth'),
    u64('coinDecimals'),
    u64('pcDecimals'),
    u64('state'),
    u64('resetFlag'),
    u64('minSize'),
    u64('volMaxCutRatio'),
    u64('amountWaveRatio'),
    u64('coinLotSize'),
    u64('pcLotSize'),
    u64('minPriceMultiplier'),
    u64('maxPriceMultiplier'),
    u64('systemDecimalsValue'),
  
    u64('ammMaxPrice'),
    u64('ammMiddlePrice'),
    u64('ammPriceMultiplier'),
  
    // Fees
    u64('minSeparateNumerator'),
    u64('minSeparateDenominator'),
    u64('tradeFeeNumerator'),
    u64('tradeFeeDenominator'),
    u64('pnlNumerator'),
    u64('pnlDenominator'),
    u64('swapFeeNumerator'),
    u64('swapFeeDenominator'),
    // OutPutData
    u64('needTakePnlCoin'),
    u64('needTakePnlPc'),
    u64('totalPnlPc'),
    u64('totalPnlCoin'),
    u128('poolTotalDepositPc'),
    u128('poolTotalDepositCoin'),
    u128('swapCoinInAmount'),
    u128('swapPcOutAmount'),
    u128('swapPcInAmount'),
    u128('swapCoinOutAmount'),
    u64('swapPcFee'),
    u64('swapCoinFee'),
  
    publicKey('poolCoinTokenAccount'),
    publicKey('poolPcTokenAccount'),
    publicKey('coinMintAddress'),
    publicKey('pcMintAddress'),
    publicKey('lpMintAddress'),
    publicKey('ammOpenOrders'),
    publicKey('serumMarket'),
    publicKey('serumProgramId'),
    publicKey('ammTargetOrders'),
    publicKey('poolWithdrawQueue'),
    publicKey('poolTempLpTokenAccount'),
    publicKey('ammOwner'),
    publicKey('pnlOwner'),
  
    u128('currentK'),
    u128('padding1'),
    publicKey('padding2')
])

exports.SERUM_PROGRAM_ID_V3 = SERUM_PROGRAM_ID_V3
exports.LIQUIDITY_POOL_PROGRAM_ID_V4 = LIQUIDITY_POOL_PROGRAM_ID_V4
exports.STAKE_PROGRAM_ID = STAKE_PROGRAM_ID
exports.NATIVE_SOL = NATIVE_SOL
exports.TOKENS = TOKENS
exports.LP_TOKENS = LP_TOKENS
exports.FARMS = FARMS
exports.LIQUIDITY_POOLS = LIQUIDITY_POOLS
exports.STAKE_INFO_LAYOUT = STAKE_INFO_LAYOUT
exports.STAKE_INFO_LAYOUT_V4 = STAKE_INFO_LAYOUT_V4
exports.AMM_INFO_LAYOUT = AMM_INFO_LAYOUT
exports.AMM_INFO_LAYOUT_V3 = AMM_INFO_LAYOUT_V3
exports.AMM_INFO_LAYOUT_V4 = AMM_INFO_LAYOUT_V4
exports.AMM_INFO_LAYOUT_STABLE = AMM_INFO_LAYOUT_STABLE