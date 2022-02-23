import networkConfig from "../networks";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { isDevelopementChain, sleep, formatJsonSvg } from "../util";
import fs from "fs";

const deployCollectible: DeployFunction = async ({
  getNamedAccounts,
  deployments,
  getChainId,
  run,
  network,
}: HardhatRuntimeEnvironment) => {
  const { deploy, get, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();
  const CONFIG = networkConfig[chainId];
  let linkTokenAddress;
  let vrfCoordinatorAddress;

  if (isDevelopementChain(chainId)) {
    const linkToken = await get("LinkToken");
    const VRFCoordinatorMock = await get("VRFCoordinatorMock");
    linkTokenAddress = linkToken.address;
    vrfCoordinatorAddress = VRFCoordinatorMock.address;
  } else {
    linkTokenAddress = CONFIG.linkToken;
    vrfCoordinatorAddress = CONFIG.vrfCoordinator;
  }
  const keyHash = CONFIG.keyHash;
  const fee = CONFIG.fee;
  const hairs = formatJsonSvg(
    JSON.parse(fs.readFileSync("./files/Hairs.json", "utf8"))
  );
  const legs = formatJsonSvg(
    JSON.parse(fs.readFileSync("./files/Legs.json", "utf8"))
  );
  const bodies = formatJsonSvg(
    JSON.parse(fs.readFileSync("./files/Bodies.json", "utf8"))
  );

  console.log("Hairs", hairs, "\nBodies", bodies, "\nLegs", legs);

  log("Deploying contract from: ", deployer);

  const collectible = await deploy("Humaaans", {
    from: deployer,
    args: [
      vrfCoordinatorAddress,
      linkTokenAddress,
      keyHash,
      fee,
      hairs,
      legs,
      bodies,
    ],
    log: true,
  });

  log("Contract deployed on address:", collectible.address);

  if (!isDevelopementChain(chainId)) {
    log(
      `https://${
        network.name !== "mainnet" ? network.name : ""
      }.etherscan.io/address/${collectible.address}`
    );
    log("Verifying contract....");
    await sleep(30); // Wait for etherscan to list the contract
    try {
      await run("verify:verify", {
        address: collectible.address,
        constructorArguments: [
          vrfCoordinatorAddress,
          linkTokenAddress,
          keyHash,
          fee,
          hairs,
          legs,
          bodies,
        ],
        network: network.name,
      });
    } catch (error) {
      log("The contract couldn't be verified yet");
      log("You can try later, running:");
      log(
        `npx hardhat verify --network ${network.name} ${collectible.address} ${vrfCoordinatorAddress} ${linkTokenAddress} ${keyHash} ${fee} ${hairs} ${legs} ${bodies}`
      );
    }
  }
  log("----------------------------------------------------");
};

export default deployCollectible;
export const tags = ["all", "collectible"];
