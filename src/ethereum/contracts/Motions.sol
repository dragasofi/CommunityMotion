pragma solidity 0.5.16;

import "./CommunityMotions.sol";

contract Motions{
    struct Request{
        bool active;
        uint numberOfTimesApproved;
        uint numberOfTimesVoted;
    }
    
    mapping(address => Request) public votes;
    mapping(address => mapping(address => mapping(address => bool))) public hasVoted;
    address[] public requests;
    
    function createRequests(string memory title, string memory description, uint limit) public {
        CommunityMotions motion = new CommunityMotions(title, description, limit, msg.sender);
        requests.push(address(motion));
        votes[address(motion)].active = true;
    }

    function getRequests() public view returns(address[] memory) {
        return requests;
    }
    
    function getTotalDonationsForRequests() public view returns(uint) {
        uint total = 0;
        for(uint i = 0; i< requests.length; i++){
            total += CommunityMotions(requests[i]).totalDonated();
        }
        return total;
    }
    
    function canVote(address creator, address request) public view returns(bool) {
        if(msg.sender == creator)
            return false;
        if(!votes[request].active)
            return false;
        if(CommunityMotions(request).campaignCreator() != creator)
            return false;
        if(CommunityMotions(request).donations(msg.sender) == 0)
            return false;
        return !hasVoted[creator][request][msg.sender];
    }
    
    function vote(address creator, address request, bool isApproved) public {
        require(canVote(creator, request), "You can't vote.");
        hasVoted[creator][request][msg.sender] = true;
        if(isApproved){
            votes[request].numberOfTimesApproved++;
        }
        votes[request].numberOfTimesVoted++;
    }
    
    function withdraw(uint amount, address request) public  {
         require(amount <= request.balance, "Transfer amount is invalid.");
         require(msg.sender == CommunityMotions(request).campaignCreator(), "Withdrawing funds not allowed.");
         require(votes[request].active, "Request doesn't exists.");
         require(votes[request].numberOfTimesApproved > (votes[request].numberOfTimesVoted/2), "Request is not approved");
         
         CommunityMotions(request).campaignCreator().transfer(amount);
    }
}