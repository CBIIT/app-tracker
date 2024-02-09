import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
	GET_USER_APPLICATIONS,
	REMOVE_USER_APPLICATION_DRAFT,
	WITHDRAW_USER_APPLICATION,
} from '../../constants/ApiEndpoints';
import { EDIT_APPLICATION, VIEW_APPLICATION } from '../../constants/Routes';
import {
	Table,
	ConfigProvider,
	Empty,
	Space,
	Button,
	Divider,
	Modal,
	message,
} from 'antd';
import {
	EditOutlined,
	DeleteOutlined,
	MinusCircleOutlined,
	ExclamationCircleFilled,
	FileTextOutlined,
} from '@ant-design/icons';
import axios from 'axios';

import Error from '../../components/UI/Error/Error';
import { transformDateToDisplay } from '../../components/Util/Date/Date';
import { useFetch } from '../../hooks/useFetch';
import './ApplicantDashboard.css';

const applicantDashboard = () => {
	const history = useHistory();
	const [removeDraftModalVisible, setRemoveDraftModalVisible] = useState(false);
	const [withdrawAppModalVisible, setWithdrawAppModalVisible] = useState(false);
	const [currentApplication, setCurrentApplication] = useState([]);

	let customizeRenderEmpty = () => (
		<div style={{ textAlign: 'center' }}>
			<Empty
				image={Empty.PRESENTED_IMAGE_SIMPLE}
				description={'No Applications'}
			/>
		</div>
	);

	const handleRemoveModalCancel = () => {
		setRemoveDraftModalVisible(false);
	};

	const handleWithdrawModalCancel = () => {
		setWithdrawAppModalVisible(false);
	};

	const removeDraft = async () => {
		try {
			await axios.post(
				REMOVE_USER_APPLICATION_DRAFT + currentApplication.draft_id
			);

			setData((currentData) =>
				currentData.filter(
					(data) => data.draft_id !== currentApplication.draft_id
				)
			);
			message.success('Draft removed');
		} catch (error) {
			message.error('Sorry, an error occurred while trying to remove draft');
		} finally {
			setRemoveDraftModalVisible(false);
		}
	};

	const withdrawApp = async () => {
		try {
			await axios.post(WITHDRAW_USER_APPLICATION + currentApplication.app_id);
			const updatedWithdrawnData = await axios.get(GET_USER_APPLICATIONS);
			setData(updatedWithdrawnData.data.result);
			setWithdrawAppModalVisible(false);
			message.success('Withdrawn application');
		} catch (error) {
			setWithdrawAppModalVisible(false);
			message.error(
				'Sorry, an error occurred while trying to withdraw application'
			);
		}
	};

	const { isLoading, data, error, setData } = useFetch(GET_USER_APPLICATIONS);
	console.log(data)

	const applicationColumns = [
		{
			title: 'Vacancy Title',
			dataIndex: 'vacancy',
			key: 'title',
			sorter: {
				compare: (a, b) => a.vacancy.localeCompare(b.vacancy),
				multiple: 1,
			},
			defaultSortOrder: 'ascend',
			render: (title, record) => {
				switch (record.state) {
					case 'submitted':
						return <Link to={VIEW_APPLICATION + record.app_id}>{title}</Link>;
					case 'draft':
						return (
							<Link to={EDIT_APPLICATION + 'draft/' + record.draft_id}>
								{title}
							</Link>
						);
					default:
						return <Link to={'/vacancy/' + record.vacancy_id}>{title}</Link>;
				}
			},
		},
		{
			title: 'State',
			dataIndex: 'state',
			key: 'state',
			render: (state) => {
				return <span style={{ textTransform: 'capitalize' }}>{state}</span>;
			},
		},
		{
			title: 'Vacancy Closes',
			dataIndex: 'vacancy_closes',
			key: 'closes',
			render: (date) => date ? transformDateToDisplay(date) : "Open Until Filled",
			sorter: {
				compare: (a, b) =>
					new Date(a.vacancy_closes) - new Date(b.vacancy_closes),
				multiple: 2,
			},
			defaultSortOrder: 'ascend',
		},

		{
			title: 'Application Submitted',
			dataIndex: 'vacancy_submitted',
			key: 'submitted',
			render: (date) => transformDateToDisplay(date),
			sorter: {
				compare: (a, b) =>
					new Date(a.vacancy_submitted) - new Date(b.vacancy_submitted),
				multiple: 3,
			},
			defaultSortOrder: 'ascend',
		},
		{
			title: 'Actions',
			key: 'action',
			render: (application) => {
				if (application.state == 'submitted') {
					let buttons = [];
					if (application.vacancy_state === 'live')
						buttons.push(
							<Button
								key='edit'
								type='text'
								onClick={() => {
									history.push(EDIT_APPLICATION + application.app_id);
								}}
							>
								<EditOutlined /> Edit
							</Button>,
							<Divider key='divider' type='vertical' />
						);
					buttons.push(
						<Button
							key='withdraw'
							type='text'
							onClick={async () => {
								setWithdrawAppModalVisible(true);
								setCurrentApplication(application);
							}}
						>
							<MinusCircleOutlined />
							Withdraw
						</Button>
					);
					return <Space size='middle'>{buttons}</Space>;
				} else if (application.state == 'withdrawn') {
					return (
						<Button
							type='text'
							onClick={() => {
								history.push('/vacancy/' + application.vacancy_id);
							}}
						>
							<FileTextOutlined />
							View Vacancy
						</Button>
					);
				} else {
					return (
						<Space size='middle'>
							<Button
								type='text'
								onClick={() => {
									history.push(
										EDIT_APPLICATION + 'draft/' + application.draft_id
									);
								}}
							>
								<EditOutlined /> Edit
							</Button>
							<Divider type='vertical' />
							<Button
								type='text'
								onClick={async () => {
									setRemoveDraftModalVisible(true);
									setCurrentApplication(application);
								}}
							>
								<DeleteOutlined /> Remove
							</Button>
						</Space>
					);
				}
			},
		},
	];

	return isLoading ? (
		<> </>
	) : error ? (
		<Error error={error} />
	) : (
		<>
			<div className='HeaderTitle'>
				<h1>Your Applications</h1>
			</div>
			{data.length > 0 ? (
				<div className='ApplicantDashboard'>
					<ConfigProvider renderEmpty={customizeRenderEmpty}>
						<Table
							className='ApplicantTable'
							rowKey={(record) => {
								if (record.app_id != undefined) {
									return record.app_id;
								} else if (record.draft_id != undefined) {
									return record.draft_id;
								}
							}}
							dataSource={data}
							columns={applicationColumns}
							scroll={{ x: 'true' }}
							key='Applications'
							style={{
								width: '1170px',
								display: 'block',
								paddingLeft: '20px',
								paddingRight: '20px',
								paddingTop: '20px',
							}}
						></Table>
					</ConfigProvider>
				</div>
			) : (
				<div className='ApplicantDashboardNoApplications'>
					<p>
						You do not have any active applications.{'  '}
						<Link to='/'>View all open positions↗</Link>
					</p>
				</div>
			)}

			<Modal
				visible={removeDraftModalVisible}
				onOk={removeDraft}
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
						Are you sure you want to remove this draft?
					</h2>
					<p>
						Please confirm you would like to remove this draft or click cancel
						to return to the previous screen.
					</p>
				</div>
			</Modal>
			<Modal
				visible={withdrawAppModalVisible}
				onOk={withdrawApp}
				onCancel={handleWithdrawModalCancel}
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
						Are you sure you want to withdraw this application?
					</h2>
					<p>
						Please confirm you would like to withdraw this application or click
						cancel to return to the previous screen.
					</p>
				</div>
			</Modal>
		</>
	);
};

export default applicantDashboard;
