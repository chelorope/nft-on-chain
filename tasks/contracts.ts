import { task } from "hardhat/config";

task(
  "contracts",
  "Prints the list of contracts deployed",
  async (taskArgs, hre) => {
    const deployments = await hre.deployments.all();
    const addressMap = Object.keys(deployments).reduce(
      (accum: Record<string, string>, key: string) => {
        accum[key] = deployments[key].address;
        return accum;
      },
      {}
    );
    console.log("Contracts addresses: \n", addressMap);
  }
);
