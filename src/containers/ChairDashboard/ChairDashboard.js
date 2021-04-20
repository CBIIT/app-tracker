import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import SectionHeader from '../../components/UI/ReviewSectionHeader/ReviewSectionHeader';
import { Tabs, Table } from 'antd';
import './ChairDashboard.css';
import axios from 'axios';

const chairDashboard = () => {
	const { sysId } = useParams();
	let [url, setURL] = useState(
		'/api/x_g_nci_app_tracke/vacancy/chair/' + sysId + '/pending_triage'
	);
	const [data, setData] = useState([]);
	const [pendingTriageCount, setPendingTriageCount] = useState([]);
	const [individualScoringCount, setIndividualScoringCount] = useState([]);
	const [committeeScoringCount, setCommitteeScoringCount] = useState([]);
	debugger;

	const urls = {
		pending_triage:
			'/api/x_g_nci_app_tracke/vacancy/chair/' + sysId + '/pending_triage',
		individual_scoring:
			'/api/x_g_nci_app_tracke/vacancy/chair/' + sysId + '/individual_scoring',
		committee_scoring:
			'/api/x_g_nci_app_tracke/vacancy/chair/' + sysId + '/committee_scoring',
	};

	// const tabChangeHandler = async (selectedTab) => {
	// 	url = urls[selectedTab];
	// 	try {
	// 		const newData = await axios.get(url);
	// 		setData(newData.data.result);
	// 		setURL(url);
	// 	} catch (err) {
	// 		console.warn(err);
	// 	}
	// };

	useEffect(() => {
		(async () => {
			try {
				const currentData = await axios.get(url);
				// debugger;
				setData(currentData.data.result);
				const currentPendingTriageCount = await axios.get(urls.pending_triage);
				setPendingTriageCount(currentPendingTriageCount.data.result.applicants);
				// const currentIndividualScoringCount = await axios.get(urls.live);
				// setIndividualScoringCount(currentIndividualScoringCount.data.result.length);
				// const currentCommitteeScoringCount = await axios.get(urls.closed);
				// setCommitteeScoringCount(currentCommitteeScoringCount.data.result.length);
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
					// rowKey='pending_triage'
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
		render: (title, record) => <Link>{title}</Link>,
	},
	{
		title: 'Applicants',
		dataIndex: 'applicants',
		key: 'applicants',
		render: (number, record) => (
			<Link>
				{number} {number == 1 ? 'aplicant' : 'applicants'}
			</Link>
		),
	},
	{
		title: 'Status',
		// dataIndex: 'status',
		key: 'status',
	},
];

export default chairDashboard;
