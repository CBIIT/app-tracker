import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Tabs, Radio, Space, Divider } from 'antd';
import {
	DeleteOutlined,
	EditOutlined,
	LinkOutlined,
	FieldTimeOutlined,
	MinusCircleOutlined,
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

	try {
		useEffect(async () => {
			const currentData = await axios.get(url);
			setData(currentData.data.result);

			const currentPreCount = await axios.get(urls.preflight);
			setPreFlightCount(currentPreCount.data.result.length);

			const currentLiveCount = await axios.get(urls.live);
			setLiveCount(currentLiveCount.data.result.length);

			const currentClosedCount = await axios.get(urls.closed);
			setClosedCount(currentClosedCount.data.result.length);
		}, []);

		data.map((i) => {
			i.key = i.sys_id;
		});
	} catch (err) {
		console.warn(err);
	}

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
		} else {
			setData(filteredData.data.result.filter((res) => res.state == newFilter));
		}
	};

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
							link
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
									<Radio.Button value='final'>Finalized</Radio.Button>
								</Radio.Group>
							</div>
							<div style={{ backgroundColor: 'white' }}>
								<Table
									dataSource={data}
									columns={preFlightColumns}
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
								<Table
									dataSource={data}
									columns={liveColumns}
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
									<Radio.Button value='individuallyscored'>
										Individually Scored
									</Radio.Button>
									<Radio.Button value='scored'>Scored</Radio.Button>
									<Radio.Button value='archived'>Archived</Radio.Button>
								</Radio.Group>
							</div>
							<div style={{ backgroundColor: 'white' }}>
								<Table
									dataSource={data}
									columns={closedColumns}
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

export default vacancyDashboard;
