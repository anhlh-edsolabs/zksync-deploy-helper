import * as zk from "zksync-web3";
import * as ethers from "ethers";
import "@matterlabs/hardhat-zksync-upgradable";
import { DeployProxyOptions } from '@matterlabs/hardhat-zksync-upgradable/src/utils/options';
import { HelperObject } from "./helperObject";
import chalk from "chalk";
import { log } from "console";

export async function deployContract(
	helperObject: HelperObject,
	constructorArgs: any[] = [],
	isUpgradeable: boolean = false
): Promise<zk.Contract> {
	const proxyType: DeployProxyOptions = { kind: "uups" };
	// const artifact = isUpgradeable
	// 	? await helperObject.zkDeployer.loadArtifact(helperObject.proxyName!)
	// 	: await helperObject.zkDeployer.loadArtifact(helperObject.contractName);

	const artifact = await helperObject.zkDeployer.loadArtifact(
		helperObject.contractName
	);

	let deploymentFee, contractDeployment;
	if (isUpgradeable) {
		deploymentFee =
			await helperObject.zkUpgrader.estimation.estimateGasProxy(
				helperObject.zkDeployer,
				artifact,
				constructorArgs,
				proxyType
			);
		contractDeployment = await helperObject.zkUpgrader.deployProxy(
			helperObject.zkWallet,
			artifact,
			constructorArgs,
			proxyType,
			true
		);
	} else {
		deploymentFee = await helperObject.zkDeployer.estimateDeployFee(
			artifact,
			constructorArgs
		);
		contractDeployment = await helperObject.zkDeployer.deploy(
			artifact,
			constructorArgs,
			helperObject.overrides,
			helperObject.additionalFactoryDeps
		);
	}

	const parsedFee = ethers.utils.formatEther(deploymentFee.toString());

	log(
		`Deploying ${
			isUpgradeable
				? "proxy contract"
				: chalk.bold.blue(artifact.contractName)
		} with estimated cost ${chalk.bold.yellowBright(parsedFee)}...`
	);

	// return await helperObject.zkDeployer.deploy(
	// 	artifact,
	// 	constructorArgs,
	// 	helperObject.overrides,
	// 	helperObject.additionalFactoryDeps
	// );
	return await contractDeployment.deployed();
}
