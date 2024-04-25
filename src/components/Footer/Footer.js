import React from 'react';

import './Footer.css';
import LegalStatement from './LegalStatement/LegalStatement';
import ExternalNav from './ExternalNav/ExternalNav';

const footer = () => (
    <div className='Footer'>
        <LegalStatement />
        <ExternalNav />
    </div>
)

export default footer;