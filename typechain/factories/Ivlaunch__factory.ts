/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer } from "ethers";
import { Provider } from "@ethersproject/providers";

import type { Ivlaunch } from "../Ivlaunch";

export class Ivlaunch__factory {
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Ivlaunch {
    return new Contract(address, _abi, signerOrProvider) as Ivlaunch;
  }
}

const _abi = [
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "tickets",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "validity",
            type: "uint256",
          },
        ],
        internalType: "struct StakingInfo",
        name: "info_",
        type: "tuple",
      },
      {
        internalType: "bytes",
        name: "sig_",
        type: "bytes",
      },
    ],
    name: "buyAndClaimTickets",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];