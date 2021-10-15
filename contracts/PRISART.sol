// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract PRISART is
    ERC721,
    ERC721Enumerable,
    ERC721URIStorage,
    ERC721Burnable,
    Ownable
{
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    // solhint-disable-next-line no-empty-blocks
    constructor() ERC721("PRISART ERC721 minter", "PRISART") {}

    /**
     * @dev Safely mints a token to an address with a tokenURI.
     * @param to address of the future owner of the token
     * @param metadataURI full URI to token metadata
     */
    function safeMint(address to, string memory metadataURI) public onlyOwner {
        uint256 newTokenId = _tokenIdCounter.current();
        _safeMint(to, newTokenId);
        _setTokenURI(newTokenId, metadataURI);
        _tokenIdCounter.increment();
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    /**
     * @dev Link to Contract metadata https://docs.opensea.io/docs/contract-level-metadata
     */
    function contractURI() public pure returns (string memory) {
        //TODO: Update with IPFS link
        return
            "https://arweave.net/WG3HOwfkrRJnT-GYln3Q5Q3kAUYhqH-0hJMEv5838AM";
    }
}
