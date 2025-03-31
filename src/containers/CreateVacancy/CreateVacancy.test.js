
// import { useRef } from 'react';
import CreateVacancy from './CreateVacancy';
import { rtRender } from '../test-utils';
import { screen } from '@testing-library/react';
import { initialValues } from './Forms/FormsInitialValues';
import axios from 'axios';
import useAuth from '../../hooks/useAuth';

// jest.mock('react', () => {
//     const originReact = jest.requireActual('react');
//     const mUseRef = jest.fn();
//     return {
//       ...originReact,
//       useRef: mUseRef,
//     };
// });


jest.mock('../../hooks/useAuth', () => jest.fn().mockImplementation(() => {
    return {
        auth: {
            iTrustGlideSsoId: 'mockId',
            iTrustUrl: 'mockUrl',
            isUserLoggedIn: true,
            user: { name: 'Mock User' },
            oktaLoginAndRedirectUrl: 'mockRedirectUrl',
        },
    };
}));

// jest.mock('../../hooks/useAuth', () => ({
//     __esModule: true,
//     default: jest.fn(),
// }));

jest.mock('axios');
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: jest.fn().mockImplementation(() => {
        return {
            pathname: '/create-vacancy'
        }
    })
}));


// Mock react-quill
jest.mock('react-quill', () => ({
    ...jest.requireActual('react-quill'),
    onChange: jest.fn(),
}));

const mockFinalizeVacancy = jest.fn();
jest.mock('./Forms/FinalizeVacancy/FinalizeVacancy', () => (props) => {
    mockFinalizeVacancy(props);
    return <mock-FinalizeVacancy />
});

const mockMandatoryStatements = jest.fn();
jest.mock('./Forms/MandatoryStatements/MandatoryStatements', () => (props) => {
    mockMandatoryStatements(props);
    return <mock-MandatoryStatements />
});

const mockVacancyCommittee = jest.fn();
jest.mock('./Forms/VacancyCommittee/VacancyCommittee', () => (props) => {
    mockVacancyCommittee(props);
    return <mock-VacancyCommittee />
});

const mockEmailTemplates = jest.fn();
jest.mock('./Forms/EmailTemplates/EmailTemplates', () => (props) => {
    mockEmailTemplates(props);
    return <mock-EmailTemplates />
});


const mockBasicInfo = jest.fn();
jest.mock('./Forms/BasicInfo/BasicInfo', () => (props) => {
    mockBasicInfo(props);
    return <mock-BasicInfo />
});

// Mock window.matchMedia
window.matchMedia = window.matchMedia || function () {
    return {
        matches: false,
        addListener: function () { },
        removeListener: function () { }
    };
};

describe('CreateVacancy component tests' , () => {
    let mockUseAuthTenant1;
    let t1 = 'tenant 1';
    //let t2 = 'tenant 2';
    
    beforeEach(() => {
        // const mRef = { current: ''} ;
        // useRef.mockReturnValueOnce(mRef);

        mockUseAuthTenant1 = {
            auth: {
                iTrustGlideSsoId: 'testSsoId',
                iTrustUrl: 'https://test.itrust.com',
                isUserLoggedIn: false,
                user: { firstName: 'John', lastInitial: 'D' },
                oktaLoginAndRedirectUrl: 'https://test.okta.com',
                currentTenant: t1,
            },
        };
        useAuth.mockReturnValue(mockUseAuthTenant1);

        const pa = {'data': {'result': {
            'package_initiators': [
                {
                    name: "John Smith",
                    sys_id: "some sysid",
                    email: "john.smith@test.co"
                },]
        }}};
        axios.get.mockClear();
        axios.get.mockImplementation(() => Promise.resolve({data: pa }))

        document.getSelection = () => {
            return {
              removeAllRanges: () => {},
              addRange: () => {},
              getRangeAt: () => {},
            }
        }
    });

    afterEach(() => {
		jest.clearAllMocks();
	});


    test('<CreateVacancy /> crash test', async () => {    
        const data = {}
        const sysId = ''     
        rtRender(<CreateVacancy initialValues={data} draftSysId={sysId} />)
    });

    test('<CreateVacancy /> test with initial values', async () => {    
        const data = {
            ...initialValues,
            description: 'Test vacancy'
        }
        const sysId = '123'     
        await rtRender(<CreateVacancy initialValues={data} draftSysId={sysId} />);
        expect(screen.getByTestId('create-vacancy-container')).toBeInTheDocument();
    });

    // test('<CreateVacancy /> test with initial values', async () => {   

    //     const data = {}
    //     const sysId = ''      
    //     await rtRender(<CreateVacancy initialValues={data} draftSysId={sysId} />);
    //     expect(screen.getByTestId('create-vacancy-container')).toBeInTheDocument();

    //     const mRef = { current: t1 };
    //     let mockUseAuthTenant2 = {
    //         auth: {
    //             iTrustGlideSsoId: 'testSsoId',
    //             iTrustUrl: 'https://test.itrust.com',
    //             isUserLoggedIn: false,
    //             user: { firstName: 'John', lastInitial: 'D' },
    //             oktaLoginAndRedirectUrl: 'https://test.okta.com',
    //             previousTenant: mRef,
    //             currentTenant: t2,
    //         },
    //     };
    //     useAuth.mockReturnValue(mockUseAuthTenant2);

    // });


});