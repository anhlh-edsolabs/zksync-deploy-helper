# zksync-deploy-helper

## Introduction

The purpose of this plugin is to simplify the smart contract deployment on `zkSync` layer 2 network by wrapping the `Deployer` object from `@matterlabs/hardhat-zksync-deploy`. Additionally, it export the deployment data to an external file, grouping by deployment environment keys `ENV_KEY: (DEV/STG/UAT/PRD)` for better contract management.  

## Change logs

### v2.1.1

- Add gas estimation for upgradeable contract deployment.

### v2.1.0

- Add support for Upgradeable contracts using **UUPS proxy** deployment, using `@matterlabs/hardhat-zksync-upgradable`

### v2.0.0

#### Breaking changes

- Project is now converted into **Typescript**.
- Add `overrides` parameter to HelperObject to support transaction parameters overriding.
- Add `additionalFactoryDeps` parameter to support factory deployments.

## Deployment script samples

### 1. Deploy contract without additional factory dependencies

```Javascript
require("dotenv").config();
const { DeployHelper } = require("zksync-deploy-helper");

module.exports = async () => {
    const ENV_KEY = process.env.DEPLOYMENT_ENV;
    const SIGNER_PK = process.env.ZKSYNC_DEPLOYER_PK;
    const CONTRACT_NAME = "ERC20";

    // Contract's constructor arguments
    const CONSTRUCTOR_ARGS = ["MyToken", "MTK"];

    const helper = new DeployHelper(
        ENV_KEY,
        hre,
        CONTRACT_NAME,
        SIGNER_PK,
        {
            initializationArgs: CONSTRUCTOR_ARGS,
        }
    );

    await helper.deploy();
};
```

### 2. Deploy factory contract with additional factory dependencies

```Javascript
require("dotenv").config();
const { DeployHelper } = require("zksync-deploy-helper");
const zksync = require("zksync-web3");

module.exports = async () => {
    const ENV_KEY = process.env.DEPLOYMENT_ENV;
    const SIGNER_PK = process.env.ZKSYNC_DEPLOYER_PK;
    const CONTRACT_NAME = "ERC20Factory";

    const ERC20Artifact = await hre.artifacts.readArtifact("ERC20");

    const ERC20BytecodeHash = zksync.utils.hashBytecode(
        ERC20Artifact.bytecode
    );

    const CONSTRUCTOR_ARGS = [
        ERC20BytecodeHash,
    ];

    const helper = new DeployHelper(
        ENV_KEY,
        hre,
        CONTRACT_NAME,
        SIGNER_PK,
        {
            initializationArgs: CONSTRUCTOR_ARGS,
            overrides: undefined,
            additionalFactoryDeps: [ERC20Artifact.bytecode],
        }
    );

    await helper.deploy();
};
```

### 3. Deploy upgradeable contract

Set the `options` parameter `isUpgradeable` to `true` to deploy the contract as UUPS proxy.

```Javascript
require("dotenv").config();
const { DeployHelper } = require("zksync-deploy-helper");

module.exports = async () => {
    const ENV_KEY = process.env.DEPLOYMENT_ENV;
    const SIGNER_PK = process.env.ZKSYNC_DEPLOYER_PK;
    const CONTRACT_NAME = "DummyUpgradeable";

    const helper = new DeployHelper(
        ENV_KEY,
        hre,
        CONTRACT_NAME,
        SIGNER_PK,
        {
            isUpgradeable: true
        }
    );

    await helper.deploy();
};

```
