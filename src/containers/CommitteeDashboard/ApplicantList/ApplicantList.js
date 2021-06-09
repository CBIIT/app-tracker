import { Table } from 'antd';
import { Link } from 'react-router-dom';

import { MANAGE_APPLICATION } from '../../../constants/Routes';

const renderDecision = (text) =>
	text == 'Pending' ? (
		<span style={{ color: 'rgba(0,0,0,0.25)', textTransform: 'capitalize' }}>
			{text}
		</span>
	) : (
		<span style={{ textTransform: 'capitalize' }}>{text}</span>
	);

const applicantList = (props) => {
	const applicants = props.applicants;
	applicants.map((applicant, index) => {
		applicant.key = index;
	});

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
			title: 'Raw Score',
			dataIndex: 'raw_score',
			key: 'rawscore',
			render: (text) => {
				return <span>{text.split(' ')[0]}</span>;
			},
		},

		{
			title: 'Average Score',
			dataIndex: 'average_score',
			key: 'averagescore',
			render: (text) => renderDecision(text),
		},
		{
			title: 'Recommend Interview?',
			dataIndex: 'recommend',
			key: 'recommend',
			render: (text) => renderDecision(text),
		},
	];

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
