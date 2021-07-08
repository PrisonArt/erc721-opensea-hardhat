import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { PRISART__factory, PRISART } from "../typechain";

let prisart: PRISART;
let prisartFactory: PRISART__factory;
let deployer: SignerWithAddress;

const PROXY_REGISTRATION_ADDRESS = '0xa5409ec958c83c3f309868babaca7c86dcb077c1';

async function main() {
  [deployer] = await ethers.getSigners();
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
