import { useEffect, useState } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import axios from 'axios';
import { Button, message, Modal } from 'antd';
import {
	LikeOutlined,
	DislikeOutlined,
	QuestionCircleOutlined,
	ExclamationCircleOutlined,
	LeftOutlined,
	RightOutlined,
} from '@ant-design/icons';

import ApplicantInfo from './ApplicantInfo/ApplicantInfo';
import Address from './Address/Address';
import Documents from './Documents/Documents';
import References from './References/References';
import TriageWidget from './TriageWidget/TriageWidget';
import { transformJsonFromBackend } from './Util/TransformJsonFromBackend';
import {
	GET_APPLICATION,
	GET_APPLICATION_TRIAGE_INFO,
	SUBMIT_TRIAGE,
	DISPLAY_REFERENCES,
} from '../../constants/ApiEndpoints';

import { MANAGE_VACANCY } from '../../constants/Routes';

import './Application.css';
import applicantList from '../ManageDashboard/ApplicantList/ApplicantList';

const steps = [
	{
		key: 'owmTriage',
		title: 'OWM Triage',
	},
	{ key: 'chairTriage', title: 'Chair Triage' },
	{ key: 'individualScoring', title: 'Individual Scoring' },
	{ key: 'committeeScoring', title: 'Committee Scoring' },
];

const triageOptions = [
	{
		label: (
			<>
				<LikeOutlined /> yes
			</>
		),
		value: 'yes',
	},
	{
		label: (
			<>
				<DislikeOutlined /> no
			</>
		),
		value: 'no',
	},
	{
		label: (
			<>
				<QuestionCircleOutlined /> maybe
			</>
		),
		value: 'maybe',
	},
];

const { confirm } = Modal;

const application = () => {
	const [application, setApplication] = useState();
	const [vacancyTitle, setVacancyTitle] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	const [triageChoice, setTriageChoice] = useState();
	const [triageComments, setTriageComments] = useState();
	const [displayReferences, setDisplayReferences] = useState();
	const [applicantsList, setApplicantsList] = useState([]);

	const history = useHistory();

	const onTriageSelect = (event) => {
		setTriageChoice(event.target.value);
	};

	const onTriageCommentsChange = (event) => {
		setTriageComments(event.target.value);
	};

	const onTriageWidgetCancelClick = () => {
		confirm({
			title:
				'Are you sure you want to cancel any unsaved changes and return back to the applicants list?',
			icon: <ExclamationCircleOutlined />,
			cancelText: 'cancel',
			okText: 'ok',
			onOk() {
				history.push(MANAGE_VACANCY + application.vacancyId + '/applicants');
			},
		});
	};

	const onTriageWidgetSaveClick = async () => {
		try {
			const triage = {
				vacancy_id: application.vacancyId,
				app_sys_id: application.appSysId,
				triage: triageChoice,
				triage_comments: triageComments,
			};

			await axios.post(SUBMIT_TRIAGE, triage);
			message.success('Feedback and notes saved.');
		} catch (error) {
			message.error(
				'Sorry!  There was an error in saving.  Try reloading the page and saving again.'
			);
		}
	};

	const handleDisplayReferenceToggle = async (isToggleOn) => {
		try {
			await axios.post(
				DISPLAY_REFERENCES + '/' + application.appSysId + '/' + isToggleOn
			);
			message.success('References preference saved.');
		} catch (error) {
			message.error(
				'Sorry!  An error occurred.  Unable to save.  Try reloading the page and trying again.'
			);
		}
	};

	const { sysId } = useParams();

	useEffect(() => {
		(async () => {
			setIsLoading(true);

			try {
				const responses = await Promise.all([
					axios.get(GET_APPLICATION + sysId),
					axios.get(GET_APPLICATION_TRIAGE_INFO + sysId),
				]);
				const application = transformJsonFromBackend(responses[0].data.result);

				console.log('[Application] application', application);
				console.log('[Application] response[0]', responses[0]);
				console.log('[Application] response[1]', responses[1]);

				setApplication(application);
				setVacancyTitle(responses[0].data.result.basic_info.vacancy.label);
				setTriageChoice(responses[0].data.result.basic_info.triage.value);
				setTriageComments(
					responses[0].data.result.basic_info.triage_comments.value
				);
				setDisplayReferences(
					+responses[0].data.result.basic_info.display_references.value
				);

				const appList = await axios.get(
					'/api/x_g_nci_app_tracke/vacancy/get_applicant_list/' +
						application.vacancyId
				);
				setApplicantsList(appList.data.result);

				setIsLoading(false);
			} catch (error) {
				console.log('[Application] error: ', error);
			}
		})();
	}, []);

	console.log('[Application] application:', application);
	debugger;

	return !isLoading ? (
		<>
			<div className='ApplicationContainer'>
				<h1>{vacancyTitle}</h1>
				<div className='ApplicationHeaderBar'>
					<h2>
						Applicant:{' '}
						{application.basicInfo.firstName +
							' ' +
							application.basicInfo.lastName}
					</h2>
					<div className='ApplicantsNav'>
						<Button disabled={sysId == applicantsList[0].sys_id ? true : false}>
							<LeftOutlined />
						</Button>
						<Link to={MANAGE_VACANCY + application.vacancyId + '/applicants'}>
							<Button type='link'>view applicants list</Button>
						</Link>
						<Button
							disabled={
								sysId == applicantsList[applicantList.length - 1].sys_id
									? false
									: true
							}
						>
							<RightOutlined />
						</Button>
					</div>
				</div>
				<div className='ApplicationContent'>
					<div
						className='ApplicationContentColumn'
						style={{ maxWidth: '675px' }}
					>
						<ApplicantInfo
							basicInfo={application.basicInfo}
							style={{ backgroundColor: 'white' }}
						/>
						<Address
							address={application.address}
							style={{ backgroundColor: 'white' }}
						/>
						<References
							references={application.references}
							style={{ backgroundColor: 'white' }}
							switchInitialValue={displayReferences}
							handleToggle={handleDisplayReferenceToggle}
						/>
						<Documents
							documents={application.documents}
							style={{ backgroundColor: 'white' }}
						/>
					</div>
					<div
						className='ApplicationContentColumn'
						style={{ maxWidth: '480px' }}
					>
						<TriageWidget
							steps={steps}
							style={{ backgroundColor: 'white' }}
							triageOptions={triageOptions}
							onTriageSelect={onTriageSelect}
							onTriageCommentsChange={onTriageCommentsChange}
							onCancelClick={onTriageWidgetCancelClick}
							onSaveClick={onTriageWidgetSaveClick}
							triageChoice={triageChoice}
							triageComments={triageComments}
							triageCommentsPlaceholder={'Add notes (optional)'}
						/>
						<Button>
							{/* <a href='/exportAttachmentsToZip.do?sysparm_sys_id=828c84d71bdfe850e541631ee54bcbfa'> */}
							<a>Download Application Package</a>
						</Button>
					</div>
				</div>
			</div>
		</>
	) : null;
};

export default application;
