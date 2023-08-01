import * as zk from "zksync-web3";
import "@matterlabs/hardhat-zksync-upgradable";
import { utils } from "ethers";
import { DeployProxyOptions } from "@matterlabs/hardhat-zksync-upgradable/dist/src/utils/options";
import { HelperObject } from "./helperObject";
import { estimateGasUUPS } from "./utils";
import chalk from "chalk";
import { log } from "console";

export async function deployContract(
	helperObject: HelperObject,
): Promise<zk.Contract> {
	const proxyType: DeployProxyOptions = { kind: "uups" };

	const artifact = await helperObject.zkDeployer.loadArtifact(
		helperObject.contractName,
	);

	let deploymentFee;
	let contractDeployment;
	if (helperObject.isUpgradeable) {
		const args: DeployProxyOptions[] = [
			{ constructorArgs: helperObject.initializationArgs },
		];
		
		deploymentFee = await estimateGasUUPS(
			helperObject.hre,
			helperObject.zkDeployer,
			artifact,
			args
		);

		// TODO: check proxy type & add support for deterministic deployment

		contractDeployment = await helperObject.zkUpgrader.deployProxy(
			helperObject.zkWallet,
			artifact,
			helperObject.initializationArgs,
			proxyType,
			true,
		);
	} else {
		deploymentFee = await helperObject.zkDeployer.estimateDeployFee(
			artifact,
			helperObject.initializationArgs,
		);
		contractDeployment = await helperObject.zkDeployer.deploy(
			artifact,
			helperObject.initializationArgs,
			helperObject.overrides,
			helperObject.additionalFactoryDeps,
		);
	}

	const parsedFee = utils.formatEther(deploymentFee.toString());

	log(
		`Deploying ${
			helperObject.isUpgradeable
				? "proxy contract"
				: chalk.bold.blue(artifact.contractName)
		} with estimated cost ${chalk.bold.yellowBright(parsedFee)}...`
	);
	// log(
	// 	`Deploying ${
	// 		helperObject.isUpgradeable
	// 			? "proxy contract"
	// 			: chalk.bold.blue(artifact.contractName)
	// 	}...`,
	// );

	return await contractDeployment.deployed();
}
