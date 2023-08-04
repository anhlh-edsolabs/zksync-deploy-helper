"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upgradeProxy = void 0;
require("@matterlabs/hardhat-zksync-upgradable");
const utils_1 = require("./utils");
const chalk_1 = __importDefault(require("chalk"));
const console_1 = require("console");
async function upgradeProxy(helperObject) {
    const artifact = await helperObject.zkDeployer.loadArtifact(helperObject.contractName);
    const deployments = utils_1.deploymentData[helperObject.envKey];
    const contractDeployment = Object.keys(deployments)
        .filter((key) => key == helperObject.contractName)
        .map((value) => deployments[value])[0];
    if (contractDeployment !== undefined) {
        (0, console_1.log)(contractDeployment);
    }
    (0, console_1.log)(`Upgrading ${chalk_1.default.bold.blue(helperObject.contractName)} proxy contract at: ${chalk_1.default.bold.yellowBright(contractDeployment.Proxy)}...`);
    return await helperObject.zkUpgrader.upgradeProxy(helperObject.zkWallet, contractDeployment.Proxy, artifact);
}
exports.upgradeProxy = upgradeProxy;
//# sourceMappingURL=upgrade.js.map