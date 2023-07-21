import * as zk from "zksync-web3";
import chalk from "chalk";
import { log } from "console";
import "@matterlabs/hardhat-zksync-upgradable";
import { DeployProxyOptions } from "@matterlabs/hardhat-zksync-upgradable/dist/src/utils/options";
import { HelperObject } from "./helperObject";
import { estimateGasUUPS } from "./utils";

export async function deployContract(
	helperObject: HelperObject
): Promise<zk.Contract> {
	const proxyType: DeployProxyOptions = { kind: "uups" };

	const artifact = await helperObject.zkDeployer.loadArtifact(
		helperObject.contractName
	);

	// let deploymentFee,
	let contractDeployment;
	if (helperObject.isUpgradeable) {
		/// TODO: Add deployment fee estimation

		// deploymentFee =
		// 	await helperObject.zkUpgrader.estimation.estimateGasProxy(
		// 		helperObject.zkDeployer,
		// 		artifact,
		// 		constructorArgs,
		// 		proxyType
		// 	);
		// deploymentFee = await estimateGasUUPS(
		// 	helperObject.hre,
		// 	helperObject.zkDeployer,
		// 	artifact,
		// 	helperObject.initializationArgs
		// );
		contractDeployment = await helperObject.zkUpgrader.deployProxy(
			helperObject.zkWallet,
			artifact,
			helperObject.initializationArgs,
			proxyType,
			true
		);
	} else {
		// deploymentFee = await helperObject.zkDeployer.estimateDeployFee(
		// 	artifact,
		// 	helperObject.initializationArgs,
		// );
		contractDeployment = await helperObject.zkDeployer.deploy(
			artifact,
			helperObject.initializationArgs,
			helperObject.overrides,
			helperObject.additionalFactoryDeps
		);
	}

	// const parsedFee = ethers.utils.formatEther(deploymentFee.toString());

	// log(
	// 	`Deploying ${
	// 		helperObject.isUpgradeable
	// 			? "proxy contract"
	// 			: chalk.bold.blue(artifact.contractName)
	// 	} with estimated cost ${chalk.bold.yellowBright(parsedFee)}...`
	// );
	log(
		`Deploying ${
			helperObject.isUpgradeable
				? "proxy contract"
				: chalk.bold.blue(artifact.contractName)
		}...`
	);

	return await contractDeployment.deployed();
}
