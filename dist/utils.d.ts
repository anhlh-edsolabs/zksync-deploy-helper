import { BigNumber } from "ethers";
import { Provider } from "zksync-web3";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { HelperObject, DeploymentAddresses } from "./helperObject";
import { ZkSyncArtifact } from "@matterlabs/hardhat-zksync-deploy/dist/types";
export interface ContractDeployment {
    ChainID: number;
    Proxy: string | null;
    Impl: string;
    InitializationArgs: (string | Uint8Array)[];
}
interface DeploymentInfo {
    [envKey: string]: {
        [contractName: string]: ContractDeployment;
    };
}
export declare const deploymentData: DeploymentInfo;
export declare function printPreparationInfo(helperObject: HelperObject): Promise<void>;
export declare function printUpgradePreparationInfo(helperObject: HelperObject): Promise<void>;
export declare function printDeploymentResult(helperObject: HelperObject, addresses: DeploymentAddresses): Promise<void>;
export declare function printProxyUpgradeResult(helperObject: HelperObject, addresses: DeploymentAddresses): Promise<void>;
export declare function writeDeploymentResult(helperObject: HelperObject, addresses: DeploymentAddresses): Promise<void>;
export declare function getImplementationAddress(provider: Provider, proxyAddress: string): Promise<string>;
export declare function estimateGasUUPS(hre: HardhatRuntimeEnvironment, deployer: Deployer, artifact: ZkSyncArtifact, args: unknown[]): Promise<BigNumber>;
export {};
//# sourceMappingURL=utils.d.ts.map