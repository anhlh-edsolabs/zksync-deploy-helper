import * as zk from "zksync-web3";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { HelperObject, HelperObjectOptions, DeploymentAddresses } from "./helperObject";
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
		let contractDeployment: zk.Contract;
		let deploymentAddresses: DeploymentAddresses;

		if (this._helperObject.isUpgradeable) {
			contractDeployment = await deployContract(
				this._helperObject,
				this._helperObject.initializationArgs,
				true
			);

			deploymentAddresses = {
				proxy: contractDeployment.address,
				implementation: await getImplementationAddress(
					this._helperObject.zkWallet.provider,
					contractDeployment.address
				),
			};
		} else {
			contractDeployment = await deployContract(
				this._helperObject,
				this._helperObject.initializationArgs
			);
			deploymentAddresses = {
				implementation: contractDeployment.address,
			};
		}

		// let contractDeployment = await this._deployImpl();

		// let addresses = {
		// 	proxyDeploymentAddress: "",
		// 	contractDeploymentAddress: contractDeployment.address,
		// };

		// if (this._helperObject.isUpgradeable) {
		// 	// Deploy UUPS proxy
		// 	const callData = contractDeployment.interface.encodeFunctionData(
		// 		"initialize",
		// 		this._helperObject.initializationArgs
		// 	);
		// 	const proxyDeployment = await this._deployProxy(
		// 		contractDeployment.address,
		// 		callData
		// 	);

		// 	addresses.proxyDeploymentAddress = proxyDeployment.address;
		// }

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

	// private _deployImpl = async (): Promise<zk.Contract> => {
	// 	// Deploy this contract. The returned object will be of a `Contract` type, similarly to ones in `ethers`.
	// 	return await deployContract(
	// 		this._helperObject,
	// 		this._helperObject.initializationArgs
	// 	);
	// };

	// private _deployProxy = async (implAddress: string, callData: string): Promise<zk.Contract> => {
	// 	// Deploy the proxy contract with implementation address and call data as constructor arguments
	// 	return await deployContract(
	// 		this._helperObject,
	// 		[implAddress, callData],
	// 		true
	// 	);
	// };

	// private _deployProxy = async (): Promise<zk.Contract> => {
	// 	return await deployContract(
	// 		this._helperObject,
	// 		this._helperObject.initializationArgs,
	// 		true
	// 	);
	// };
}
