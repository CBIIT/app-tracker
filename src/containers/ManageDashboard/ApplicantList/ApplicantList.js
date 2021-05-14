import { Table } from 'antd';
import { Link } from 'react-router-dom';

import { MANAGE_APPLICATION } from '../../../constants/Routes';
import { INDIVIDUAL_SCORING_IN_PROGRESS } from '../../../constants/VacancyStates';
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

const getApplicantColumns = (vacancyState) => {
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
	];

	if (vacancyState === INDIVIDUAL_SCORING_IN_PROGRESS)
		applicantColumns.push(
			{ title: 'Average Member Score' },
			{ title: 'Interview Recommendation' }
		);
};

const applicantList = (props) => {
	const applicants = props.applicants;
	applicants.map((applicant, index) => {
		applicant.key = index;
	});

	return (
		<div className='applicant-table'>
			<Table
				dataSource={applicants}
				columns={applicantColumns}
				key='applicants'
			></Table>
		</div>
	);
};

export default applicantList;
