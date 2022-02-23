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

    const creationTx = await collectible.create();
    await creationTx.wait(1);
    const tokenCount = await collectible.tokenCounter();
    // console.log(
    //   "Request id to tokenid:",
    //   await collectible.requestIdToTokenId()
    // );
    console.log("Token Count: ", tokenCount.toNumber());
    // await sleep(20);
    const mintTx = await collectible.finishMint(tokenCount.toNumber() - 1);
    await mintTx.wait(1);
    const lastTokenUri = await collectible.tokenURI(tokenCount.toNumber() - 1);
    console.log("Token URI: ", lastTokenUri);

    // expect(await greeter.greet()).to.equal("Hello, world!");

    // const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // // wait until the transaction is mined
    // await setGreetingTx.wait();

    // expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});
