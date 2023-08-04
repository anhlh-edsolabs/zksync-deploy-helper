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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.estimateGasUUPS = exports.getImplementationAddress = exports.writeDeploymentResult = exports.printProxyUpgradeResult = exports.printDeploymentResult = exports.printUpgradePreparationInfo = exports.printPreparationInfo = exports.deploymentData = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const assert_1 = __importDefault(require("assert"));
const ethers_1 = require("ethers");
const constants_1 = require("@matterlabs/hardhat-zksync-upgradable/dist/src/constants");
const utils_general_1 = require("@matterlabs/hardhat-zksync-upgradable/dist/src/utils/utils-general");
const console_1 = require("console");
// export { getImplementationAddress } from "@openzeppelin/upgrades-core/dist/eip-1967";
const DATA_ROOTPATH = "./deployments-zk/";
const DATA_FILE = ".deployment_data.json";
/** Implementation Slot is calculated as follow:
 * IMPLEMENTATION_SLOT = BigNumber.from(utils.keccak256(Buffer.from('eip1967.proxy.implementation'))).sub(1).toHexString()
 *
 * Output value: '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc'
 * */
const IMPLEMENTATION_SLOT = "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc";
// Make sure to deploy a ERC1967Proxy contract to a deterministic address on all networks
const MOCK_IMPL_ADDRESS = "0xa2b21D60f1B65BAC46604a17d91Ddd6FE5813F7f";
const deploymentDataStorage = _prepareDataFile();
exports.deploymentData = deploymentDataStorage.deployment;
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
        (0, console_1.log)(`${dataFilePath} not found, creating file...`);
        fs_1.default.writeFileSync(dataFilePath, JSON.stringify({}));
    }
    let deploymentInfo;
    try {
        deploymentInfo = require(dataFileAbsPath);
    }
    catch (error) {
        // Handle the error
        (0, console_1.log)(`Error importing deployment info from ${dataFilePath}: ${error.message}`);
        // Initialize an empty object as deploymentInfo
        deploymentInfo = {};
    }
    return { path: dataFilePath, deployment: deploymentInfo };
}
async function printPreparationInfo(helperObject) {
    (0, console_1.log)("====================================================");
    (0, console_1.log)(`Start time: ${chalk_1.default.bold.cyanBright(new Date(Date.now()).toString())}`);
    (0, console_1.log)(`Deploying contract with the account: ${chalk_1.default.bold.yellowBright(helperObject.zkWallet.address)}`);
    (0, console_1.log)(`Account balance: ${chalk_1.default.bold.yellowBright(ethers_1.utils.formatEther((await helperObject.zkDeployer.zkWallet.getBalance()).toString()))}`);
    (0, console_1.log)("====================================================\n\r");
}
exports.printPreparationInfo = printPreparationInfo;
async function printUpgradePreparationInfo(helperObject) {
    (0, console_1.log)("====================================================");
    (0, console_1.log)(`Start time: ${chalk_1.default.bold.cyanBright(new Date(Date.now()).toString())}`);
    (0, console_1.log)(`Upgrading contract with the account: ${chalk_1.default.bold.yellowBright(helperObject.zkWallet.address)}`);
    (0, console_1.log)(`Account balance: ${chalk_1.default.bold.yellowBright(ethers_1.utils.formatEther((await helperObject.zkDeployer.zkWallet.getBalance()).toString()))}`);
    (0, console_1.log)("====================================================\n\r");
}
exports.printUpgradePreparationInfo = printUpgradePreparationInfo;
async function printDeploymentResult(helperObject, addresses) {
    // log("====================================================");
    if (helperObject.isUpgradeable) {
        (0, console_1.log)(`\t - ${chalk_1.default.bold.blue(helperObject.contractName)} proxy address: ${chalk_1.default.bold.magenta(addresses.proxy ?? "")}`);
    }
    (0, console_1.log)(`\t - ${chalk_1.default.bold.blue(helperObject.contractName)} implementation address: ${chalk_1.default.bold.yellow(addresses.implementation)}`);
    (0, console_1.log)("====================================================");
    (0, console_1.log)("Completed.\n\rAccount balance after deployment: ", chalk_1.default.bold.yellowBright(ethers_1.utils.formatEther((await helperObject.zkDeployer.zkWallet.getBalance()).toString())));
}
exports.printDeploymentResult = printDeploymentResult;
async function printProxyUpgradeResult(helperObject, addresses) {
    (0, console_1.log)(`\t - ${chalk_1.default.bold.blue(helperObject.contractName)} proxy address: ${chalk_1.default.bold.magenta(addresses.proxy ?? "")}`);
    (0, console_1.log)(`\t - ${chalk_1.default.bold.blue(helperObject.contractName)} implementation address: ${chalk_1.default.bold.yellow(addresses.implementation)}`);
    (0, console_1.log)("====================================================");
    (0, console_1.log)("Completed.\n\rAccount balance after deployment: ", chalk_1.default.bold.yellowBright(ethers_1.utils.formatEther((await helperObject.zkDeployer.zkWallet.getBalance()).toString())));
}
exports.printProxyUpgradeResult = printProxyUpgradeResult;
async function writeDeploymentResult(helperObject, addresses) {
    deploymentDataStorage.deployment[helperObject.envKey] =
        deploymentDataStorage.deployment[helperObject.envKey] !== undefined
            ? deploymentDataStorage.deployment[helperObject.envKey]
            : {};
    if (helperObject.isProxyUpgrade) {
        deploymentDataStorage.deployment[helperObject.envKey][helperObject.contractName].Impl = addresses.implementation;
    }
    else {
        deploymentDataStorage.deployment[helperObject.envKey][helperObject.contractName] = {
            ChainID: (await helperObject.zkDeployer.zkWallet.provider.getNetwork()).chainId,
            Proxy: helperObject.isUpgradeable ? addresses.proxy ?? "" : null,
            Impl: addresses.implementation,
            InitializationArgs: helperObject.initializationArgs,
        };
    }
    // Add flag for upgrade
    try {
        await fs_1.default.promises.writeFile(deploymentDataStorage.path, JSON.stringify(deploymentDataStorage.deployment, null, "\t"));
        (0, console_1.log)(`Information has been written to ${deploymentDataStorage.path}!\n\r`);
    }
    catch (err) {
        (0, console_1.log)(`Error when trying to write to ${deploymentDataStorage.path}!\n\r`, err);
    }
}
exports.writeDeploymentResult = writeDeploymentResult;
async function getImplementationAddress(provider, proxyAddress) {
    const impl = await provider.getStorageAt(proxyAddress, IMPLEMENTATION_SLOT);
    return ethers_1.utils.defaultAbiCoder.decode(["address"], impl)[0];
}
exports.getImplementationAddress = getImplementationAddress;
async function estimateGasUUPS(hre, deployer, artifact, args) {
    const ERC1967ProxyPath = (await hre.artifacts.getArtifactPaths()).find((x) => x.includes(path_1.default.sep + constants_1.ERC1967_PROXY_JSON));
    (0, assert_1.default)(ERC1967ProxyPath, "ERC1967Proxy artifact not found");
    const proxyContract = await (_a = ERC1967ProxyPath, Promise.resolve().then(() => __importStar(require(_a))));
    // estimate impl deployment gas
    const implGasCost = await deployer.estimateDeployFee(artifact, []);
    const callData = (0, utils_general_1.getInitializerData)(ethers_1.Contract.getInterface(proxyContract.abi), args, false);
    const uupsGasCost = await deployer.estimateDeployFee(proxyContract, [
        MOCK_IMPL_ADDRESS,
        callData,
    ]);
    const totalGasCost = implGasCost.add(uupsGasCost);
    return totalGasCost;
}
exports.estimateGasUUPS = estimateGasUUPS;
//# sourceMappingURL=utils.js.map