const { waitSeconds } = require("../../../utils/wait");
const { updateRewardRateSum } = require("../utils/updateRewardRateSum");
const { getAddresses } = require("../../config/address");
const { getNetwork } = require("../../config/network");

function rewardAddresses() {
  const network = getNetwork();
  if (network === "fuji") {
    return [
      {
        farmId: 0,
        rewardTokenSymbols: ["arOSMO"],
      },
      {
        farmId: 1,
        rewardTokenSymbols: ["arOSMO"],
      },
      {
        farmId: 2,
        rewardTokenSymbols: ["arCAKE"],
      },
      {
        farmId: 3,
        rewardTokenSymbols: ["arCAKE"],
      },
      {
        farmId: 4,
        rewardTokenSymbols: ["arQUICK"],
      },
      {
        farmId: 5,
        rewardTokenSymbols: ["arQUICK"],
      },
      {
        farmId: 6,
        rewardTokenSymbols: ["arRAY"],
      },
      {
        farmId: 7,
        rewardTokenSymbols: ["arRAY"],
      },
      {
        farmId: 9,
        rewardTokenSymbols: ["arCRV"],
      },
      {
        farmId: 10,
        rewardTokenSymbols: ["arSUSHI"],
      },
      {
        farmId: 10,
        rewardTokenSymbols: ["arTRU"],
      },
      {
        farmId: 11,
        rewardTokenSymbols: ["arUSD"],
      },
    ];
  } else if (network == "avax") {
    return [
      {
        farmId: 0,
        rewardTokenSymbols: ["arADA"],
      },
      {
        farmId: 1,
        rewardTokenSymbols: ["arDOT"],
      },
      {
        farmId: 2,
        rewardTokenSymbols: ["arSOL"],
      },
      {
        farmId: 3,
        rewardTokenSymbols: ["arETH"],
      },
      {
        farmId: 4,
        rewardTokenSymbols: ["arMATIC"],
      },
    ];
  }
  return [];
}

exports.updateRewardRateSums = async function () {
  try {
    const addresses = await getAddresses();
    const setRewards = rewardAddresses();
    for (let i = 0; i < setRewards.length; i++) {
      try {
        const reward = setRewards[i];
        console.log(`setting reward sum for farmId = ${reward.farmId}`);
        let addrs = reward.rewardTokenSymbols.map(
          (symbol) => addresses[symbol]
        );
        await updateRewardRateSum(reward.farmId, addrs.toString());
        await waitSeconds(3);
      } catch (error) {
        console.log(error);
      }
    }
  } catch (error) {
    console.log(error);
  }
};
