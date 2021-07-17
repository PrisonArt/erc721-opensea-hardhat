import dotenv from 'dotenv';
import { ContractTransaction, ethers } from "ethers";
import { PRISART } from "../typechain";

// TODO: https://hardhat.org/guides/create-task.html
// hh run --network rinkeby scripts/burn-rinkeby.ts with tokenId parameter on commandline

const abi = [
  'function burn(uint256 tokenId ) public',
]
async function main() {
  dotenv.config();
  const INFURA_API_KEY = process.env.INFURA_API_KEY || '';
  const RINKEBY_PRIVATE_KEY = process.env.RINKEBY_PRIVATE_KEY || '';
  const URL = `https://rinkeby.infura.io/v3/${INFURA_API_KEY}`;
  console.log(`url: ${URL}`);

  const provider = new ethers.providers.JsonRpcProvider(URL);
  const deployer = new ethers.Wallet(RINKEBY_PRIVATE_KEY, provider);
  const deployerAddress = await deployer.getAddress();
  console.log(`deployer address: ${deployerAddress}`);

  const contractAddress = process.env.RINKEBY_CONTRACT_ADDRESS || '';
  console.log(`contractAddress: ${contractAddress}`);  
  const mintToAddress = process.env.MINT_TO_ADDRESS || '';
  console.log(`mintToAddress: ${mintToAddress}`);  

  const contract: PRISART = new ethers.Contract(contractAddress, abi, deployer) as PRISART;
  const tokenId = ethers.BigNumber.from(1);
  const receipt: ContractTransaction = await contract.connect(deployer)
    .burn(tokenId, { gasLimit: 300000 });

  console.log('burned:', receipt);
  process.exit(0)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });