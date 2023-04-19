class HelperObject {
    constructor(envKey, contractName, contractKey, options = {}) {
        const {
            initializationArgs = [],
            isUpgradeable = false,
            proxyName = 'zkERC1967Proxy',
        } = options;

        this.envKey = envKey;
        this.contractName = contractName;
        this.contractKey = contractKey;
        this.initializationArgs = initializationArgs;
        this.isUpgradeable = isUpgradeable;
        this.proxyName = this.isUpgradeable ? proxyName : undefined;
    }
}

module.exports = { HelperObject }