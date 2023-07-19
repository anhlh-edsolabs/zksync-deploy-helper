import { HelperObject, DeploymentAddresses } from "./helperObject";
import { Provider } from "zksync-web3";
export declare function printPreparationInfo(helperObject: HelperObject): Promise<void>;
export declare function printDeploymentResult(helperObject: HelperObject, addresses: DeploymentAddresses): Promise<void>;
export declare function writeDeploymentResult(helperObject: HelperObject, addresses: DeploymentAddresses): Promise<void>;
export declare function getImplementationAddress(provider: Provider, proxyAddress: string): Promise<string>;
//# sourceMappingURL=utils.d.ts.map