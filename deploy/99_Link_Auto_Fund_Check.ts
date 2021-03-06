import { ethers } from "hardhat";
import networkConfig from "../networks";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { isDevelopementChain } from "../util";

const fundWithLink: DeployFunction = async ({
  deployments,
  getChainId,
  run,
}: HardhatRuntimeEnvironment) => {
  const { log, get } = deployments;
  const chainId = await getChainId();
  let linkTokenAddress;
  let additionalMessage = "";
  const CONFIG = networkConfig[chainId];
  const networkName = CONFIG.name;
  // set log level to ignore non errors
  ethers.utils.Logger.setLogLevel(ethers.utils.Logger.levels.ERROR);

  if (isDevelopementChain(chainId)) {
    const linkToken = await get("LinkToken");
    linkTokenAddress = linkToken.address;
    additionalMessage = " --linkaddress " + linkTokenAddress;
  } else {
    linkTokenAddress = CONFIG.linkToken;
  }

  // Auto-fund VRFConsumer contract

  const Collectible = await deployments.get("Humaaans");
  const CollectibleContract = await ethers.getContractAt(
    "Humaaans",
    Collectible.address
  );

  if (
    await autoFundCheck(
      chainId,
      CollectibleContract.address,
      networkName,
      linkTokenAddress,
      additionalMessage
    )
  ) {
    await run("fund-link", {
      contract: CollectibleContract.address,
      linkaddress: linkTokenAddress,
    });
  }
  log("----------------------------------------------------");
};

const autoFundCheck = async (
  chainId: string,
  contractAddr: string,
  networkName: string,
  linkTokenAddress: string,
  additionalMessage: string
) => {
  console.log("Checking to see if contract can be auto-funded with LINK:");
  const amount = networkConfig[chainId].fundAmount;
  // check to see if user has enough LINK
  const accounts = await ethers.getSigners();
  const signer = accounts[0];
  const LinkToken = await ethers.getContractFactory("LinkToken");
  const linkTokenContract = new ethers.Contract(
    linkTokenAddress,
    LinkToken.interface,
    signer
  );
  const balanceHex = await linkTokenContract.balanceOf(signer.address);
  const balance = await ethers.BigNumber.from(balanceHex._hex).toString();
  const contractBalanceHex = await linkTokenContract.balanceOf(contractAddr);
  const contractBalance = await ethers.BigNumber.from(
    contractBalanceHex._hex
  ).toString();
  if (balance > amount && amount > 0 && contractBalance < amount) {
    // user has enough LINK to auto-fund
    // and the contract isn't already funded
    return true;
  } else {
    // user doesn't have enough LINK, print a warning
    console.log(
      "Account doesn't have enough LINK to fund contracts, or you're deploying to a network where auto funding isnt' done by default"
    );
    console.log(
      "Please obtain LINK via the faucet at https://" +
        networkName +
        ".chain.link/, then run the following command to fund contract with LINK:"
    );
    console.log(
      "npx hardhat fund-link --contract " +
        contractAddr +
        " --network " +
        networkName +
        additionalMessage
    );
    return false;
  }
};

export default fundWithLink;
export const tags = ["all"];
