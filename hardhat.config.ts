import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-etherscan";
import "@typechain/hardhat";
//import "hardhat-gas-reporter";
//import "solidity-coverage";
//import "@tenderly/hardhat-tenderly";

import { HardhatUserConfig } from "hardhat/config";

//import "./tasks/clean";





const _Ethereum : string = "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161";

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      //forking: {
       // url: ALCHEMY_ETH_MAINNET,
      // blockNumber: 20763852//19956647//polyBlockNumber19.956647
     // },
      chainId: 1337,
    },

    Ethereum : {
      url : _Ethereum
    },

  },
  solidity: {
    version: "0.8.7",
    settings: {
      optimizer: {
        enabled: true,
        runs: 2000,
      },
    },
  },
  mocha: {
    timeout: 600000,
  },

  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },

};

export default config;
