import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MANAGE_VACANCY } from '../../constants/Routes.js';
import { Table } from 'antd';
import { GET_COMMITTEE_CHAIR_VACANCIES } from '../../constants/ApiEndpoints';
import './ChairDashboard.css';
import axios from 'axios';
import { LoadingOutlined } from '@ant-design/icons';

const chairDashboard = () => {
	const [data, setData] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		(async () => {
			setIsLoading(true);
			try {
				const currentData = await axios.get(GET_COMMITTEE_CHAIR_VACANCIES);
				setData(
					currentData.data.result.filter(
						(vacancy) => vacancy.status != 'live' && vacancy.status != 'final'
					)
				);
			} catch (err) {
				console.warn(err);
			}
			setIsLoading(false);
		})();
	}, []);

	return (
		<>
			<div className='HeaderTitle'>
				<h1>Vacancies Assigned To You</h1>
			</div>
			<div className='ChairDashboard'>
				<Table
					rowKey={(record) => record.vacancy_id}
					dataSource={data}
					columns={chairColumns}
					loading={
						isLoading
							? { indicator: <LoadingOutlined style={{ fontSize: 24 }} spin /> }
							: false
					}
					key='ChairVacancies'
				></Table>
			</div>
		</>
	);
};

const chairColumns = [
	{
		title: 'Vacancy Title',
		dataIndex: 'vacancy_title',
		key: 'title',
		sorter: {
			compare: (a, b) => a.vacancy_title.localeCompare(b.vacancy_title),
			multiple: 1,
		},
		defaultSortOrder: 'ascend',
		render: (title, record) => (
			<Link to={MANAGE_VACANCY + record.vacancy_id}>{title}</Link>
		),
	},
	{
		title: 'Applicants',
		dataIndex: 'applicants',
		key: 'applicants',
		render: (number, record) => (
			<Link to={MANAGE_VACANCY + record.vacancy_id + '/applicants'}>
				{number} {number == 1 ? 'applicant' : 'applicants'}
			</Link>
		),
	},
	{
		title: 'Status',
		dataIndex: 'status',
		key: 'status',
		sorter: {
			compare: (a, b) => a.status.localeCompare(b.status),
			multiple: 2,
		},
		defaultSortOrder: 'ascend',
		render: (status) => {
			if (status.includes('owm')) {
				status = status.split('_')[0].toUpperCase() + status.substring(3);
			}
			if (status.includes('_')) {
				status = status
					.split('_')
					.map((word) => word[0].toUpperCase() + word.substring(1))
					.join(' ');
				return <span style={{ color: 'rgb(86,86,86)' }}>{status}</span>;
			} else {
				return (
					<span style={{ color: 'rgb(86,86,86)' }}>
						{status.charAt(0).toUpperCase() + status.slice(1)}
					</span>
				);
			}
		},
	},
];

export default chairDashboard;
