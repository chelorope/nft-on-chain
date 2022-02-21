// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "base64-sol/base64.sol";

contract HumanSVGGenerator {
    /* Path Attributes: [d, fill, fill-opacity] */
    string[][][] public immutable hairs;
    string[][][] public immutable legs;
    string[][][] public immutable bodies;

    uint8 maxPathAttributes = 3;

    constructor(
        string[][][] _hairs,
        string[][][] _legs,
        string[][][] _bodies
    ) {
        hairs = _hairs;
        bodies = _bodies;
        legs = _legs;
    }

    function generateHumanSVG(uint256 _randomness)
        internal
        view
        returns (string memory humanSvg)
    {
        humanSvg = string(
            abi.encodePacked(
                "<svg width='380' height='480' xmlns='http://www.w3.org/2000/svg'>",
                "<g transform='translate(43 35)' fill='none' fill-rule='evenodd'>",
                "<g transform='translate(82 -7)'>",
                // HEAD
                "<path d='M62 65c-4-5-7-12-7-19 2-21 31-17 37-6s5 38-2 40c-3 1-10-1-16-5l4 29H54l8-39Z' fill='#B28B67'/>",
                // HAIR
                generateBodyPart(hairs[_randomness]),
                "</g>",
                // LEG
                "<g transform='translate(0 187)'>",
                generateBodyPart(legs[_randomness]),
                "</g>",
                // BODY
                "<g transform='translate(22 82)'>",
                generateBodyPart(bodies[_randomness]),
                "</g>",
                "</g>",
                "</svg>"
            )
        );
    }

    function generatePath(
        string _d,
        string _fill,
        string _fillOpacity
    ) internal pure returns (string memory finalPath) {
        finalPath = string(abi.encodePacked("<path d='", _d, "' "));
        finalPath = _fill != ""
            ? string(abi.encoded(finalPath, "fill='", _fill, "' "))
            : string(abi.encoded(finalPath, ""));
        finalPath = _fillOpacity != ""
            ? string(
                abi.encoded(finalPath, "fill-opacity='", _fillOpacity, "' ")
            )
            : string(abi.encoded(finalPath, ""));
        finalPath = string(abi.encoded(finalPath, "/>"));
    }

    function generateBodyPart(uint256 _bodyPart)
        private
        pure
        returns (string memory finalParts)
    {
        uint8 pathIndex;
        while (_bodyPart[pathIndex]) {
            finalParts = string(
                abi.encodePacked(
                    finalParts,
                    generatePath(
                        _bodyPart[0][pathIndex],
                        _bodyPart[1][pathIndex],
                        _bodyPart[2][pathIndex]
                    )
                )
            );
            pathIndex++;
        }
    }
}
