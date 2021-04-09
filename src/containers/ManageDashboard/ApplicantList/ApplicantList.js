import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Table } from 'antd';
import axios from 'axios';
import './ApplicantList.css';

const applicantList = () => {
	const [applicants, setApplicants] = useState([]);
	const { sysId } = useParams();

	useEffect(() => {
		(async () => {
			const response = await axios.get(
				'/api/x_g_nci_app_tracke/vacancy/get_applicant_list/' + sysId
			);
			response.data.result.map((applicant, index) => {
				applicant.key = index;
			});
			setApplicants(response.data.result);
		})();
	}, []);

	return (
		<>
			<div className='applicant-table'>
				<Table
					dataSource={applicants}
					columns={applicantColumns}
					key='applicants'
				></Table>
			</div>
		</>
	);
};
const applicantColumns = [
	{
		title: 'Applicant',
		dataIndex: 'applicant_last_name',
		key: 'name',
		render: (text, record) => {
			return (
				<a>
					{text}, {record.applicant_first_name}
				</a>
			);
		},
		sorter: {
			compare: (a, b) =>
				a.applicant_last_name.localeCompare(b.applicant_last_name),
			multiple: 1,
		},
		defaultSortOrder: 'ascend',
	},
	{
		title: 'Email',
		dataIndex: 'applicant_email',
		key: 'email',
	},
	{
		title: 'Submitted',
		dataIndex: 'submitted',
		key: 'submitted',
		render: (text) => {
			return <span>{text.split(' ')[0]}</span>;
		},
	},
	{
		title: 'OWM Triage Decision',
		dataIndex: 'owm_triage_status',
		key: 'OWMStatus',
		render: (text) => {
			if (text == 'Pending') {
				return <span style={{ color: 'rgba(0,0,0,0.25)' }}>{text}</span>;
			}
		},
	},

	{
		title: 'Chair Triage Decision',
		dataIndex: 'chair_triage_status',
		key: 'ChairStatus',
		render: (text) => {
			if (text == 'Pending') {
				return <span style={{ color: 'rgba(0,0,0,0.25)' }}>{text}</span>;
			}
		},
	},
];

export default applicantList;
