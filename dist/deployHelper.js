"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeployHelper = void 0;
const helperObject_1 = require("./helperObject");
const deploy_1 = require("./deploy");
const utils_1 = require("./utils");
class DeployHelper {
    constructor(envKey, hre, contractName, signerPk, options) {
        this.deploy = () => __awaiter(this, void 0, void 0, function* () {
            yield this._printPreparationInfo(this._helperObject);
            let contractDeployment = yield this._deployImpl();
            let addresses = {
                proxyDeploymentAddress: "",
                contractDeploymentAddress: contractDeployment.address,
            };
            if (this._helperObject.isUpgradeable) {
                // Deploy UUPS proxy
                const callData = contractDeployment.interface.encodeFunctionData("initialize", this._helperObject.initializationArgs);
                const proxyDeployment = yield this._deployProxy(contractDeployment.address, callData);
                addresses.proxyDeploymentAddress = proxyDeployment.address;
            }
            yield this._printDeploymentResult(this._helperObject, addresses);
            // Write the result to deployment data file
            yield this._writeDeploymentResult(this._helperObject, addresses);
        });
        this._deployImpl = () => __awaiter(this, void 0, void 0, function* () {
            // Deploy this contract. The returned object will be of a `Contract` type, similarly to ones in `ethers`.
            return yield (0, deploy_1.deployContract)(this._helperObject, this._helperObject.initializationArgs, false);
        });
        this._deployProxy = (implAddress, callData) => __awaiter(this, void 0, void 0, function* () {
            // Deploy the proxy contract with implementation address and call data as constructor arguments
            return yield (0, deploy_1.deployContract)(this._helperObject, [implAddress, callData], true);
        });
        this._helperObject = new helperObject_1.HelperObject(envKey, hre, signerPk, contractName, options);
        this._printPreparationInfo = utils_1.printPreparationInfo;
        this._printDeploymentResult = utils_1.printDeploymentResult;
        this._writeDeploymentResult = utils_1.writeDeploymentResult;
    }
}
exports.DeployHelper = DeployHelper;
