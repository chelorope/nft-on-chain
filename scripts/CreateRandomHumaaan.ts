import { sleep } from "./../util";
import { ethers, deployments, getNamedAccounts } from "hardhat";

const main = async () => {
  const { deployer } = await getNamedAccounts();
  const Collectible = await deployments.get("Humaaans");
  const collectible = await ethers.getContractAt(
    "Humaaans",
    Collectible.address
  );

  console.log("Creating NFT on contract: ", Collectible.address);

  try {
    const creationTx = await collectible.create({
      from: deployer,
    });
    await creationTx.wait(1);
    const tokenId = (await collectible.tokenCounter()).toNumber() - 1;
    console.log("Token ID: ", tokenId);
    console.log("Finishing mint....");
    await sleep(120); // Giving some time for Chainlink to answer
    const finishMintTx = await collectible.finishMint(tokenId, {
      from: deployer,
      gasLimit: 20000000,
    });
    await finishMintTx.wait(1);
    console.log("Token", tokenId, "successfully minted!");
    const tokenURI = await collectible.tokenURI(tokenId);
    console.log("Token URI:", tokenURI);
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
};

main()
  .then(() => {
    console.log("Collectible created");
  })
  .catch((error) => console.error(error));
