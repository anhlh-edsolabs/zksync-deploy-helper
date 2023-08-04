import * as zk from "zksync-web3";
import "@matterlabs/hardhat-zksync-upgradable";
import { HelperObject } from "./helperObject";
import { deploymentData, ContractDeployment } from "./utils";
import chalk from "chalk";
import { log } from "console";

export async function upgradeProxy(
	helperObject: HelperObject,
): Promise<zk.Contract> {
	const artifact = await helperObject.zkDeployer.loadArtifact(
		helperObject.contractName,
	);

	const deployments = deploymentData[helperObject.envKey];

	const contractDeployment: ContractDeployment = Object.keys(deployments)
		.filter((key) => key == helperObject.contractName)
		.map((value) => deployments[value])[0];

	if (contractDeployment !== undefined) {
		log(
			`${chalk.bold.blue(
				helperObject.contractName,
			)} current deployment info:`,
		);
		log(contractDeployment);
	}

	log(
		`Upgrading ${chalk.bold.blue(
			helperObject.contractName,
		)} proxy contract at: ${chalk.bold.yellowBright(
			contractDeployment.Proxy,
		)}...`,
	);

	const upgradedProxy = await helperObject.zkUpgrader.upgradeProxy(
		helperObject.zkWallet,
		contractDeployment.Proxy as string,
		artifact,
	);

	return await upgradedProxy.deployed();
}
