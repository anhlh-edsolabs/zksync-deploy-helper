"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImplementationAddress = exports.writeDeploymentResult = exports.printDeploymentResult = exports.printPreparationInfo = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const ethers_1 = require("ethers");
const { log } = console;
const DATA_ROOTPATH = "./deployments-zk/";
const DATA_FILE = ".deployment_data.json";
const implSlot = "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc";
const { dataFilePath, deploymentInfo } = _prepareDataFile();
function _prepareDataFile() {
    try {
        // Check if the directory exists
        fs_1.default.mkdirSync(DATA_ROOTPATH, { recursive: true });
    }
    catch (err) {
        console.error(err);
    }
    const dataFilePath = path_1.default.join(DATA_ROOTPATH, DATA_FILE);
    const dataFileAbsPath = path_1.default.resolve(dataFilePath);
    if (!fs_1.default.existsSync(dataFilePath)) {
        log(`${dataFilePath} not found, creating file...`);
        fs_1.default.writeFileSync(dataFilePath, JSON.stringify({}));
    }
    let deploymentInfo;
    try {
        deploymentInfo = require(dataFileAbsPath);
    }
    catch (error) {
        // Handle the error
        log(`Error importing deployment info from ${dataFilePath}: ${error.message}`);
        // Initialize an empty object as deploymentInfo
        deploymentInfo = {};
    }
    return { dataFilePath, deploymentInfo };
}
async function printPreparationInfo(helperObject) {
    log("====================================================");
    log(`Start time: ${chalk_1.default.bold.cyanBright(new Date(Date.now()).toString())}`);
    log(`Deploying contracts with the account: ${chalk_1.default.bold.yellowBright(helperObject.zkWallet.address)}`);
    log(`Account balance: ${chalk_1.default.bold.yellowBright(ethers_1.utils.formatEther((await helperObject.zkDeployer.zkWallet.getBalance()).toString()))}`);
    log("====================================================\n\r");
}
exports.printPreparationInfo = printPreparationInfo;
async function printDeploymentResult(helperObject, addresses) {
    log("====================================================");
    if (helperObject.isUpgradeable) {
        log(`${chalk_1.default.bold.blue(helperObject.contractName)} proxy address: ${chalk_1.default.bold.magenta(addresses.proxy ?? "")}\n\r`);
    }
    log(`${chalk_1.default.bold.blue(helperObject.contractName)} implementation address: ${chalk_1.default.bold.yellow(addresses.implementation)}\n\r`);
    log("====================================================");
    log("Completed.\n\rAccount balance after deployment: ", chalk_1.default.bold.yellowBright(ethers_1.utils.formatEther((await helperObject.zkDeployer.zkWallet.getBalance()).toString())));
}
exports.printDeploymentResult = printDeploymentResult;
async function writeDeploymentResult(helperObject, addresses) {
    deploymentInfo[helperObject.envKey] =
        deploymentInfo[helperObject.envKey] !== undefined
            ? deploymentInfo[helperObject.envKey]
            : {};
    deploymentInfo[helperObject.envKey][helperObject.contractName] = {
        ChainID: (await helperObject.zkDeployer.zkWallet.provider.getNetwork())
            .chainId,
        Proxy: helperObject.isUpgradeable
            ? addresses.proxy ?? ""
            : null,
        Impl: addresses.implementation,
        InitializationArgs: helperObject.initializationArgs,
    };
    try {
        await fs_1.default.promises.writeFile(dataFilePath, JSON.stringify(deploymentInfo, null, "\t"));
        log(`Information has been written to ${dataFilePath}!\n\r`);
    }
    catch (err) {
        log(`Error when trying to write to ${dataFilePath}!\n\r`, err);
    }
}
exports.writeDeploymentResult = writeDeploymentResult;
async function getImplementationAddress(provider, proxyAddress) {
    const impl = await provider.getStorageAt(proxyAddress, implSlot);
    return ethers_1.utils.defaultAbiCoder.decode(["address"], impl)[0];
}
exports.getImplementationAddress = getImplementationAddress;
//# sourceMappingURL=utils.js.map