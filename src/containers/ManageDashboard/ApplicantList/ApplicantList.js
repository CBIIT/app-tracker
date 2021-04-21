import { Table } from 'antd';
import './ApplicantList.css';

const applicantList = (props) => {
	const applicants = props.applicants;
	applicants.map((applicant, index) => {
		applicant.key = index;
	});

	return (
		<>
			<div className='applicant-table'>
				<Table
					dataSource={applicants}
					columns={applicantColumns}
					key='applicants'
				></Table>
			</div>
		</>
	);
};
const applicantColumns = [
	{
		title: 'Applicant',
		dataIndex: 'applicant_last_name',
		key: 'name',
		render: (text, record) => {
			return (
				<a>
					{text}, {record.applicant_first_name}
				</a>
			);
		},
		sorter: {
			compare: (a, b) =>
				a.applicant_last_name.localeCompare(b.applicant_last_name),
			multiple: 1,
		},
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
		render: (text) => {
			if (text == 'Pending') {
				return <span style={{ color: 'rgba(0,0,0,0.25)' }}>{text}</span>;
			}
		},
	},

	{
		title: 'Chair Triage Decision',
		dataIndex: 'chair_triage_status',
		key: 'ChairStatus',
		render: (text) => {
			if (text == 'Pending') {
				return <span style={{ color: 'rgba(0,0,0,0.25)' }}>{text}</span>;
			}
		},
	},
];

export default applicantList;
