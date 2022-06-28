import React from 'react';
import { useParams } from 'react-router-dom';

export function withRouter(Children){
    return(props)=>{
       const match  = {params: useParams()};
       return <Children {...props}  match = {match}/>
   }
 }


class CommunityMotion extends React.Component {

    componentDidMount() {
        const {address} = this.props.match.params;   
        console.log(address);
    }

    render() {
        return <div>CommunityMotion</div>
    }
}

export default withRouter(CommunityMotion);