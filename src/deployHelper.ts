import { HardhatRuntimeEnvironment } from "hardhat/types";
import { HelperObject } from "./helperObject";
import { deployContract } from "./deploy";
import {
	printPreparationInfo,
	printDeploymentResult,
	writeDeploymentResult,
} from "./utils";

export class DeployHelper {
	private _helperObject: HelperObject;
	private _printPreparationInfo: (
		helperObject: HelperObject
	) => Promise<void>;
	private _printDeploymentResult: (
		helperObject: HelperObject,
		addresses: {
			proxyDeploymentAddress: string;
			contractDeploymentAddress: string;
		}
	) => Promise<void>;
	private _writeDeploymentResult: (
		helperObject: HelperObject,
		addresses: {
			proxyDeploymentAddress: string;
			contractDeploymentAddress: string;
		}
	) => Promise<void>;

	constructor(
		envKey: string,
		hre: HardhatRuntimeEnvironment,
		contractName: string,
		signerPk: string,
		options?: any
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

		let contractDeployment = await this._deployImpl();

		let addresses = {
			proxyDeploymentAddress: "",
			contractDeploymentAddress: contractDeployment.address,
		};

		if (this._helperObject.isUpgradeable) {
			// Deploy UUPS proxy
			const callData = contractDeployment.interface.encodeFunctionData(
				"initialize",
				this._helperObject.initializationArgs
			);
			const proxyDeployment = await this._deployProxy(
				contractDeployment.address,
				callData
			);

			addresses.proxyDeploymentAddress = proxyDeployment.address;
		}

		await this._printDeploymentResult(this._helperObject, addresses);

		// Write the result to deployment data file
		await this._writeDeploymentResult(this._helperObject, addresses);
	};

	private _deployImpl = async () => {
		// Deploy this contract. The returned object will be of a `Contract` type, similarly to ones in `ethers`.
		return await deployContract(
			this._helperObject,
			this._helperObject.initializationArgs,
			false
		);
	};

	private _deployProxy = async (implAddress: string, callData: string) => {
		// Deploy the proxy contract with implementation address and call data as constructor arguments
		return await deployContract(
			this._helperObject,
			[implAddress, callData],
			true
		);
	};
}
