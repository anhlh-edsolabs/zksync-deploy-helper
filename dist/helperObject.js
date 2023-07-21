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
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelperObject = void 0;
const hardhat_zksync_deploy_1 = require("@matterlabs/hardhat-zksync-deploy");
const zk = __importStar(require("zksync-web3"));
class HelperObject {
    constructor(envKey, hre, signerPK, contractName, options = {}) {
        // const {
        // 	initializationArgs = [],
        // 	isUpgradeable = false,
        // 	overrides,
        // 	additionalFactoryDeps,
        // } = options;
        this.createDeployer = (signerPk) => {
            const provider = new zk.Provider(this.hre.network.config.url);
            const wallet = new zk.Wallet(signerPk, provider);
            const deployer = new hardhat_zksync_deploy_1.Deployer(this.hre, wallet);
            return { deployer, wallet, provider };
        };
        this.envKey = envKey;
        this.hre = hre;
        this.contractName = contractName;
        this.initializationArgs = options.initializationArgs ?? [];
        this.isUpgradeable = options.isUpgradeable ?? false;
        this.overrides = options.overrides;
        this.additionalFactoryDeps = options.additionalFactoryDeps;
        const { deployer, wallet } = this.createDeployer(signerPK);
        this.zkDeployer = deployer;
        this.zkWallet = wallet;
        this.zkUpgrader = hre.zkUpgrades;
    }
}
exports.HelperObject = HelperObject;
//# sourceMappingURL=helperObject.js.map