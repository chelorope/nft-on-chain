import { task } from "hardhat/config";
import networkConfig from "../networks";
import { formatJsonSvg } from "../util";
import fs from "fs";

task(
  "verify-collectible",
  "Prints the list of contracts deployed",
  async (taskArgs, { run, getChainId, deployments, network }) => {
    const chainId = await getChainId();
    const CONFIG = networkConfig[chainId];
    const linkTokenAddress = CONFIG.linkToken;
    const vrfCoordinatorAddress = CONFIG.vrfCoordinator;
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

    const Collectible = await deployments.get("Humaaans");
    await run("verify:verify", {
      address: Collectible.address,
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
  }
);
