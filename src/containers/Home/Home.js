import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Table } from 'antd';
import axios from 'axios';

import './Home.css';
import homeLogo from '../../assets/images/landing-page-image.png';

const columns = [
	{
		title: 'Vacancy Title',
		dataIndex: 'vacancyTitle',
		render: (title, record) => (
			<Link to={'/vacancy/' + record.key}>{title}</Link>
		),
		sorter: (a, b) => a.vacancyTitle.length - b.vacancyTitle.length,
		sortDirections: ['descend'],
	},
	{
		title: 'Institute/Office/Program',
		dataIndex: 'office',
		sorter: (a, b) => a.office.length - b.office.length,
	},
	{
		title: 'Application Period',
		dataIndex: 'applicationPeriod',
		sorter: (a, b) => {
			const newA = a.applicationPeriod.split(' -')[0];
			const newB = b.applicationPeriod.split(' -')[0];
			return new Date(newA) - new Date(newB);
		},
		defaultSortOrder: 'descend',
	},
];

const transformData = (data) => {
	return data.map((item) => ({
		key: item.sys_id,
		vacancyTitle: item.title,
		office: item.tenant,
		applicationPeriod:
			transformDate(item.open_date) + ' - ' + transformDate(item.close_date),
	}));
};

const transformDate = (date) => {
	return new Date(date + 'T00:00:00').toLocaleDateString('en-US');
};

const home = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [data, setData] = useState();

	useEffect(() => {
		(async () => {
			const response = await axios.get(
				'/api/x_g_nci_app_tracke/vacancy/get_homepage_vacancy_list'
			);
			setData(transformData(response.data.result));
			setIsLoading(false);
		})();
	}, []);

	return (
		<>
			<div className='HomeLogo'>
				<img
					src={homeLogo}
					alt='Specialized Scientific Jobs'
					style={{ maxHeight: '400px', width: '100%' }}
				></img>
			</div>
			<div className='HomeContent'>
				<p>
					The National Institutes of Health (NIH), a part of the U.S. Department
					of Health and Human Services, is the nation{"'"}s medical research
					agency &#8212; making important discoveries that improve health and
					save lives. To learn more about NIH, please visit{' '}
					<a href='https://www.nih.gov/about-nih/who-we-are'>
						https://www.nih.gov/about-nih/who-we-are
					</a>
				</p>

				<h2 style={{ marginBottom: '3px' }}>Open Vacancies</h2>
				<p>
					Application period for all vacancies ends at 11:59PM ET on final day.
				</p>
				{!isLoading ? (
					<Table
						columns={columns}
						dataSource={data}
						scroll={{ x: 'true' }}
						pagination={{ hideOnSinglePage: true }}
						locale={{
							emptyText:
								'There are currently no open vacancies.  Please check back later.',
						}}
					/>
				) : null}
			</div>
		</>
	);
};

export default home;
