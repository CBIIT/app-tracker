import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, Tooltip, Select, Modal, Input, Button, message } from 'antd';
import { CommentOutlined } from '@ant-design/icons';

import axios from 'axios';
import { SUBMIT_COMMITTEE_DECISION } from '../../../../constants/ApiEndpoints';
import { MANAGE_APPLICATION } from '../../../../constants/Routes';

const { Option } = Select;
const { TextArea } = Input;
const committeeVoteChangeHandler = async (vote, sysId) => {
	console.log('[IndividualScoringTable] vote', vote ? vote : '');
	console.log('[IndividualScoringTable] sysId', sysId);
	try {
		const response = await axios.post(SUBMIT_COMMITTEE_DECISION, {
			app_sys_id: sysId,
			committee_decision: vote ? vote : '',
		});
		console.log('[IndividualScoringTable] response: ', response);
		message.success('Decision saved.');
	} catch (error) {
		console.log('[IndividualScoringTable] error: ', error);
		message.error(
			'Sorry, an error occurred while attempting to save.  Please try reloading the page and selecting again.'
		);
	}
};

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
					<CommentOutlined />
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
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [committeeComments, setCommitteeComments] = useState('');

	const onCommentButtonClick = () => {
		setIsModalVisible(true);
	};

	const getColumns = (isCommitteeVoting) => {
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
		];

		if (isCommitteeVoting)
			columns.push(
				{
					title: 'Committee Vote',
					dataIndex: 'committee_decision',
					render: (value, record) => (
						<>
							<Select
								style={{ width: 120 }}
								placeholder='--'
								value={value}
								allowClear
								onChange={(value) =>
									committeeVoteChangeHandler(value, record.sys_id)
								}
							>
								<Option value='selected'>Selected</Option>
								<Option value='rejected'>Rejected</Option>
							</Select>
						</>
					),
				},
				{
					title: 'Committee Comments',
					dataIndex: 'committee_comments',
					key: 'committee_comments',
					align: 'center',
					render: (comment) => (
						<Button type='text' shape='circle' onClick={onCommentButtonClick}>
							<CommentOutlined />
						</Button>
					),
				}
			);
		else
			columns.push(
				{ title: 'Scoring Status', dataIndex: 'scoring_status' },
				{
					title: 'Interview Recommendation',
					dataIndex: 'interview_recommendation',
					render: (value) =>
						value.Yes +
						' Yes • ' +
						value.No +
						' No • ' +
						value.Maybe +
						' Maybe',
				}
			);

		return columns;
	};

	const columns = getColumns(props.committeeVoting);

	return (
		<>
			<Table
				dataSource={props.applicants}
				scroll={{ x: 'true' }}
				columns={columns}
				rowKey='sys_id'
				expandable={{
					expandedRowRender: (record) => expandedRowRender(record.scores),
				}}
			/>
			<Modal
				title='Voting Comments'
				visible={isModalVisible}
				// onOk={handleOk}
				// onCancel={handleCancel}
			>
				<TextArea
					placeholder='add your comments here'
					rows={4}
					defaultValue={committeeComments}
				/>
			</Modal>
		</>
	);
};

export default individualScoringTable;
