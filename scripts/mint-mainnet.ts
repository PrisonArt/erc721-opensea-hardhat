import dotenv from 'dotenv';
import { ContractTransaction, ethers } from "ethers";
import { PRISART } from "../typechain";

// hh run --network mainnet scripts/mint-mainnet.ts
// https://etherscan.io/address/<contract address>

const abi = [
  'function safeMint(address _to, string _metadataURI ) public',
]

async function main() {
  dotenv.config();
  const INFURA_API_KEY = process.env.INFURA_API_KEY || '';
  const MAINNET_PRIVATE_KEY = process.env.MAINNET_PRIVATE_KEY || '';
  const URL = `https://mainnet.infura.io/v3/${INFURA_API_KEY}`;
  console.log(`url: ${URL}`);

  const provider = new ethers.providers.JsonRpcProvider(URL);
  const deployer = new ethers.Wallet(MAINNET_PRIVATE_KEY, provider);
  const deployerAddress = await deployer.getAddress();
  console.log(`deployer address: ${deployerAddress}`);

  const contractAddress = process.env.MAINNET_CONTRACT_ADDRESS || '';
  console.log(`contractAddress: ${contractAddress}`);  
  const mintToAddress = process.env.MINT_TO_ADDRESS || '';
  console.log(`mintToAddress: ${mintToAddress}`);  

  const contract: PRISART = new ethers.Contract(contractAddress, abi, deployer) as PRISART;
  //TODO: Update with IPFS link
  const mintTokenURI = 'https://arweave.net/p94DFXUKhuN9wOHTXBxjxLTl6_66nCvQo3Yde8I7uxc';

  const receipt: ContractTransaction = await contract.connect(deployer)
    .safeMint(mintToAddress, mintTokenURI, { gasLimit: 3000000 });

  // receipt should include tokenURI with tokenID
  // here is where you would supply metadata to the above address
  // possibly with a REST post that would create json at that address
  // that would contain a link to the mp4, etc.
  console.log('minted:', receipt);
  process.exit(0)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });