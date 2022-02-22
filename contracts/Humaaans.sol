// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./HumanSVGGenerator.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "base64-sol/base64.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract RandomSVG is
    ERC721URIStorage,
    VRFConsumerBase,
    HumanSVGGenerator,
    Ownable
{
    uint256 public tokenCounter;
    uint256 public immutable maxTokens = maxHairs * maxLegs * maxBodies;

    event CreatedSVG(uint256 indexed tokenId, string tokenURI);
    event CreatedUnfinishedSVG(uint256 indexed tokenId, uint256 randomNumber);
    event RequestedRandomNumber(
        bytes32 indexed requestId,
        uint256 indexed tokenId
    );
    mapping(bytes32 => address) public requestIdToSender;
    mapping(uint256 => uint256) public tokenIdToRandomNumber;
    mapping(bytes32 => uint256) public requestIdToTokenId;
    bytes32 internal keyHash;
    uint256 internal fee;

    constructor(
        address _VRFCoordinator,
        address _LinkToken,
        bytes32 _keyhash,
        uint256 _fee,
        string[][][] memory _hairs,
        string[][][] memory _legs,
        string[][][] memory _bodies
    )
        VRFConsumerBase(_VRFCoordinator, _LinkToken)
        ERC721("Humaaans", "HMN")
        HumanSVGGenerator(_hairs, _legs, _bodies)
    {
        tokenCounter = 0;
        keyHash = _keyhash;
        fee = _fee;
    }

    function withdraw() public payable onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    function create() public returns (bytes32 requestId) {
        require(tokenCounter < maxTokens, "All Humaaans were already minted");
        requestId = requestRandomness(keyHash, fee);
        requestIdToSender[requestId] = msg.sender;
        uint256 tokenId = tokenCounter;
        requestIdToTokenId[requestId] = tokenId;
        tokenCounter = tokenCounter + 1;
        emit RequestedRandomNumber(requestId, tokenId);
    }

    function finishMint(uint256 tokenId) public {
        require(
            bytes(tokenURI(tokenId)).length <= 0,
            "tokenURI is already set!"
        );
        require(tokenCounter > tokenId, "TokenId has not been minted yet!");
        require(
            tokenIdToRandomNumber[tokenId] > 0,
            "Need to wait for the Chainlink node to respond!"
        );
        uint256 randomNumber = tokenIdToRandomNumber[tokenId];
        string memory svg = generateHumanSVG(randomNumber);
        string memory imageURI = svgToImageURI(svg);
        _setTokenURI(tokenId, formatTokenURI(imageURI));
        emit CreatedSVG(tokenId, svg);
    }

    function fulfillRandomness(bytes32 requestId, uint256 randomNumber)
        internal
        override
    {
        address nftOwner = requestIdToSender[requestId];
        uint256 tokenId = requestIdToTokenId[requestId];
        _safeMint(nftOwner, tokenId);
        tokenIdToRandomNumber[tokenId] = randomNumber;
        emit CreatedUnfinishedSVG(tokenId, randomNumber);
    }

    function svgToImageURI(string memory svg)
        public
        pure
        returns (string memory)
    {
        string memory baseURL = "data:image/svg+xml;base64,";
        string memory svgBase64Encoded = Base64.encode(
            bytes(string(abi.encodePacked(svg)))
        );
        return string(abi.encodePacked(baseURL, svgBase64Encoded));
    }

    function formatTokenURI(string memory imageURI)
        public
        view
        returns (string memory)
    {
        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name":"',
                                "Humaaan",
                                tokenCounter,
                                '", "description":"Randomly generated on-chain Humaaan", "attributes":"", "image":"',
                                imageURI,
                                '"}'
                            )
                        )
                    )
                )
            );
    }
}
