import { BigNumber } from "ethers";
import { Provider } from "zksync-web3";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { HelperObject, DeploymentAddresses } from "./helperObject";
import { ZkSyncArtifact } from "@matterlabs/hardhat-zksync-deploy/dist/types";
export declare function printPreparationInfo(helperObject: HelperObject): Promise<void>;
export declare function printDeploymentResult(helperObject: HelperObject, addresses: DeploymentAddresses): Promise<void>;
export declare function writeDeploymentResult(helperObject: HelperObject, addresses: DeploymentAddresses): Promise<void>;
export declare function getImplementationAddress(provider: Provider, proxyAddress: string): Promise<string>;
export declare function estimateGasUUPS(hre: HardhatRuntimeEnvironment, deployer: Deployer, artifact: ZkSyncArtifact, args: unknown[]): Promise<BigNumber>;
//# sourceMappingURL=utils.d.ts.map