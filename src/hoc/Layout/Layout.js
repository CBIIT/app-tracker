import React from 'react';
import { useLocation } from 'react-router-dom';

import './Layout.css';
import { routeTitles } from './RouteTitles';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

const layout = (props) => {
    const location = useLocation();
    
    return (
        <>
            <Header />
            <div className='OuterContainer'>
                <div className='ContentContainer'>
                    <div className='HeaderTitle'><h1>{routeTitles[location.pathname]}</h1></div>
                    <div className='RouteContent'>
                        {props.children}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default layout;