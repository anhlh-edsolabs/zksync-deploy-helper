"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployContract = void 0;
require("@matterlabs/hardhat-zksync-upgradable");
const ethers_1 = require("ethers");
const utils_1 = require("./utils");
const chalk_1 = __importDefault(require("chalk"));
const console_1 = require("console");
async function deployContract(helperObject) {
    const proxyType = { kind: "uups" };
    const artifact = await helperObject.zkDeployer.loadArtifact(helperObject.contractName);
    let deploymentFee;
    let contractDeployment;
    if (helperObject.isUpgradeable) {
        const args = [
            { constructorArgs: helperObject.initializationArgs },
        ];
        deploymentFee = await (0, utils_1.estimateGasUUPS)(helperObject.hre, helperObject.zkDeployer, artifact, args);
        // TODO: check proxy type & add support for deterministic deployment
        contractDeployment = await helperObject.zkUpgrader.deployProxy(helperObject.zkWallet, artifact, helperObject.initializationArgs, proxyType, true);
    }
    else {
        deploymentFee = await helperObject.zkDeployer.estimateDeployFee(artifact, helperObject.initializationArgs);
        contractDeployment = await helperObject.zkDeployer.deploy(artifact, helperObject.initializationArgs, helperObject.overrides, helperObject.additionalFactoryDeps);
    }
    const parsedFee = ethers_1.utils.formatEther(deploymentFee.toString());
    (0, console_1.log)(`Deploying ${helperObject.isUpgradeable
        ? "proxy contract"
        : chalk_1.default.bold.blue(artifact.contractName)} with estimated cost ${chalk_1.default.bold.yellowBright(parsedFee)}...`);
    // log(
    // 	`Deploying ${
    // 		helperObject.isUpgradeable
    // 			? "proxy contract"
    // 			: chalk.bold.blue(artifact.contractName)
    // 	}...`,
    // );
    return await contractDeployment.deployed();
}
exports.deployContract = deployContract;
//# sourceMappingURL=deploy.js.map