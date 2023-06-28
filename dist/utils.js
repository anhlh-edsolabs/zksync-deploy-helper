"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeDeploymentResult = exports.printDeploymentResult = exports.printPreparationInfo = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const ethers_1 = require("ethers");
const { log } = console;
const DATA_ROOTPATH = "./deployments-zk/";
const DATA_FILE = ".deployment_data.json";
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
function printPreparationInfo(helperObject) {
    return __awaiter(this, void 0, void 0, function* () {
        log("====================================================");
        log(`Start time: ${chalk_1.default.bold.cyanBright(new Date(Date.now()).toString())}`);
        log(`Deploying contracts with the account: ${chalk_1.default.bold.yellowBright(helperObject.zkWallet.address)}`);
        log(`Account balance: ${chalk_1.default.bold.yellowBright(ethers_1.utils.formatEther((yield helperObject.zkDeployer.zkWallet.getBalance()).toString()))}`);
        log("====================================================\n\r");
    });
}
exports.printPreparationInfo = printPreparationInfo;
function printDeploymentResult(helperObject, addresses) {
    return __awaiter(this, void 0, void 0, function* () {
        log("====================================================");
        if (helperObject.isUpgradeable) {
            log(`${chalk_1.default.bold.blue(helperObject.contractName)} proxy address: ${chalk_1.default.bold.magenta(addresses.proxyDeploymentAddress)}\n\r`);
        }
        log(`${chalk_1.default.bold.blue(helperObject.contractName)} implementation address: ${chalk_1.default.bold.yellow(addresses.contractDeploymentAddress)}\n\r`);
        log("====================================================");
        log("Completed.\n\rAccount balance after deployment: ", chalk_1.default.bold.yellowBright(ethers_1.utils.formatEther((yield helperObject.zkDeployer.zkWallet.getBalance()).toString())));
    });
}
exports.printDeploymentResult = printDeploymentResult;
function writeDeploymentResult(helperObject, addresses) {
    return __awaiter(this, void 0, void 0, function* () {
        deploymentInfo[helperObject.envKey] =
            deploymentInfo[helperObject.envKey] !== undefined
                ? deploymentInfo[helperObject.envKey]
                : {};
        deploymentInfo[helperObject.envKey][helperObject.contractName] = {
            ChainID: (yield helperObject.zkDeployer.zkWallet.provider.getNetwork())
                .chainId,
            Proxy: helperObject.isUpgradeable
                ? addresses.proxyDeploymentAddress
                : null,
            Impl: addresses.contractDeploymentAddress,
            InitializationArgs: helperObject.initializationArgs,
        };
        try {
            yield fs_1.default.promises.writeFile(dataFilePath, JSON.stringify(deploymentInfo, null, "\t"));
            log(`Information has been written to ${dataFilePath}!\n\r`);
        }
        catch (err) {
            log(`Error when trying to write to ${dataFilePath}!\n\r`, err);
        }
    });
}
exports.writeDeploymentResult = writeDeploymentResult;
