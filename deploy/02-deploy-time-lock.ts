import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import { networkConfig, developmentChains, MIN_DELAY } from "../helper-hardhat-config"


const deployTimeLock : DeployFunction = async function (hre: HardhatRuntimeEnvironment){
    const { getNamedAccounts, deployments } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  log('Deploying Timelock');

  const timeLock = await deploy("TimeLock", {
   from: deployer, 
   args: [MIN_DELAY, [], [], deployer],
   log: true,
   // we need to wait if on a live network so we can verify properly
  // waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
})
}

export default deployTimeLock; 