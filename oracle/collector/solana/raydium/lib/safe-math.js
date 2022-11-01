const { BigNumber } = require('bignumber.js')

// adapted from https://github.com/raydium-io/raydium-ui/blob/fe9c9d44c2987b35efca50cfe7ea3d46d45ef058/src/utils/safe-math.ts#L5
class TokenAmount {
    wei //BigNumber
    decimals //number
    _decimals //BigNumber
  
    constructor(wei, decimals = 0, isWei = true) {
      this.decimals = decimals
      this._decimals = new BigNumber(10).exponentiatedBy(decimals)
  
      if (isWei) {
        this.wei = new BigNumber(wei)
      } else {
        this.wei = new BigNumber(wei).multipliedBy(this._decimals)
      }
    }
  
    toEther() {
      return this.wei.dividedBy(this._decimals)
    }
  
    toWei() {
      return this.wei
    }
  
    format() {
      const vaule = this.wei.dividedBy(this._decimals)
      return vaule.toFormat(vaule.isInteger() ? 0 : this.decimals)
    }
  
    fixed() {
      return this.wei.dividedBy(this._decimals).toFixed(this.decimals)
    }
  
    isNullOrZero() {
      return this.wei.isNaN() || this.wei.isZero()
    }
    // + plus
    // - minus
    // × multipliedBy
    // ÷ dividedBy
  }
  exports.TokenAmount = TokenAmount
  
  // >
  function gt(a, b) {
    const valueA = new BigNumber(a)
    const valueB = new BigNumber(b)
  
    return valueA.isGreaterThan(valueB)
  }
  exports.gt = gt
  
  // >=
  function gte(a, b) {
    const valueA = new BigNumber(a)
    const valueB = new BigNumber(b)
  
    return valueA.isGreaterThanOrEqualTo(valueB)
  }
  exports.gte = gte
  
  // <
  function lt(a, b) {
    const valueA = new BigNumber(a)
    const valueB = new BigNumber(b)
  
    return valueA.isLessThan(valueB)
  }
  exports.lt = lt
  
  // <=
  function lte(a, b) {
    const valueA = new BigNumber(a)
    const valueB = new BigNumber(b)
  
    return valueA.isLessThanOrEqualTo(valueB)
  }
  exports.lte = lte
  
  function isNullOrZero(value) {
    const amount = new BigNumber(value)
  
    return amount.isNaN() || amount.isZero()
  }
  exports.isNullOrZero = isNullOrZero

  // adapted from https://github.com/raydium-io/raydium-ui/blob/fe9c9d44c2987b35efca50cfe7ea3d46d45ef058/src/utils/layouts.ts#L28
  function getBigNumber(num) {
    return num === undefined || num === null ? 0 : parseFloat(num.toString())
  }
  exports.getBigNumber = getBigNumber