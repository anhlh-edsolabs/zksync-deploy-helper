require('@matterlabs/hardhat-zksync-deploy');
const { deployHelper } = require('./src/deployHelper');
const { TASK_DEPLOY_ZKSYNC } = require('@matterlabs/hardhat-zksync-deploy/dist/task-names');

module.exports = { deployHelper };

task(TASK_DEPLOY_ZKSYNC, 'Runs the deploy scripts for zkSync network')
    .setAction(async (_, __, runSuper) => {
        return await runSuper();
    });
