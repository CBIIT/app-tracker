import React from 'react';

import './Footer.css';
import LegalStatement from './LegalStatement/LegalStatement';
import ExternalNav from './ExternalNav/ExternalNav';
import HelpDesk from './HelpDesk/HelpDesk';

const footer = () => (
    <div className='Footer'>
        <HelpDesk />
        <LegalStatement />
        <ExternalNav />
    </div>
)

export default footer;