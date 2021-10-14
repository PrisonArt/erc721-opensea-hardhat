import { task, types } from "hardhat/config";
import { ContractReceipt, ContractTransaction } from "ethers";
import { PRISART } from "../../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { TASK_BURN } from "../task-names";
import { Network } from '@ethersproject/networks/lib/types';

import abi from '../../data/abi/PRISART.json';

// hh burn-token --network rinkeby|mainnet|localhost --token-id 22
task(TASK_BURN, "Burns a token by token id")
  .addParam("tokenId", "The token id", null, types.int)
  .setAction(async ({ tokenId }, hre) => {
    console.log('burning:', tokenId);

    const wallets: SignerWithAddress[] = await hre.ethers.getSigners();
    const deployerWallet = wallets[0];

    const deployerAddress = await deployerWallet.getAddress();

    const network: Network = await hre.ethers.provider.getNetwork();
    console.log(`network: ${network.name}`);

    var contractAddress = "";
    if (network.name === "rinkeby") {
      contractAddress = process.env.RINKEBY_CONTRACT_ADDRESS || '';
    } else if (network.name === "homestead") {
      contractAddress = process.env.MAINNET_CONTRACT_ADDRESS || '';
    } else if (network.name === "unknown") { //localhost network
      contractAddress = process.env.LOCALHOST_CONTRACT_ADDRESS || '';
    }
    console.log(`contractAddress: ${contractAddress}`);

    const contract: PRISART = new hre.ethers.Contract(contractAddress, abi, deployerWallet) as PRISART;

    var burnTx: ContractTransaction;

    try {
      burnTx = await contract.connect(deployerWallet).burn(tokenId, { gasLimit: 300000 });

      const receipt: ContractReceipt = await burnTx.wait();

      if (receipt.events) {
        const event = receipt.events.filter(e => e.event === 'Transfer')[0];

        if (event.args) {
          console.log(`Burned token #${event.args.tokenId} to ${event.args.to}`);
        }
      } else {
        console.log('Burn failed');
      }

    } catch (error) {
      console.log(`Burn of token# ${tokenId} failed with ${error}`);
    }

    process.exit(0)
  });