import React from 'react';
import web3 from '../ethereum/web3';
import {Link} from 'react-router-dom';
import MotionsContract from '../ethereum/motions';
import CommunityMotionContract from '../ethereum/communityMotion';
import { Button } from 'semantic-ui-react';
import CardComponent from './CardComponent';

class Motions extends React.Component {

    state = {
        communityMotions:[]
    }

    async componentDidMount() {
        const motions = MotionsContract();
        const accounts = await web3.eth.getAccounts();
        const createdMotions = await motions.methods.getRequests().call({from:accounts[0]});
        let communityMotions = await Promise.all(
            Array(createdMotions.length).fill().map( async (element, i) => {
                const communityMotionInstance = CommunityMotionContract(createdMotions[i]);
                let communityMotion = {
                    address:createdMotions[i]
                }
                await Promise.all(
                    communityMotion["campaignCreator"] = await communityMotionInstance.methods.campaignCreator().call(),
                    communityMotion["campaignDescription"] = await communityMotionInstance.methods.campaignDescription().call(),
                    communityMotion["campaignTitle"] = await communityMotionInstance.methods.campaignTitle().call(),
                    communityMotion["limitAmount"] = await communityMotionInstance.methods.limitAmount().call(),
                    communityMotion["totalDonated"] = await communityMotionInstance.methods.totalDonated().call()
                )
                return communityMotion;
            })
        )

        this.setState({
            communityMotions: communityMotions
        });
    }

    goToMotion = (address) => {
        this.props.history.push(`/motion/${address}`)
    }

    renderMotions() {
        return (
            <CardComponent communityMotions={this.state.communityMotions}></CardComponent>
        )
    }

    render() {
        return (
            <div>
                <Link to="/motion/new">
                    <Button style={{marginTop:"10px"}} floated='right' content="Create Motion" icon="plus" labelPosition='left' primary/>
                </Link>
                {this.renderMotions()}
            </div>
        )
    }
}

export default Motions;