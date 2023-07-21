"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeployHelper = void 0;
const helperObject_1 = require("./helperObject");
const deploy_1 = require("./deploy");
const utils_1 = require("./utils");
class DeployHelper {
    constructor(envKey, hre, contractName, signerPk, options) {
        this.deploy = async () => {
            await this._printPreparationInfo(this._helperObject);
            /** TODO: use deploy proxy */
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
        this._helperObject = new helperObject_1.HelperObject(envKey, hre, signerPk, contractName, options);
        this._printPreparationInfo = utils_1.printPreparationInfo;
        this._printDeploymentResult = utils_1.printDeploymentResult;
        this._writeDeploymentResult = utils_1.writeDeploymentResult;
    }
}
exports.DeployHelper = DeployHelper;
//# sourceMappingURL=deployHelper.js.map