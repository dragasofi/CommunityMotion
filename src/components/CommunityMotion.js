import React from 'react';
import { useParams } from 'react-router-dom';
import CommunityMotionContract from '../ethereum/communityMotion';
import web3 from '../ethereum/web3';
import { Button, Input, Message, Form } from 'semantic-ui-react';
import MotionsContract from '../ethereum/motions'

export function withRouter(Children){
    return(props)=>{
       const match  = {params: useParams()};
       return <Children {...props}  match = {match}/>
   }
 }

class CommunityMotion extends React.Component {

    state = {
        address:'',
        creator:'',
        title:'',
        description:'',
        limitAmount:'',
        totalDonated:'',
        donationAmount:'',
        loading:false,
        errorMessage:'',
        donors:[],       
    }

    async componentDidMount() {
        const {address} = this.props.match.params;   
        //console.log(address);
        const communityMotionInstance = CommunityMotionContract(address);
        const creator = await communityMotionInstance.methods.campaignCreator().call();
        const title = await communityMotionInstance.methods.campaignTitle().call();
        const description = await communityMotionInstance.methods.campaignDescription().call();
        const limitAmount = await communityMotionInstance.methods.limitAmount().call();
        const totalDonated = await communityMotionInstance.methods.totalDonated().call();
        const donors = await communityMotionInstance.methods.getAllDonors().call();
        console.log(donors);

        this.setState({
            address,
            creator,
            title,
            description,
            limitAmount, 
            totalDonated,
            donors
        });
        console.log(this.state);
    }

    donate = async(ev) => {
        ev.preventDefault();
        this.setState({
            loading:true,
            errorMessage:''
        })
        try {
            const accounts = await web3.eth.getAccounts();
            const communityMotionInstance = CommunityMotionContract(this.state.address);
            await communityMotionInstance.methods.donate().send({from: accounts[0], value:web3.utils.toWei(this.state.donationAmount, "ether")});
            const totalDonated = await communityMotionInstance.methods.totalDonated().send();
            this.setState({
                totalDonated
            });
        }
        catch(error) {
            
            this.setState({
                errorMessage:error.message
            })
            console.log(this.state.errorMessage);
        }
        this.setState({
            loading:false
        })
        
    }

    vote = async(creatorAddress, requestAddress) => {
        try {
            const accounts = await web3.eth.getAccounts();
            const motions = MotionsContract();
            await motions.methods.vote(creatorAddress, requestAddress, true).send({from: accounts[0]});
        }
        catch(error) {
            
            this.setState({
                errorMessage:error.message
            })
            console.log(this.state.errorMessage);
        }
    } 

    render() {
        return (
        <div>
            <a className='item' href={`https://rinkeby.etherscan.io/address/${this.state.address}`} target="_">
                <h3>{this.state.title}</h3>
            </a>
            <label>Description: {this.state.description}</label><br/>
            <label>Campaign creator: {this.state.creator}</label><br/>
            <label>Minimum donation amount: {this.state.limitAmount}</label><br/>
            <label>Total donated: {`${web3.utils.fromWei(this.state.totalDonated)} ETH`}</label><br/>
            <label>Donors: {this.state.donors.map((d) => <li>{d}
                                                            {<Button 
                                                                content='Approve'
                                                                onClick={() => this.vote(this.state.creator, this.state.address)}
                                                                >
                                                            </Button>}
                                                        </li>)}
            </label><br/>          
            <Form onSubmit={this.donate} error={!!this.state.error}>
                <Input 
                    label="Donation Amount" 
                    value={this.state.donationAmount} 
                    onChange={ event => this.setState({donationAmount:event.target.value})}
                /><br/>
                <Message error header='Error' content={this.state.errorMessage} />   
                <Button 
                    loading={this.state.loading}
                    style={{marginTop: "10px"}} 
                    floated="left" 
                    content='Donate' 
                    icon='dollar' 
                    labelPosition='left' 
                    primary
                /> 
            </Form>
        </div>
        )
    }
}

export default withRouter(CommunityMotion);