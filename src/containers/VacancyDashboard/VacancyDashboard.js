import React, { useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import {
	Table,
	Button,
	Tabs,
	Radio,
	Space,
	Divider,
	message,
	Modal,
	Empty,
	ConfigProvider,
	Tooltip,
} from 'antd';
import {
	DeleteOutlined,
	EditOutlined,
	LinkOutlined,
	FieldTimeOutlined,
	UserOutlined,
	FileTextOutlined,
	ExclamationCircleFilled,
} from '@ant-design/icons';
import axios from 'axios';

import { transformDateToDisplay } from '../../components/Util/Date/Date';
import {
	REMOVE_VACANCY,
	REMOVE_DRAFT_VACANCY,
	VACANCY_COUNTS,
	DASHBOARD_VACANCIES,
} from '../../constants/ApiEndpoints';
import {
	EDIT_DRAFT,
	EDIT_VACANCY,
	MANAGE_VACANCY,
	CREATE_VACANCY,
	VACANCY_DASHBOARD,
} from '../../constants/Routes';
import CountTile from './CountTile/CountTile';
import ExtendModal from './ExtendModal/ExtendModal';
import './VacancyDashboard.css';

const vacancyDashboard = () => {
	const [data, setData] = useState([]);
	const history = useHistory();
	const [currentVacancy, setCurrentVacancy] = useState([]);
	const [extendModalVisible, setExtendModalVisible] = useState(false);
	const [removeModalVisible, setRemoveModalVisible] = useState(false);
	const [modalLoading, setModalLoading] = useState(false);
	const [activeTab, setActiveTab] = useState();
	const [isLoading, setIsLoading] = useState(true);
	const [filter, setFilter] = useState('all');

	const tabs = {
		PREFLIGHT: 'preflight',
		LIVE: 'live',
		CLOSED: 'closed',
	};

	const { tab } = useParams();

	let customizeRenderEmpty = () => (
		<div style={{ textAlign: 'center' }}>
			<Empty
				image={Empty.PRESENTED_IMAGE_SIMPLE}
				description={'No Vacancies'}
			/>
		</div>
	);

	const tabChangeHandler = async (selectedTab) => {
		history.push(VACANCY_DASHBOARD + '/' + selectedTab);
	};

	const cancelToken = axios.CancelToken.source();

	useEffect(() => {
		(async () => {
			setIsLoading(true);
			let dataUrl = DASHBOARD_VACANCIES + tabs.PREFLIGHT;
			if (tab) {
				dataUrl = DASHBOARD_VACANCIES + tab;
				setActiveTab(tab);
			}

			setFilter('all');

			try {
				const currentData = await axios.get(dataUrl, {
					cancelToken: cancelToken.token,
				});

				setData(currentData.data.result);
			} catch (err) {
				if (!axios.isCancel)
					message.error('Sorry!  An error occurred while loading.');
			}
			setIsLoading(false);
		})();

		return () => {
			cancelToken.cancel();
		};
	}, [tab]);

	const filterChangeHandler = async (e) => {
		setFilter(e.target.value);
	};

	const getFilteredData = (filter) => {
		if (filter === 'all') {
			return data;
		} else if (tab === tabs.CLOSED) {
			return data.filter((res) => {
				let newState = '';
				switch (res.state) {
					case 'closed':
						newState = 'closed';
						break;
					case 'owm_triage':
						newState = 'triaged';
						break;
					case 'chair_triage':
						newState = 'triaged';
						break;
					case 'individual_scoring_in_progress':
						newState = 'individual_scored';
						break;
					case 'individual_scoring_complete':
						newState = 'individual_scored';
						break;
					case 'committee_review_in_progress':
						newState = 'committee_review';
						break;
					case 'committee_review_complete':
						newState = 'committee_review';
						break;
					case 'voting_complete':
						newState = 'voting_complete';
						break;
				}
				return newState == filter;
			});
		} else if (filter === 'extended') {
			return data.filter((res) => res.extended == 1);
		} else {
			return data.filter((res) => res.state == filter);
		}
	};

	const handleExtendModalCancel = (sysId) => {
		setExtendModalVisible((prev) => {
			const newState = { ...prev };
			newState[sysId] = false;
			return newState;
		});
	};

	const removeVacancy = async () => {
		setModalLoading(true);
		try {
			if (currentVacancy.state == 'draft') {
				await axios.post(REMOVE_DRAFT_VACANCY + currentVacancy.sys_id);
			} else if (currentVacancy.state == 'final') {
				await axios.post(REMOVE_VACANCY + currentVacancy.sys_id);
			}
			const updatedRemovedData = await axios.get(
				DASHBOARD_VACANCIES + (tab || tabs.PREFLIGHT)
			);
			setData(updatedRemovedData.data.result);
			message.success('Removed vacancy');
		} catch (error) {
			message.error('Sorry, an error occurred while trying to remove vacancy');
		}
		setRemoveModalVisible(false);
		setModalLoading(false);
	};

	const handleRemoveModalCancel = () => {
		setRemoveModalVisible(false);
	};

	const copyLinkMessage = () => {
		message.info('Vacancy link copied to clipboard');
	};

	const dateCompare = (dateA, dateB) => {
		if (dateA == '--' || dateA == '') dateA = null;
		if (dateB == '--' || dateB == '') dateB = null;
		return new Date(dateA) - new Date(dateB);
	};

	const handleEditButtonClick = (record) => {
		if (record.state === 'draft') history.push(EDIT_DRAFT + record.sys_id);
		else history.push(EDIT_VACANCY + record.sys_id);
	};

	// Preflight Columns
	const preFlightColumns = [
		{
			title: 'Vacancy Title',
			dataIndex: 'title',
			render: (title, record) => {
				let route = MANAGE_VACANCY;
				if (record.state === 'draft') route = EDIT_DRAFT;
				return <Link to={route + record.sys_id}>{title}</Link>;
			},
		},
		{
			title: 'Open Date',
			dataIndex: 'open_date',
			render: (date) => transformDateToDisplay(date),
			sorter: {
				compare: (a, b) => {
					const dateA = a.open_date;
					const dateB = b.open_date;
					return dateCompare(dateA, dateB);
				},
				multiple: 1,
			},
			defaultSortOrder: 'ascend',
		},
		{
			title: 'Close Date',
			dataIndex: 'close_date',
			render: (date) => transformDateToDisplay(date),
			sorter: {
				compare: (a, b) => {
					const dateA = a.close_date;
					const dateB = b.close_date;
					return dateCompare(dateA, dateB);
				},
				multiple: 2,
			},
		},
		{
			title: 'Actions',
			key: 'action',
			render: (vacancy, record) => (
				<Space size='middle'>
					<Button
						type='text'
						onClick={() => {
							handleEditButtonClick(record);
						}}
					>
						<EditOutlined /> Edit
					</Button>
					<Divider type='vertical' />
					<Button
						type='text'
						onClick={async () => {
							setRemoveModalVisible(true);
							setCurrentVacancy(vacancy);
						}}
					>
						<DeleteOutlined /> Remove
					</Button>
				</Space>
			),
		},
	];

	const liveColumns = [
		{
			title: 'Vacancy Title',
			dataIndex: 'title',
			render: (title, record) => {
				return (
					<>
						<Link id={record.sys_id} to={MANAGE_VACANCY + record.sys_id}>
							{title}
						</Link>
					</>
				);
			},
		},
		{
			dataIndex: 'extended',
			render: (vacancy, record) => {
				if (record.extended == '1') {
					return (
						<>
							<Tooltip title='Extended'>
								<FieldTimeOutlined
									alt='Extended Icon'
									style={{
										fontSize: '20px',
										color: 'rgb(191,191,191)',
									}}
								/>
							</Tooltip>
						</>
					);
				} else {
					return null;
				}
			},
		},
		{
			title: 'Applicants',
			dataIndex: 'applicants',
			sorter: {
				compare: (a, b) => a.applicants - b.applicants,
				multiple: 1,
			},
		},
		{
			title: 'Open Date',
			dataIndex: 'open_date',
			render: (date) => transformDateToDisplay(date),
			sorter: {
				compare: (a, b) => new Date(a.open_date) - new Date(b.open_date),
				multiple: 2,
			},
		},
		{
			title: 'Close Date',
			dataIndex: 'close_date',
			render: (date) => transformDateToDisplay(date),
			sorter: {
				compare: (a, b) => new Date(a.close_date) - new Date(b.close_date),
				multiple: 3,
				defaultSortOrder: 'descend',
			},
			defaultSortOrder: 'descend',
		},
		{
			title: 'Actions',
			key: 'action',
			width: '5px',
			render: (vacancy, record) => (
				<Space size={0}>
					<Button
						type='text'
						style={{ padding: '0px' }}
						onClick={() => {
							handleEditButtonClick(record);
						}}
					>
						<EditOutlined /> Edit
					</Button>
					<Divider type='vertical' />
					<Button
						type='text'
						onClick={() => {
							const copyLink = document.getElementById(vacancy.sys_id).href;
							const copyInput = document.createElement('input');
							copyInput.id = 'copy_link_' + vacancy.sys_id;
							copyInput.value = copyLink;
							document.body.append(copyInput);
							document.getElementById(`copy_link_${vacancy.sys_id}`).select();
							document.execCommand('copy');
							document.getElementById(`copy_link_${vacancy.sys_id}`).remove();
							copyLinkMessage();
						}}
						style={{ padding: '0px' }}
					>
						<LinkOutlined /> Copy Link
					</Button>
					<Divider type='vertical' />
					<Button
						type='text'
						onClick={async () => {
							setCurrentVacancy(vacancy);
							setExtendModalVisible((prev) => {
								const newState = { ...prev };
								newState[vacancy.sys_id] = true;
								return newState;
							});
						}}
						style={{ padding: '0px' }}
					>
						<FieldTimeOutlined /> Extend
					</Button>
					<ExtendModal
						extendModalVisible={extendModalVisible[vacancy.sys_id]}
						handleExtendModalCancel={() =>
							handleExtendModalCancel(vacancy.sys_id)
						}
						currentVacancy={vacancy}
						setData={setData}
						tab={tab}
					/>
				</Space>
			),
		},
	];

	const closedColumns = [
		{
			title: 'Vacancy Title',
			dataIndex: 'title',
			render: (title, record) => (
				<Link to={MANAGE_VACANCY + record.sys_id}>{title}</Link>
			),
		},
		{
			title: 'Applicants',
			dataIndex: 'applicants',
			sorter: {
				compare: (a, b) => a.applicants - b.applicants,
			},
		},
		{
			title: 'Close Date',
			dataIndex: 'close_date',
			render: (date) => transformDateToDisplay(date),
			sorter: {
				compare: (a, b) => new Date(a.close_date) - new Date(b.close_date),
				multiple: 1,
				defaultSortOrder: 'descend',
			},
			defaultSortOrder: 'descend',
		},
		{
			title: 'Actions',
			key: 'action',
			width: '5px',
			render: (vacancy, record) => (
				<Space size={0}>
					<Button
						type='text'
						style={{ padding: '0px' }}
						onClick={() => {
							handleEditButtonClick(record);
						}}
					>
						<EditOutlined /> Edit
					</Button>
					<Divider type='vertical' />
					<Button
						type='text'
						onClick={() => {
							history.push(MANAGE_VACANCY + vacancy.sys_id + '/applicants');
						}}
					>
						<UserOutlined /> View Applicants
					</Button>
					<Divider type='vertical' />
					<Button
						type='text'
						onClick={() => {
							history.push(MANAGE_VACANCY + vacancy.sys_id);
						}}
					>
						<FileTextOutlined /> View Vacancy
					</Button>
				</Space>
			),
		},
	];

	const filteredData = getFilteredData(filter);

	return (
		<>
			<div style={{ backgroundColor: '#EDF1F4' }}>
				<div className='app-container'>
					<div className='CreateVacancyButtonDiv'>
						<Link to={CREATE_VACANCY}>
							<Button
								className='CreateVacancyButton'
								type='primary'
								style={{
									fontSize: '16px',
									maxWidth: '161px',
									height: '36px',
									float: 'right',
								}}
								link='true'
							>
								+ Create Vacancy
							</Button>
						</Link>
					</div>
					<Tabs
						className='vacancy-tabs'
						size={'large'}
						onChange={tabChangeHandler}
						activeKey={activeTab}
						defaultActiveKey={tabs.PREFLIGHT}
					>
						<Tabs.TabPane
							tab={
								<CountTile
									title='pre-flight vacancies'
									apiUrl={VACANCY_COUNTS + tabs.PREFLIGHT}
									data={data}
								/>
							}
							key={tabs.PREFLIGHT}
						>
							<div className='tabs-div'>
								<p style={{ display: 'inline-block' }}>Filter Vacancies: </p>
								<Radio.Group
									defaultValue='all'
									style={{ display: 'inline-block', paddingLeft: '10px' }}
									onChange={filterChangeHandler}
									value={filter}
								>
									<Radio.Button value='all'>All</Radio.Button>
									<Radio.Button value='draft'>Draft</Radio.Button>
									<Radio.Button value='final'>Finalized</Radio.Button>
								</Radio.Group>
							</div>
							<div style={{ backgroundColor: 'white' }}>
								<ConfigProvider renderEmpty={customizeRenderEmpty}>
									<Table
										rowKey='sys_id'
										dataSource={filteredData}
										columns={preFlightColumns}
										scroll={{ x: 'true' }}
										style={{
											width: '1170px',
											display: 'block',
											paddingLeft: '20px',
											paddingRight: '20px',
										}}
										loading={isLoading}
									/>
								</ConfigProvider>
							</div>
						</Tabs.TabPane>
						<Tabs.TabPane
							tab={
								<CountTile
									title='live vacancies'
									apiUrl={VACANCY_COUNTS + tabs.LIVE}
								/>
							}
							key={tabs.LIVE}
						>
							<div className='tabs-div'>
								<p style={{ display: 'inline-block' }}>Filter Vacancies: </p>
								<Radio.Group
									defaultValue='all'
									style={{ display: 'inline-block', paddingLeft: '10px' }}
									onChange={filterChangeHandler}
									value={filter}
								>
									<Radio.Button value='all'>All</Radio.Button>
									<Radio.Button value='live'>Live</Radio.Button>
									<Radio.Button value='extended'>Extended</Radio.Button>
								</Radio.Group>
							</div>
							<div style={{ backgroundColor: 'white' }}>
								<ConfigProvider renderEmpty={customizeRenderEmpty}>
									<Table
										rowKey='sys_id'
										dataSource={filteredData}
										columns={liveColumns}
										scroll={{ x: 'true' }}
										style={{
											width: '1170px',
											display: 'block',
											paddingLeft: '20px',
											paddingRight: '20px',
										}}
										loading={isLoading}
									/>
								</ConfigProvider>
							</div>
						</Tabs.TabPane>
						<Tabs.TabPane
							tab={
								<CountTile
									title='closed vacancies'
									apiUrl={VACANCY_COUNTS + tabs.CLOSED}
								/>
							}
							key={tabs.CLOSED}
						>
							<div className='tabs-div'>
								<p style={{ display: 'inline-block' }}>Filter Vacancies: </p>
								<Radio.Group
									defaultValue='all'
									style={{ display: 'inline-block', paddingLeft: '10px' }}
									onChange={filterChangeHandler}
									value={filter}
								>
									<Radio.Button value='all'>All</Radio.Button>
									<Radio.Button value='triaged'>Triage</Radio.Button>
									<Radio.Button value='individual_scored'>
										Individual Scoring
									</Radio.Button>
									<Radio.Button value='committee_review'>
										Committee Review
									</Radio.Button>
									<Radio.Button value='voting_complete'>
										Voting Complete
									</Radio.Button>
								</Radio.Group>
							</div>
							<div style={{ backgroundColor: 'white' }}>
								<ConfigProvider renderEmpty={customizeRenderEmpty}>
									<Table
										rowKey='sys_id'
										dataSource={filteredData}
										columns={closedColumns}
										scroll={{ x: 'true' }}
										style={{
											width: '1170px',
											display: 'block',
											paddingLeft: '20px',
											paddingRight: '20px',
										}}
										loading={isLoading}
									/>
								</ConfigProvider>
							</div>
						</Tabs.TabPane>
					</Tabs>
				</div>
			</div>

			<Modal
				visible={removeModalVisible}
				onOk={removeVacancy}
				onCancel={handleRemoveModalCancel}
				closable={false}
				okText='Confirm'
				cancelText='Cancel'
				confirmLoading={modalLoading}
			>
				<div>
					<ExclamationCircleFilled
						style={{
							color: '#faad14',
							fontSize: '24px',
							display: 'inline-block',
							marginRight: '15px',
						}}
					/>
					<h2
						style={{
							display: 'inline-block',
						}}
					>
						Are you sure you want to remove this vacancy?
					</h2>
					<p>
						Please confirm you would like to remove this vacancy or click cancel
						to return to the previous screen.
					</p>
				</div>
			</Modal>
		</>
	);
};

export default vacancyDashboard;
