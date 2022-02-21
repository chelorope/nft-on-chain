import { task } from "hardhat/config";
import networkConfig from "../networks";
import { isDevelopementChain } from "../util";

task("balance", "Prints an account's balance")
  .addParam("account", "The account's address")
  .setAction(async (taskArgs, { ethers, getChainId }) => {
    const chainId = await getChainId();
    if (!isDevelopementChain(chainId)) {
      const provider = ethers.getDefaultProvider(Number(chainId));
      const account = ethers.utils.getAddress(taskArgs.account);
      const balance = await provider.getBalance(account);

      console.log(ethers.utils.formatEther(balance), "ETH");

      const Link = await ethers.getContractAt(
        "LinkToken",
        networkConfig[chainId].linkToken
      );
      const balanceLink = await Link.balanceOf(taskArgs.account);
      console.log(ethers.utils.formatEther(balanceLink), "LINK");
    }
  });
