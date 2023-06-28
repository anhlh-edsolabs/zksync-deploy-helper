import { ethers } from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import * as zk from "zksync-web3";

interface HelperObjectOptions {
	initializationArgs?: any[];
	isUpgradeable?: boolean;
	proxyName?: string;
	overrides?: ethers.Overrides;
	additionalFactoryDeps?: ethers.BytesLike[];
}

export class HelperObject {
	envKey: string;
	contractName: string;
	initializationArgs: (string | Uint8Array)[];
	isUpgradeable: boolean;
	proxyName?: string;
	overrides?: ethers.Overrides;
	additionalFactoryDeps?: ethers.BytesLike[];
	zkDeployer: Deployer;
	zkWallet: zk.Wallet;

	constructor(
		envKey: string,
		hre: HardhatRuntimeEnvironment,
		signerPK: string,
		contractName: string,
		options: HelperObjectOptions = {}
	) {
		const {
			initializationArgs = [],
			isUpgradeable = false,
			proxyName = "zkERC1967Proxy",
			overrides,
			additionalFactoryDeps,
		} = options;

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
	}

	private createDeployer = (
		hre: HardhatRuntimeEnvironment,
		signerPk: string
	) => {
		const wallet = new zk.Wallet(signerPk);
		const deployer = new Deployer(hre, wallet);

		return { deployer, wallet };
	};
}
