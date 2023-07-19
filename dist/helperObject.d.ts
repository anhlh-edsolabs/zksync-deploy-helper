import { ethers } from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { HardhatUpgrades } from '@matterlabs/hardhat-zksync-upgradable/src/interfaces';
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import * as zk from "zksync-web3";
export interface DeploymentAddresses {
    proxy?: string;
    implementation: string;
}
export interface HelperObjectOptions {
    initializationArgs?: any[];
    isUpgradeable?: boolean;
    proxyName?: string;
    overrides?: ethers.Overrides;
    additionalFactoryDeps?: ethers.BytesLike[];
}
export declare class HelperObject {
    envKey: string;
    contractName: string;
    initializationArgs: (string | Uint8Array)[];
    isUpgradeable: boolean;
    proxyName?: string;
    overrides?: ethers.Overrides;
    additionalFactoryDeps?: ethers.BytesLike[];
    zkDeployer: Deployer;
    zkWallet: zk.Wallet;
    zkUpgrader: HardhatUpgrades;
    constructor(envKey: string, hre: HardhatRuntimeEnvironment, signerPK: string, contractName: string, options?: HelperObjectOptions);
    private createDeployer;
}
//# sourceMappingURL=helperObject.d.ts.map