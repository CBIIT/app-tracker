import { Table, Tooltip } from 'antd';
import { useState, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
	CheckCircleTwoTone,
	ExclamationCircleOutlined,
} from '@ant-design/icons';
import { getColumnSearchProps } from '../../ManageDashboard/Util/ColumnSearchProps'
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
	const [searchText, setSearchText] = useState('');
	const [searchedColumn, setSearchedColumn] = useState('');
	const searchInput = useRef(null);

	const applicants = props.applicants;
	applicants.map((applicant, index) => {
		applicant.key = index;
	});

	const applicantColumns = [
		/* {
			key: 'average_score',
			width: 100,
			render: (record) => {
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
		}, */
		{
			title: 'Applicant',
			dataIndex: 'applicant_name',
			key: 'name',
			sorter: {
				compare: (a, b) => a.applicant_name - b.applicant_name,
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
			width: 130,
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
						sorter.order
					);
				}}
				loading={props.loading}
			></Table>
		</div>
	);
};

export default applicantList;
