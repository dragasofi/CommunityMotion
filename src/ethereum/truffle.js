const HDWalletProvider = require('truffle-hdwallet-provider');
const mnemonic = 'always rookie insect cheese shell indoor steak post zoo fragile boat leg';

module.exports = {
    networks: {
      development: {
        host: "127.0.0.1",
        port: 8545,
        network_id: "*" // Match any network id
      },
      rinkeby: {
        provider: function() { 
         return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/dc3e9331faf8413498237b35c6bc2412");
        },
        network_id: 4,
        gas: 4500000,
        gasPrice: 10000000000,
    }
    },
    compilers: {
      solc: {
        version: "0.5.16"
      }
    }
  };