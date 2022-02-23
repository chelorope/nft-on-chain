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
    const tokenCount = await collectible.tokenCounter();
    console.log("Token Count: ", tokenCount.toNumber());
    const creationTx = await collectible.finishMint(0, {
      from: deployer,
      gasLimit: 20000000,
    });
    await creationTx.wait(1);
  } catch (error) {
    // @ts-ignore
    console.log(error.message);
    throw error;
  }
};

main()
  .then(() => {
    console.log("Collectible finished");
  })
  .catch((error) => console.error(error));
