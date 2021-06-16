import React, { useEffect, useState } from 'react';
import {
	GET_USER_APPLICATIONS,
	REMOVE_USER_APPLICATION_DRAFT,
} from '../../constants/ApiEndpoints';
import {
	Table,
	ConfigProvider,
	Empty,
	Space,
	Button,
	Divider,
	Modal,
} from 'antd';
import {
	EditOutlined,
	DeleteOutlined,
	MinusCircleOutlined,
	ExclamationCircleFilled,
} from '@ant-design/icons';
import { transformDateToDisplay } from '../../components/Util/Date/Date';
import './ApplicantDashboard.css';
import axios from 'axios';

const applicantDashboard = () => {
	const [data, setData] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [removeDraftModalVisible, setRemoveDraftModalVisible] = useState(false);
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

	const removeDraft = async () => {
		try {
			await axios.post(
				REMOVE_USER_APPLICATION_DRAFT + currentApplication.draft_id
			);
			const updatedRemovedData = await axios.get(GET_USER_APPLICATIONS);
			// //Refresh data onClick of remove button
			setData(updatedRemovedData.data.result);
			setRemoveDraftModalVisible(false);
		} catch (error) {
			console.log('[REMOVE VACANCY] error: ', error);
		}
	};

	useEffect(() => {
		(async () => {
			setIsLoading(true);
			try {
				const currentData = await axios.get(GET_USER_APPLICATIONS);
				setData(currentData.data.result);
			} catch (err) {
				console.warn(err);
			}

			setIsLoading(false);
		})();
	}, []);

	const applicationColumns = [
		{
			title: 'Vacancy Title',
			dataIndex: 'vacancy',
			key: 'title',
			sorter: {
				compare: (a, b) => a.vacancy_title - b.vacancy_title,
				multiple: 1,
			},
			defaultSortOrder: 'ascend',
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
			render: (date) => transformDateToDisplay(date),
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
					return (
						<Button type='text'>
							<MinusCircleOutlined />
							withdraw
						</Button>
					);
				} else {
					return (
						<Space size='middle'>
							<Button type='text'>
								<EditOutlined /> edit
							</Button>
							<Divider type='vertical' />
							<Button
								type='text'
								onClick={async () => {
									setRemoveDraftModalVisible(true);
									setCurrentApplication(application);
								}}
							>
								<DeleteOutlined /> remove
							</Button>
						</Space>
					);
				}
			},
		},
	];

	return isLoading ? (
		<> </>
	) : (
		<>
			<div className='HeaderTitle'>
				<h1>Your Applications</h1>
			</div>
			<div className='ApplicantDashboard'>
				<ConfigProvider renderEmpty={customizeRenderEmpty}>
					<Table
						className='ApplicantTable'
						rowKey={(record) => {
							return record.vacancy_id;
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
		</>
	);
};

export default applicantDashboard;
