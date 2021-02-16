import React from 'react';

import './Logo.css';
import nciLogo from '../../../assets/images/nci-logo.png';

const logo = () => (
    <div className='Logo'>
        <img src={nciLogo} alt="NCI" />
    </div>
);

export default logo;