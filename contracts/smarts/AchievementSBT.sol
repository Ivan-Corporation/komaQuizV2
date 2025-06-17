// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AchievementSBT is ERC721URIStorage, Ownable {
    uint256 public nextTokenId;
    mapping(address => mapping(string => bool)) public hasAchievement;

    constructor(address initialOwner)
        ERC721("KomaAchievement", "KOMSBT")
        Ownable(initialOwner)
    {}

    function mint(address to, string memory achievementId, string memory uri) external onlyOwner {
        require(!hasAchievement[to][achievementId], "Achievement already claimed");

        uint256 tokenId = nextTokenId++;
        _mint(to, tokenId);
        _setTokenURI(tokenId, uri);
        hasAchievement[to][achievementId] = true;
    }

    /// @dev Enforce soulbound (non-transferable) by overriding _update
    function _update(address to, uint256 tokenId, address auth)
        internal
        override
        returns (address)
    {
        // Prevent transfers (only minting from address(0) is allowed)
        address from = _ownerOf(tokenId);
        require(from == address(0), "Soulbound: non-transferable");
        return super._update(to, tokenId, auth);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }


}
