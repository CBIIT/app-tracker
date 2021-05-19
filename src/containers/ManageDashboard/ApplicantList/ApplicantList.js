import { Table } from 'antd';
import { Link } from 'react-router-dom';

import IndividualScoringTable from './IndividualScoringTable/IndividualScoringTable';
import { MANAGE_APPLICATION } from '../../../constants/Routes';
import { INDIVIDUAL_SCORING_IN_PROGRESS } from '../../../constants/VacancyStates';
import { OWM_TEAM, COMMITTEE_CHAIR } from '../../../constants/Roles';
import './ApplicantList.css';

const renderDecision = (text) =>
	text == 'Pending' ? (
		<span style={{ color: 'rgba(0,0,0,0.25)', textTransform: 'capitalize' }}>
			{text}
		</span>
	) : (
		<span style={{ textTransform: 'capitalize' }}>{text}</span>
	);

const applicantColumns = [
	{
		title: 'Applicant',
		dataIndex: 'applicant_last_name',
		key: 'name',
		render: (text, record) => {
			return (
				<Link to={MANAGE_APPLICATION + record.sys_id}>
					{text}, {record.applicant_first_name}
				</Link>
			);
		},
		sorter: {
			compare: (a, b) =>
				a.applicant_last_name.localeCompare(b.applicant_last_name),
			multiple: 1,
		},
		width: 400,
		defaultSortOrder: 'ascend',
	},
	{
		title: 'Email',
		dataIndex: 'applicant_email',
		key: 'email',
	},
	{
		title: 'Submitted',
		dataIndex: 'submitted',
		key: 'submitted',
		render: (text) => {
			return <span>{text.split(' ')[0]}</span>;
		},
	},
	{
		title: 'OWM Triage Decision',
		dataIndex: 'owm_triage_status',
		key: 'OWMStatus',
		render: (text) => renderDecision(text),
	},

	{
		title: 'Chair Triage Decision',
		dataIndex: 'chair_triage_status',
		key: 'ChairStatus',
		render: (text) => renderDecision(text),
	},
];

const getTable = (vacancyState, applicants, userRoles, userCommitteeRole) => {
	if (userRoles.includes(OWM_TEAM) || userCommitteeRole === COMMITTEE_CHAIR) {
		switch (vacancyState) {
			case INDIVIDUAL_SCORING_IN_PROGRESS:
				return <IndividualScoringTable applicants={applicants} />;
			default:
				return (
					<Table
						dataSource={applicants}
						columns={applicantColumns}
						rowKey='sys_id'
					></Table>
				);
		}
	} else {
		return (
			<Table
				dataSource={applicants}
				columns={applicantColumns}
				rowKey='sys_id'
			></Table>
		);
	}
};

const applicantList = (props) => {
	const table = getTable(
		props.vacancyState,
		props.applicants,
		props.userRoles,
		props.userCommitteeRole
	);

	return <div className='applicant-table'>{table}</div>;
};

export default applicantList;
