import web3 from './web3';
import Motions from './build/contracts/Motions.json';
import { address } from './contractAddress';
console.log(address);

export default () => {
  return new web3.eth.Contract(
    Motions.abi,   
    address
  );
};