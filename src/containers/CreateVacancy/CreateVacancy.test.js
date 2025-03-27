
import CreateVacancy from './CreateVacancy';
import { rtRender } from '../test-utils';
import axios from 'axios';


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

    beforeEach(() => {
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


    test('<CreateVacancy /> crash test', async () => {    
        const data = {}
        const sysId = ''     
        rtRender(<CreateVacancy initialValues={data} draftSysId={sysId} />)

    });
});