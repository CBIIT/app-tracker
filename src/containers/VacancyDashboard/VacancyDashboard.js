<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
=======
import React from 'react';
>>>>>>> origin/dev
import { Link } from 'react-router-dom';
import { Table, Button, Tabs, Radio, Space, Divider } from 'antd';
import {
	DeleteOutlined,
	EditOutlined,
	LinkOutlined,
	FieldTimeOutlined,
	MinusCircleOutlined,
<<<<<<< HEAD
	UserOutlined,
	FileTextOutlined,
} from '@ant-design/icons';
import './VacancyDashboard.css';
import axios from 'axios';

const vacancyDashboard = () => {
	const [data, setData] = useState([]);
	let [url, setURL] = useState(
		'/api/x_g_nci_app_tracke/vacancy/get_dashboard_vacancy_list/preflight'
	);
	const [preFlightCount, setPreFlightCount] = useState([]);
	const [liveCount, setLiveCount] = useState([]);
	const [closedCount, setClosedCount] = useState([]);
	const urls = {
		preflight:
			'/api/x_g_nci_app_tracke/vacancy/get_dashboard_vacancy_list/preflight',
		live: '/api/x_g_nci_app_tracke/vacancy/get_dashboard_vacancy_list/live',
		closed: '/api/x_g_nci_app_tracke/vacancy/get_dashboard_vacancy_list/closed',
	};

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
				const currentData = await axios.get(url);
				setData(currentData.data.result);

				const currentPreCount = await axios.get(urls.preflight);
				setPreFlightCount(currentPreCount.data.result.length);

				const currentLiveCount = await axios.get(urls.live);
				setLiveCount(currentLiveCount.data.result.length);

				const currentClosedCount = await axios.get(urls.closed);
				setClosedCount(currentClosedCount.data.result.length);
			} catch (err) {
				console.warn(err);
			}
		})();
	}, []);

	// const vacancyTable = (
	//   <Table
	//     dataSource={}
	//     columns={}
	//     style={{
	//       width: "1170px",
	//       display: "block",
	//       paddingLeft: "20px",
	//       paddingRight: "20px",
	//     }}
	//   ></Table>
	// );

	const filterChangeHandler = async (e) => {
		const newFilter = e.target.value;
		const filteredData = await axios.get(url);
		if (e.target.value == 'all') {
			setData(filteredData.data.result);
		} else if (e.target.value == 'extended') {
			setData(filteredData.data.result.filter((res) => res.extended == 1));
		} else {
			setData(filteredData.data.result.filter((res) => res.state == newFilter));
		}
	};
=======
} from '@ant-design/icons';
import './VacancyDashboard.css';

const vacancyDashboard = () => (
	<>
		<div style={{ backgroundColor: '#EDF1F4' }}>
			{/* <PageHeader
        breadcrumb={{ routes }}
        style={{ marginLeft: "220px", display: "inline-block" }}
      /> */}
			<div className='app-container' style={{ width: '1170px' }}>
				<Link to='/create-vacancy'>
					<Button
						type='primary'
						style={{
							display: 'inline-block',
							backgroundColor: '#015EA2',
							marginLeft: '1010px',
							width: '161px',
							height: '36px',
							fontSize: '16px',
						}}
					>
						+ Create Vacancy
					</Button>
				</Link>
				<Tabs size={'large'}>
					<Tabs.TabPane
						tab={
							<span className='tab-letters'>
								<p className='num-count'>{preFlightCount}</p>
								<p>pre-flight vacancies</p>
							</span>
						}
						key='1'
					>
						<div className='tabs-div'>
							<p style={{ display: 'inline-block' }}>Filter Vacancies: </p>
							<Radio.Group
								defaultValue='all'
								style={{ display: 'inline-block', paddingLeft: '10px' }}
							>
								<Radio.Button value='all'>All</Radio.Button>
								<Radio.Button value='draft'>Draft</Radio.Button>
								<Radio.Button value='final'>Finalized</Radio.Button>
							</Radio.Group>
						</div>
						<div style={{ backgroundColor: 'white' }}>
							<Table
								dataSource={preFlightData}
								columns={preFlightColumns}
								// onChange={onChange}
								style={{
									width: '1170px',
									display: 'block',
									paddingLeft: '20px',
									paddingRight: '20px',
								}}
							></Table>
						</div>
					</Tabs.TabPane>
					<Tabs.TabPane
						tab={
							<span className='tab-letters'>
								<p className='num-count'>{liveCount}</p>
								<p>live vacancies</p>
							</span>
						}
						key='2'
					>
						<div className='tabs-div'>
							<p style={{ display: 'inline-block' }}>Filter Vacancies: </p>
							<Radio.Group
								defaultValue='all'
								style={{ display: 'inline-block', paddingLeft: '10px' }}
							>
								<Radio.Button value='all'>All</Radio.Button>
								<Radio.Button value='live'>Live</Radio.Button>
								<Radio.Button value='extended'>Extended</Radio.Button>
							</Radio.Group>
						</div>
						<div style={{ backgroundColor: 'white' }}>
							<Table
								dataSource={liveData}
								columns={liveColumns}
								// onChange={onChange}
								style={{
									width: '1170px',
									display: 'block',
									paddingLeft: '20px',
									paddingRight: '20px',
								}}
							></Table>
						</div>
					</Tabs.TabPane>
					<Tabs.TabPane
						tab={
							<span className='tab-letters'>
								<p className='num-count'>{closedCount}</p>
								<p>closed vacancies</p>
							</span>
						}
						key='3'
					>
						<div className='tabs-div'>
							<p style={{ display: 'inline-block' }}>Filter Vacancies: </p>
							<Radio.Group
								defaultValue='all'
								style={{ display: 'inline-block', paddingLeft: '10px' }}
							>
								<Radio.Button value='all'>All</Radio.Button>
								<Radio.Button value='closed'>Closed</Radio.Button>
								<Radio.Button value='triaged'>Triaged</Radio.Button>
								<Radio.Button value='individuallyscored'>
									Individually Scored
								</Radio.Button>
								<Radio.Button value='scored'>Scored</Radio.Button>
								<Radio.Button value='archived'>Archived</Radio.Button>
							</Radio.Group>
						</div>
						<div style={{ backgroundColor: 'white' }}>
							<Table
								dataSource={closedData}
								columns={closedColumns}
								// onChange={onChange}
								style={{
									width: '1170px',
									display: 'block',
									paddingLeft: '20px',
									paddingRight: '20px',
								}}
							></Table>
						</div>
					</Tabs.TabPane>
				</Tabs>
			</div>
		</div>
	</>
);

// Preflight Columns
const preFlightColumns = [
	{
		title: 'Vacancy Title',
		dataIndex: 'title',
	},
	{
		title: 'Open Date',
		dataIndex: 'odate',
		sorter: {
			compare: (a, b) => new Date(a.odate) - new Date(b.odate),
			multiple: 1,
		},
	},
	{
		title: 'Close Date',
		dataIndex: 'cdate',
		sorter: {
			compare: (a, b) => new Date(a.cdate) - new Date(b.cdate),
			multiple: 2,
		},
	},
	{
		title: 'Actions',
		key: 'action',
		render: () => (
			<Space size='middle'>
				<Button type='text'>
					<EditOutlined /> edit
				</Button>
				<Divider type='vertical' />
				<Button type='text'>
					<DeleteOutlined /> remove
				</Button>
			</Space>
		),
	},
];

const preFlightData = [
	{
		key: '1',
		title: 'Director, Division of Cancer Control and Population Sciences',
		odate: '01/12/2021',
		cdate: '06/12/2021',
	},
	{
		key: '2',
		title: 'Director, Division of Cancer Control and Population Sciences',
		odate: '01/18/2021',
		cdate: '06/12/2021',
	},
	{
		key: '3',
		title: 'Director, Division of Cancer Control and Population Sciences',
		odate: '01/12/2021',
		cdate: '08/14/2021',
	},
	{
		key: '4',
		title: 'Director, Division of Cancer Control and Population Sciences',
		odate: '01/12/2021',
		cdate: '8/14/2021',
	},
	{
		key: '5',
		title: 'Director, Division of Cancer Control and Population Sciences',
		odate: '01/13/2021',
		cdate: '8/20/2021',
	},
	{
		key: '6',
		title: 'Director, Division of Cancer Control and Population Sciences',
		odate: '01/12/2021',
		cdate: '8/14/2021',
	},
	{
		key: '7',
		title: 'Director, Division of Cancer Control and Population Sciences',
		odate: '01/12/2021',
		cdate: '8/14/2021',
	},
	{
		key: '8',
		title: 'Director, Division of Cancer Control and Population Sciences',
		odate: '01/12/2021',
		cdate: '8/14/2021',
	},
];

const liveColumns = [
	{
		title: 'Vacancy Title',
		dataIndex: 'title',
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
		dataIndex: 'odate',
		sorter: {
			compare: (a, b) => {
				new Date(a.odate) - new Date(b.odate);
			},
			multiple: 2,
		},
	},
	{
		title: 'Close Date',
		dataIndex: 'cdate',
		sorter: {
			compare: (a, b) => new Date(a.cdate) - new Date(b.cdate),
			multiple: 3,
		},
	},
	{
		title: 'Actions',
		key: 'action',
		width: '5px',
		render: () => (
			<Space size={0}>
				<Button type='text' style={{ padding: '0px' }}>
					<EditOutlined /> edit
				</Button>
				<Divider type='vertical' />
				<Button type='text' style={{ padding: '0px' }}>
					<LinkOutlined /> copy link
				</Button>
				<Divider type='vertical' />
				<Button type='text' style={{ padding: '0px' }}>
					<FieldTimeOutlined /> extend
				</Button>
				<Divider type='vertical' />
				<Button type='text' style={{ padding: '0px' }}>
					<MinusCircleOutlined /> close
				</Button>
			</Space>
		),
	},
];

const liveData = [
	{
		key: '1',
		title: 'Director, Division of Cancer Control and Population Sciences',
		applicants: '4',
		odate: '01/12/2021',
		cdate: '06/12/2021',
	},
	{
		key: '2',
		title: 'Director, Division of Cancer Control and Population Sciences',
		applicants: '3  ',
		odate: '01/18/2021',
		cdate: '06/12/2021',
	},
	{
		key: '3',
		title: 'Director, Division of Cancer Control and Population Sciences',
		applicants: '6',
		odate: '01/12/2021',
		cdate: '08/14/2021',
	},
	{
		key: '4',
		title: 'Director, Division of Cancer Control and Population Sciences',
		applicants: '9',
		odate: '01/12/2021',
		cdate: '8/14/2021',
	},
	{
		key: '5',
		title: 'Director, Division of Cancer Control and Population Sciences',
		applicants: '2',
		odate: '01/13/2021',
		cdate: '8/20/2021',
	},
];

const closedColumns = [
	{
		title: 'Vacancy Title',
		dataIndex: 'title',
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
		dataIndex: 'cdate',
		sorter: {
			compare: (a, b) => new Date(a.cdate) - new Date(b.cdate),
			multiple: 2,
		},
	},
	{
		title: 'Actions',
		key: 'action',
		render: () => (
			<Space size='middle'>
				<Button type='text'>
					<EditOutlined /> edit
				</Button>
				<Divider type='vertical' />
				<Button type='text'>
					<DeleteOutlined /> remove
				</Button>
			</Space>
		),
	},
];

const closedData = [
	{
		key: '1',
		title: 'Director, Division of Cancer Control and Population Sciences',
		applicants: '4',
		odate: '01/12/2021',
		cdate: '06/12/2021',
	},
	{
		key: '2',
		title: 'Director, Division of Cancer Control and Population Sciences',
		applicants: '4',
		odate: '01/18/2021',
		cdate: '06/12/2021',
	},
	{
		key: '3',
		title: 'Director, Division of Cancer Control and Population Sciences',
		applicants: '6',
		odate: '01/12/2021',
		cdate: '08/14/2021',
	},
	{
		key: '4',
		title: 'Director, Division of Cancer Control and Population Sciences',
		applicants: '9',
		odate: '01/12/2021',
		cdate: '8/14/2021',
	},
	{
		key: '5',
		title: 'Director, Division of Cancer Control and Population Sciences',
		applicants: '4',
		odate: '01/13/2021',
		cdate: '8/20/2021',
	},
	{
		key: '6',
		title: 'Director, Division of Cancer Control and Population Sciences',
		applicants: '6',
		odate: '01/12/2021',
		cdate: '8/14/2021',
	},
	{
		key: '7',
		title: 'Director, Division of Cancer Control and Population Sciences',
		applicants: '4',
		odate: '01/12/2021',
		cdate: '8/14/2021',
	},
	{
		key: '8',
		title: 'Director, Division of Cancer Control and Population Sciences',
		applicants: '4',
		odate: '01/12/2021',
		cdate: '8/14/2021',
	},
	{
		key: '9',
		title: 'Director, Division of Cancer Control and Population Sciences',
		applicants: '4',
		odate: '01/18/2021',
		cdate: '06/12/2021',
	},
	{
		key: '10',
		title: 'Director, Division of Cancer Control and Population Sciences',
		applicants: '2',
		odate: '01/18/2021',
		cdate: '06/12/2021',
	},
	{
		key: '11',
		title: 'Director, Division of Cancer Control and Population Sciences',
		applicants: '4',
		odate: '01/18/2021',
		cdate: '06/12/2021',
	},
	{
		key: '12',
		title: 'Director, Division of Cancer Control and Population Sciences',
		applicants: '4',
		odate: '01/18/2021',
		cdate: '06/12/2021',
	},
	{
		key: '13',
		title: 'Director, Division of Cancer Control and Population Sciences',
		applicants: '1',
		odate: '01/18/2021',
		cdate: '06/12/2021',
	},
	{
		key: '14',
		title: 'Director, Division of Cancer Control and Population Sciences',
		applicants: '4',
		odate: '01/18/2021',
		cdate: '06/12/2021',
	},
	{
		key: '15',
		title: 'Director, Division of Cancer Control and Population Sciences',
		applicants: '7',
		odate: '01/18/2021',
		cdate: '06/12/2021',
	},
	{
		key: '16',
		title: 'Director, Division of Cancer Control and Population Sciences',
		applicants: '4',
		odate: '01/18/2021',
		cdate: '06/12/2021',
	},
	{
		key: '17',
		title: 'Director, Division of Cancer Control and Population Sciences',
		applicants: '2',
		odate: '01/18/2021',
		cdate: '06/12/2021',
	},
	{
		key: '18',
		title: 'Director, Division of Cancer Control and Population Sciences',
		applicants: '3',
		odate: '01/18/2021',
		cdate: '06/12/2021',
	},
];
>>>>>>> origin/dev

	return (
		<>
			<div style={{ backgroundColor: '#EDF1F4' }}>
				<div className='app-container'>
					<Link to='/create-vacancy'>
						<Button
							type='primary'
							style={{
								display: 'inline-block',
								backgroundColor: '#015EA2',
								marginLeft: '85%',
								width: '161px',
								height: '36px',
								fontSize: '16px',
							}}
							link='true'
						>
							+ Create Vacancy
						</Button>
					</Link>
					<Tabs
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
									<Radio.Button value='finalized'>Finalized</Radio.Button>
								</Radio.Group>
							</div>
							<div style={{ backgroundColor: 'white' }}>
								<Table
									rowKey='sys_id'
									dataSource={data}
									columns={preFlightColumns}
									style={{
										width: '1170px',
										display: 'block',
										paddingLeft: '20px',
										paddingRight: '20px',
									}}
								/>
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
									<Radio.Button value='open'>Live</Radio.Button>
									<Radio.Button value='extended'>Extended</Radio.Button>
								</Radio.Group>
							</div>
							<div style={{ backgroundColor: 'white' }}>
								<Table
									rowKey='sys_id'
									dataSource={data}
									columns={liveColumns}
									style={{
										width: '1170px',
										display: 'block',
										paddingLeft: '20px',
										paddingRight: '20px',
									}}
								/>
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
										Individually Scored
									</Radio.Button>
									<Radio.Button value='scored'>Scored</Radio.Button>
									<Radio.Button value='archived'>Archived</Radio.Button>
								</Radio.Group>
							</div>
							<div style={{ backgroundColor: 'white' }}>
								<Table
									rowKey='sys_id'
									dataSource={data}
									columns={closedColumns}
									style={{
										width: '1170px',
										display: 'block',
										paddingLeft: '20px',
										paddingRight: '20px',
									}}
								/>
							</div>
						</Tabs.TabPane>
					</Tabs>
				</div>
			</div>
		</>
	);
};

// Preflight Columns
const preFlightColumns = [
	{
		title: 'Vacancy Title',
		dataIndex: 'title',
	},
	{
		title: 'Open Date',
		dataIndex: 'open_date',
		sorter: {
			compare: (a, b) => new Date(a.open_date) - new Date(b.open_date),
			multiple: 1,
		},
		defaultSortOrder: 'ascend',
	},
	{
		title: 'Close Date',
		dataIndex: 'close_date',
		sorter: {
			compare: (a, b) => new Date(a.close_date) - new Date(b.close_date),
			multiple: 2,
		},
	},
	{
		title: 'Actions',
		key: 'action',
		render: () => (
			<Space size='middle'>
				<Button type='text'>
					<EditOutlined /> edit
				</Button>
				<Divider type='vertical' />
				<Button type='text'>
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
		sorter: {
			compare: (a, b) => new Date(a.open_date) - new Date(b.open_date),
			multiple: 2,
		},
	},
	{
		title: 'Close Date',
		dataIndex: 'close_date',
		sorter: {
			compare: (a, b) => new Date(a.close_date) - new Date(b.close_date),
			multiple: 3,
		},
	},
	{
		title: 'Actions',
		key: 'action',
		width: '5px',
		render: () => (
			<Space size={0}>
				<Button type='text' style={{ padding: '0px' }}>
					<EditOutlined /> edit
				</Button>
				<Divider type='vertical' />
				<Button type='text' style={{ padding: '0px' }}>
					<LinkOutlined /> copy link
				</Button>
				<Divider type='vertical' />
				<Button type='text' style={{ padding: '0px' }}>
					<FieldTimeOutlined /> extend
				</Button>
				<Divider type='vertical' />
				<Button type='text' style={{ padding: '0px' }}>
					<MinusCircleOutlined /> close
				</Button>
			</Space>
		),
	},
];

const closedColumns = [
	{
		title: 'Vacancy Title',
		dataIndex: 'title',
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
		sorter: {
			compare: (a, b) => new Date(a.close_date) - new Date(b.close_date),
			multiple: 2,
		},
	},
	{
		title: 'Actions',
		key: 'action',
		render: () => (
			<Space size='middle'>
				<Button type='text'>
					<UserOutlined /> view applicants
				</Button>
				<Divider type='vertical' />
				<Button type='text'>
					<FileTextOutlined /> view vacancy
				</Button>
			</Space>
		),
	},
];

export default vacancyDashboard;
