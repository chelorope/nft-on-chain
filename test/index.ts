import { expect } from "chai";
import { ethers, deployments } from "hardhat";
import { sleep } from "../util";

describe("Humaaans", function () {
  it("Should return the correct SVG URI", async function () {
    await deployments.fixture(["all"]);
    const Collectible = await deployments.get("Humaaans");
    const collectible = await ethers.getContractAt(
      "Humaaans",
      Collectible.address
    );
    console.log("Creating token...");
    const tokenCounter = (await collectible.tokenCounter()).toNumber();
    const creationTx = await collectible.create();
    await creationTx.wait(1);
    const tokenId = (await collectible.tokenCounter()).toNumber() - 1;
    console.log("Token created. ID:", tokenId);
    expect(tokenId).to.equal(tokenCounter);

    console.log("Finishing token mint....");
    // await sleep(20);
    const mintTx = await collectible.finishMint(tokenId);
    await mintTx.wait(1);
    console.log("Mint process finished!");
    const lastTokenUri = await collectible.tokenURI(tokenId);
    console.log("Token URI: ", lastTokenUri);
    expect(lastTokenUri).to.instanceOf("string");

    // expect(await greeter.greet()).to.equal("Hello, world!");

    // const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // // wait until the transaction is mined
    // await setGreetingTx.wait();

    // expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});
