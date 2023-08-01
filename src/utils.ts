import fs from "fs";
import path from "path";
import chalk from "chalk";
import assert from "assert";
import { utils, BigNumber, Contract } from "ethers";
import { Provider } from "zksync-web3";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import { ERC1967_PROXY_JSON } from "@matterlabs/hardhat-zksync-upgradable/dist/src/constants";
import { getInitializerData } from "@matterlabs/hardhat-zksync-upgradable/dist/src/utils/utils-general";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { HelperObject, DeploymentAddresses } from "./helperObject";
import { ZkSyncArtifact } from "@matterlabs/hardhat-zksync-deploy/dist/types";
import { log } from "console";

const DATA_ROOTPATH = "./deployments-zk/";
const DATA_FILE = ".deployment_data.json";

const IMPLEMENTATION_SLOT =
	"0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc";

// Make sure to deploy a ERC1967Proxy contract to a deterministic address on all networks
const MOCK_IMPL_ADDRESS = "0xa2b21D60f1B65BAC46604a17d91Ddd6FE5813F7f";

interface DeploymentInfo {
	[envKey: string]: {
		[contractName: string]: {
			ChainID: number;
			Proxy: string | null;
			Impl: string;
			InitializationArgs: (string | Uint8Array)[];
		};
	};
}

interface DeploymentDataStorage {
	path: string;
	deployment: DeploymentInfo;
}

const deploymentDataStorage: DeploymentDataStorage = _prepareDataFile();

function _prepareDataFile(): DeploymentDataStorage {
	try {
		// Check if the directory exists
		fs.mkdirSync(DATA_ROOTPATH, { recursive: true });
	} catch (err) {
		console.error(err);
	}

	const dataFilePath = path.join(DATA_ROOTPATH, DATA_FILE);
	const dataFileAbsPath = path.resolve(dataFilePath);

	if (!fs.existsSync(dataFilePath)) {
		log(`${dataFilePath} not found, creating file...`);
		fs.writeFileSync(dataFilePath, JSON.stringify({}));
	}

	let deploymentInfo: DeploymentInfo;
	try {
		deploymentInfo = require(dataFileAbsPath);
	} catch (error: any) {
		// Handle the error
		log(
			`Error importing deployment info from ${dataFilePath}: ${error.message}`,
		);
		// Initialize an empty object as deploymentInfo
		deploymentInfo = {};
	}

	return { path: dataFilePath, deployment: deploymentInfo };
}

export async function printPreparationInfo(helperObject: HelperObject) {
	log("====================================================");
	log(
		`Start time: ${chalk.bold.cyanBright(new Date(Date.now()).toString())}`,
	);
	log(
		`Deploying contracts with the account: ${chalk.bold.yellowBright(
			helperObject.zkWallet.address,
		)}`,
	);
	log(
		`Account balance: ${chalk.bold.yellowBright(
			utils.formatEther(
				(
					await helperObject.zkDeployer.zkWallet.getBalance()
				).toString(),
			),
		)}`,
	);
	log("====================================================\n\r");
}

export async function printDeploymentResult(
	helperObject: HelperObject,
	addresses: DeploymentAddresses,
): Promise<void> {
	log("====================================================");
	if (helperObject.isUpgradeable) {
		log(
			`${chalk.bold.blue(
				helperObject.contractName,
			)} proxy address: ${chalk.bold.magenta(addresses.proxy ?? "")}\n\r`,
		);
	}
	log(
		`${chalk.bold.blue(
			helperObject.contractName,
		)} implementation address: ${chalk.bold.yellow(
			addresses.implementation,
		)}\n\r`,
	);
	log("====================================================");

	log(
		"Completed.\n\rAccount balance after deployment: ",
		chalk.bold.yellowBright(
			utils.formatEther(
				(
					await helperObject.zkDeployer.zkWallet.getBalance()
				).toString(),
			),
		),
	);
}

export async function writeDeploymentResult(
	helperObject: HelperObject,
	addresses: DeploymentAddresses,
): Promise<void> {
	deploymentDataStorage.deployment[helperObject.envKey] =
		deploymentDataStorage.deployment[helperObject.envKey] !== undefined
			? deploymentDataStorage.deployment[helperObject.envKey]
			: {};

	deploymentDataStorage.deployment[helperObject.envKey][
		helperObject.contractName
	] = {
		ChainID: (await helperObject.zkDeployer.zkWallet.provider.getNetwork())
			.chainId,
		Proxy: helperObject.isUpgradeable ? addresses.proxy ?? "" : null,
		Impl: addresses.implementation,
		InitializationArgs: helperObject.initializationArgs,
	};

	try {
		await fs.promises.writeFile(
			deploymentDataStorage.path,
			JSON.stringify(deploymentDataStorage.deployment, null, "\t"),
		);
		log(
			`Information has been written to ${deploymentDataStorage.path}!\n\r`,
		);
	} catch (err) {
		log(
			`Error when trying to write to ${deploymentDataStorage.path}!\n\r`,
			err,
		);
	}
}

export async function getImplementationAddress(
	provider: Provider,
	proxyAddress: string,
): Promise<string> {
	const impl = await provider.getStorageAt(proxyAddress, IMPLEMENTATION_SLOT);
	return utils.defaultAbiCoder.decode(["address"], impl)[0];
}

export async function estimateGasUUPS(
	hre: HardhatRuntimeEnvironment,
	deployer: Deployer,
	artifact: ZkSyncArtifact,
	args: unknown[],
): Promise<BigNumber> {
	const ERC1967ProxyPath = (await hre.artifacts.getArtifactPaths()).find(
		(x) => x.includes(path.sep + ERC1967_PROXY_JSON),
	);
	assert(ERC1967ProxyPath, "ERC1967Proxy artifact not found");
	const proxyContract = await import(ERC1967ProxyPath);

	// estimate impl deployment gas
	const implGasCost = await deployer.estimateDeployFee(artifact, []);

	const callData = getInitializerData(
		Contract.getInterface(proxyContract.abi),
		args,
		false,
	);

	const uupsGasCost = await deployer.estimateDeployFee(proxyContract, [
		MOCK_IMPL_ADDRESS,
		callData,
	]);

	const totalGasCost = implGasCost.add(uupsGasCost);
	return totalGasCost;
}
