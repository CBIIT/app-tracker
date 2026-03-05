import VacancyCommittee from './VacancyCommittee';
import { render, screen } from '@testing-library/react';

const mockEditableTable = jest.fn(() => <div data-testid='editable-table' />);

jest.mock('./EditableTable/EditableTable', () => (props) =>
	mockEditableTable(props)
);

describe('VacancyCommittee', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	test('renders EditableTable and forwards expected props', () => {
		const committeeMembers = [{ name: 'Jane Doe', role: 'Chair' }];
		const setCommitteeMembers = jest.fn();
		const getCommitteeMembers = jest.fn();
		const formInstance = { getFieldValue: jest.fn() };

		render(
			<VacancyCommittee
				committeeMembers={committeeMembers}
				setCommitteeMembers={setCommitteeMembers}
				getCommitteeMembers={getCommitteeMembers}
				formInstance={formInstance}
			/>
		);

		expect(screen.getByTestId('editable-table')).toBeInTheDocument();
		expect(mockEditableTable).toHaveBeenCalledTimes(1);
		expect(mockEditableTable).toHaveBeenCalledWith(
			expect.objectContaining({
				name: 'VacancyCommittee',
				data: committeeMembers,
				setData: setCommitteeMembers,
				getData: getCommitteeMembers,
				formInstance,
			})
		);
	});
});
