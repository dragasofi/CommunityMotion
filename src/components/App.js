import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import Header from './Header';
import Motions from './Motions';
import CommunityMotion from './CommunityMotion';
import CreateMotion from './CreateMotion';


const App = () => {
    return (
        <Container>
            <BrowserRouter>
                <Header />
                <div>
                    <Routes>
                        <Route path="/" element={<Motions/>} />                  
                        <Route path="/motion/new" element={<CreateMotion/>} />
                        <Route path="/motion/:address" element={<CommunityMotion />} /> 
                    </Routes>
                </div>  
            </BrowserRouter>
        </Container>
    )
}

export default App;