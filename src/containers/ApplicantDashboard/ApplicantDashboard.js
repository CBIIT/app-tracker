import React, { useEffect, useState } from 'react';
import { GET_USER_APPLICATIONS } from '../../constants/ApiEndpoints';
import { Table, ConfigProvider, Empty, Space, Button, Divider } from 'antd';
import {
	EditOutlined,
	DeleteOutlined,
	MinusCircleOutlined,
} from '@ant-design/icons';
import { transformDateToDisplay } from '../../components/Util/Date/Date';
import './ApplicantDashboard.css';
import axios from 'axios';

const applicantDashboard = () => {
	const [data, setData] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	let customizeRenderEmpty = () => (
		<div style={{ textAlign: 'center' }}>
			<Empty
				image={Empty.PRESENTED_IMAGE_SIMPLE}
				description={'No Applications'}
			/>
		</div>
	);

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
		</>
	);
};

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
						<Button type='text'>
							<DeleteOutlined /> remove
						</Button>
					</Space>
				);
			}
		},
	},
];

export default applicantDashboard;
