import React from 'react';

import './ExternalNav.css';

const externalNav = () => (
    <div className='ExternalNav'>
        <div className='ExternalNavContent'>
            <nav>
                <ul>
                    <li><a href='https://ccr.cancer.gov/'>Home</a></li>
                    <li><a href='mailto:CCRCareersAdmin@mail.nih.gov'>Support</a></li>
                    <li><a href='https://www.cancer.gov/global/web/policies'>Policies</a></li>
                    <li><a href='https://www.cancer.gov/global/web/policies/accessibility'>Accessibility</a></li>
                    <li><a href='https://cancer.gov/global/viewing-files'>Viewing Files</a></li>
                    <li><a href='https://www.cancer.gov/global/web/policies/foia'>FOIA</a></li>
                </ul>
                <ul>
                    <li><a href='https://www.hhs.gov/'>U.S Department of Health and Human Services</a></li>
                    <li><a href='https://www.nih.gov/'>National Institutes of Health</a></li>
                    <li><a href='https://www.cancer.gov/'>National Cancer Institute</a></li>
                    <li><a href='https://usa.gov/'>USA.gov</a></li>
                </ul>
            </nav>
        </div>
        <div className='ExternalNavTrademark'>NIH ... Turning Discovery Into Health ®</div>
    </div>
);

export default externalNav;


// Home | Support | Policies | Accessibility | Viewing Files | FOIA
// U.S. Department of Health and Human Services | National Institutes of Health | National Cancer Institute | USA.gov
// NIH ... Turning Discovery Into Health ®