import { CommentOutlined } from '@ant-design/icons';
import { Button, Select, Tag } from 'antd';

const getCommitteeReviewColumns = ({
	roleCaps,
	tenantCaps,
	handlers,
	searchProps,
}) => {
	const safeRoleCaps = roleCaps || {};
	const safeTenantCaps = tenantCaps || {};
	const safeHandlers = handlers || {};
	const getSearchProps =
		searchProps || safeHandlers.searchProps || (() => ({}));
	const renderDecision = safeHandlers.renderDecision || ((value) => value);
	const columnChangeHandler = safeHandlers.columnChangeHandler || (() => {});
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
					onChange={(val) =>
						columnChangeHandler(
							'referredToInterview',
							val,
							record.sys_id,
							handlers && handlers.postChangeHandler
								? handlers.postChangeHandler
								: undefined
						)
					}
				>
					<Select.Option value='yes'>Yes</Select.Option>
					<Select.Option value='no'>No</Select.Option>
				</Select>
			</>
		));
    const renderCommitteeComments =
        safeHandlers.renderCommitteeComments ||
        ((comment, record) => (
            <>
                <Button
                    type='text'
                    shape='cicrle'
                    onClick={() => onCommentButtonClick(comment, record.sys_id)}
                >
                    <CommentOutlined />
                </Button>
            </>
        ));
	const renderCollectReferencesButton =
		safeHandlers.renderCollectReferencesButton || (() => null);
	const renderRegretEmailButton =
		safeHandlers.renderRegretEmailButton || (() => null);
	const renderReferenceCount =
		safeHandlers.renderReferenceCount || ((text) => text || '-');

	const cols = [
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
		{
			title: 'Referred to Interview',
			dataIndex: 'referred_to_interview',
			render: renderReferredToInterview,
		},
		{
			title: 'Committee Comments',
			dataIndex: 'committee_comments',
			key: 'committee_comments',
			align: 'center',
            render: renderCommitteeComments
		}
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
};

export default getCommitteeReviewColumns;
