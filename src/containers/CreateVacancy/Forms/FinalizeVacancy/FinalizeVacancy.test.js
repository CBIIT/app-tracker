import FinalizeVacancy from './FinalizeVacancy';
import { rtRender } from '../../../test-utils';
import React, { useState as usestateMock } from 'react';
import { initialValues } from '../../Forms/FormsInitialValues';
import useAuth from '../../../../hooks/useAuth';

jest.mock('../../../../hooks/useAuth');
const mockEditButtonClick = jest.fn();

window.matchMedia =
	window.matchMedia ||
	function () {
		return {
			matches: false,
			addListener: function () {},
			removeListener: function () {},
		};
	};


describe('FinalizeVacancy component tests' , () => {

    beforeEach(() => {
        document.getSelection = () => {
            return {
              removeAllRanges: () => {},
              addRange: () => {},
              getRangeAt: () => {},
            }
        }
        const data = {
                ...initialValues,
                basicInfo: {
                    ...initialValues.basicInfo,
                    appointmentPackageIndicator: 'user-uid',
                    vacancyPoc: 'user-uid',
                },
                currentTenant: 'current-Tenant',
        };

        useAuth.mockReturnValue({
			auth: { 
                isUserLoggedIn: true, 
                iTrustGlideSsoId: 'itrust123', 
                oktaGlideSsoId: 'okta123', 
                user: {
                    isManager: true,
                    isExecSec: false,
                    roles: [],
                    hasApplications: false,
                    uid: '123'
            } }
		});

    });


    afterEach(() => {
		jest.clearAllMocks();
	});

    test('<FinalizeVacancy /> crash test', async () => {    
   
        rtRender(<FinalizeVacancy
            allForms={jest.fn().mockImplementationOnce(() => data)}
            onEditButtonClick={mockEditButtonClick}
            errorSections={[]}
        />)
    })
});