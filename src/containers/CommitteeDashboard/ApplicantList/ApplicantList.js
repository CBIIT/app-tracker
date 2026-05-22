import { Table, Tooltip } from 'antd';
import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import {
	CheckCircleTwoTone,
	ExclamationCircleOutlined,
} from '@ant-design/icons';
import { getColumnSearchProps } from '../../ManageDashboard/Util/ColumnSearchProps';
import SearchContext from '../../ManageDashboard/Util/SearchContext';
import { MANAGE_APPLICATION } from '../../../constants/Routes';
import useAuth from '../../../hooks/useAuth';
import {
	ROLLING_CLOSE,
	INDIVIDUAL_SCORING_IN_PROGRESS,
} from '../../../constants/VacancyStates';
import { SCORING } from '../../../constants/ApplicationStates';

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
		searchInput,
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
			width: 250,
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

	const {
		auth: { tenants },
		currentTenant,
	} = useAuth();
	const tname = tenants ? tenants.find((t) => t.value === currentTenant) : {};
	const focusAreaEnabled = tname.properties?.find(
		(p) => p.name === 'enableFocusArea'
	)?.value;

	var applicantFocusArea = props.focusArea;

	const focusAreaOptions = applicantFocusArea.map((fa) => ({
		text: fa,
		value: fa,
	}));

	// concat primary and secondary focus area
	applicants.forEach((applicant) => {
		if (applicant.primary_focus_area && applicant.secondary_focus_area) {
			applicant.focus_area =
				applicant.primary_focus_area + ', ' + applicant.secondary_focus_area;
		} else if (applicant.primary_focus_area) {
			applicant.focus_area = applicant.primary_focus_area;
		} else if (applicant.secondary_focus_area) {
			applicant.focus_area = applicant.secondary_focus_area;
		}
	});

	if (
		focusAreaEnabled &&
		focusAreaEnabled === 'true' &&
		((props.vacancyState === ROLLING_CLOSE && props.filter === SCORING) ||
			props.vacancyState === INDIVIDUAL_SCORING_IN_PROGRESS)
	) {
		// Insert focus area column at index 2
		applicantColumns.splice(3, 0, {
			title: 'Focus Area',
			dataIndex: 'focus_area',
			key: 'focus_area',
			render: (focus_area) => {
				return focus_area;
			},
			filters: focusAreaOptions,
			onFilter: (value, record) => record.focus_area.includes(value),
			width: 250,
		});
	}

	return (
		<div className='applicant-table'>
			<Table
				data-testid='applicant-table'
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
				onChange={(pagination, filters, _, sorter) => {
					const focusArea = filters && filters.focus_area ? filters.focus_area : [];
					props.onTableChange(
						pagination.current,
						pagination.pageSize,
						sorter.order,
						sorter.field,
						focusArea
					);
				}}
				loading={props.loading}
			></Table>
		</div>
	);
};

export default applicantList;
