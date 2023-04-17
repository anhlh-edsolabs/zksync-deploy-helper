const fs = require('fs');
const path = require('path');
const zk = require('zksync-web3');
const { Deployer } = require('@matterlabs/hardhat-zksync-deploy');
const { log } = require('console');

const DATA_ROOTPATH = './deployments-zk/';

class deployUtils {
    constructor(envKey, contractName, contractKey, initializationArgs, dataFile) {
        this.envKey = envKey;
        this.contractName = contractName;
        this.contractKey = contractKey;
        this.initializationArgs = initializationArgs;
        this.dataFile = dataFile;
    }

    _createDeployer = (hre, signerPk) => {
        // console.log(hre.network);
        const zkWallet = new zk.Wallet(signerPk);
        const deployer = new Deployer(hre, zkWallet);

        return deployer;
    };

    deploy = async (hre, signerPk) => {
        const deployer = this._createDeployer(hre, signerPk);
        const chainId = await await deployer.hre.getChainId();

        log('====================================================');
        log(`Start time: ${Date(Date.now())}`);
        log(`Deploying contracts with the account: ${deployer.zkWallet.address}`);
        log(
            `Account balance: ${hre.ethers.utils.formatEther(
                (await deployer.zkWallet.getBalance()).toString()
            )}`
        );
        log('====================================================\n\r');

        let { dataFileAbsPath, deploymentInfo } = this._prepareDataFile();

        const artifact = await deployer.loadArtifact(this.contractName);

        // Estimate contract deployment fee
        const deploymentFee = await deployer.estimateDeployFee(artifact, this.initializationArgs);

        // Deploy this contract. The returned object will be of a `Contract` type, similarly to ones in `ethers`.
        const parsedFee = hre.ethers.utils.formatEther(deploymentFee.toString());

        log(`Deploying ${artifact.contractName} with estimated cost ${parsedFee}...`);

        const deployment = await deployer.deploy(artifact);

        this._getDeploymentResult(artifact.contractName, deployment);

        log(
            'Completed.\n\rAccount balance after deployment: ',
            hre.ethers.utils.formatEther((await deployer.zkWallet.getBalance()).toString())
        );

        // Write the result to deployment data file
        await this._writeDeploymentResult(deploymentInfo, dataFileAbsPath, deployment, chainId);
    };

    _prepareDataFile = () => {
        try {
            // Check if the directory exists
            fs.mkdirSync(DATA_ROOTPATH, { recursive: true });
        } catch (err) {
            console.error(err);
        }

        const dataFilePath = DATA_ROOTPATH + this.dataFile;
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
            console.error(`Error importing deployment info from ${dataFilePath}: ${error.message}`);
            // Initialize an empty object as deploymentInfo
            deploymentInfo = {};
        }

        return { dataFileAbsPath: dataFilePath, deploymentInfo };
    };

    _getDeploymentResult = (contractName, deployedContract) => {
        let impl = deployedContract.address;

        log('====================================================');
        log(`\x1b[36m${contractName}\x1b[0m deployment address: \x1b[36m${impl}\x1b[0m\n\r`);
        log('====================================================');

        return impl;
    };

    _writeDeploymentResult = async (deploymentInfo, dataFile, deployment, chainId) => {
        // deploymentInfo[this.envKey] =
        //     deploymentInfo[this.envKey] !== undefined ? deploymentInfo[this.envKey] : {};

        deploymentInfo[this.envKey] = {
            [this.contractKey]: {
                ChainID: chainId,
                Impl: deployment.address,
                InitializationArgs: this.initializationArgs,
            },
        };

        try {
            await fs.promises.writeFile(dataFile, JSON.stringify(deploymentInfo, null, '\t'));
            console.log(`Information has been written to ${dataFile}!`);
        } catch (err) {
            console.error(`Error when trying to write to ${dataFile}!`, err);
        }
    };
}

module.exports = { deployUtils };
