const path = require('path');
const fs = require('fs-extra');

// Solidity compailer
const solc = require('solc');

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

const communityMotionsPath = path.resolve(__dirname, 'contracts', 'CommunityMotions.sol');
const motionsPath = path.resolve(__dirname,'contracts', 'Motions.sol');

const contractsSources = {
    'CommunityMotions.sol': fs.readFileSync(communityMotionsPath, 'utf8'),
    'Motions.sol': fs.readFileSync(motionsPath, 'utf8')
}

const jsonContractsSources = JSON.stringify({
    language: 'Solidity',
    sources: {
        'CommunityMotions.sol': {
            content: contractsSources['CommunityMotions.sol']
        },
        'Motions.sol': {
            content: contractsSources['Motions.sol']
        }
    },
    settings: { 
        outputSelection: {
            '*': {
                '*': ['*'],
            },
        },
    },
});

const output = solc.compile({contractsSources},1);

fs.ensureDirSync(buildPath);

for(let contract in output){
    console.log(contract);
    fs.outputJsonSync(path.resolve(buildPath, contract.substring(contract.indexOf(':')+1) + '.json'), output[contract]);
}