const path = require('path');
const fs = require('fs-extra');
const HDWalletProvider = require('truffle/hdwallet-provider');
const Web3 = require('web3');
const { abi, bytecode } = require('./build/Motions.json');

const mnemonic = 'always rookie insect cheese shell indoor steak post zoo fragile boat leg';

const provider = new HDWalletProvider(
  mnemonic,
  'https://rinkeby.infura.io/v3/dc3e9331faf8413498237b35c6bc2412'
);

const web3 = new Web3(provider);

const deploy = async () => {
    console.log('Start deployment');
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from account', accounts[0]);
    let result;
  
    try {
      result = await new web3.eth.Contract(abi)
        .deploy({ data: '0x' + bytecode })
        .send({ from: accounts[0], gas: 4500000 });
    } 
    catch (error) {
        console.error(error);
    }

    console.log('Deployment completed');
    const add = result.options.address;
    console.log(add);

    fs.outputFileSync(
        path.resolve(__dirname, 'contractAddress.js'),
        `const address = '${add}';\nmodule.exports = { address };\n`
      );
};
deploy();