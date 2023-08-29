first created a contract Box.sol
yarn add --dev hardhat
yarn hardhat
yarn add --dev @openzeppelin/contracts
yarn hardhat compile - to compile

The governance part

GovernanceToken.sol

This is not a normal ERC20, cause in normal ERC20, people can buy and sell it at their will (Pump and dump)
Hence we need a snapshot at every point as to how many tokens people have at a certain block
Once a proposal goes through, we pick a snapshot from the past that we wanna use. This prevents people from jumping in when there is a proposal and jump out when it gets passed. If someone has pumped and dumped, we will not consider their votes.

Now we need to add some overriding functions required by solidity

Timelock is the owner of box contract. Governor has all the voting logic.

You would want to give some time to users to walk away if the are not interested in a passed proposal. Hence there is some time gap. That's where Timelock Controller comes.

Governor settings contract is where we set voting delay, voting period and proposal threshold

Propose is where we propose new Governance

Execute fn executes queued proposal

Scripts

To deploy we need hardhat-deploy package

1. yarn add --dev @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers ethers (hardhat-deploy-ethers is overriding hardhat-ethers)
2. yarn add --dev hardhat-deploy (using this we can just create a deploy folder and add all the scripts there)
3. yarn add --dev typescript type chain ts-node @typechain/ethers-v5 @typechain/hardhat @types/chai @types/node
4. Copy boilerplate from hardhat deploy github repo
5. Add config in hardhat config and export. Run hardhat node to spin up a blockchain on localhost network (mentioned in config)
6. When you run tests it uses hardhat network
7. yarn hardhat deploy
8. WHen you deploy the contract, nobody has voting power yet as nobody has token delegated to them. Hence we want to delegate the tokens to deployer. That's why delegate function is used.
9. Similarly also deploy 22 and 03
