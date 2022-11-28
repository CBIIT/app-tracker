import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, Select, Modal, Input, Button, message } from 'antd';
import { CommentOutlined } from '@ant-design/icons';
import axios from 'axios';

import InnerScoresTable from './InnerScoresTable/InnerScoresTable';
import {
	INTERVIEW,
	SELECTED,
	REFERRED_TO_SELECTING_OFFICIAL,
	SUBMIT_COMMITTEE_COMMENTS,
} from '../../../../constants/ApiEndpoints';
import {
	COMMITTEE_REVIEW_IN_PROGRESS,
	VOTING_COMPLETE,
} from '../../../../constants/VacancyStates';
import { MANAGE_APPLICATION } from '../../../../constants/Routes';

const { Option } = Select;
const { TextArea } = Input;

const columnApiMap = {
	referredToInterview: INTERVIEW,
	referredToSelectingOfficial: REFERRED_TO_SELECTING_OFFICIAL,
	selected: SELECTED,
};

const columnChangeHandler = async (column, value, sysId, postChangeHandler) => {
	try {
		const key = column;
		const data = { appSysId: sysId };
		data[key] = value ? value : '';

		await axios.put(columnApiMap[column], data);
		postChangeHandler();
		message.success('Decision saved.');
	} catch (error) {
		message.error(
			'Sorry, an error occurred while attempting to save.  Please try reloading the page and selecting again.'
		);
	}
};

const expandedRowRender = (applicationSysId) => (
	<InnerScoresTable applicationSysId={applicationSysId} />
);

const individualScoringTable = (props) => {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [committeeComments, setCommitteeComments] = useState('');
	const [applicantSysId, setAppicantSysId] = useState();
	const [isOtherCommentsModalVisible, setIsOtherCommentsModalVisible] =
		useState(false);
	const [triageComments, setTriageComments] = useState('');
	const [chairComments, setChairComments] = useState('');
	const [committeeMembersComments, setCommitteeMembersComments] = useState([]);

	const onCommentButtonClick = (comment, sysId) => {
		setIsModalVisible(true);
		setCommitteeComments(comment);
		setAppicantSysId(sysId);
	};

	const handleCancel = () => {
		setCommitteeComments('');
		setIsModalVisible(false);
	};

	const onTextAreaChangeHandler = (event) => {
		setCommitteeComments(event.target.value);
	};

	const handleCommentSave = async (comment, sysId) => {
		try {
			await axios.post(SUBMIT_COMMITTEE_COMMENTS, {
				app_sys_id: sysId,
				committee_comments: comment,
			});
			setIsModalVisible(false);
			props.postChangeHandler();
			message.success('Comments saved!');
		} catch (error) {
			message.error(
				'Sorry!  An issue occurred while trying to save.  Please reload and try again.'
			);
		}
	};

	const onOtherCommentsButtonClick = (
		triageComments,
		chairComments,
		committeeMembersComments
	) => {
		setTriageComments(triageComments);
		setChairComments(chairComments);
		setCommitteeMembersComments(committeeMembersComments);
		setIsOtherCommentsModalVisible(true);
	};

	const getColumns = () => {
		const columns = [
			{
				title: 'Applicant',
				dataIndex: 'applicant_last_name',
				key: 'name',
				sorter: true,
				render: (text, record) => {
					return (
						<Link to={MANAGE_APPLICATION + record.sys_id}>
							{text}, {record.applicant_first_name}
						</Link>
					);
				},
				defaultSortOrder: 'ascend',
				width: 200,
			},
			{
				title: 'Email',
				dataIndex: 'applicant_email',
				key: 'email',
				width: 200,
			},
			{
				title: 'Average Score',
				dataIndex: 'average_member_score',
				width: 50,
				render: (text) => {
					if (text == 'NaN') {
						return (
							<span style={{ color: 'rgba(0,0,0,0.25)' }}>
								{(text = 'Pending')}
							</span>
						);
					} else {
						return text;
					}
				},
			},
		];

		if (
			props.vacancyState === VOTING_COMPLETE ||
			props.vacancyState === COMMITTEE_REVIEW_IN_PROGRESS
		) {
			columns.push({
				title: 'Referred to Interview',
				dataIndex: 'referred_to_interview',
				render: (value, record) => (
					<>
						<Select
							style={{ width: 100 }}
							placeholder='--'
							value={value}
							allowClear
							onChange={(value) =>
								columnChangeHandler(
									'referredToInterview',
									value,
									record.sys_id,
									props.postChangeHandler
								)
							}
						>
							<Option value='yes'>Yes</Option>
							<Option value='no'>No</Option>
						</Select>
					</>
				),
			});

			if (props.vacancyState === VOTING_COMPLETE) {
				columns.push({
					title: 'Referred to Selecting Official',
					dataIndex: 'referred_to_selecting_official',
					render: (value, record) => (
						<>
							<Select
								style={{ width: 100 }}
								placeholder='--'
								value={value}
								allowClear
								onChange={(value) =>
									columnChangeHandler(
										'referredToSelectingOfficial',
										value,
										record.sys_id,
										props.postChangeHandler
									)
								}
							>
								<Option value='yes'>Yes</Option>
								<Option value='no'>No</Option>
							</Select>
						</>
					),
				});

				columns.push({
					title: 'Selected',
					dataIndex: 'selected',
					render: (value, record) => (
						<>
							<Select
								style={{ width: 100 }}
								placeholder='--'
								value={value}
								allowClear
								onChange={(value) =>
									columnChangeHandler(
										'selected',
										value,
										record.sys_id,
										props.postChangeHandler
									)
								}
							>
								<Option value='yes'>Yes</Option>
								<Option value='no'>No</Option>
							</Select>
						</>
					),
				});
			}

			if (props.displayAllComments) {
				columns.push({
					title: 'Other Comments',
					align: 'center',
					render: (_, record) => (
						<Button
							type='text'
							shape='circle'
							onClick={() =>
								onOtherCommentsButtonClick(
									record.triage_comments,
									record.chair_triage_comment,
									record.scores
								)
							}
						>
							<CommentOutlined />
						</Button>
					),
				});
			}

			columns.push({
				title: 'Committee Comments',
				dataIndex: 'committee_comments',
				key: 'committee_comments',
				align: 'center',
				render: (comment, record) => (
					<Button
						type='text'
						shape='circle'
						onClick={() => onCommentButtonClick(comment, record.sys_id)}
					>
						<CommentOutlined />
					</Button>
				),
			});
		} else
			columns.push(
				{ title: 'Scoring Status', dataIndex: 'scoring_status', width: 125 },
				{
					title: 'Interview Recommendation',
					dataIndex: 'interview_recommendation',
					width: 100,
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

	const handleOtherCommentsModalClose = () => {
		setIsOtherCommentsModalVisible(false);
	};

	const columns = getColumns();

	return (
		<>
			<Table
				pagination={props.pagination}
				dataSource={props.applicants}
				loading={props.loading}
				onChange={(pagination, _, sorter) => {
					props.onTableChange(
						pagination.current,
						pagination.pageSize,
						sorter.order
					);
				}}
				scroll={{ x: 'true' }}
				columns={columns}
				rowKey='sys_id'
				expandable={{
					expandedRowRender: (record) => expandedRowRender(record.sys_id),
				}}
			/>
			<Modal
				title='Voting Comments'
				visible={isModalVisible}
				onOk={() => handleCommentSave(committeeComments, applicantSysId)}
				onCancel={handleCancel}
				destroyOnClose={true}
			>
				<TextArea
					placeholder='add your comments here'
					rows={4}
					defaultValue={committeeComments}
					onChange={onTextAreaChangeHandler}
					maxLength={10000}
				/>
			</Modal>
			<Modal
				title='Other Comments'
				visible={isOtherCommentsModalVisible}
				closable={true}
				destroyOnClose={true}
				onCancel={handleOtherCommentsModalClose}
				okButtonProps={{ style: { display: 'none' } }}
				cancelButtonProps={{ style: { display: 'none' } }}
			>
				<>
					<b>Vacancy Manager Comments:</b> <p>{triageComments}</p>
					<b>Chair Comments:</b> <p>{chairComments}</p>
					{committeeMembersComments.map((comment, index) => {
						if (comment.average_score !== '--') {
							return (
								<div key={index}>
									<b>{comment.name + "'s Comments:"}</b>
									<p>{comment.comments}</p>
								</div>
							);
						}
					})}
				</>
			</Modal>
		</>
	);
};

export default individualScoringTable;
