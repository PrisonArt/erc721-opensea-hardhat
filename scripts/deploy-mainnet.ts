import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { PRISART__factory, PRISART } from "../typechain";

const INFURA_API_KEY = process.env.INFURA_API_KEY || '';
const MAINNET_PRIVATE_KEY = process.env.MAINNET_PRIVATE_KEY || '';

const URL = `https://mainnet.infura.io/v3/${INFURA_API_KEY}`;
console.log(`url: ${URL}`);

let prisart: PRISART;
let prisartFactory: PRISART__factory;

const PROXY_REGISTRATION_ADDRESS = '0xa5409ec958c83c3f309868babaca7c86dcb077c1';

async function main() {
    const provider = new ethers.providers.JsonRpcProvider(URL);
    const deployer = new ethers.Wallet(MAINNET_PRIVATE_KEY, provider);
    const address = await deployer.getAddress();
    console.log(`deployer address: ${address}`);

    prisartFactory = (await ethers.getContractFactory(
        'PRISART',
        deployer
      )) as PRISART__factory;
      
      prisart = (await prisartFactory.deploy(PROXY_REGISTRATION_ADDRESS)) as PRISART;
      console.log("deployed to:", prisart.address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
