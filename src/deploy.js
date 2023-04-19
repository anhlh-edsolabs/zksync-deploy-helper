const chalk = require('chalk');
const { log } = require('console');

async function deployContract(helperObject, constructorArgs = [], isProxy = false) {
    const artifact = isProxy
        ? await helperObject.zkDeployer.loadArtifact(helperObject.proxyName)
        : await helperObject.zkDeployer.loadArtifact(helperObject.contractName);
    const deploymentFee = await helperObject.zkDeployer.estimateDeployFee(
        artifact,
        constructorArgs
    );
    const parsedFee = hre.ethers.utils.formatEther(deploymentFee.toString());

    log(
        `Deploying ${
            isProxy ? 'proxy contract' : chalk.bold.blue(artifact.contractName)
        } with estimated cost ${chalk.bold.yellowBright(parsedFee)}...`
    );

    return await helperObject.zkDeployer.deploy(artifact, constructorArgs);
}

module.exports = { deployContract };
