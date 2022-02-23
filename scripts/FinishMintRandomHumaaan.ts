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
    const tokenId = (await collectible.tokenCounter()).toNumber() - 1;
    console.log("Finishing token: ", tokenId);
    const creationTx = await collectible.finishMint(tokenId, {
      from: deployer,
      gasLimit: 20000000,
    });
    await creationTx.wait(1);
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
    console.log("Collectible finished");
  })
  .catch((error) => console.error(error));
