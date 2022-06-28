import React from 'react';
import {Link} from 'react-router-dom';
import {Menu, Divider} from 'semantic-ui-react';

const Header = () => (
    <React.Fragment>
        <Menu secondary>
            <Link to="/" className='item'>
                Motions
            </Link>
            <Link to="/motion/new" className='item'>
                Create Motion
            </Link>
        </Menu>
        <Divider />
    </React.Fragment>
);

export default Header;