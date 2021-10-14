import { task, types } from "hardhat/config";
import { ContractReceipt, ContractTransaction } from "ethers";
import { PRISART } from "../../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { TASK_MINT } from "../task-names";
import { Network } from '@ethersproject/networks/lib/types';

import abi from '../../data/abi/PRISART.json';

//TODO: Change metadata-uri to IPFS
// hh mint-token --network rinkeby|mainnet|localhost --metadata-uri ar://8_NZWr4K9d6N8k4TDbMzLAkW6cNQnSQMLeoShc8komM
task(TASK_MINT, "Mints a token with token metadata uri")
  .addParam("metadataUri", "The token URI", null, types.string)
  .setAction(async ({ metadataUri }, hre) => {
    //TODO: Check for IPFS URI
    if (!metadataUri.startsWith("ar://")) {
      console.log('token-id must begin with ar://');
      process.exit(0)
    }
    console.log('mintTokenURI:', metadataUri)

    const wallets: SignerWithAddress[] = await hre.ethers.getSigners();
    const deployerWallet = wallets[0];

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

    var mintToAddress = "";
    if (network.name === "unknown") { //localhost network
      mintToAddress = await deployerWallet.getAddress();
    } else {
      mintToAddress = process.env.MINT_TO_ADDRESS || '';
    }

    const contract: PRISART = new hre.ethers.Contract(contractAddress, abi, deployerWallet) as PRISART;

    const mintTx: ContractTransaction = await contract.connect(deployerWallet)
      .safeMint(mintToAddress, metadataUri, { gasLimit: 300000 });

    const receipt: ContractReceipt = await mintTx.wait();

    if (receipt.events) {
      const event = receipt.events.filter(e => e.event === 'Transfer')[0];

      if (event.args) {
        console.log(`Minted token #${event.args.tokenId} to ${mintToAddress}`);
      }
    } else {
      console.log('Mint failed to ${mintToAddress}');
    }

    process.exit(0)
  });