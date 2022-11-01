const { collect, collect_fast_prices } = require("./collector");
const { feed, offChainFeed } = require("./submitter");
const { executeEpoch, startNewMinterEpoch } = require("./epoch_actions");
const { listenNewEpoch } = require("./epoch_actions/minterRewards");

const nodeCron = require("node-cron");
const { submitOracleStatus } = require("./utils");
const { getAddresses } = require("./config/address");
// const { state } = require('./state');
require("dotenv").config();

const validatorAddress = (process.env.VALIDATOR_ADDRESS || "").toLowerCase();
const { oracleProviders } = getAddresses();
const validatorIndex = oracleProviders
  .map((e) => e.toLowerCase())
  .indexOf(validatorAddress);
const providerCount = oracleProviders.length;

const startHour = Math.abs(Math.floor((24 * validatorIndex) / providerCount));
const startSeconds = Math.abs(
  Math.floor((60 * validatorIndex) / providerCount)
);

async function main() {
  await runDataFeedActions();
  await runEpochActions();
  await minterRewards();
}

async function runDataFeedActions() {
  // All scripts will run first second of first minute every hour
  await nodeCron.schedule(`0 ${startHour} * * *`, async function () {
    console.log("on-chain submit", Date.now());
    const state = await collect();
    console.log("collection", JSON.stringify(state, null, "\t"));
    const isSuccess = await feed(state);
    console.log("feed the oracle successfully!");
    if (isSuccess) {
      await submitOracleStatus(validatorAddress);
    }
  });

  await nodeCron.schedule(`${startSeconds} * * * * *`, async function () {
    console.log("off-chain submit", Date.now());
    const state = await collect_fast_prices();
    console.log("collect done");

    const isSuccess = await offChainFeed(state);
    console.log("feed off-chain price successfully!");
    if (isSuccess) {
      await submitOracleStatus(validatorAddress);
    }
  });
}

async function runEpochActions() {
  // On testnet we run the epoch action once per hour
  const hour = (startHour + 8) % 24;
  await nodeCron.schedule(`0 ${hour} * * *`, async function () {
    await executeEpoch();
  });

  //this job will only run once a day as the value is hardcode to a day in farming contract.
  //As of now, this will run at 1st min of 1am everyday
  // await nodeCron.schedule('1 1 * * *', async function () {
  //   await executeEpoch();
  // });
}

async function minterRewards() {
  // On testnet we run the epoch action once per 8 hours - run every 1st hour of 8 hours
  // TODO: configure
  const hour = (startHour + 16) % 24;

  await nodeCron.schedule(`0 ${hour} * * *`, async function () {
    await startNewMinterEpoch();
  });

  listenNewEpoch();
}

main();
