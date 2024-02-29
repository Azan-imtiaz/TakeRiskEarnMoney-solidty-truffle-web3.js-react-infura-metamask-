// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract demo2 {
    uint256 value;
    address payable[] public  customers ;
    uint public count=0;
    address manager;
    constructor(){
         manager=msg.sender;
    }
  receive() external payable {
     
      customers.push(payable(msg.sender));
      count=count+1;
      value+=msg.value;
  }
     function takeRiskEarnDouble() external {
    require(msg.sender == manager, "Only manager can call this function");
    require(count > 1, "Wait for more people to participate");
    
    require(address(this).balance > 0, "No balance available to transfer");
    
    // Calculate the amount to transfer (less than or equal to the contract balance)
    uint256 amountToTransfer = address(this).balance; // Transfer the entire balance
    
    customers[1].transfer(amountToTransfer);
    
    // Reset the customers array to an empty array
    customers=new address payable[](0);
    count = 0; // Reset the count
}


    function getBalance() public  view returns (uint256) {
      return address(this).balance;
  }
  
  
}