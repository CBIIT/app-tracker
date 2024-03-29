import { Table, Tooltip } from 'antd';
import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import {
	CheckCircleTwoTone,
	ExclamationCircleOutlined,
} from '@ant-design/icons'; 
import { getColumnSearchProps } from '../../ManageDashboard/Util/ColumnSearchProps'
import SearchContext from '../../ManageDashboard/Util/SearchContext';
import { MANAGE_APPLICATION } from '../../../constants/Routes';

import './ApplicantList.css';

const renderDecision = (text) =>
	text == 'Pending' ? (
		<span style={{ color: 'rgba(0,0,0,0.25)', textTransform: 'capitalize' }}>
			{text}
		</span>
	) : (
		<span style={{ textTransform: 'capitalize' }}>{text}</span>
	);

const applicantList = (props) => {
	const history = useHistory();
	const contextValue = useContext(SearchContext);
	const {
		searchText,
		setSearchText,
		searchedColumn,
		setSearchedColumn,
		searchInput
	} = contextValue;
	const applicants = props.applicants;
	
	applicants.map((applicant, index) => {
		applicant.key = index;
	});

	const applicantColumns = [
		{
			key: 'averagescore',
			render: (text, record) => {
				if (record.recused == 1)
					return (
						<Tooltip title='Recused'>
							<ExclamationCircleOutlined style={{ color: '#faad14' }} />
						</Tooltip>
					);
				else
					return record.average_score != undefined ? (
						<Tooltip title='Scoring Completed'>
							<CheckCircleTwoTone twoToneColor='#60E241'></CheckCircleTwoTone>
						</Tooltip>
					) : null;
			},
		},
		{
			title: 'Applicant',
			dataIndex: 'applicant_name',
			key: 'name',
			sorter: (a, b) =>{
				if (a.applicant_name < b.applicant_name) {
					return -1;
				}
				if (a.applicant_name > b.applicant_name) {
					return 1;
				}
				return 0;
			},
			width: 250,
			defaultSortOrder: 'ascend',
			...getColumnSearchProps(
				'applicant_name',
				'name',
				searchText,
				setSearchText,
				searchedColumn,
				setSearchedColumn,
				searchInput
			),
		},
		{
			title: 'Email',
			dataIndex: 'applicant_email',
			key: 'email',
			width: 250,
			...getColumnSearchProps(
				'applicant_email',
				'email',
				searchText,
				setSearchText,
				searchedColumn,
				setSearchedColumn,
				searchInput
			),
		},
		{
			title: 'Raw Score',
			dataIndex: 'raw_score',
			key: 'rawscore',
			width: 130,
			render: (text, record) => (record.recused == 1 ? 'n/a' : text),
		},
		{
			title: 'Average Score',
			dataIndex: 'average_score',
			key: 'averagescore',
			render: (text, record) =>
				record.recused == 1 ? 'n/a' : renderDecision(text),
		},
		{
			title: 'Recommend Interview?',
			dataIndex: 'recommend',
			key: 'recommend',
			render: (text, record) => (record.recused == 1 ? 'n/a' : text),
		},
	];

	return (
		<div className='applicant-table'>
			<Table
				pagination={props.pagination}
				className='applicantTable'
				dataSource={applicants}
				columns={applicantColumns}
				scroll={{ x: 'true' }}
				key='applicants'
				onRow={(record) => ({
					onClick: () => {
						history.push(MANAGE_APPLICATION + record.sys_id);
					},
				})}
				onChange={(pagination, _, sorter) => {
					props.onTableChange(
						pagination.current,
						pagination.pageSize,
						sorter.order,
						sorter.field
					);
				}}
				loading={props.loading}
			></Table>
		</div>
	);
};

export default applicantList;
