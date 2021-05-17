import { Link } from 'react-router-dom';
import { Table, Tooltip } from 'antd';
import { MessageOutlined } from '@ant-design/icons';

import { MANAGE_APPLICATION } from '../../../../constants/Routes';

const columns = [
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
	},
	{
		title: 'Email',
		dataIndex: 'applicant_email',
		key: 'email',
	},
	{
		title: 'Average Member Score',
		dataIndex: 'average_member_score',
		sorter: (a, b) => a.average_member_score - b.average_member_score,
		defaultSortOrder: 'descend',
	},
	{ title: 'Scoring Status', dataIndex: 'scoring_status' },
	{
		title: 'Interview Recommendation',
		dataIndex: 'interview_recommendation',
		render: (value) =>
			value.Yes + ' Yes • ' + value.No + ' No • ' + value.Maybe + ' Maybe',
	},
];

const expandedRowRender = (scores) => {
	const columns = [
		{ title: 'Committee Member', dataIndex: 'name', key: 'name' },
		{ title: 'Raw Score', dataIndex: 'raw_score', key: 'raw_score' },
		{
			title: 'Avg Score',
			dataIndex: 'average_score',
			key: 'average_score',
		},
		{
			title: 'Knowledge / Experience',
			dataIndex: 'knowledge_experience',
			key: 'knowledge_experience',
		},
		{
			title: 'Leadership',
			dataIndex: 'development_implementation_coordination',
			key: 'development_implementation_coordination',
		},
		{
			title: 'Management',
			dataIndex: 'management_leadership_supervision',
			key: 'management_leadership_supervision',
		},
		{
			title: 'Comms Skills',
			dataIndex: 'communication_skill',
			key: 'communication_skill',
		},
		{
			title: 'Recommend?',
			dataIndex: 'recommend',
			key: 'recommend',
		},
		{
			title: 'Comments',
			dataIndex: 'comments',
			key: 'comments',
			render: (comment) => (
				<Tooltip title={comment} trigger='click'>
					<MessageOutlined />
				</Tooltip>
			),
		},
	];

	return (
		<Table
			rowKey='sys_id'
			columns={columns}
			dataSource={scores}
			pagination={false}
		/>
	);
};

const individualScoringTable = (props) => {
	return (
		<>
			<Table
				dataSource={props.applicants}
				columns={columns}
				rowKey='sys_id'
				expandable={{
					expandedRowRender: (record) => expandedRowRender(record.scores),
				}}
			/>
		</>
	);
};

export default individualScoringTable;
