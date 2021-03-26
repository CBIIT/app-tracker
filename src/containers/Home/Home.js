import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Table } from 'antd';
import axios from 'axios';

import './Home.css';
import homeLogo from '../../assets/images/home-logo.png';

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
		title: 'Application Period',
		dataIndex: 'applicationPeriod',
	},
];

const transformData = (data) => {
	return data.map((item) => ({
		key: item.sys_id,
		vacancyTitle: item.title,
		applicationPeriod:
			transformDate(item.open_date) + ' - ' + transformDate(item.close_date),
	}));
};

const transformDate = (date) => new Date(date).toLocaleDateString('en-US');

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
				<img src={homeLogo}></img>
			</div>
			<div className='HomeContent'>
				<p>
					The largest of the institutes and centers that make up the National
					Institutes of Health, the National Cancer Institute (NCI) is a premier
					research center that offers research, programmatic support, and
					training opportunities at its laboratories and offices in Maryland.
					NCI is deeply committed to the core values of equity, diversity, and
					inclusion that allow all staff to reach their potential and fully
					contribute to the Institute’s cancer mission.
				</p>
				<p>To learn more about NCI, please visit http://www.cancer.gov</p>
				<h2>Open Vacancies</h2>
				{!isLoading ? (
					<Table
						columns={columns}
						dataSource={data}
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
