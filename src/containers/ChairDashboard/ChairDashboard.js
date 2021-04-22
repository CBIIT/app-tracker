import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MANAGE_VACANCY } from '../../constants/Routes.js';
import { Table } from 'antd';
import './ChairDashboard.css';
import axios from 'axios';

const chairDashboard = () => {
	const { sysId } = useParams();
	const [data, setData] = useState([]);

	useEffect(() => {
		(async () => {
			try {
				const currentData = await axios.get(
					'/api/x_g_nci_app_tracke/vacancy/chair/' + sysId
				);
				setData(currentData.data.result);
			} catch (err) {
				console.warn(err);
			}
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
			<Link to={'/manage/vacancy/' + record.vacancy_id}>{title}</Link>
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
