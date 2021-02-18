import React from 'react';

import NavigationItem from './NavigationItem/NavigationItem';
import './NavigationItems.css';

const navigationItems = () => (
    <div className='NavigationContainer'>
        <nav>
            <ul className='NavigationItems'>
                <NavigationItem link='/'>Executive Careers</NavigationItem>
                <NavigationItem link='/create-vacancy'>The NCI Hiring Experience</NavigationItem>
            </ul>
        </nav>
    </div>
);

export default navigationItems;