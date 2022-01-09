pragma solidity 0.8.7;


struct StakingInfo{
    address owner;
    uint256 tickets;
    uint256 validity;
}

interface Ivlaunch{    
    function buyAndClaimTickets(StakingInfo calldata info_, bytes memory sig_) external;
    function transfer(address to, uint value) external;

}