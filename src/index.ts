import "@matterlabs/hardhat-zksync-deploy";
import "@matterlabs/hardhat-zksync-upgradable";
import { task } from "hardhat/config";
import { TASK_DEPLOY_ZKSYNC } from "@matterlabs/hardhat-zksync-deploy/dist/task-names";

export * from "./deployHelper";

task(
	TASK_DEPLOY_ZKSYNC,
	"Runs the deploy scripts for zkSync network"
).setAction(async (_, __, runSuper) => {
	return await runSuper();
});
