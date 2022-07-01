import React, { useState } from 'react';
import { Form, Input, TextArea, Label, Button } from 'semantic-ui-react';
import MotionsContract from '../ethereum/motions'
import web3 from '../ethereum/web3';
import { useNavigate } from 'react-router-dom';

function CreateMotion(props) {
    
    const [title,setTitle] = useState("");
    const [description,setDescription] = useState("");
    const [limitAmount, setLimitAmount] = useState();
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const onSubmit = async (ev) => {
        ev.preventDefault();
        setLoading(true);
        await window.ethereum.enable();
        const accounts = await web3.eth.getAccounts();
        const motions = MotionsContract();
        //const {title, description, limitAmount} = this.state;
        await motions.methods.createRequests(title, description, limitAmount).send({from:accounts[0]});
        const motionAddresses = await motions.methods.getRequests().call({from:accounts[0]});
        const lastMotion = motionAddresses[motionAddresses.length-1];
        setLoading(false);
        navigate(`/motion/${lastMotion}`);
        //this.props.history.push(`/motion/${lastMotion}`);
        //history.push(`/motion/${lastMotion}`);
        //<Link to={`/motion/${lastMotion}`}></Link>
        //<Redirect to="/motion/1" /> 
    }

    //render() {
        return (
            <Form onSubmit={onSubmit}>
            <Input 
                fluid
                label="Title" 
                value={title}
                onChange={event => setTitle(event.target.value)}
                /><br/>
            <Label size={'large'}>Description</Label>
            <TextArea 
                rows={3}
                value={description}
                onChange={event => setDescription(event.target.value)}
                /><br/><br/>
            <Input 
                fluid 
                label="Limit"
                value={limitAmount}
                onChange={event => setLimitAmount(event.target.value)} 
                /><br/>
            <Button loading={loading} primary type='submit'>Create</Button>
        </Form>
        )
    //}
}

export default CreateMotion;