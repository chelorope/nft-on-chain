import * as dotenv from "dotenv";

import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import "@typechain/hardhat";
import "hardhat-deploy";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "@nomiclabs/hardhat-truffle5";
import "@appliedblockchain/chainlink-plugins-fund-link";

import "./tasks/accounts";
import "./tasks/contracts";
import "./tasks/balance";

dotenv.config();

const {
  PRIVATE_KEY = "",
  RINKEBY_RPC_URL,
  MUMBAI_RPC_URL,
  POLYGON_MAINNET_RPC_URL,
  GANACHE_MNEMONIC,
  ETHERSCAN_API_KEY,
} = process.env;

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  solidity: {
    compilers: [
      { version: "0.8.0" },
      { version: "0.8.1" },
      { version: "0.6.0" },
      { version: "0.6.1" },
      { version: "0.6.6" },
    ],
  },
  networks: {
    rinkeby: {
      url: RINKEBY_RPC_URL,
      accounts: [PRIVATE_KEY],
      saveDeployments: true,
    },
    ganache: {
      url: "http://localhost:7545",
      accounts: {
        mnemonic: GANACHE_MNEMONIC,
      },
    },
    mumbai: {
      url: MUMBAI_RPC_URL,
      accounts: [PRIVATE_KEY],
      saveDeployments: true,
    },
    polygon: {
      url: POLYGON_MAINNET_RPC_URL,
      accounts: [PRIVATE_KEY],
      saveDeployments: true,
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  mocha: {
    timeout: 300000,
  },
};

export default config;
