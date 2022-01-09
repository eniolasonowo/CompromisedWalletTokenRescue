import { BigNumber, BigNumberish, BytesLike,utils,Wallet} from "ethers"
import {ethers,network} from "hardhat"

import { FlashbotsBundleProvider,FlashbotsBundleResolution } from "@flashbots/ethers-provider-bundle";


import {Ivlaunch,} from "../typechain"


const ETH_MAINNET: string = "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161";

const rpcProvider = new ethers.providers.JsonRpcProvider(ETH_MAINNET);


interface StakingInfo {
    owner:string,
    tickets:BigNumberish,
    validity:BigNumberish
}



const vlaunchAddress = ""

const CHAIN_ID = 1;


const FLASHBOTS_EP = "https://relay.flashbots.net";
const flashSigner = Wallet.createRandom();


//Compromised account details 
const compromisedAccountAddress = "";
const compromisedPrivateKey = "";
//Connect compromised account
const compromisedWallet = new ethers.Wallet(compromisedPrivateKey,rpcProvider);


//Safe Account details
const safeAccountAddress = "";
const safeAccountPrivateKey = "";
const safeAccountWallet = new ethers.Wallet(safeAccountPrivateKey,rpcProvider);


//vlaunch stake parameters
let _tickets = 500;
let _validity = 1231042996;
let _sig = ""


/**
 *   Send fund to compromised wallet from safeAccountWallet, call getReward /     unstake on staking contract with compromised wallet, transfer       rewards/ stake funds from compromised wallet to safeAccountWallet
 */
async function claim(){

    const flashbotsProvider = await FlashbotsBundleProvider.create(rpcProvider,flashSigner);

    const account1Nonce = await rpcProvider.getTransactionCount(safeAccountAddress);
    const compromisedAccountNonce = await rpcProvider.getTransactionCount(compromisedAccountAddress);

    const blockNumber = await rpcProvider.getBlockNumber();
    const block : any  = await rpcProvider.getBlock(blockNumber)


    const gw = BigNumber.from(10).pow(9);
    const priorityFee = gw.mul(31);

    //Calculate gasPrice based on block baseFeePerGas
    const gasPrice = priorityFee.add(block.baseFeePerGas);
    const BLOCK_IN_THE_FUTURE = 2;
    const stakingContractGasUsage = 125496;
    
    const stakeRewardsTransferFunctionGasUsage = 41000;

    const totalGasSpent = stakingContractGasUsage + stakeRewardsTransferFunctionGasUsage;

    //Transfer Eth To Compromised Account
    const _value = gasPrice.mul(totalGasSpent)
    console.log("Amount of Eth to transfer to compromiesd Wallet :", ethers.utils.formatEther(_value));
    

    const _transferEthToCompromisedWallet = {
        to : compromisedAccountAddress,
        value : _value, //gasPrice * getRewardGasLimit
        nonce : account1Nonce,
        gasPrice :  gasPrice
    }

    const transferEthToCompromisedWallet = await safeAccountWallet.populateTransaction(_transferEthToCompromisedWallet);



    //Connect to staking contract (Vlaunch)
    const vlaunch = (await ethers.getContractAt(
        "contracts/Interfaces.sol:Ivlaunch",
        vlaunchAddress
    )) as Ivlaunch

    console.log("Vlaunch connected",vlaunch.address);


    /**
     * Put info here
     */
    const info : StakingInfo = {
        owner : "",
        tickets : BigNumber.from(_tickets),
        validity : BigNumber.from(_validity)   
    }


    const sig : BytesLike  = _sig

    const _callClaim = await vlaunch.populateTransaction.buyAndClaimTickets(
            info,
            sig,
            {
                gasLimit : stakingContractGasUsage,
                gasPrice : gasPrice,
                nonce : compromisedAccountNonce
            }
        )
    
    const callClaim = await compromisedWallet.populateTransaction(_callClaim);


    //Transfer stake rewards out of compromised wallet to safe Account


    //Amount of staked funds you are expecting  from the staking contract
    const amountOfStakeRewards = utils.parseEther('500')
    
    const _transferStakeRewardsOut = await vlaunch.populateTransaction.transfer(
        safeAccountAddress,amountOfStakeRewards,
        {
            nonce:compromisedAccountNonce + 1
        }
        );


    const transferStakeRewardsOut = await compromisedWallet.populateTransaction(_transferEthToCompromisedWallet);


    //Sign bundle
    const signTransactions = await flashbotsProvider.signBundle([
        {signer : safeAccountWallet, transaction : transferEthToCompromisedWallet},
        {signer : compromisedWallet, transaction : callClaim},
        {signer : compromisedWallet, transaction : transferStakeRewardsOut}
    ])



    //Simulate and send tx to flashbot
    
    rpcProvider.on('block',async (blockNumber) => {
        
        const targetBlock = blockNumber + BLOCK_IN_THE_FUTURE;

        const simulateTx = await flashbotsProvider.simulate(signTransactions,targetBlock);
        console.log(simulateTx);

        const bundleSubmission = await flashbotsProvider.sendRawBundle(signTransactions,targetBlock);

        
        if( 'error' in bundleSubmission){
            throw new Error(bundleSubmission.error.message)
        }

        const bundleResolution = await bundleSubmission.wait()
        console.log(`Result: ${FlashbotsBundleResolution[bundleResolution]}`)


        if (bundleResolution === FlashbotsBundleResolution.BundleIncluded) {
            console.log(`Bundle included in ${targetBlock}`)
            process.exit(0)
        } else if (bundleResolution === FlashbotsBundleResolution.BlockPassedWithoutInclusion) {
            console.log(`Bundle not included in ${targetBlock}`)
        } else if (bundleResolution === FlashbotsBundleResolution.AccountNonceTooHigh) {
            console.log("Nonce too high")
            process.exit(1)
        }
    })

}



claim()