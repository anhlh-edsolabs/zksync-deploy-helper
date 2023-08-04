"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeployHelper = void 0;
const helperObject_1 = require("./helperObject");
const deploy_1 = require("./deploy");
const upgrade_1 = require("./upgrade");
const utils_1 = require("./utils");
class DeployHelper {
    constructor(envKey, hre, contractName, signerPk, options) {
        this.deploy = async () => {
            await this._printPreparationInfo(this._helperObject);
            const contractDeployment = await (0, deploy_1.deployContract)(this._helperObject);
            let deploymentAddresses;
            if (this._helperObject.isUpgradeable) {
                deploymentAddresses = {
                    proxy: contractDeployment.address,
                    implementation: await (0, utils_1.getImplementationAddress)(this._helperObject.zkWallet.provider, contractDeployment.address),
                };
            }
            else {
                deploymentAddresses = {
                    implementation: contractDeployment.address,
                };
            }
            await this._printDeploymentResult(this._helperObject, deploymentAddresses);
            // Write the result to deployment data file
            await this._writeDeploymentResult(this._helperObject, deploymentAddresses);
        };
        this.upgrade = async () => {
            this._helperObject.isProxyUpgrade = true;
            await this._printUpgradePreparationInfo(this._helperObject);
            const proxyUpgrade = await (0, upgrade_1.upgradeProxy)(this._helperObject);
            const deploymentAddresses = {
                proxy: proxyUpgrade.address,
                implementation: await (0, utils_1.getImplementationAddress)(this._helperObject.zkWallet.provider, proxyUpgrade.address),
            };
            await this._printProxyUpgradeResult(this._helperObject, deploymentAddresses);
            // Write the result to deployment data file
            await this._writeDeploymentResult(this._helperObject, deploymentAddresses);
        };
        this._helperObject = new helperObject_1.HelperObject(envKey, hre, signerPk, contractName, options);
        this._printPreparationInfo = utils_1.printPreparationInfo;
        this._printDeploymentResult = utils_1.printDeploymentResult;
        this._writeDeploymentResult = utils_1.writeDeploymentResult;
        this._printUpgradePreparationInfo = utils_1.printUpgradePreparationInfo;
        this._printProxyUpgradeResult = utils_1.printProxyUpgradeResult;
    }
}
exports.DeployHelper = DeployHelper;
//# sourceMappingURL=deployHelper.js.map