"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployContract = void 0;
const ethers = __importStar(require("ethers"));
require("@matterlabs/hardhat-zksync-upgradable");
const chalk_1 = __importDefault(require("chalk"));
const console_1 = require("console");
async function deployContract(helperObject, constructorArgs = [], isUpgradeable = false) {
    const proxyType = { kind: "uups" };
    // const artifact = isUpgradeable
    // 	? await helperObject.zkDeployer.loadArtifact(helperObject.proxyName!)
    // 	: await helperObject.zkDeployer.loadArtifact(helperObject.contractName);
    const artifact = await helperObject.zkDeployer.loadArtifact(helperObject.contractName);
    let deploymentFee, contractDeployment;
    if (isUpgradeable) {
        deploymentFee =
            await helperObject.zkUpgrader.estimation.estimateGasProxy(helperObject.zkDeployer, artifact, constructorArgs, proxyType);
        contractDeployment = await helperObject.zkUpgrader.deployProxy(helperObject.zkWallet, artifact, constructorArgs, proxyType, true);
    }
    else {
        deploymentFee = await helperObject.zkDeployer.estimateDeployFee(artifact, constructorArgs);
        contractDeployment = await helperObject.zkDeployer.deploy(artifact, constructorArgs, helperObject.overrides, helperObject.additionalFactoryDeps);
    }
    const parsedFee = ethers.utils.formatEther(deploymentFee.toString());
    (0, console_1.log)(`Deploying ${isUpgradeable
        ? "proxy contract"
        : chalk_1.default.bold.blue(artifact.contractName)} with estimated cost ${chalk_1.default.bold.yellowBright(parsedFee)}...`);
    // return await helperObject.zkDeployer.deploy(
    // 	artifact,
    // 	constructorArgs,
    // 	helperObject.overrides,
    // 	helperObject.additionalFactoryDeps
    // );
    return await contractDeployment.deployed();
}
exports.deployContract = deployContract;
//# sourceMappingURL=deploy.js.map