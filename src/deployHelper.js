const chalk = require('chalk');
const zk = require('zksync-web3');
const { Deployer } = require('@matterlabs/hardhat-zksync-deploy');
// const { log } = require('console');

const { HelperObject } = require('./helperObject');
const { deployContract } = require('./deploy');
const { printPreparationInfo, printDeploymentResult, writeDeploymentResult } = require('./utils');

class deployHelper {
    constructor(envKey, contractName, contractKey, signerPk, options = {}) {
        
        this.helperObject = new HelperObject(
            envKey,
            contractName,
            contractKey,
            options
        );

        const { deployer, wallet } = this._createDeployer(hre, signerPk);
        this.helperObject.zkDeployer = deployer;
        this.helperObject.zkWallet = wallet;

        this._printPreparationInfo = printPreparationInfo;
        this._printDeploymentResult = printDeploymentResult;
        this._writeDeploymentResult = writeDeploymentResult;
    };

    deploy = async (hre) => {
        this.helperObject.chainId = (await this.helperObject.zkDeployer.zkWallet.provider.getNetwork()).chainId;

        await this._printPreparationInfo(this.helperObject);

        this.helperObject._contractDeployment = await this._deployImpl();

        if (this.helperObject.isUpgradeable) {
            // Deploy UUPS proxy
            const callData = await this.helperObject._contractDeployment.interface.encodeFunctionData(
                'initialize',
                this.helperObject.initializationArgs
            );
            this.helperObject._proxyDeployment = await this._deployProxy(
                this.helperObject._contractDeployment.address,
                callData
            );
        }

        await this._printDeploymentResult(this.helperObject);

        // Write the result to deployment data file
        await this._writeDeploymentResult(this.helperObject);
    };

    _createDeployer = (hre, signerPk) => {
        const wallet = new zk.Wallet(signerPk);
        const deployer = new Deployer(hre, wallet);

        return { deployer, wallet };
    };

    _deployImpl = async () => {
        // Deploy this contract. The returned object will be of a `Contract` type, similarly to ones in `ethers`.
        return await deployContract(this.helperObject, this.helperObject.initializationArgs);
    };

    _deployProxy = async (implAddress, callData) => {
        // Deploy the proxy contract with implementation address and call data as constructor arguments
        return await deployContract(this.helperObject, [implAddress, callData], true);
    };
}

module.exports = { deployHelper };
