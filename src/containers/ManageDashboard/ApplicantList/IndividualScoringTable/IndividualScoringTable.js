import { useState, useContext } from 'react';
import { Table, Select, Modal, Input, Button, message } from 'antd';
import { CommentOutlined } from '@ant-design/icons';
import { getColumnSearchProps } from '../../Util/ColumnSearchProps';
import axios from 'axios';
import SearchContext from '../../Util/SearchContext';
import InnerScoresTable from './InnerScoresTable/InnerScoresTable';
import ReferenceModal from '../ReferenceModal/ReferenceModal';
import {
	INTERVIEW,
	SELECTED,
	REFERRED_TO_SELECTING_OFFICIAL,
	SUBMIT_COMMITTEE_COMMENTS,
	COLLECT_REFERENCES
} from '../../../../constants/ApiEndpoints';
import {
	COMMITTEE_REVIEW_IN_PROGRESS,
	ROLLING_CLOSE,
	VOTING_COMPLETE,
} from '../../../../constants/VacancyStates';
import { IN_REVIEW, COMPLETED, REVIEW_COMPLETE } from '../../../../constants/ApplicationStates';

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
	const [showReferenceModal, setShowReferenceModal] = useState(false);
	const [committeeComments, setCommitteeComments] = useState('');
	const [applicantSysId, setAppicantSysId] = useState();
	const [isOtherCommentsModalVisible, setIsOtherCommentsModalVisible] =
		useState(false);
	const [triageComments, setTriageComments] = useState('');
	const [chairComments, setChairComments] = useState('');
	const [committeeMembersComments, setCommitteeMembersComments] = useState([]);
	const contextValue = useContext(SearchContext);
	const {
		searchText,
		setSearchText,
		searchedColumn,
		setSearchedColumn,
		searchInput
	} = contextValue;

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

	const sendReferences = async (sysId) => {
		try {
			const response = await axios.get(COLLECT_REFERENCES + sysId);
			message.success(
				response.data.result.message
			);
		} catch (e) {
			message.error(
				'Sorry, there was an error sending the notifications to the references.  Try refreshing the browser.'
			);
		}
	}

	const onCollectReferenceButtonClick = async (sysId, referencesSent) => {
		setAppicantSysId(sysId);
		if (referencesSent === '0') {
			sendReferences(sysId)
		} else {
			setShowReferenceModal(true);
		}
	}

	const getColumns = () => {
		const columns = [
			{
				title: 'Applicant',
				dataIndex: 'applicant_name',
				key: 'name',
				sorter: (a, b) =>{
					if (a.applicant_name < b.applicant_name) {
						return -1;
					}
					if (a.applicant_name > b.applicant_name) {
						return 1;
					}
					return 0;
				},
				defaultSortOrder: 'ascend',
				width: 250,
				...getColumnSearchProps(
					'applicant_name',
					'name',
					searchText,
					setSearchText,
					searchedColumn,
					setSearchedColumn,
					searchInput
				),
			},
			{
				title: 'Email',
				dataIndex: 'applicant_email',
				key: 'email',
				width: 250,
				...getColumnSearchProps(
					'applicant_email',
					'email',
					searchText,
					setSearchText,
					searchedColumn,
					setSearchedColumn,
					searchInput
				),
			},
			{
				title: 'Average Score',
				dataIndex: 'average_member_score',
				width: 50,
				render: (text) => {
					if (!text || text == 'NaN') {
						return (
							<span style={{ color: 'rgba(0,0,0,0.25)' }}>
								{(text = 'Pending')}
							</span>
						);
					} else {
						return parseFloat(text).toFixed(2);
					}
				},
				sorter: {
					compare: (a, b) => a.average_member_score - b.average_member_score,
				},
			},
		];

		if (
			(props.vacancyState === ROLLING_CLOSE && (props.filter === IN_REVIEW || props.filter === COMPLETED || props.filter === REVIEW_COMPLETE)) ||
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

			if (props.vacancyState === VOTING_COMPLETE || (props.vacancyState === ROLLING_CLOSE && props.filter === REVIEW_COMPLETE)) {
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
		} else {
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
		}
		if (props.isVacancyManager && props.refCollection) {
			columns.push(
				{
					title: '',
					align: 'center',
					width: 200,
					render: (_, record) => (
						<Button
							onClick={() => onCollectReferenceButtonClick(record.sys_id, record.references_sent)}
						>
							Collect References
						</Button>
					)
				}
			)
		}
		
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
						sorter.order,
						sorter.field
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
			<ReferenceModal
				appSysId={applicantSysId}
				showModal={showReferenceModal}
				setShowModal={setShowReferenceModal}
				sendReferences={sendReferences}
			/>
		</>
	);
};

export default individualScoringTable;
