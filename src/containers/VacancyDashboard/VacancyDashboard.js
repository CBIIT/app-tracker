import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
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
import { transformDateToDisplay } from '../../components/Util/Date/Date';
import {
	EXTEND_VACANCY,
	REMOVE_VACANCY,
	REMOVE_DRAFT_VACANCY,
} from '../../constants/ApiEndpoints';
import {
	EDIT_DRAFT,
	EDIT_VACANCY,
	MANAGE_VACANCY,
	CREATE_VACANCY,
} from '../../constants/Routes';
import './VacancyDashboard.css';
import axios from 'axios';

const vacancyDashboard = () => {
	const [data, setData] = useState([]);
	const history = useHistory();
	let [url, setURL] = useState(
		'/api/x_g_nci_app_tracke/vacancy/get_dashboard_vacancy_list/preflight'
	);
	const [preFlightCount, setPreFlightCount] = useState([]);
	const [liveCount, setLiveCount] = useState([]);
	const [closedCount, setClosedCount] = useState([]);
	const [currentVacancy, setCurrentVacancy] = useState([]);
	const [extendModalVisible, setExtendModalVisible] = useState(false);
	const [removeModalVisible, setRemoveModalVisible] = useState(false);
	const urls = {
		preflight:
			'/api/x_g_nci_app_tracke/vacancy/get_dashboard_vacancy_list/preflight',
		live: '/api/x_g_nci_app_tracke/vacancy/get_dashboard_vacancy_list/live',
		closed: '/api/x_g_nci_app_tracke/vacancy/get_dashboard_vacancy_list/closed',
	};

	let customizeRenderEmpty = () => (
		<div style={{ textAlign: 'center' }}>
			<Empty
				image={Empty.PRESENTED_IMAGE_SIMPLE}
				description={'No Vacancies'}
			/>
		</div>
	);

	const tabChangeHandler = async (selectedTab) => {
		url = urls[selectedTab];
		try {
			const newData = await axios.get(url);
			setData(newData.data.result);
			setURL(url);
		} catch (err) {
			console.warn(err);
		}
	};

	useEffect(() => {
		(async () => {
			try {
				const [
					currentData,
					currentPreCount,
					currentLiveCount,
					currentClosedCount,
				] = await Promise.all([
					axios.get(url),
					axios.get(urls.preflight),
					axios.get(urls.live),
					axios.get(urls.closed),
				]);

				setData(currentData.data.result);
				setPreFlightCount(currentPreCount.data.result.length);
				setLiveCount(currentLiveCount.data.result.length);
				setClosedCount(currentClosedCount.data.result.length);
			} catch (err) {
				console.warn(err);
			}
		})();
	}, []);

	const filterChangeHandler = async (e) => {
		const newFilter = e.target.value;
		const filteredData = await axios.get(url);
		if (e.target.value == 'all') {
			setData(filteredData.data.result);
		} else if (url == urls.closed) {
			setData(
				filteredData.data.result.filter((res) => {
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
					return newState == newFilter;
				})
			);
		} else if (e.target.value == 'extended') {
			setData(filteredData.data.result.filter((res) => res.extended == 1));
		} else {
			setData(filteredData.data.result.filter((res) => res.state == newFilter));
		}
	};

	const extendVacancy = async () => {
		try {
			await axios.post(EXTEND_VACANCY + currentVacancy.sys_id);
			const updatedExtendedData = await axios.get(url);
			//Refresh data onClick of extend button
			setData(updatedExtendedData.data.result);
			setExtendModalVisible(false);
			message.success('Vacancy extended');
		} catch (error) {
			setExtendModalVisible(false);
			message.error('Sorry, an error occurred while trying to extend vacancy');
		}
	};

	const handleExtendModalCancel = () => {
		setExtendModalVisible(false);
	};

	const removeVacancy = async () => {
		try {
			if (currentVacancy.state == 'draft') {
				await axios.post(REMOVE_DRAFT_VACANCY + currentVacancy.sys_id);
			} else if (currentVacancy.state == 'final') {
				await axios.post(REMOVE_VACANCY + currentVacancy.sys_id);
			}
			const updatedRemovedData = await axios.get(url);
			//Refresh data onClick of remove button
			setData(updatedRemovedData.data.result);
			const updatedPreFlightCount = await axios.get(urls.preflight);
			//Refresh Pre-Flight Count onClick of remove button
			setPreFlightCount(updatedPreFlightCount.data.result.length);
			setRemoveModalVisible(false);
			message.success('Removed vacancy');
		} catch (error) {
			setRemoveModalVisible(false);
			message.error('Sorry, an error occurred while trying to remove vacancy');
		}
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
						<EditOutlined /> edit
					</Button>
					<Divider type='vertical' />
					<Button
						type='text'
						onClick={async () => {
							setRemoveModalVisible(true);
							setCurrentVacancy(vacancy);
						}}
					>
						<DeleteOutlined /> remove
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
			defaultSortOrder: 'ascend',
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
			},
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
						<EditOutlined /> edit
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
						<LinkOutlined /> copy link
					</Button>
					<Divider type='vertical' />
					<Button
						type='text'
						onClick={async () => {
							setExtendModalVisible(true);
							setCurrentVacancy(vacancy);
						}}
						style={{ padding: '0px' }}
					>
						<FieldTimeOutlined /> extend
					</Button>
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
				multiple: 1,
			},
			defaultSortOrder: 'ascend',
		},
		{
			title: 'Close Date',
			dataIndex: 'close_date',
			render: (date) => transformDateToDisplay(date),
			sorter: {
				compare: (a, b) => new Date(a.close_date) - new Date(b.close_date),
				multiple: 2,
			},
		},
		{
			title: 'Actions',
			key: 'action',
			render: (vacancy) => (
				<Space size='middle'>
					<Button
						type='text'
						onClick={() => {
							history.push(MANAGE_VACANCY + vacancy.sys_id + '/applicants');
						}}
					>
						<UserOutlined /> view applicants
					</Button>
					<Divider type='vertical' />
					<Button
						type='text'
						onClick={() => {
							history.push(MANAGE_VACANCY + vacancy.sys_id);
						}}
					>
						<FileTextOutlined /> view vacancy
					</Button>
				</Space>
			),
		},
	];

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
						defaultActiveKey='preflight'
					>
						<Tabs.TabPane
							tab={
								<span className='tab-letters'>
									<p className='num-count'>{preFlightCount}</p>
									<p className='vacancy-desc'>pre-flight vacancies</p>
								</span>
							}
							key='preflight'
						>
							<div className='tabs-div'>
								<p style={{ display: 'inline-block' }}>Filter Vacancies: </p>
								<Radio.Group
									defaultValue='all'
									style={{ display: 'inline-block', paddingLeft: '10px' }}
									onChange={filterChangeHandler}
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
										dataSource={data}
										columns={preFlightColumns}
										scroll={{ x: 'true' }}
										style={{
											width: '1170px',
											display: 'block',
											paddingLeft: '20px',
											paddingRight: '20px',
										}}
									/>
								</ConfigProvider>
							</div>
						</Tabs.TabPane>
						<Tabs.TabPane
							tab={
								<span className='tab-letters'>
									<p className='num-count'>{liveCount}</p>
									<p className='vacancy-desc'>live vacancies</p>
								</span>
							}
							key='live'
						>
							<div className='tabs-div'>
								<p style={{ display: 'inline-block' }}>Filter Vacancies: </p>
								<Radio.Group
									defaultValue='all'
									style={{ display: 'inline-block', paddingLeft: '10px' }}
									onChange={filterChangeHandler}
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
										dataSource={data}
										columns={liveColumns}
										scroll={{ x: 'true' }}
										style={{
											width: '1170px',
											display: 'block',
											paddingLeft: '20px',
											paddingRight: '20px',
										}}
									/>
								</ConfigProvider>
							</div>
						</Tabs.TabPane>
						<Tabs.TabPane
							tab={
								<span className='tab-letters'>
									<p className='num-count'>{closedCount}</p>
									<p className='vacancy-desc'>closed vacancies</p>
								</span>
							}
							key='closed'
						>
							<div className='tabs-div'>
								<p style={{ display: 'inline-block' }}>Filter Vacancies: </p>
								<Radio.Group
									defaultValue='all'
									style={{ display: 'inline-block', paddingLeft: '10px' }}
									onChange={filterChangeHandler}
								>
									<Radio.Button value='all'>All</Radio.Button>
									<Radio.Button value='closed'>Closed</Radio.Button>
									<Radio.Button value='triaged'>Triaged</Radio.Button>
									<Radio.Button value='individual_scored'>
										Individual Scored
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
										dataSource={data}
										columns={closedColumns}
										scroll={{ x: 'true' }}
										style={{
											width: '1170px',
											display: 'block',
											paddingLeft: '20px',
											paddingRight: '20px',
										}}
									/>
								</ConfigProvider>
							</div>
						</Tabs.TabPane>
					</Tabs>
				</div>
			</div>
			<Modal
				visible={extendModalVisible}
				onOk={extendVacancy}
				onCancel={handleExtendModalCancel}
				closable={false}
				okText='Confirm'
				cancelText='Cancel'
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
						Are you sure you want to extend this vacancy?
					</h2>
					<p>
						Please confirm you would like to extend this vacancy or click cancel
						to return to the previous screen.
					</p>
				</div>
			</Modal>
			<Modal
				visible={removeModalVisible}
				onOk={removeVacancy}
				onCancel={handleRemoveModalCancel}
				closable={false}
				okText='Confirm'
				cancelText='Cancel'
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
