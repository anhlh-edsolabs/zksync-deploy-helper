import { ethers } from "ethers";
import { HardhatRuntimeEnvironment, HttpNetworkConfig } from "hardhat/types";
import { HardhatUpgrades } from "@matterlabs/hardhat-zksync-upgradable/src/interfaces";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import * as zk from "zksync-web3";

export interface DeploymentAddresses {
	proxy?: string;
	implementation: string;
}
export interface HelperObjectOptions {
	initializationArgs?: (string | Uint8Array)[];
	isUpgradeable?: boolean;
	overrides?: ethers.Overrides;
	additionalFactoryDeps?: ethers.BytesLike[];
}

export class HelperObject {
	envKey: string;
	hre: HardhatRuntimeEnvironment;
	contractName: string;
	initializationArgs: (string | Uint8Array)[];
	isUpgradeable: boolean;
	overrides?: ethers.Overrides;
	additionalFactoryDeps?: ethers.BytesLike[];
	zkDeployer: Deployer;
	zkWallet: zk.Wallet;
	zkUpgrader: HardhatUpgrades;

	constructor(
		envKey: string,
		hre: HardhatRuntimeEnvironment,
		signerPK: string,
		contractName: string,
		options: HelperObjectOptions = {}
	) {
		// const {
		// 	initializationArgs = [],
		// 	isUpgradeable = false,
		// 	overrides,
		// 	additionalFactoryDeps,
		// } = options;

		this.envKey = envKey;
		this.hre = hre;
		this.contractName = contractName;
		this.initializationArgs = options.initializationArgs ?? [];
		this.isUpgradeable = options.isUpgradeable ?? false;
		this.overrides = options.overrides;
		this.additionalFactoryDeps = options.additionalFactoryDeps;

		const { deployer, wallet } = this.createDeployer(signerPK);
		this.zkDeployer = deployer;
		this.zkWallet = wallet;
		this.zkUpgrader = hre.zkUpgrades;
	}

	private createDeployer = (
		signerPk: string
	) => {
		const provider = new zk.Provider((this.hre.network.config as HttpNetworkConfig).url);
		const wallet = new zk.Wallet(signerPk, provider);
		const deployer = new Deployer(this.hre, wallet);

		return { deployer, wallet, provider };
	};
}
