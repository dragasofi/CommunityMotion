const assert = require('assert');
const ganche = require('ganache-cli'); // Testing network
const Web3 = require('web3'); 
// Web3 constructor requires provider for network
const web3 = new Web3(ganche.provider());

// Contracts
const Motions = require('../build/contracts/Motions.json');
const CommunityMotions = require('../build/contracts/CommunityMotions.json');

let accounts;
let motionsAbi;
let motionsAddresses;

// Prepare stuff for other tests
beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    motionsAbi = await new web3.eth.Contract(Motions.abi).deploy({ data: Motions.bytecode }).send({from: accounts[0], gas: 3000000});

    await motionsAbi.methods.createRequests(
        "Community Motion",
        "Fundraising for hospital equipment",
        web3.utils.toWei("0.1", 'ether')
    ).send({from: accounts[0], gas: 3000000});

    motionsAddresses = await motionsAbi.methods.getRequests().call({from: accounts[0]});
});


// Collection of it tests
describe('Motions testing', () => {
    it('get all accounts on network', () => {
        assert.ok(accounts.length > 0);
    });

    it('deploys contract on network', () => {
        assert.ok(motionsAbi.options.address);
    });

    it('creates a CommunityMotion', async () => {
        await motionsAbi.methods.createRequests(
            "Community Motion",
            "Fundraising for hospital equipment",
            web3.utils.toWei("0.1", 'ether')
        ).send({from: accounts[0], gas: 3000000});

        const motions = await motionsAbi.methods.getRequests().call({from: accounts[0]});

        assert.equal(motions.length, 2);
        assert.ok(motions[1]);
    });

    it('returns all motions', async () => {
        assert.equal(motionsAddresses.length, 1);
    });

    it('a donor cant vote for creator if he didnt donate', async() => {
        const canVote = await motionsAbi.methods.canVote(accounts[0], motionsAddresses[0]).call({from: accounts[1]});

        assert.ok(!canVote);
    });

    it('returns votes for a creator', async() => {
        const creator = await motionsAbi.methods.votes(accounts[0]).call({from: accounts[0]});

        assert.ok(!creator.active);
        assert.equal(creator.numberOfTimesVoted, 0);
        assert.equal(creator.numberOfTimesApproved, 0);
    });

    it('a donor can vote for creator if he donated', async() => {
        const communityMotion = new web3.eth.Contract(CommunityMotions.abi, motionsAddresses[0]);
        await communityMotion.methods.donate().send({from: accounts[1], gas: 3000000, value: web3.utils.toWei("0.1", 'ether')});

        const canVote = await motionsAbi.methods.canVote(accounts[0], motionsAddresses[0]).call({from: accounts[1]});
        assert.ok(canVote);
    });

    it('total donations for requests', async() => {
        const communityMotion = new web3.eth.Contract(CommunityMotions.abi, motionsAddresses[0]);

        await communityMotion.methods.donate().send({from: accounts[2], gas: 3000000, value: web3.utils.toWei("0.1", 'ether')});
        await communityMotion.methods.donate().send({from: accounts[1], gas: 3000000, value: web3.utils.toWei("0.2", 'ether')});

        const totalDonations = await motionsAbi.methods.getTotalDonationsForRequests().call({from: accounts[0]});

        assert.equal(totalDonations, 300000000000000000);
    });

    // Fails 
    it('vote for withdrawing money for a request', async() => {
        const communityMotion = new web3.eth.Contract(CommunityMotions.abi, motionsAddresses[0]);
        await communityMotion.methods.donate().send({from: accounts[1], gas: 3000000, value: web3.utils.toWei("0.1", 'ether')});

        await motionsAbi.methods.vote(accounts[0], motionsAddresses[0], false).send({from: accounts[1], gas: 3000000});
        
        const hasVoted = await motionsAbi.methods.hasVoted(accounts[0], motionsAddresses[0], accounts[1]).call({from: accounts[0]});
        const creator = await motionsAbi.methods.votes(accounts[0]).call({from: accounts[0]});

        assert.ok(hasVoted);
        //assert.equal(creator.numberOfTimesVoted, 1);
        //assert.equal(creator.numberOfTimesApproved, 0);
    });
});



describe('CommunityMotions testing', () => {
    it('are all properties properly set', async() => {
        const communityMotion = new web3.eth.Contract(CommunityMotions.abi, motionsAddresses[0]);

        const campaignTitle = await communityMotion.methods.campaignTitle().call({from: accounts[0]});
        const campaignDescription = await communityMotion.methods.campaignDescription().call({from: accounts[0]});
        const limitAmount = await communityMotion.methods.limitAmount().call({from: accounts[0]});
        const campaignCreator = await communityMotion.methods.campaignCreator().call({from: accounts[0]});

        assert.equal(campaignTitle, "Community Motion");
        assert.equal(campaignDescription, "Fundraising for hospital equipment")
        assert.equal(web3.utils.fromWei(limitAmount, 'ether'), 0.1);
        assert.equal(accounts[0], campaignCreator);
    });

    it('test a donation', async() => {
        const communityMotion = new web3.eth.Contract(CommunityMotions.abi, motionsAddresses[0]);

        await communityMotion.methods.donate().send({from: accounts[2], gas: 3000000, value: web3.utils.toWei("0.1", 'ether')});

        const donation = await communityMotion.methods.donations(accounts[2]).call({from: accounts[0]});

        assert.equal(donation, 100000000000000000);
    });

    it('test total donated', async() => {
        const communityMotion = new web3.eth.Contract(CommunityMotions.abi, motionsAddresses[0]);

        await communityMotion.methods.donate().send({from: accounts[2], gas: 3000000, value: web3.utils.toWei("0.1", 'ether')});
        await communityMotion.methods.donate().send({from: accounts[2], gas: 3000000, value: web3.utils.toWei("0.12", 'ether')});

        const donation = await communityMotion.methods.donations(accounts[2]).call({from: accounts[0]});

        assert.equal(donation, 220000000000000000);
    });
});
