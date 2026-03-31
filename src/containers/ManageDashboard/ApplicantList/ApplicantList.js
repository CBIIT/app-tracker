import { useEffect, useState, useContext, useRef } from 'react';
import { message, Table, Tooltip, Collapse, Button, Radio } from 'antd';
import { useParams } from 'react-router-dom';
import {
	CheckCircleOutlined,
	CloseCircleOutlined,
	CheckCircleTwoTone,
	ExclamationCircleOutlined,
} from '@ant-design/icons';
import { getColumnSearchProps } from '../Util/ColumnSearchProps';
import axios from 'axios';
import IndividualScoringTable from './IndividualScoringTable/IndividualScoringTable';
import ApplicantList from '../../CommitteeDashboard/ApplicantList/ApplicantList';
import ReferenceModal from './ReferenceModal/ReferenceModal';
import RejectionEmailModal from './RejectionEmailModal/RejectionEmailModal';
import {
	INDIVIDUAL_SCORING_IN_PROGRESS,
	COMMITTEE_REVIEW_IN_PROGRESS,
	VOTING_COMPLETE,
	TRIAGE,
	ROLLING_CLOSE,
} from '../../../constants/VacancyStates';
import {
	APP_TRIAGE,
	SCORING,
	IN_REVIEW,
	REVIEW_COMPLETE,
	COMPLETED,
} from '../../../constants/ApplicationStates';
import {
	OWM_TEAM,
	COMMITTEE_HR_SPECIALIST,
	COMMITTEE_CHAIR,
	COMMITTEE_MEMBER_VOTING,
	COMMITTEE_MEMBER_NON_VOTING,
	COMMITTEE_MEMBER_READ_ONLY,
} from '../../../constants/Roles';
import {
	GET_APPLICANT_LIST,
	COLLECT_REFERENCES,
	GET_ROLLING_APPLICANT_LIST,
	SEND_REGRET_EMAIL,
	GET_APPLICANT_FOCUS_AREA,
} from '../../../constants/ApiEndpoints';
import SearchContext from '../Util/SearchContext';
import { transformDateTimeToDisplay } from '../../../components/Util/Date/Date';
import useAuth from '../../../hooks/useAuth';
import './ApplicantList.css';
import ExportToExcel from '../Util/ExportToExcel';
import moment from 'moment';
import { request } from 'express';

const { Panel } = Collapse;
const renderDecision = (text) =>
	text == 'Pending' ? (
		<span style={{ color: 'rgba(0,0,0,0.25)', textTransform: 'capitalize' }}>
			{text}
		</span>
	) : (
		<span style={{ textTransform: 'capitalize' }}>{text}</span>
	);
const displayTriage = (userRole, committeeRole) => {
	if (
		committeeRole === COMMITTEE_CHAIR ||
		committeeRole === COMMITTEE_HR_SPECIALIST ||
		userRole.includes(OWM_TEAM)
	) {
		return true;
	} else {
		return false;
	}
};

const applicantList = (props) => {
	const { sysId } = useParams();
	const [applicants, setApplicants] = useState([]);
	const [excelApplicants, setExcelApplicants] = useState([]);
	const [excelApplicantColumns, setExcelApplicantColumns] = useState([
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
			dataIndex: 'triage_status',
			key: 'TriageStatus',
			render: (text) => renderDecision(text),
		},
		{
			title: 'Chair Triage Decision',
			dataIndex: 'chair_triage_status',
			key: 'ChairStatus',
			render: (text) => renderDecision(text),
		},
		{
			title: 'Reference Status',
			dataIndex: 'total_received_references',
			key: 'totalReceivedReferences',
		},
	]);
	const [pageSize, setPageSize] = useState(50);
	const [totalCount, setTotalCount] = useState(0);
	const [tableLoading, setTableLoading] = useState(false);
	const [appSysId, setAppSysId] = useState();
	const [referenceModal, setReferenceModal] = useState(false);
	const [rejectionEmailModal, setRejectionEmailModal] = useState(false);
	const [referredToInterview, setReferredToInterview] = useState();
	const contextValue = useContext(SearchContext);
	const [filter, setFilter] = useState(
		displayTriage(props.userRoles, props.userCommitteeRole)
			? APP_TRIAGE
			: SCORING
	);
	const [referencesSent, setReferencesSent] = useState();
	const [rejectionEmailSent, setRejectionEmailSent] = useState();
	const [focusAreaFilter, setFocusAreaFilter] = useState([]);
	const [applicantFocusArea, setApplicantFocusArea] = useState([]);
	const {
		searchText,
		setSearchText,
		searchedColumn,
		setSearchedColumn,
		searchInput,
	} = contextValue;
	const allApplicantsRequestRef = useRef(0);
	const recommendedRequestRef = useRef(0);
	const nonRecommendedRequestRef = useRef(0);

	const {
		auth: { tenants },
		currentTenant,
	} = useAuth();
	const tname = tenants ? tenants.find((t) => t.value === currentTenant) : {};
	const top25Enabled = (tname?.properties || []).find(
		(p) => p.name === 'enableTop25Percent'
	)?.value;

	const sendReferences = async (sysId) => {
		try {
			const response = await axios.get(COLLECT_REFERENCES + sysId);
			message.success(response.data.result.message);
			loadVacancyAndApplicants();
		} catch (e) {
			message.error(
				'Sorry, there was an error sending the notifications to the references.  Try refreshing the browser.'
			);
		}
	};
	const sendRejectionEmail = async (sysId) => {
		try {
			const rejectionResponse = await axios.get(SEND_REGRET_EMAIL + sysId);
			message.success(rejectionResponse.data.result.response.message);
			loadVacancyAndApplicants();
		} catch (e) {
			message.error(
				'Sorry, there was an error sending the rejection email. Try refreshing the browser.'
			);
		}
	};
	const onCollectReferenceButtonClick = async (sysId, referencesSent) => {
		setAppSysId(sysId);
		setReferencesSent(referencesSent);
		setReferenceModal(true);
	};
	const onSendRejectionEmailButtonClick = async (
		sysId,
		rejectionEmailSent,
		referredToInterview
	) => {
		setAppSysId(sysId);
		setRejectionEmailSent(rejectionEmailSent);
		setRejectionEmailModal(true);
		setReferredToInterview(referredToInterview);
	};
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
			dataIndex: 'triage_status',
			key: 'TriageStatus',
			render: (text) => renderDecision(text),
		},
		{
			title: 'Chair Triage Decision',
			dataIndex: 'chair_triage_status',
			key: 'ChairStatus',
			render: (text) => renderDecision(text),
		},
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
	];
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
	if (props.userRoles.includes(OWM_TEAM)) {
		if (props.referenceCollection) {
			applicantColumns.push({
				title: '',
				align: 'center',
				width: 200,
				render: (_, record) => (
					<Button
						data-testid='collect-references-button'
						onClick={() =>
							onCollectReferenceButtonClick(
								record.sys_id,
								record.references_sent
							)
						}
					>
						Collect References
					</Button>
				),
			});
		}
		if (top25Enabled !== 'true') {
			applicantColumns.push({
				title: '',
				align: 'center',
				width: 200,
				render: (_, record) => (
					<Button
						data-testid='send-regret-email-button'
						onClick={() =>
							onSendRejectionEmailButtonClick(
								record.sys_id,
								record.rejection_email_sent,
								record.referred_to_interview
							)
						}
					>
						Send Regret Email
					</Button>
				),
			});
		}
		applicantColumns.push({
			title: 'Reference Status',
			dataIndex: 'total_received_references',
			key: 'totalReceivedReferences',
			align: 'center',
			render: (text, record) => (
				<span>{record.total_received_references || 0}</span>
			),
		});
	}
	const [recommendedApplicants, setRecommendedApplicants] = useState([]);
	const [recommendedApplicantsPageSize, setRecommendedApplicantsPageSize] =
		useState(50);
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
	] = useState(50);
	const [
		nonRecommendedApplicantsTotalCount,
		setNonRecommendedApplicantsTotalCount,
	] = useState(0);
	const [
		nonRecommendedApplicantsTableLoading,
		setNonRecommendedApplicantsTableLoading,
	] = useState([]);
	const pageSizeOptions = [10, 25, 50];
	const tablePagination = {
		pageSizeOptions: pageSizeOptions,
		pageSize: pageSize,
		total: totalCount,
		hideOnSinglePage: true,
		showSizeChanger: true,
	};
	const recommendedApplicantsTablePagination = {
		pageSizeOptions: pageSizeOptions,
		pageSize: recommendedApplicantsPageSize,
		total: recommendedApplicantsTotalCount,
		hideOnSinglePage: true,
		showSizeChanger: true,
	};
	const nonRecommendedApplicantsTablePagination = {
		pageSizeOptions: pageSizeOptions,
		pageSize: nonRecommendedApplicantsPageSize,
		total: nonRecommendedApplicantsTotalCount,
		hideOnSinglePage: true,
		showSizeChanger: true,
	};

	useEffect(() => {
		const fetchApplicantFocusArea = async () => {
			const response = await axios.get(GET_APPLICANT_FOCUS_AREA + sysId);
			setApplicantFocusArea(response.data.result.focusAreaFilter);
		};
		fetchApplicantFocusArea();
	}, []);

	useEffect(() => {
		updateData(1, pageSize);
	}, [props.vacancyState, searchText, filter]);

	useEffect(() => {
		const columnList = [];
		const columnMapList = [];
		let newApplicantColumns = [];

		if (
			props.userCommitteeRole === COMMITTEE_MEMBER_VOTING ||
			props.userCommitteeRole === COMMITTEE_MEMBER_NON_VOTING ||
			props.userCommitteeRole === COMMITTEE_MEMBER_READ_ONLY
		) {
			const applicantColumnCopy = [...excelApplicantColumns];
			const columns = applicantColumnCopy.splice(0, 2);
			if (props.userCommitteeRole === COMMITTEE_MEMBER_READ_ONLY) {
				newApplicantColumns = columns;
			} else {
				const newColumns = columns.concat(committeeColumns);
				newApplicantColumns = newColumns;
			}
		} else {
			newApplicantColumns = excelApplicantColumns;
		}

		newApplicantColumns.forEach((element) => {
			columnList.push(element.dataIndex);
			columnMapList.push({
				dataIndex: element.dataIndex,
				title: element.title,
			});
		});

		let excelData = [];
		let data = [];

		if (recommendedApplicants && recommendedApplicants.length > 0) {
			data.push(...recommendedApplicants);
		}
		if (nonRecommendedApplicants && nonRecommendedApplicants.length > 0) {
			data.push(...nonRecommendedApplicants);
		}
		if (applicants && applicants.length > 0) {
			data =
				props.vacancyState == ROLLING_CLOSE
					? getFilterData(filter, applicants)
					: applicants;
		}

		data.forEach((applicant) => {
			let newApplicant = {};
			columnList.forEach((col) => {
				if (applicant.hasOwnProperty(col)) {
					let val = applicant[col];
					if (col === 'top_25') {
						val = applicant[col] === '1' ? 'Yes' : 'No';
					}
					columnMapList.some((column) => {
						column.dataIndex === col
							? (newApplicant[column.title] = val ? val : '')
							: null;
					});
				}
			});
			excelData.push(newApplicant);
		});

		excelData ? setExcelApplicants(excelData) : null;
	}, [applicants, recommendedApplicants, nonRecommendedApplicants]);

	const filterChangeHandler = async (e) => {
		setFilter(e.target.value);
	};

	const getFilterData = (filter, apps) => {
		return apps.filter((applicant) => {
			let newState = '';
			switch (applicant.state) {
				case 'triage':
					newState = 'triage';
					break;
				case 'scoring':
					newState = 'scoring';
					break;
				case 'in_review':
					newState = 'in_review';
					break;
				case 'review_complete':
				case 'completed':
					newState = 'review_complete';
					break;
			}
			return newState == filter;
		});
	};

	const loadRecommendedApplicants = async (
		page,
		pageSize,
		orderBy,
		orderColumn,
		focusArea = focusAreaFilter
	) => {
		const requestId = ++recommendedRequestRef.current;
		setRecommendedApplicantsTableLoading(true);
		const data = await loadApplicants(
			page,
			pageSize,
			orderBy,
			orderColumn,
			'yes',
			focusArea
		);
		if (requestId !== recommendedRequestRef.current) {
			return;
		}
		setRecommendedApplicantsTableLoading(false);
		setRecommendedApplicants(data.applicants);
		setRecommendedApplicantsTotalCount(data.totalCount);
		setRecommendedApplicantsPageSize(data.pageSize);
	};

	const loadNonRecommendedApplicants = async (
		page,
		pageSize,
		orderBy,
		orderColumn,
		focusArea = focusAreaFilter
	) => {
		const requestId = ++nonRecommendedRequestRef.current;
		setNonRecommendedApplicantsTableLoading(true);
		const data = await loadApplicants(
			page,
			pageSize,
			orderBy,
			orderColumn,
			'no',
			focusArea
		);
		if (requestId !== nonRecommendedRequestRef.current) {
			return
		}
		setNonRecommendedApplicantsTableLoading(false);
		setNonRecommendedApplicants(data.applicants);
		setNonRecommendedApplicantsTotalCount(data.totalCount);
		setNonRecommendedApplicantsPageSize(data.pageSize);
	};

	const handleFocusAreaFilterChange = (newFilter) => {
		setFocusAreaFilter(newFilter);
	};

	const loadAllApplicants = async (
		page,
		pageSize,
		orderBy,
		orderColumn,
		focusArea = focusAreaFilter
	) => {
		const requestId = ++allApplicantsRequestRef.current;
		setTableLoading(true);
		const data = await loadApplicants(
			page,
			pageSize,
			orderBy,
			orderColumn,
			undefined,
			focusArea
		);
		if (requestId !== allApplicantsRequestRef.current) {
			return;
		}
		setTableLoading(false);
		if (data && data.applicants) {
			setApplicants(data.applicants);
		}
		if (data && data.totalCount) {
			setTotalCount(data.totalCount);
		}
		if (data && data.pageSize) {
			setPageSize(data.pageSize);
		}
	};

	const updateData = async (page, pageSize, orderBy, orderColumn) => {
		if (
			props.userRoles.includes(OWM_TEAM) &&
			(props.vacancyState === INDIVIDUAL_SCORING_IN_PROGRESS ||
				props.vacancyState === VOTING_COMPLETE ||
				props.vacancyState === COMMITTEE_REVIEW_IN_PROGRESS ||
				(props.vacancyState === ROLLING_CLOSE && filter !== TRIAGE))
		) {
			loadRecommendedApplicants(
				1,
				recommendedApplicantsPageSize,
				orderBy,
				orderColumn
			);
			loadNonRecommendedApplicants(
				1,
				nonRecommendedApplicantsPageSize,
				orderBy,
				orderColumn
			);
		} else {
			loadAllApplicants(1, pageSize, orderBy, orderColumn);
		}
	};

	const getTable = (vacancyState, userRoles, userCommitteeRole) => {
		const getColumns = () => {
			if (
				userCommitteeRole === COMMITTEE_MEMBER_VOTING ||
				userCommitteeRole === COMMITTEE_MEMBER_NON_VOTING ||
				userCommitteeRole === COMMITTEE_MEMBER_READ_ONLY
			) {
				const applicantColumnCopy = [...applicantColumns];
				const columns = applicantColumnCopy.splice(0, 2);
				if (userCommitteeRole === COMMITTEE_MEMBER_READ_ONLY) {
					return columns;
				}
				const newColumns = columns.concat(committeeColumns);
				return newColumns;
			} else {
				return applicantColumns;
			}
		};
		const data =
			vacancyState == ROLLING_CLOSE
				? getFilterData(filter, applicants)
				: applicants;
		const table = (
			<Table
				data-testid='applicant-table'
				dataSource={data}
				columns={getColumns()}
				scroll={{ x: 'true' }}
				rowKey='sys_id'
				pagination={tablePagination}
				loading={tableLoading}
				onChange={(pagination, filters, sorter) => {
					setPageSize(pagination.pageSize);
					const focusArea =
						filters && filters.focus_area ? filters.focus_area : [];
					setFocusAreaFilter(focusArea);
					loadAllApplicants(
						pagination.current,
						pagination.pageSize,
						sorter.order,
						sorter.field,
						focusArea
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
									reloadVacancy={loadVacancyAndApplicants}
									vacancyState={vacancyState}
									focusAreaFilter={focusAreaFilter}
									onFocusAreaFilterChange={handleFocusAreaFilterChange}
									focusArea={applicantFocusArea}
									postChangeHandler={loadVacancyAndApplicants}
									updateExcelColumns={setExcelApplicantColumns}
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
									reloadVacancy={loadVacancyAndApplicants}
									vacancyState={vacancyState}
									focusAreaFilter={focusAreaFilter}
									onFocusAreaFilterChange={handleFocusAreaFilterChange}
									focusArea={applicantFocusArea}
									postChangeHandler={loadVacancyAndApplicants}
									updateExcelColumns={setExcelApplicantColumns}
								/>
							</Panel>
						</Collapse>
					);
				case VOTING_COMPLETE:
					return (
						<>
							<div>
								<p>
									<b>REMINDER: </b> Once an individual has been marked selected,
									a New Appointment package will be prompted in the{' '}
									<a
										target='_blank'
										rel='noopener noreferrer'
										href='https://ess.niaid.nih.gov/livelink/livelink.exe/Open/PATSDashboard'
									>
										PATS
									</a>{' '}
									system with the Position Classification, Organizational Code,
									and PATS Initiator identified in the Basic Vacancy Information
									section.
								</p>
							</div>
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
										reloadVacancy={loadVacancyAndApplicants}
										focusAreaFilter={focusAreaFilter}
										onFocusAreaFilterChange={handleFocusAreaFilterChange}
										focusArea={applicantFocusArea}
										updateExcelColumns={setExcelApplicantColumns}
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
										reloadVacancy={loadVacancyAndApplicants}
										focusAreaFilter={focusAreaFilter}
										onFocusAreaFilterChange={handleFocusAreaFilterChange}
										focusArea={applicantFocusArea}
										updateExcelColumns={setExcelApplicantColumns}
									/>
								</Panel>
							</Collapse>
						</>
					);
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
									reloadVacancy={loadVacancyAndApplicants}
									focusAreaFilter={focusAreaFilter}
									onFocusAreaFilterChange={handleFocusAreaFilterChange}
									focusArea={applicantFocusArea}
									updateExcelColumns={setExcelApplicantColumns}
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
									reloadVacancy={loadVacancyAndApplicants}
									focusAreaFilter={focusAreaFilter}
									onFocusAreaFilterChange={handleFocusAreaFilterChange}
									focusArea={applicantFocusArea}
									updateExcelColumns={setExcelApplicantColumns}
								/>
							</Panel>
						</Collapse>
					);
				case ROLLING_CLOSE:
					switch (filter) {
						case SCORING:
							return (
								<Collapse defaultActiveKey={['0']} ghost>
									<Panel header='Recommended Applicants'>
										<IndividualScoringTable
											applicants={getFilterData(filter, recommendedApplicants)}
											pagination={recommendedApplicantsTablePagination}
											loading={recommendedApplicantsTableLoading}
											onTableChange={loadRecommendedApplicants}
											refCollection={props.referenceCollection}
											isVacancyManager={props.userRoles.includes(OWM_TEAM)}
											filter={filter}
											reloadVacancy={loadVacancyAndApplicants}
											vacancyState={vacancyState}
											focusAreaFilter={focusAreaFilter}
											onFocusAreaFilterChange={handleFocusAreaFilterChange}
											focusArea={applicantFocusArea}
											updateExcelColumns={setExcelApplicantColumns}
										/>
									</Panel>
									<Panel header='Non-Recommended Applicants'>
										<IndividualScoringTable
											applicants={getFilterData(
												filter,
												nonRecommendedApplicants
											)}
											pagination={nonRecommendedApplicantsTablePagination}
											loading={nonRecommendedApplicantsTableLoading}
											onTableChange={loadNonRecommendedApplicants}
											refCollection={props.referenceCollection}
											isVacancyManager={props.userRoles.includes(OWM_TEAM)}
											filter={filter}
											reloadVacancy={loadVacancyAndApplicants}
											vacancyState={vacancyState}
											focusAreaFilter={focusAreaFilter}
											onFocusAreaFilterChange={handleFocusAreaFilterChange}
											focusArea={applicantFocusArea}
											updateExcelColumns={setExcelApplicantColumns}
										/>
									</Panel>
								</Collapse>
							);
						case IN_REVIEW:
							return (
								<Collapse defaultActiveKey={['0']} ghost>
									<Panel header='Recommended Applicants'>
										<IndividualScoringTable
											applicants={getFilterData(filter, recommendedApplicants)}
											pagination={recommendedApplicantsTablePagination}
											loading={recommendedApplicantsTableLoading}
											onTableChange={loadRecommendedApplicants}
											committeeVoting={true}
											postChangeHandler={loadVacancyAndApplicants}
											displayAllComments={filter === 'review_complete'}
											vacancyState={vacancyState}
											refCollection={props.referenceCollection}
											isVacancyManager={props.userRoles.includes(OWM_TEAM)}
											filter={filter}
											reloadVacancy={loadVacancyAndApplicants}
											focusAreaFilter={focusAreaFilter}
											onFocusAreaFilterChange={handleFocusAreaFilterChange}
											focusArea={applicantFocusArea}
											updateExcelColumns={setExcelApplicantColumns}
										/>
									</Panel>
									<Panel header='Non-Recommended Applicants'>
										<IndividualScoringTable
											applicants={getFilterData(
												filter,
												nonRecommendedApplicants
											)}
											pagination={nonRecommendedApplicantsTablePagination}
											loading={nonRecommendedApplicantsTableLoading}
											onTableChange={loadNonRecommendedApplicants}
											committeeVoting={true}
											postChangeHandler={loadVacancyAndApplicants}
											displayAllComments={filter === 'review_complete'}
											vacancyState={vacancyState}
											refCollection={props.referenceCollection}
											isVacancyManager={props.userRoles.includes(OWM_TEAM)}
											filter={filter}
											reloadVacancy={loadVacancyAndApplicants}
											focusAreaFilter={focusAreaFilter}
											onFocusAreaFilterChange={handleFocusAreaFilterChange}
											focusArea={applicantFocusArea}
											updateExcelColumns={setExcelApplicantColumns}
										/>
									</Panel>
								</Collapse>
							);
						case REVIEW_COMPLETE:
						case COMPLETED:
							return (
								<>
									<div>
										<p classname='PATS-Reminder'>
											<b>REMINDER: </b> Once an individual has been marked
											selected, a New Appointment package will be prompted in
											the{' '}
											<a
												target='_blank'
												rel='noopener noreferrer'
												href='https://ess.niaid.nih.gov/livelink/livelink.exe/Open/PATSDashboard'
											>
												PATS
											</a>{' '}
											system with the Position Classification, Organizational
											Code, and PATS Initiator identified in the Basic Vacancy
											Information section.
										</p>
									</div>
									<Collapse defaultActiveKey={['0']} ghost>
										<Panel header='Recommended Applicants'>
											<IndividualScoringTable
												applicants={getFilterData(
													filter,
													recommendedApplicants
												)}
												pagination={recommendedApplicantsTablePagination}
												loading={recommendedApplicantsTableLoading}
												onTableChange={loadRecommendedApplicants}
												committeeVoting={true}
												postChangeHandler={loadVacancyAndApplicants}
												displayAllComments={filter === 'review_complete'}
												vacancyState={vacancyState}
												refCollection={props.referenceCollection}
												isVacancyManager={props.userRoles.includes(OWM_TEAM)}
												filter={filter}
												reloadVacancy={loadVacancyAndApplicants}
												focusAreaFilter={focusAreaFilter}
												onFocusAreaFilterChange={handleFocusAreaFilterChange}
												focusArea={applicantFocusArea}
												updateExcelColumns={setExcelApplicantColumns}
											/>
										</Panel>
										<Panel header='Non-Recommended Applicants'>
											<IndividualScoringTable
												applicants={getFilterData(
													filter,
													nonRecommendedApplicants
												)}
												pagination={nonRecommendedApplicantsTablePagination}
												loading={nonRecommendedApplicantsTableLoading}
												onTableChange={loadNonRecommendedApplicants}
												committeeVoting={true}
												postChangeHandler={loadVacancyAndApplicants}
												displayAllComments={filter === 'review_complete'}
												vacancyState={vacancyState}
												refCollection={props.referenceCollection}
												isVacancyManager={props.userRoles.includes(OWM_TEAM)}
												filter={filter}
												reloadVacancy={loadVacancyAndApplicants}
												focusAreaFilter={focusAreaFilter}
												onFocusAreaFilterChange={handleFocusAreaFilterChange}
												focusArea={applicantFocusArea}
												updateExcelColumns={setExcelApplicantColumns}
											/>
										</Panel>
									</Collapse>
								</>
							);
						default:
							return table;
					}
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
							vacancyState={vacancyState}
							focusArea={applicantFocusArea}
							updateExcelColumns={setExcelApplicantColumns}
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
							focusArea={applicantFocusArea}
							updateExcelColumns={setExcelApplicantColumns}
						/>
					);
				case ROLLING_CLOSE:
					switch (filter) {
						case SCORING:
							return (
								<IndividualScoringTable
									applicants={getFilterData(filter, applicants)}
									pagination={tablePagination}
									onTableChange={loadAllApplicants}
									loading={tableLoading}
									filter={filter}
									vacancyState={vacancyState}
									focusArea={applicantFocusArea}
									updateExcelColumns={setExcelApplicantColumns}
								/>
							);
						case IN_REVIEW:
						case REVIEW_COMPLETE:
						case COMPLETED:
							return (
								<IndividualScoringTable
									applicants={getFilterData(filter, applicants)}
									pagination={tablePagination}
									onTableChange={loadAllApplicants}
									committeeVoting={true}
									postChangeHandler={loadVacancyAndApplicants}
									displayAllComments={filter === 'review_complete'}
									loading={tableLoading}
									filter={filter}
									focusArea={applicantFocusArea}
									updateExcelColumns={setExcelApplicantColumns}
								/>
							);
						default:
							return table;
					}
				default:
					return table;
			}
		} else if (
			userCommitteeRole === COMMITTEE_MEMBER_VOTING ||
			userCommitteeRole === COMMITTEE_MEMBER_NON_VOTING
		) {
			return (
				<ApplicantList
					applicants={
						vacancyState === ROLLING_CLOSE
							? getFilterData(filter, applicants)
							: applicants
					}
					pagination={tablePagination}
					onTableChange={loadAllApplicants}
					loading={tableLoading}
					filter={filter}
					vacancyState={vacancyState}
					focusArea={applicantFocusArea}
				/>
			);
		} else {
			return table;
		}
	};
	const loadApplicants = async (
		page,
		pageSize,
		orderBy,
		orderColumn,
		recommended,
		focusArea
	) => {
		const offset = page;
		const limit = pageSize;
		const api =
			props.vacancyState == ROLLING_CLOSE
				? GET_ROLLING_APPLICANT_LIST
				: GET_APPLICANT_LIST;
		try {
			let apiString = api + sysId + '?offset=' + offset + '&limit=' + limit;
			if (orderBy && orderColumn) {
				apiString += '&orderBy=' + orderBy + '&orderColumn=' + orderColumn;
			}

			if (recommended) apiString += '&recommended=' + recommended;
			if (searchText) apiString += '&search=' + searchText.toLowerCase();
			const safeFocusArea = Array.isArray(focusArea) ? focusArea : [];
			if (safeFocusArea.length > 0) {
				apiString += '&focusArea=' + safeFocusArea.join(',');
			}
			// If safeFocusArea is empty, do not add focusArea param at all
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
		updateData(1, pageSize);
		props.reloadVacancy();
	};
	const table = getTable(
		props.vacancyState,
		props.userRoles,
		props.userCommitteeRole
	);
	return (
		<>
			{props.vacancyState == 'rolling_close' && (
				<div className='tabs-div'>
					<p style={{ display: 'inline-block' }}>Filter Applications: </p>
					<Radio.Group
						defaultValue={APP_TRIAGE}
						style={{ display: 'inline-block', paddingLeft: '10px' }}
						onChange={filterChangeHandler}
						value={filter}
					>
						{displayTriage(props.userRoles, props.userCommitteeRole) ? (
							<Radio.Button value={APP_TRIAGE}>Triage</Radio.Button>
						) : (
							''
						)}
						<Radio.Button value={SCORING}>Individual Scoring</Radio.Button>
						<Radio.Button value={IN_REVIEW}>Committee Review</Radio.Button>
						<Radio.Button value={REVIEW_COMPLETE}>Selected</Radio.Button>
					</Radio.Group>
				</div>
			)}
			<div
				className='ExportToExcelButtonDiv'
				style={{
					display: 'flex',
					justifyContent: 'flex-end',
					marginBottom: '4px',
				}}
			>
				<Button
					disabled={excelApplicants.length === 0}
					ghost
					type='primary'
					onClick={() =>
						ExportToExcel(
							excelApplicants,
							`${props.vacancyTitle}-ApplicantList-${moment(new Date().toString()).format('MM-DD-YYYY')}.xlsx`
						)
					}
				>
					Export to Excel
				</Button>
			</div>
			<div className='applicant-table'>{table}</div>
			<ReferenceModal
				appSysId={appSysId}
				referenceModal={referenceModal}
				setReferenceModal={setReferenceModal}
				sendReferences={sendReferences}
				referencesSent={referencesSent}
			/>
			<RejectionEmailModal
				appSysId={appSysId}
				rejectionEmailModal={rejectionEmailModal}
				setRejectionEmailModal={setRejectionEmailModal}
				sendRejectionEmail={sendRejectionEmail}
				rejectionEmailSent={rejectionEmailSent}
				referredToInterview={referredToInterview}
			/>
		</>
	);
};
export default applicantList;
