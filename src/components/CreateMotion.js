import React from 'react';
import { Form, Input, TextArea, Label, Button } from 'semantic-ui-react';
import MotionsContract from '../ethereum/motions'
import web3 from '../ethereum/web3';
import { useParams } from 'react-router-dom';

export function withRouter(Children){
    return(props)=>{
       const history  = {params: useParams()};
       return <Children {...props}  history = {history}/>
   }
 }

class CreateMotion extends React.Component {
    state = {
        title:'',
        description:'',
        limitAmount:''
    }

    componentDidMount() {
        const nesto = this.props.history.params;
        console.log(nesto);
    }

    onSubmit = async (ev) => {
        ev.preventDefault();
        await window.ethereum.enable();
        const accounts = await web3.eth.getAccounts();
        const motions = MotionsContract();
        const {title, description, limitAmount} = this.state;
        await motions.methods.createRequests(title, description, limitAmount).send({from:accounts[0]});
        const motionAddresses = await motions.methods.getRequests().call({from:accounts[0]});
        const lastMotion = motionAddresses[motionAddresses.length-1];
        this.props.history.push(`/motion/${lastMotion}`);
        //history.push(`/motion/${lastMotion}`);
        //<Link to={`/motion/${lastMotion}`}></Link>
        //<Redirect to="/motion/1" /> 
    }

    render() {
        return (
            <Form onSubmit={this.onSubmit}>
            <Input 
                fluid
                label="Title" 
                value={this.state.title}
                onChange={event => this.setState({title:event.target.value})}
                /><br/>
            <Label size={'large'}>Description</Label>
            <TextArea 
                rows={3}
                value={this.state.description}
                onChange={event => this.setState({description:event.target.value})}
                /><br/><br/>
            <Input 
                fluid 
                label="Limit"
                value={this.state.limitAmount}
                onChange={event => this.setState({limitAmount:event.target.value})} 
                /><br/>
            <Button primary type='submit'>Create</Button>
        </Form>
        )
    }
}

export default withRouter(CreateMotion);