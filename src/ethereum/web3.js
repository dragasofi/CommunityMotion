import Web3 from 'web3';

let web3;

if (typeof window != 'undefined' && typeof window.web3 !== 'undefined') {
  // Metamask is available
  web3 = new Web3(window.web3.currentProvider);
  //console.log(web3);
} else {
  // Metamask is not available, use Infura
  const provider = new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/dc3e9331faf8413498237b35c6bc2412');

  web3 = new Web3(provider);
}

export default web3;