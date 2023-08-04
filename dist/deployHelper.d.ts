import { HardhatRuntimeEnvironment } from "hardhat/types";
import { HelperObjectOptions } from "./helperObject";
export declare class DeployHelper {
    private _helperObject;
    private _printPreparationInfo;
    private _printDeploymentResult;
    private _writeDeploymentResult;
    private _printUpgradePreparationInfo;
    private _printProxyUpgradeResult;
    constructor(envKey: string, hre: HardhatRuntimeEnvironment, contractName: string, signerPk: string, options?: HelperObjectOptions);
    deploy: () => Promise<void>;
    upgrade: () => Promise<void>;
}
//# sourceMappingURL=deployHelper.d.ts.map