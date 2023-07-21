import { HardhatRuntimeEnvironment } from "hardhat/types";
import {
	HelperObject,
	HelperObjectOptions,
	DeploymentAddresses,
} from "./helperObject";
import { deployContract } from "./deploy";
import {
	printPreparationInfo,
	printDeploymentResult,
	writeDeploymentResult,
	getImplementationAddress,
} from "./utils";

export class DeployHelper {
	private _helperObject: HelperObject;
	private _printPreparationInfo: (
		helperObject: HelperObject
	) => Promise<void>;
	private _printDeploymentResult: (
		helperObject: HelperObject,
		addresses: DeploymentAddresses
	) => Promise<void>;
	private _writeDeploymentResult: (
		helperObject: HelperObject,
		addresses: DeploymentAddresses
	) => Promise<void>;

	constructor(
		envKey: string,
		hre: HardhatRuntimeEnvironment,
		contractName: string,
		signerPk: string,
		options?: HelperObjectOptions
	) {
		this._helperObject = new HelperObject(
			envKey,
			hre,
			signerPk,
			contractName,
			options
		);

		this._printPreparationInfo = printPreparationInfo;
		this._printDeploymentResult = printDeploymentResult;
		this._writeDeploymentResult = writeDeploymentResult;
	}

	deploy = async () => {
		await this._printPreparationInfo(this._helperObject);

		/** TODO: use deploy proxy */
		const contractDeployment = await deployContract(this._helperObject);

		let deploymentAddresses: DeploymentAddresses;

		if (this._helperObject.isUpgradeable) {
			deploymentAddresses = {
				proxy: contractDeployment.address,
				implementation: await getImplementationAddress(
					this._helperObject.zkWallet.provider,
					contractDeployment.address
				),
			};
		} else {
			deploymentAddresses = {
				implementation: contractDeployment.address,
			};
		}

		await this._printDeploymentResult(
			this._helperObject,
			deploymentAddresses
		);

		// Write the result to deployment data file
		await this._writeDeploymentResult(
			this._helperObject,
			deploymentAddresses
		);
	};
}
