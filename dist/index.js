"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
require("@matterlabs/hardhat-zksync-deploy");
require("@matterlabs/hardhat-zksync-upgradable");
const config_1 = require("hardhat/config");
const task_names_1 = require("@matterlabs/hardhat-zksync-deploy/dist/task-names");
__exportStar(require("./deployHelper"), exports);
(0, config_1.task)(task_names_1.TASK_DEPLOY_ZKSYNC, "Runs the deploy scripts for zkSync network").setAction(async (_, __, runSuper) => {
    return await runSuper();
});
//# sourceMappingURL=index.js.map