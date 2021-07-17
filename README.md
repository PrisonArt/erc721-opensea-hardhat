# PRISART for OpenSea
Adapted for hardhat from https://github.com/ProjectOpenSea/opensea-creatures. Uses IPFS to store contract and image metadata.

Contract Features: Mintable with Auto Increment Ids, Burnable, Enumerable, URI Storage

Access Control: Ownable

Whitelists OpenSea's trading address


## Quick start

```sh
git clone https://github.com/PrisonArt/erc721-opensea-hardhat
cd erc721-opensea-hardhat
npm i
# list hardhat tasks:
npx hardhat
```
## Install hardhat-shorthand
```sh
npm i -g hardhat-shorthand
hardhat-completion install
# hh == npx hardhat
```
## Create Infura and Etherscan Accounts
Create free accounts on:
* https://infura.io
* https://etherscan.io

Create .env (listed in .gitignore). **Important**, **never** check in .env to public repo!
```sh
cp .env.sample .env
```
enter the following values into .env:
* INFURA_API_KEY=
* ETHERSCAN_API_KEY=

## Deploy and test locally

Clean, compile and test:
```sh
hh clean
hh compile
hh test
hh coverage
```
## Local deployment
```sh
hh node
```
In a new terminal, go to the repository's root folder and run this to
deploy your contract:

```sh
hh run --network localhost scripts/deploy-localhost.ts
```

## Set up Metadata for Contract

### TODO: change to IPFS

Verify image and fee_recipient values in prisart-contract.json. Deploy prisart-contract.json:
```sh
npx arweave deploy data/prisart-contract.json
```

Update "contractURI" in contracts/PRISART.sol with URL result from above.

## Set up Metadata and Images for First Minted Work

### TODO: change to IPNS
Upload image as a 480x480 animated gif:
```sh
ffmpeg -i prisart-0.mp4 -vf scale=480:-1 prisart-0.gif
npx arweave deploy assets/prisart-0.gif
```

After Arweave deployment, update "image" with the resulting Arweave URL in prisart-0.json.

Upload animation_url as a 1024x1024 mp4 with vcodec H.264, pixel format YUV 4:2:0, and CRF 25. Arweave image or video should be less than 10MB:
```sh
npx arweave deploy assets/prisart-0.mp4
```

After Arweave deployment, update "animation_url" with the resulting Arweave URL in prisart-0.json. Deploy prisart-0.json:
```sh
npx arweave deploy data/prisart-0.json
```

Update mintTokenURI in scripts/mint-rinkeby.ts and scripts/mint-mainnet.ts with Arweave path to token metadata file

## Deploy to Rinkeby
Get ether on Rinkeby:
https://faucet.rinkeby.io/

Supply the private key of the contract owner in .env:
* RINKEBY_PRIVATE_KEY=

Deploy contract to Rinkeby:
```sh
hh run --network rinkeby scripts/deploy-rinkeby.ts
```
Note the deployed contract's address and update value in .env:
* RINKEBY_CONTRACT_ADDRESS=

### Verify on Rinkeby
Run the following command, by providing the new contract address. The last value is a constructor argument, OpenSea's proxy address on Rinkeby:
```sh
hh verify --network rinkeby --contract contracts/PRISART.sol:PRISART <contract-address> 0xf57b2c51ded3a29e6891aba85459d600256cf317
```
### Check code and abi on Rinkeby
Visit the following URL, by providing the new contract address:
https://rinkeby.etherscan.io/address/_contract-address_

### Mint to Rinkeby
```sh
hh run --network rinkeby scripts/mint-rinkeby.ts
```

### Check contract on OpenSea
Go to https://testnets.opensea.io/ connect wallet using the Rinkeby network. Choose "My Collections" and "Import an existing smart contract". Enter the Rinkeby Contract Address.

### Burn Token on Rinkeby
Verify TokenId in burn-rinkeby.ts
```sh
hh run --network rinkeby scripts/burn-rinkeby.ts
```
Token will be transferred to the zero address and marked as nonexistent token

## Deploy to mainnet
```sh
hh run --network mainnet scripts/deploy-mainnet.ts
```

note the depoloyed contract's address and update value in .env:
* MAINNET_CONTRACT_ADDRESS=

### Verify on mainnet
Run the following command, by providing the new contract address. The last value is a constructor argument, OpenSea's proxy address on mainnet:
```sh
hh verify --network mainnet --contract contracts/PRISART.sol:PRISART <contract-address> 0xa5409ec958c83c3f309868babaca7c86dcb077c1
```
### Check code and abi on mainnet
Visit the following URL, by providing the new contract address:
https://etherscan.io/address/_contract-address_#code

### Mint to mainnet
```sh
hh run --network mainnet scripts/mint-mainnet.ts
```

### Check contract on OpenSea
Go to https://opensea.io/ and connect wallet using the mainnet network. Choose "My Collections" and "Import an existing smart contract". Enter the mainnet Contract Address.

## References
https://github.com/Dynamiculture/erc721-opensea-hardhat-template
