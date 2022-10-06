import { Table, Tooltip } from 'antd';
import { Link, useHistory } from 'react-router-dom';
import { CheckCircleTwoTone } from '@ant-design/icons';

import { MANAGE_APPLICATION } from '../../../constants/Routes';

import './ApplicantList.css';

const renderDecision = (text) =>
	text == 'Pending' ? (
		<span style={{ color: 'rgba(0,0,0,0.25)', textTransform: 'capitalize' }}>
			{text}
		</span>
	) : (
		<span style={{ textTransform: 'capitalize' }}>{text}</span>
	);

const applicantList = (props) => {
	const history = useHistory();

	const applicants = props.applicants;
	applicants.map((applicant, index) => {
		applicant.key = index;
	});

	const applicantColumns = [
		{
			key: 'average_score',
			render: (record) => {
				return record.average_score != undefined ? (
					<Tooltip title='Scoring Completed'>
						<CheckCircleTwoTone twoToneColor='#60E241'></CheckCircleTwoTone>
					</Tooltip>
				) : null;
			},
		},
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
			sorter: true,
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
				pagination={props.pagination}
				className='applicantTable'
				dataSource={applicants}
				columns={applicantColumns}
				scroll={{ x: 'true' }}
				key='applicants'
				onRow={(record) => ({
					onClick: () => {
						history.push(MANAGE_APPLICATION + record.sys_id);
					},
				})}
				onChange={(pagination, _, sorter) => {
					props.onTableChange(
						pagination.current,
						pagination.pageSize,
						sorter.order
					);
				}}
			></Table>
		</div>
	);
};

export default applicantList;
