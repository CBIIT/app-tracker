import { useEffect, useState, useContext } from 'react';
import { message, Table, Tooltip, Collapse, Button } from 'antd';
import { useParams } from 'react-router-dom';
import { CheckCircleOutlined, CloseCircleOutlined, CheckCircleTwoTone, ExclamationCircleOutlined } from '@ant-design/icons';
import { getColumnSearchProps } from '../Util/ColumnSearchProps';
import axios from 'axios';

// TODO: create individual scoring component for rolling close?
// TODO: use committee member applicant list
import ReferenceModal from './ReferenceModal/ReferenceModal';
import {
	OWM_TEAM,
	COMMITTEE_CHAIR,
	COMMITTEE_MEMBER_VOTING,
	COMMITTEE_MEMBER_NON_VOTING,
	COMMITTEE_MEMBER_READ_ONLY,
} from '../../../constants/Roles';
import { GET_APPLICANT_LIST, COLLECT_REFERENCES } from '../../../constants/ApiEndpoints';
import SearchContext from '../Util/SearchContext';
import { transformDateTimeToDisplay } from '../../../components/Util/Date/Date';

// TODO: use OG applicantlist css?

const { Panel } = Collapse;

const renderDecision = (text) =>
	text == 'Pending' ? (
		<span style={{ color: 'rgba(0,0,0,0.25)', textTransform: 'capitalize' }}>
			{text}
		</span>
	) : (
		<span style={{ textTransform: 'capitalize' }}>{text}</span>
	);

const defaultApplicantSort = 'ascend';

const applicantList = (props) => {
    const { sysId } = useParams();
	const [applicants, setApplicants] = useState([]);
	const [pageSize, setPageSize] = useState(10);
	const [totalCount, setTotalCount] = useState(0);
	const [tableLoading, setTableLoading] = useState(false);
	const [appSysId, setAppSysId] = useState();
	const [showModal, setShowModal] = useState(false);
	const contextValue = useContext(SearchContext);
	const {
		searchText,
		setSearchText,
		searchedColumn,
		setSearchedColumn,
		searchInput
	} = contextValue;

    const sendReferences = async (sysId) => {
		try {
			const response = await axios.get(COLLECT_REFERENCES + sysId);
			message.success(
				response.data.result.message
			);
		} catch (e) {
			message.error(
				'Sorry, there was an error sending the notifications to the references.  Try refreshing the browser.'
			);
		}
	}

	const onCollectReferenceButtonClick = async (sysId, referencesSent) => {
		setAppSysId(sysId);
		if (referencesSent === '0') {
			sendReferences(sysId)
		} else {
			setShowModal(true);
		}
	}

	// Applicant Columns
	const applicantColumns = [
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
			defaultSortOrder: defaultApplicantSort,
			sorter: (a, b) => {
				if (a.applicant_name < b.applicant_name) {
					return -1;
				}
				if (a.applicant_name > b.applicant_name) {
					return 1;
				}
				return 0;
			},
		},
		{
			title: 'Email',
			dataIndex: 'applicant_email',
			key: 'email',
			maxWidth: 250,
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
			title: 'Submitted',
			dataIndex: 'submitted',
			key: 'submitted',
			render: (date) => transformDateTimeToDisplay(date),
		},
		{
			title: 'Vacancy Manager Triage Decision',
			dataIndex: 'owm_triage_status',
			key: 'OWMStatus',
			render: (text) => renderDecision(text),
		},
		{
			title: 'Chair Triage Decision',
			dataIndex: 'chair_triage_status',
			key: 'ChairStatus',
			render: (text) => renderDecision(text),
		}
	];

	// Committee Columns
	const committeeColumns = [
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
			title: 'Recommend Interview?',
			dataIndex: 'recommend',
			key: 'recommend',
			render: (text, record) => (record.recused == 1 ? 'n/a' : text),
		},
	]
};

export default applicantList;