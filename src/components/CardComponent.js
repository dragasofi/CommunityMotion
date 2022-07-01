import React, { useState } from 'react';
import { Card, Button } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import { useNavigate } from 'react-router-dom';
import MotionsContract from '../ethereum/motions'

function CardComponent(props)  {

    const navigate = useNavigate();
    

    const withdrawMoney = async () => {
        try {
            const accounts = await web3.eth.getAccounts();
            const motions = MotionsContract();
            await motions.methods.withdraw(100000000000, accounts[0]).send({from: accounts[0]});
        }
        catch(error) {
        }
    } 

    return (
        <Card.Group>
                {props.communityMotions.map( communityMotion => {
                    return (
                        <Card key={communityMotion.address}>
                            <Card.Content>
                                <Card.Header>{communityMotion.campaignTitle}</Card.Header>
                                <Card.Meta>Donated: {`${web3.utils.fromWei(communityMotion.totalDonated)} ETH`}</Card.Meta>
                                <Card.Description>
                                    {communityMotion.campaignDescription}<br/>
                                </Card.Description>
                            </Card.Content>
                            <Card.Content extra>
                                <div className='ui three buttons'>
                                    <Button onClick={() => navigate(`/motion/${communityMotion.address}`)} basic primary>
                                        Donate
                                    </Button>
                                    <Button onClick={() => navigate(`/motion/${communityMotion.address}`)} basic secondary>
                                        View
                                    </Button>
                                    <Button onClick={() => withdrawMoney()} basic secondary>
                                        Withdraw
                                    </Button>
                                </div>
                            </Card.Content>
                        </Card>
                    )
                })}
            </Card.Group>
    )
}

export default CardComponent;