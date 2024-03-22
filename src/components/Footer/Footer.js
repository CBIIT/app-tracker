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
// This is a test to see if I can push
export default footer;