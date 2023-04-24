const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { log } = require('console');

const DATA_ROOTPATH = './deployments-zk/';
const DATA_FILE = '.deployment_data.json';

const { dataFilePath, deploymentInfo } = _prepareDataFile();

function _prepareDataFile() {
    try {
        // Check if the directory exists
        fs.mkdirSync(DATA_ROOTPATH, { recursive: true });
    } catch (err) {
        console.error(err);
    }

    const dataFilePath = DATA_ROOTPATH + DATA_FILE;
    const dataFileAbsPath = path.resolve(dataFilePath);

    if (!fs.existsSync(dataFilePath)) {
        log(`${dataFilePath} not found, creating file...`);
        fs.writeFileSync(dataFilePath, JSON.stringify({}));
    }

    let deploymentInfo;
    try {
        deploymentInfo = require(dataFileAbsPath);
    } catch (error) {
        // Handle the error
        log(`Error importing deployment info from ${dataFilePath}: ${error.message}`);
        // Initialize an empty object as deploymentInfo
        deploymentInfo = {};
    }

    return { dataFilePath, deploymentInfo };
}

async function printPreparationInfo(helperObject) {
    log('====================================================');
    log(`Start time: ${chalk.bold.cyanBright(Date(Date.now()))}`);
    log(
        `Deploying contracts with the account: ${chalk.bold.yellowBright(
            helperObject.zkWallet.address
        )}`
    );
    log(
        `Account balance: ${chalk.bold.yellowBright(
            hre.ethers.utils.formatEther(
                (await helperObject.zkDeployer.zkWallet.getBalance()).toString()
            )
        )}`
    );
    log('====================================================\n\r');
}

async function printDeploymentResult(helperObject) {
    log('====================================================');
    if (helperObject.isUpgradeable) {
        log(
            `${chalk.bold.blue(helperObject.contractName)} proxy address: ${chalk.bold.magenta(
                helperObject._proxyDeployment.address
            )}\n\r`
        );
    }
    log(
        `${chalk.bold.blue(helperObject.contractName)} implementation address: ${chalk.bold.yellow(
            helperObject._contractDeployment.address
        )}\n\r`
    );
    log('====================================================');

    log(
        'Completed.\n\rAccount balance after deployment: ',
        chalk.bold.yellowBright(
            hre.ethers.utils.formatEther(
                (await helperObject.zkDeployer.zkWallet.getBalance()).toString()
            )
        )
    );
}

async function writeDeploymentResult(helperObject) {
    deploymentInfo[helperObject.envKey] =
        deploymentInfo[helperObject.envKey] !== undefined
            ? deploymentInfo[helperObject.envKey]
            : {};
    
    deploymentInfo[helperObject.envKey][helperObject.contractKey] = {
        ChainID: helperObject.chainId,
        Proxy: helperObject.isUpgradeable ? helperObject._proxyDeployment.address : null,
        Impl: helperObject._contractDeployment.address,
        InitializationArgs: helperObject.initializationArgs,
    }

    try {
        await fs.promises.writeFile(dataFilePath, JSON.stringify(deploymentInfo, null, '\t'));
        log(`Information has been written to ${dataFilePath}!\n\r`);
    } catch (err) {
        log(`Error when trying to write to ${dataFilePath}!\n\r`, err);
    }
}

module.exports = { printPreparationInfo, printDeploymentResult, writeDeploymentResult };
