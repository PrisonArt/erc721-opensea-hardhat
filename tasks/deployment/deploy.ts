import { task } from "hardhat/config";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { PRISART__factory, PRISART } from "../../typechain";
import { TASK_DEPLOY } from "../task-names";
import { Network } from '@ethersproject/networks/lib/types';

//hh deploy --network hardhat|localhost|rinkeby|mainnet
task(TASK_DEPLOY, "Deploy PRISART contract")
  .setAction(async (args, hre) => {
    const network: Network = await hre.ethers.provider.getNetwork();
    console.log(`network: ${network.name}`);

    const wallets: SignerWithAddress[] = await hre.ethers.getSigners();
    const deployerWallet = wallets[0];
    const deployerAddress = await deployerWallet.getAddress();
    console.log(`deployer address: ${deployerAddress}`);

    const prisartFactory = (await hre.ethers.getContractFactory(
      'PRISART',
      deployerWallet
    )) as PRISART__factory;

    console.log('Deploying PRISART...');
    const prisart: PRISART = await prisartFactory.deploy();
    await prisart.deployed();

    console.log('PRISART deployed to:', prisart.address);
  });

