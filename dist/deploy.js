"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployContract = void 0;
const chalk_1 = __importDefault(require("chalk"));
const console_1 = require("console");
require("@matterlabs/hardhat-zksync-upgradable");
async function deployContract(helperObject) {
    const proxyType = { kind: "uups" };
    const artifact = await helperObject.zkDeployer.loadArtifact(helperObject.contractName);
    // let deploymentFee,
    let contractDeployment;
    if (helperObject.isUpgradeable) {
        /// TODO: Add deployment fee estimation
        // deploymentFee =
        // 	await helperObject.zkUpgrader.estimation.estimateGasProxy(
        // 		helperObject.zkDeployer,
        // 		artifact,
        // 		constructorArgs,
        // 		proxyType
        // 	);
        // deploymentFee = await estimateGasUUPS(
        // 	helperObject.hre,
        // 	helperObject.zkDeployer,
        // 	artifact,
        // 	helperObject.initializationArgs
        // );
        contractDeployment = await helperObject.zkUpgrader.deployProxy(helperObject.zkWallet, artifact, helperObject.initializationArgs, proxyType, true);
    }
    else {
        // deploymentFee = await helperObject.zkDeployer.estimateDeployFee(
        // 	artifact,
        // 	helperObject.initializationArgs,
        // );
        contractDeployment = await helperObject.zkDeployer.deploy(artifact, helperObject.initializationArgs, helperObject.overrides, helperObject.additionalFactoryDeps);
    }
    // const parsedFee = ethers.utils.formatEther(deploymentFee.toString());
    // log(
    // 	`Deploying ${
    // 		helperObject.isUpgradeable
    // 			? "proxy contract"
    // 			: chalk.bold.blue(artifact.contractName)
    // 	} with estimated cost ${chalk.bold.yellowBright(parsedFee)}...`
    // );
    (0, console_1.log)(`Deploying ${helperObject.isUpgradeable
        ? "proxy contract"
        : chalk_1.default.bold.blue(artifact.contractName)}...`);
    return await contractDeployment.deployed();
}
exports.deployContract = deployContract;
//# sourceMappingURL=deploy.js.map