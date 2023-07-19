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
        this.createDeployer = (hre, signerPk) => {
            const wallet = new zk.Wallet(signerPk);
            const deployer = new hardhat_zksync_deploy_1.Deployer(hre, wallet);
            return { deployer, wallet };
        };
        const { initializationArgs = [], isUpgradeable = false, proxyName = "zkERC1967Proxy", overrides, additionalFactoryDeps, } = options;
        this.envKey = envKey;
        this.contractName = contractName;
        this.initializationArgs = initializationArgs;
        this.isUpgradeable = isUpgradeable;
        this.proxyName = this.isUpgradeable ? proxyName : undefined;
        this.overrides = overrides;
        this.additionalFactoryDeps = additionalFactoryDeps;
        const { deployer, wallet } = this.createDeployer(hre, signerPK);
        this.zkDeployer = deployer;
        this.zkWallet = wallet;
        this.zkUpgrader = hre.zkUpgrades;
    }
}
exports.HelperObject = HelperObject;
//# sourceMappingURL=helperObject.js.map