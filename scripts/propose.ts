import { ethers, network } from "hardhat"
import { encodeBytes32String } from "ethers"
import {
  developmentChains,
  VOTING_DELAY,
  proposalsFile,
  FUNC,
  PROPOSAL_DESCRIPTION,
  NEW_STORE_VALUE,
} from "../helper-hardhat-config"
import * as fs from "fs"
import { moveBlocks } from "../utils/move-blocks"


export async function propose(args: any[], functionToCall: string, proposalDescription: string) {
  const governor = await ethers.getContract("GovernorContract")
  const box = await ethers.getContract("Box")
  console.log("1. Box"+JSON.stringify(box))
  const encodedFunctionCall = box.interface.encodeFunctionData(functionToCall, args)
  console.log(`Proposing ${functionToCall} on ${(await box.getAddress()).toString()} with ${args}`)
  console.log(`Proposal Description:\n  ${proposalDescription}`)
  // const proposeTx = await governor.getFunction("propose")(
  //   [(await box.getAddress()).toString()],
  //   [0],
  //   [encodedFunctionCall],
  //   proposalDescription)
  //   console.log(proposeTx)
  // If working on a development chain, we will push forward till we get to the voting period.
   const proposalId = await governor.hashProposal([box.getAddress()],
   [0],
   [encodedFunctionCall], encodeBytes32String("Hello world")
  )

  const proposeTx = await governor.getFunction("propose")(
    [(await box.getAddress()).toString()],
    [0],
    [encodedFunctionCall],
    "Proposal #1 77 in the Box!")
    console.log(proposeTx)

  console.log("Proposal Id -->"+proposalId.toString())
  if (developmentChains.includes(network.name)) {
    await moveBlocks(VOTING_DELAY + 1)
  }
  

//  const proposeReceipt = await proposeTx.wait(1)
//   const proposalId = proposeReceipt.logs[0].args.proposalId
//   co nsole.log(`Proposed with proposal ID:\n  ${proposalId}`)

  const proposalState = await governor.getFunction("state")(proposalId)
  const proposalSnapShot = await governor.getFunction("proposalSnapshot")(proposalId)
  const proposalDeadline = await governor.getFunction("proposalDeadline")(proposalId)
  // save the proposalId
  let proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"))
  proposals[network.config.chainId!.toString()].push(proposalId.toString())
  fs.writeFileSync(proposalsFile, JSON.stringify(proposals))

  // The state of the proposal. 1 is not passed. 0 is passed.
  console.log(`Current Proposal State: ${proposalState}`)
  // What block # the proposal was snapshot
  console.log(`Current Proposal Snapshot: ${proposalSnapShot}`)
  // The block number the proposal voting expires
  console.log(`Current Proposal Deadline: ${proposalDeadline}`)
}

// function stringToBytes32(string memory source) public pure returns (bytes32 result) {
//   bytes memory tempEmptyStringTest = bytes(source);
//   if (tempEmptyStringTest.length == 0) {
//       return 0x0;
//   }

//   assembly {
//       result := mload(add(source, 32))
//   }
// }

propose([NEW_STORE_VALUE], FUNC, PROPOSAL_DESCRIPTION)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })