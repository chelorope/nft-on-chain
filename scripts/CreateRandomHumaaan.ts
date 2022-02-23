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
    const tokenCount = await collectible.tokenCounter();
    console.log("Token Count: ", tokenCount.toNumber());
    const lastTokenUri = await collectible.tokenURI(tokenCount.sub(1));
    console.log("Token URI: ", lastTokenUri);
  } catch (error) {
    // @ts-ignore
    console.log(error.message);
    throw error;
  }
};

main()
  .then(() => {
    console.log("Collectible created");
  })
  .catch((error) => console.error(error));
