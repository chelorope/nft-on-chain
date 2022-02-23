// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract HumanSVGGenerator {
    /* Path Attributes: [d, fill, fill-opacity] */
    string[][][] public hairs;
    string[][][] public legs;
    string[][][] public bodies;

    bool[][][] public alreadyMinted;

    uint256 public maxHairs;
    uint256 public maxLegs;
    uint256 public maxBodies;

    constructor(
        string[][][] memory _hairs,
        string[][][] memory _legs,
        string[][][] memory _bodies
    ) {
        hairs = _hairs;
        bodies = _bodies;
        legs = _legs;
        maxHairs = hairs.length;
        maxLegs = legs.length;
        maxBodies = bodies.length;
    }

    function generateHumanSVG(uint256 _randomness)
        internal
        view
        returns (string memory humanSvg)
    {
        uint256 hairRandom = uint256(
            keccak256(abi.encode(_randomness, "hairs"))
        ) % maxHairs;
        uint256 legRandom = uint256(
            keccak256(abi.encode(_randomness, "legs"))
        ) % maxLegs;
        uint256 bodyRandom = uint256(
            keccak256(abi.encode(_randomness, "bodies"))
        ) % maxBodies;

        // require(
        //     !alreadyMinted[hairRandom][legRandom][bodyRandom],
        //     "Humaaan already exists"
        // );
        humanSvg = string(
            abi.encodePacked(
                "<svg width='380' height='480' xmlns='http://www.w3.org/2000/svg'>",
                "<g transform='translate(43 35)' fill='none' fill-rule='evenodd'>",
                "<g transform='translate(82 -7)'>",
                // HEAD
                "<path d='M62 65c-4-5-7-12-7-19 2-21 31-17 37-6s5 38-2 40c-3 1-10-1-16-5l4 29H54l8-39Z' fill='#B28B67'/>",
                // HAIR
                generateBodyPart(hairs[hairRandom]),
                "</g>",
                // LEG
                "<g transform='translate(0 187)'>",
                generateBodyPart(legs[legRandom]),
                "</g>",
                // BODY
                "<g transform='translate(22 82)'>",
                generateBodyPart(bodies[bodyRandom]),
                "</g>",
                "</g>",
                "</svg>"
            )
        );
    }

    function generateBodyPart(string[][] memory _bodyPart)
        private
        view
        returns (string memory finalParts)
    {
        for (uint8 pathIndex = 0; pathIndex < _bodyPart.length; pathIndex++) {
            console.log(
                "generating body part",
                pathIndex,
                _bodyPart[0][pathIndex]
            );
            string[] memory body = _bodyPart[pathIndex];
            finalParts = string(
                abi.encodePacked(
                    finalParts,
                    generatePath(
                        body.length > 0 ? body[0] : "",
                        body.length > 1 ? body[1] : "",
                        body.length > 2 ? body[2] : ""
                    )
                )
            );
        }
    }

    function generatePath(
        string memory _d,
        string memory _fill,
        string memory _fillOpacity
    ) private pure returns (string memory finalPath) {
        finalPath = string(abi.encodePacked("<path d='", _d, "' "));
        finalPath = keccak256(abi.encodePacked(_fill)) !=
            keccak256(abi.encodePacked(""))
            ? string(abi.encodePacked(finalPath, "fill='", _fill, "' "))
            : string(abi.encodePacked(finalPath, ""));
        finalPath = keccak256(abi.encodePacked(_fillOpacity)) !=
            keccak256(abi.encodePacked(""))
            ? string(
                abi.encodePacked(
                    finalPath,
                    "fill-opacity='",
                    _fillOpacity,
                    "' "
                )
            )
            : string(abi.encodePacked(finalPath, ""));
        finalPath = string(abi.encodePacked(finalPath, "/>"));
    }
}
