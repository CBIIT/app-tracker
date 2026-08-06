import {
	CommentOutlined,
	CheckCircleTwoTone,
	ExclamationCircleOutlined,
} from '@ant-design/icons';
import { Button, Select, Tooltip } from 'antd';

const getCommitteeReviewColumns = ({
	roleCaps,
	handlers,
	searchProps,
}) => {
	const safeRoleCaps = roleCaps || {};
	const safeHandlers = handlers || {};
	const getSearchProps =
		searchProps || safeHandlers.searchProps || (() => ({}));
	const columnChangeHandler = safeHandlers.columnChangeHandler || (() => {});
	const onCommentButtonClick = safeHandlers.onCommentButtonClick || (() => {});
	const renderAverageScore =
		safeHandlers.renderAverageScore ||
		((text) => {
			if (!text || text === 'NaN') {
				return <span style={{ color: 'rgba(0,0,0,0.25)' }}>Pending</span>;
			}
			return parseFloat(text).toFixed(2);
		});
	const renderReferredToInterview =
		safeHandlers.renderReferredToInterview ||
		((value, record) => (
			<>
				<Select
					style={{ width: 100 }}
					placeholder='--'
					value={value}
					allowClear
					onChange={(val) => columnChangeHandler(val, record.sys_id)}
				>
					<Select.Option value='yes'>Yes</Select.Option>
					<Select.Option value='no'>No</Select.Option>
				</Select>
			</>
		));
	const renderCommitteeComments = safeHandlers.renderCommitteeComments ||
		((comment, record) => (
			<Button
				type='text'
				shape='circle'
				onClick={() => onCommentButtonClick(comment, record.sys_id)}
			>
				<CommentOutlined />
			</Button>
		));
	const renderCollectReferencesButton =
		safeHandlers.renderCollectReferencesButton || (() => null);
	const renderRegretEmailButton =
		safeHandlers.renderRegretEmailButton || (() => null);
	const renderReferenceCount =
		safeHandlers.renderReferenceCount || ((text) => text || '-');

	const basicApplicantColumns = [
		{
			title: 'Applicant',
			dataIndex: 'applicant_name',
			key: 'name',
			width: 250,
			...getSearchProps('applicant_name', 'name'),
		},
		{
			title: 'Email',
			dataIndex: 'applicant_email',
			key: 'email',
			width: 250,
			...getSearchProps('applicant_email', 'email'),
		},
	];

	if (safeRoleCaps.isCommitteeReadOnly) {
		return basicApplicantColumns;
	}

	if (safeRoleCaps.isCommitteeMember || safeRoleCaps.isCommitteeNonVoting) {
		return [
			{
				key: 'score_status',
				render: (_text, record) => {
					if (record.recused == 1) {
						return (
							<Tooltip title='Recused'>
								<ExclamationCircleOutlined style={{ color: '#faad14' }} />
							</Tooltip>
						);
					}

					return record.average_score !== undefined ? (
						<Tooltip title='Scoring Completed'>
							<CheckCircleTwoTone twoToneColor='#60E241' />
						</Tooltip>
					) : null;
				},
			},
			...basicApplicantColumns,
			{
				title: 'Raw Score',
				dataIndex: 'raw_score',
				key: 'raw_score',
				width: 130,
				render: (text, record) => (record.recused == 1 ? 'n/a' : text),
			},
			{
				title: 'Average Score',
				dataIndex: 'average_score',
				key: 'average_score',
				render: (text, record) =>
					record.recused == 1 ? 'n/a' : text || 'Pending',
			},
			{
				title: 'Recommend Interview?',
				dataIndex: 'recommend',
				key: 'recommend',
				render: (text, record) => (record.recused == 1 ? 'n/a' : text),
			},
		];
	}

	const cols = [...basicApplicantColumns];

	cols.push(
		{
			title: 'Average Score',
			dataIndex: 'average_member_score',
			key: 'average_member_score',
			width: 50,
			render: renderAverageScore,
			sorter: {
				compare: (a, b) =>
					(a.average_member_score || 0) - (b.average_member_score || 0),
			},
		},
		...(safeRoleCaps.canReviewInterviewDecision
			? [
					{
						title: 'Referred to Interview',
						dataIndex: 'referred_to_interview',
						render: renderReferredToInterview,
					},
			  ]
			: []),
		...(safeRoleCaps.canViewCommitteeComments
			? [
					{
						title: 'Committee Comments',
						dataIndex: 'committee_comments',
						key: 'committee_comments',
						align: 'center',
						render: renderCommitteeComments,
					},
			  ]
			: [])
	);

	if (safeRoleCaps.isVacancyManager) {
		if (safeRoleCaps.canCollectReferences) {
			cols.push({
				title: '',
				key: 'collect_references',
				align: 'center',
				width: 180,
				render: (_text, record) =>
					renderCollectReferencesButton(record.sys_id, record.references_sent),
			});
		}

		if (safeRoleCaps.canSendRegretEmail) {
			cols.push({
				title: '',
				key: 'regret_email',
				align: 'center',
				width: 180,
				render: (_text, record) =>
					renderRegretEmailButton(
						record.sys_id,
						record.rejection_email_sent,
						record.referred_to_interview
					),
			});
		}

		cols.push({
			title: 'Reference Status',
			dataIndex: 'total_received_references',
			key: 'reference_status',
			align: 'center',
			render: renderReferenceCount,
		});
	}

	return cols;
};

export default getCommitteeReviewColumns;
