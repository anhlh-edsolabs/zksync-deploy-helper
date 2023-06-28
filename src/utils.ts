import fs from "fs";
import path from "path";
import chalk from "chalk";
import { HelperObject } from "./helperObject";
import { utils } from "ethers";

const { log } = console;

const DATA_ROOTPATH = "./deployments-zk/";
const DATA_FILE = ".deployment_data.json";

interface DeploymentInfo {
	[envKey: string]: {
		[contractName: string]: {
			ChainID: number;
			Proxy: string | null;
			Impl: string;
			InitializationArgs: any[];
		};
	};
}

const { dataFilePath, deploymentInfo } = _prepareDataFile();

function _prepareDataFile(): {
	dataFilePath: string;
	deploymentInfo: DeploymentInfo;
} {
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
			`Error importing deployment info from ${dataFilePath}: ${error.message}`
		);
		// Initialize an empty object as deploymentInfo
		deploymentInfo = {};
	}

	return { dataFilePath, deploymentInfo };
}

export async function printPreparationInfo(helperObject: HelperObject) {
	log("====================================================");
	log(
		`Start time: ${chalk.bold.cyanBright(new Date(Date.now()).toString())}`
	);
	log(
		`Deploying contracts with the account: ${chalk.bold.yellowBright(
			helperObject.zkWallet.address
		)}`
	);
	log(
		`Account balance: ${chalk.bold.yellowBright(
			utils.formatEther(
				(await helperObject.zkDeployer.zkWallet.getBalance()).toString()
			)
		)}`
	);
	log("====================================================\n\r");
}

export async function printDeploymentResult(
	helperObject: HelperObject,
	addresses: {
		proxyDeploymentAddress: string;
		contractDeploymentAddress: string;
	}
): Promise<void> {
	log("====================================================");
	if (helperObject.isUpgradeable) {
		log(
			`${chalk.bold.blue(
				helperObject.contractName
			)} proxy address: ${chalk.bold.magenta(
				addresses.proxyDeploymentAddress
			)}\n\r`
		);
	}
	log(
		`${chalk.bold.blue(
			helperObject.contractName
		)} implementation address: ${chalk.bold.yellow(
			addresses.contractDeploymentAddress
		)}\n\r`
	);
	log("====================================================");

	log(
		"Completed.\n\rAccount balance after deployment: ",
		chalk.bold.yellowBright(
			utils.formatEther(
				(await helperObject.zkDeployer.zkWallet.getBalance()).toString()
			)
		)
	);
}

export async function writeDeploymentResult(
	helperObject: HelperObject,
	addresses: {
		proxyDeploymentAddress: string;
		contractDeploymentAddress: string;
	}
): Promise<void> {
	deploymentInfo[helperObject.envKey] =
		deploymentInfo[helperObject.envKey] !== undefined
			? deploymentInfo[helperObject.envKey]
			: {};

	deploymentInfo[helperObject.envKey][helperObject.contractName] = {
		ChainID: (await helperObject.zkDeployer.zkWallet.provider.getNetwork())
			.chainId,
		Proxy: helperObject.isUpgradeable
			? addresses.proxyDeploymentAddress
			: null,
		Impl: addresses.contractDeploymentAddress,
		InitializationArgs: helperObject.initializationArgs,
	};

	try {
		await fs.promises.writeFile(
			dataFilePath,
			JSON.stringify(deploymentInfo, null, "\t")
		);
		log(`Information has been written to ${dataFilePath}!\n\r`);
	} catch (err) {
		log(`Error when trying to write to ${dataFilePath}!\n\r`, err);
	}
}
