import web3 from './web3';
import CommunityMotion from './build/contracts/CommunityMotions.json';

export default (address) => {
    return new web3.eth.Contract(
        CommunityMotion.abi,
        address
    );
};