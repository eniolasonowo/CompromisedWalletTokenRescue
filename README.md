# CompromisedWalletTokenRescue
Rescue Funds (Staking Rewards, NFTs, Tokens) From Compromised Wallets



## Getting Started

Run ` npm install ` to install packages

Main file is scripts/claim.ts



# Process to rescue staked funds in a compromised wallet



## Transfer eth to compromised wallet

```
    const _transferEthToCompromisedWallet = {
        to : compromisedAccountAddress,
        value : _value, //gasPrice * getRewardGasLimit
        nonce : account1Nonce,
        gasPrice :  gasPrice
    }

```

## Staking contract custom function to call, can be (claimRewards, withdraw,unstake). The compromised wallet calls this function and tokens are released to the compromised wallet by the staking contract.

```
    const _callClaim = await vlaunch.populateTransaction.buyAndClaimTickets(
            info,
            sig,
            {
                gasLimit : stakingContractGasUsage,
                gasPrice : gasPrice,
                nonce : compromisedAccountNonce
            }
        )
    
```

## Transfer tokens out of compromised wallet to safe wallet

```
    const _transferStakeRewardsOut = await vlaunch.populateTransaction.transfer(
        safeAccountAddress,amountOfStakeRewards,
        {
            nonce:compromisedAccountNonce + 1
        }
        );
```


## Sign and bundle transactions

```
    const signTransactions = await flashbotsProvider.signBundle([
        {signer : safeAccountWallet, transaction : transferEthToCompromisedWallet},
        {signer : compromisedWallet, transaction : callClaim},
        {signer : compromisedWallet, transaction : transferStakeRewardsOut}
    ])
```

## Simulate transactions

```
        const targetBlock = blockNumber + BLOCK_IN_THE_FUTURE;

        const simulateTx = await flashbotsProvider.simulate(signTransactions,targetBlock);

```

##  Send bundle to private relay e.g Flashbots

```
        const bundleSubmission = await flashbotsProvider.sendRawBundle(signTransactions,targetBlock);

```


# Congrats! You just rescued your staked funds from a compromised wallet!

## Same process can be replicated in other blockchains e.g BSC,XDAI

I will be adding more scenerios like rescuing NFTs, so stay stuned.

## Follow me on [Twitter](https://twitter.com/eniolasonowo/ "Twitter")


