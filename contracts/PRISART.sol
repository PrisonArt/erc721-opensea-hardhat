// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./ERC721Tradable.sol";

contract PRISART is ERC721Tradable {
    constructor(
        address _proxyRegistryAddress
    ) ERC721Tradable('PRISART ERC721 minter', 'PRISART', _proxyRegistryAddress) {}

    /**
     * @dev Link to Contract metadata https://docs.opensea.io/docs/contract-level-metadata
    */
    function contractURI() public pure returns (string memory) {
        //TODO: Update with IPFS link
        return "https://arweave.net/WG3HOwfkrRJnT-GYln3Q5Q3kAUYhqH-0hJMEv5838AM";
    }
}
