var MarketplaceContract = artifacts.require("./Marketplace.sol");

module.exports = function(deployer) {
   deployer.deploy(MarketplaceContract);
};
