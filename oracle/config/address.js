const { getNetwork } = require("./network");
const fujiAddresses = require("./fujiAddress");
const avaxAddresses = require("./avaxAddress");
const bambooAddresses = require("./bambooAddress");

function getAddresses() {
  const network = getNetwork();
  switch (network) {
    case "avax":
      return avaxAddresses;
    case "fuji":
      return fujiAddresses;
    case "bamboo":
      return bambooAddresses;
    default:
      console.log("Not supported network");
      return null;
  }
}

exports.getAddresses = getAddresses;
