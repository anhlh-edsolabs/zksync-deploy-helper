import * as zk from "zksync-web3";
import * as ethers from "ethers";
import { HelperObject } from "./helperObject";
import chalk from "chalk";
import { log } from "console";

export async function deployContract(
	helperObject: HelperObject,
	constructorArgs: any[] = [],
	isProxy: boolean = false
): Promise<zk.Contract> {
	const artifact = isProxy
		? await helperObject.zkDeployer.loadArtifact(helperObject.proxyName!)
		: await helperObject.zkDeployer.loadArtifact(helperObject.contractName);

	const deploymentFee = await helperObject.zkDeployer.estimateDeployFee(
		artifact,
		constructorArgs
	);

	const parsedFee = ethers.utils.formatEther(deploymentFee.toString());

	log(
		`Deploying ${
			isProxy ? "proxy contract" : chalk.bold.blue(artifact.contractName)
		} with estimated cost ${chalk.bold.yellowBright(parsedFee)}...`
	);

	return await helperObject.zkDeployer.deploy(
		artifact,
		constructorArgs,
		helperObject.overrides,
		helperObject.additionalFactoryDeps
	);
}
