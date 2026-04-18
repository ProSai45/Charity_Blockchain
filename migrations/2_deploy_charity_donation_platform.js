const CharityDonationPlatform = artifacts.require("CharityDonationPlatform");

module.exports = async function (deployer) {
  await deployer.deploy(CharityDonationPlatform);
};
