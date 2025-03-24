import ViewVacancyDetails from './ViewVacancyDetails';
import VIEW_VACANCY from '../../constants/Routes';
import { render, screen } from '@testing-library/react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill';
import { extractAndTransformMandatoryStatements } from '../../components/Util/Vacancy/Vacancy';
import { VACANCY_DETAILS_FOR_APPLICANTS } from '../../constants/ApiEndpoints';
import { mockVacancyDetails } from './ViewVacancyDetailsMockData';

jest.mock('axios');
jest.mock('react-router-dom', () => ({
	useParams: jest.fn(),
}));

window.matchMedia =
	window.matchMedia ||
	function () {
		return {
			matches: false,
			addListener: function () {},
			removeListener: function () {},
		};
	};

describe('ViewVacancyDetails', () => {
	let sysId;

	const renderer = require('@testing-library/react');

	beforeEach(() => {
		sysId = '123';
		useParams.mockReturnValue({ sysId: sysId });
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	test ('should render ViewVacancyDetails mandatory statements', async () => {
		// const detailPage = renderer.create(<Link to={VIEW_VACANCY}></Link>).toJSON();

		// expect(detailPage).toMatchSnapshot();

	});

    // const wrapper = () => {
    //     return(
    //         <MemoryRouter initialEntries={['/']}>
    //             <Routes>
    //                 <Route path={'/vacancy/'} element={<ViewVacancyDetails />} />
    //             </Routes>
    //         </MemoryRouter>
    //     );
    // }

	// test('should render ViewVacancyDetails', async () => {
	// 	axios.get.mockResolvedValue({ data: { result: mockVacancyDetails } });
	// 	const details = await axios.get(VACANCY_DETAILS_FOR_APPLICANTS + sysId);
	// 	render(
	// 		wrapper()
	// 	);
	// });
});
