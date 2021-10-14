import { ethers } from "hardhat";
import chai from "chai";
import { PRISART__factory, PRISART } from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

const { expect } = chai;

let prisart: PRISART;
let prisartFactory: PRISART__factory;
let deployer: SignerWithAddress;
let other: SignerWithAddress;

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

describe("prisart", () => {

    beforeEach(async () => {
        [deployer, other] = await ethers.getSigners();
        prisartFactory = (await ethers.getContractFactory(
            'PRISART',
            deployer
        )) as PRISART__factory;

        prisart = (await prisartFactory.deploy()) as PRISART;
        expect(prisart.address).to.properAddress;
    });

    describe("deployment", async () => {
        it('deployer is owner', async () => {
            expect(await prisart.owner()).to.equal(deployer.address);
        });

        it("has expected name and symbol", async function () {
            expect(await prisart.name()).to.equal("PRISART ERC721 minter");
            expect(await prisart.symbol()).to.equal("PRISART");
        });
    });

    describe("minting", async () => {
        it('contract owner can mint tokens', async () => {
            const tokenId = ethers.BigNumber.from(0);
            const tokenURI = "https://pr1s0n.art/1df0";

            await expect(prisart.connect(deployer).safeMint(other.address, tokenURI))
                .to.emit(prisart, 'Transfer')
                .withArgs(ZERO_ADDRESS, other.address, tokenId);

            expect(await prisart.balanceOf(other.address)).to.equal(1);
            expect(await prisart.ownerOf(tokenId)).to.equal(other.address);
            expect(await prisart.tokenURI(tokenId)).to.equal(tokenURI);
        });

        it('other accounts cannot mint tokens', async () => {
            const tokenURI = "https://pr1s0n.art/2d3a";
            await expect(prisart.connect(other).safeMint(other.address, tokenURI))
                .to.be.revertedWith('Ownable: caller is not the owner');
        });
    });

    describe("burning", async () => {
        it('holders can burn their tokens', async () => {
            const tokenId = ethers.BigNumber.from(0);
            const tokenURI = "https://pr1s0n.art/e01b";

            await expect(prisart.connect(deployer).safeMint(other.address, tokenURI))
                .to.emit(prisart, 'Transfer')
                .withArgs(ZERO_ADDRESS, other.address, tokenId);

            await expect(prisart.connect(other).burn(tokenId))
                .to.emit(prisart, 'Transfer')
                .withArgs(other.address, ZERO_ADDRESS, tokenId);
            expect(await prisart.balanceOf(other.address)).to.equal(0);
            await expect(prisart.ownerOf(tokenId))
                .to.be.revertedWith('ERC721: owner query for nonexistent token');
            expect(await prisart.totalSupply()).to.equal(0);
        });

        it('cannot burn if not token owner', async () => {
            const tokenId = ethers.BigNumber.from(0);
            const tokenURI = "https://pr1s0n.art/e01b";

            await expect(prisart.connect(deployer).safeMint(other.address, tokenURI))
                .to.emit(prisart, 'Transfer')
                .withArgs(ZERO_ADDRESS, other.address, tokenId);

            await expect(prisart.connect(deployer).burn(tokenId))
                .to.be.revertedWith('ERC721Burnable: caller is not owner nor approved');

            expect(await prisart.balanceOf(other.address)).to.equal(1);
            expect(await prisart.totalSupply()).to.equal(1);
        });
    });
});


