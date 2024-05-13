import { useEffect, useState, useContext } from 'react';
import { message, Table, Tooltip, Collapse, Button } from 'antd';
import { useParams } from 'react-router-dom';
import { CheckCircleOutlined, CloseCircleOutlined, CheckCircleTwoTone, ExclamationCircleOutlined } from '@ant-design/icons';
import { getColumnSearchProps } from '../Util/ColumnSearchProps';
import axios from 'axios';

import IndividualScoringTable from './IndividualScoringTable/IndividualScoringTable';
import ApplicantList from '../../CommitteeDashboard/ApplicantList/ApplicantList';
import ReferenceModal from './ReferenceModal/ReferenceModal';
import {
	INDIVIDUAL_SCORING_IN_PROGRESS,
	COMMITTEE_REVIEW_IN_PROGRESS,
	VOTING_COMPLETE,
	OWM_TRIAGE,
	CHAIR_TRIAGE,
	COMMITTEE_REVIEW_COMPLETE,
	INDIVIDUAL_SCORING_COMPLETE,
} from '../../../constants/VacancyStates';
import {
	OWM_TEAM,
	COMMITTEE_CHAIR,
	COMMITTEE_MEMBER_VOTING,
	COMMITTEE_MEMBER_NON_VOTING,
	COMMITTEE_MEMBER_READ_ONLY,
} from '../../../constants/Roles';
import { GET_APPLICANT_LIST, COLLECT_REFERENCES } from '../../../constants/ApiEndpoints';
import SearchContext from '../Util/SearchContext';
import { transformDateTimeToDisplay } from '../../../components/Util/Date/Date';

import './ApplicantList.css';

const { Panel } = Collapse;

const renderDecision = (text) =>
	text == 'Pending' ? (
		<span style={{ color: 'rgba(0,0,0,0.25)', textTransform: 'capitalize' }}>
			{text}
		</span>
	) : (
		<span style={{ textTransform: 'capitalize' }}>{text}</span>
	);

const defaultApplicantSort = 'ascend';

const applicantList = (props) => {
	const { sysId } = useParams();
	const [applicants, setApplicants] = useState([]);
	const [pageSize, setPageSize] = useState(10);
	const [totalCount, setTotalCount] = useState(0);
	const [tableLoading, setTableLoading] = useState(false);
	const [appSysId, setAppSysId] = useState();
	const [showModal, setShowModal] = useState(false);
	const contextValue = useContext(SearchContext);
	const {
		searchText,
		setSearchText,
		searchedColumn,
		setSearchedColumn,
		searchInput
	} = contextValue;

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
		setAppSysId(sysId);
		if (referencesSent === '0') {
			sendReferences(sysId)
		} else {
			setShowModal(true);
		}
	}

	const applicantColumns = [
		{
			title: 'Applicant',
			dataIndex: 'applicant_name',
			key: 'name',
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
			defaultSortOrder: defaultApplicantSort,
			sorter: (a, b) => {
				if (a.applicant_name < b.applicant_name) {
					return -1;
				}
				if (a.applicant_name > b.applicant_name) {
					return 1;
				}
				return 0;
			},
		},
		{
			title: 'Email',
			dataIndex: 'applicant_email',
			key: 'email',
			maxWidth: 250,
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
			title: 'Submitted',
			dataIndex: 'submitted',
			key: 'submitted',
			render: (date) => transformDateTimeToDisplay(date),
		},
		{
			title: 'Vacancy Manager Triage Decision',
			dataIndex: 'owm_triage_status',
			key: 'OWMStatus',
			render: (text) => renderDecision(text),
		},
		{
			title: 'Chair Triage Decision',
			dataIndex: 'chair_triage_status',
			key: 'ChairStatus',
			render: (text) => renderDecision(text),
		}
	];

	const committeeColumns = [
		{
			title: 'Raw Score',
			dataIndex: 'raw_score',
			key: 'rawscore',
			width: 130,
			render: (text, record) => (record.recused == 1 ? 'n/a' : text),
		},

		{
			title: 'Average Score',
			dataIndex: 'average_score',
			width: 130,
			key: 'averagescore',
			render: (text, record) => {
				if (record.recused == 1)
					return (
						<Tooltip title='Recused'>
							<ExclamationCircleOutlined style={{ color: '#faad14' }} />
						</Tooltip>
					);
				else
					return record.average_score != undefined ? (
						<Tooltip title='Scoring Completed'>
							<CheckCircleTwoTone twoToneColor='#60E241'></CheckCircleTwoTone>
						</Tooltip>
					) : null;
			},
		},
		{
			title: 'Recommend Interview?',
			dataIndex: 'recommend',
			key: 'recommend',
			render: (text, record) => (record.recused == 1 ? 'n/a' : text),
		},
	]

	if (
		props.vacancyTenant === 'Stadtman' &&
		!applicantColumns.some((column) => column.title === 'Complete')
	) {
		applicantColumns.push({
			title: 'Complete',
			dataIndex: 'is_app_complete',
			key: 'complete',
			render: (text) => {
				return text === true ? (
					<CheckCircleOutlined className='checked-green' />
				) : (
					<CloseCircleOutlined className='closed-red' />
				);
			},
		});
	}

	if (props.referenceCollection && props.userRoles.includes(OWM_TEAM)) {
		applicantColumns.push(
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

	const [recommendedApplicants, setRecommendedApplicants] = useState([]);
	const [recommendedApplicantsPageSize, setRecommendedApplicantsPageSize] =
		useState(10);
	const [recommendedApplicantsTotalCount, setRecommendedApplicantsTotalCount] =
		useState(0);
	const [
		recommendedApplicantsTableLoading,
		setRecommendedApplicantsTableLoading,
	] = useState([]);

	const [nonRecommendedApplicants, setNonRecommendedApplicants] = useState([]);
	const [
		nonRecommendedApplicantsPageSize,
		setNonRecommendedApplicantsPageSize,
	] = useState(10);
	const [
		nonRecommendedApplicantsTotalCount,
		setNonRecommendedApplicantsTotalCount,
	] = useState(0);
	const [
		nonRecommendedApplicantsTableLoading,
		setNonRecommendedApplicantsTableLoading,
	] = useState([]);

	const pageSizeOptions = [10, 25];

	const tablePagination = {
		pageSizeOptions: pageSizeOptions,
		pageSize: pageSize,
		total: totalCount,
		hideOnSinglePage: true,
	};

	const recommendedApplicantsTablePagination = {
		pageSizeOptions: pageSizeOptions,
		pageSize: recommendedApplicantsPageSize,
		total: recommendedApplicantsTotalCount,
		hideOnSinglePage: true,
	};

	const nonRecommendedApplicantsTablePagination = {
		pageSizeOptions: pageSizeOptions,
		pageSize: nonRecommendedApplicantsPageSize,
		total: nonRecommendedApplicantsTotalCount,
		hideOnSinglePage: true,
	};

	useEffect(() => {
		updateData(1, pageSize, defaultApplicantSort, 'applicant_name');
	}, [props.vacancyState, searchText]);

	const loadRecommendedApplicants = async (page, pageSize, orderBy, orderColumn) => {
		setRecommendedApplicantsTableLoading(true);
		const data = await loadApplicants(page, pageSize, orderBy, orderColumn, 'yes');
		setRecommendedApplicantsTableLoading(false);
		setRecommendedApplicants(data.applicants);
		setRecommendedApplicantsTotalCount(data.totalCount);
		setRecommendedApplicantsPageSize(data.pageSize);
	};

	const loadNonRecommendedApplicants = async (page, pageSize, orderBy, orderColumn) => {
		setNonRecommendedApplicantsTableLoading(true);
		const data = await loadApplicants(page, pageSize, orderBy, orderColumn, 'no');
		setNonRecommendedApplicantsTableLoading(false);
		setNonRecommendedApplicants(data.applicants);
		setNonRecommendedApplicantsTotalCount(data.totalCount);
		setNonRecommendedApplicantsPageSize(data.pageSize);
	};

	const loadAllApplicants = async (page, pageSize, orderBy, orderColumn) => {
		setTableLoading(true);
		const data = await loadApplicants(page, pageSize, orderBy, orderColumn);
		setTableLoading(false);
		setApplicants(data.applicants);
		setTotalCount(data.totalCount);
		setPageSize(data.pageSize);
	};

	const updateData = async (page, pageSize, orderBy, orderColumn) => {
		if (
			props.userRoles.includes(OWM_TEAM) &&
			(props.vacancyState === INDIVIDUAL_SCORING_IN_PROGRESS ||
				props.vacancyState === VOTING_COMPLETE ||
				props.vacancyState === COMMITTEE_REVIEW_IN_PROGRESS)
		) {
			loadRecommendedApplicants(1, recommendedApplicantsPageSize, orderBy, orderColumn);
			loadNonRecommendedApplicants(
				1,
				nonRecommendedApplicantsPageSize,
				orderBy, orderColumn
			);
		} else {
			loadAllApplicants(1, pageSize, orderBy, orderColumn);
		}
	};

	const getTable = (vacancyState, userRoles, userCommitteeRole) => {
		const getColumns = () => {
			const hideColumnStateArray = [OWM_TRIAGE, CHAIR_TRIAGE, COMMITTEE_REVIEW_IN_PROGRESS, COMMITTEE_REVIEW_COMPLETE, VOTING_COMPLETE, INDIVIDUAL_SCORING_COMPLETE, INDIVIDUAL_SCORING_IN_PROGRESS]
			if (userCommitteeRole === COMMITTEE_MEMBER_READ_ONLY && hideColumnStateArray.includes(vacancyState)) {
				const newColumns = applicantColumns.filter((val) => {
					if (val.title === 'Applicant')
						return true;
					if (val.title === 'Email')
						return true;
				})
				return newColumns;
			}
			if (userCommitteeRole === COMMITTEE_MEMBER_VOTING || userCommitteeRole === COMMITTEE_MEMBER_NON_VOTING) {
				const applicantColumnCopy = [...applicantColumns]
				const columns = applicantColumnCopy.splice(0, 2);
				const newColumns = columns.concat(committeeColumns);
				return newColumns;
			} else {
				return applicantColumns;
			}
		}

		const table = (
			<Table
				dataSource={applicants}
				columns={getColumns()}
				scroll={{ x: 'true' }}
				rowKey='sys_id'
				pagination={tablePagination}
				loading={tableLoading}
				onChange={(pagination, _, sorter) => {
					loadAllApplicants(
						pagination.current,
						pagination.pageSize,
						sorter.order,
						sorter.field
					);
				}}
			></Table>
		);

		if (userRoles.includes(OWM_TEAM)) {
			switch (vacancyState) {
				case INDIVIDUAL_SCORING_IN_PROGRESS:
					return (
						<Collapse defaultActiveKey={['0']} ghost>
							<Panel header='Recommended Applicants'>
								<IndividualScoringTable
									applicants={recommendedApplicants}
									pagination={recommendedApplicantsTablePagination}
									loading={recommendedApplicantsTableLoading}
									onTableChange={loadRecommendedApplicants}
									refCollection={props.referenceCollection}
									isVacancyManager={props.userRoles.includes(OWM_TEAM)}
								/>
							</Panel>
							<Panel header='Non-Recommended Applicants'>
								<IndividualScoringTable
									applicants={nonRecommendedApplicants}
									pagination={nonRecommendedApplicantsTablePagination}
									loading={nonRecommendedApplicantsTableLoading}
									onTableChange={loadNonRecommendedApplicants}
									refCollection={props.referenceCollection}
									isVacancyManager={props.userRoles.includes(OWM_TEAM)}
								/>
							</Panel>
						</Collapse>
					);
				case VOTING_COMPLETE:
				case COMMITTEE_REVIEW_IN_PROGRESS:
					return (
						<Collapse defaultActiveKey={['0']} ghost>
							<Panel header='Recommended Applicants'>
								<IndividualScoringTable
									applicants={recommendedApplicants}
									pagination={recommendedApplicantsTablePagination}
									loading={recommendedApplicantsTableLoading}
									onTableChange={loadRecommendedApplicants}
									committeeVoting={true}
									postChangeHandler={loadVacancyAndApplicants}
									displayAllComments={vacancyState === VOTING_COMPLETE}
									vacancyState={vacancyState}
									refCollection={props.referenceCollection}
									isVacancyManager={props.userRoles.includes(OWM_TEAM)}
								/>
							</Panel>
							<Panel header='Non-Recommended Applicants'>
								<IndividualScoringTable
									applicants={nonRecommendedApplicants}
									pagination={nonRecommendedApplicantsTablePagination}
									loading={nonRecommendedApplicantsTableLoading}
									onTableChange={loadNonRecommendedApplicants}
									committeeVoting={true}
									postChangeHandler={loadVacancyAndApplicants}
									displayAllComments={vacancyState === VOTING_COMPLETE}
									vacancyState={vacancyState}
									refCollection={props.referenceCollection}
									isVacancyManager={props.userRoles.includes(OWM_TEAM)}
								/>
							</Panel>
						</Collapse>
					);
				default:
					return table;
			}
		} else if (userCommitteeRole === COMMITTEE_CHAIR) {
			switch (vacancyState) {
				case INDIVIDUAL_SCORING_IN_PROGRESS:
					return (
						<IndividualScoringTable
							applicants={applicants}
							pagination={tablePagination}
							onTableChange={loadAllApplicants}
							loading={tableLoading}
						/>
					);
				case VOTING_COMPLETE:
				case COMMITTEE_REVIEW_IN_PROGRESS:
					return (
						<IndividualScoringTable
							applicants={applicants}
							pagination={tablePagination}
							onTableChange={loadAllApplicants}
							committeeVoting={true}
							postChangeHandler={loadVacancyAndApplicants}
							displayAllComments={vacancyState === VOTING_COMPLETE}
							loading={tableLoading}
						/>
					);
				default:
					return table;
			}
		} else if (
			userCommitteeRole === COMMITTEE_MEMBER_VOTING ||
			userCommitteeRole === COMMITTEE_MEMBER_NON_VOTING
		) {
			return (
				<ApplicantList
					applicants={applicants}
					pagination={tablePagination}
					onTableChange={loadAllApplicants}
					loading={tableLoading}
				/>
			);
		} else {
			return table;
		}
	};

	const loadApplicants = async (page, pageSize, orderBy, orderColumn, recommended) => {
		const offset = page;
		const limit = pageSize;
		try {
			let apiString =
				GET_APPLICANT_LIST +
				sysId +
				'?offset=' +
				offset +
				'&limit=' +
				limit +
				'&orderBy=' +
				orderBy +
				'&orderColumn=' +
				orderColumn;

			if (recommended) apiString += '&recommended=' + recommended;
			if (searchText) apiString += '&search=' + searchText.toLowerCase();

			const response = await axios.get(apiString);

			return {
				applicants: response.data.result.applicants,
				totalCount: response.data.result.totalCount,
				pageSize: pageSize,
			};
		} catch (error) {
			message.error(
				'Sorry!  An error occurred while loading the page.  Try reloading.'
			);
		}
	};

	const loadVacancyAndApplicants = () => {
		updateData(1, pageSize, defaultApplicantSort, 'applicant_name');
		props.reloadVacancy();
	};

	const table = getTable(
		props.vacancyState,
		props.userRoles,
		props.userCommitteeRole
	);

	return (
		<>
			<div className='applicant-table'>{table}</div>
			<ReferenceModal
				appSysId={appSysId}
				showModal={showModal}
				setShowModal={setShowModal}
				sendReferences={sendReferences}
			/>
		</>
	);
};

export default applicantList;
